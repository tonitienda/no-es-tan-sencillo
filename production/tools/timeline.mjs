// Resolves the authored timeline against the measured narration audio.
//
// The author never types beat durations for narrated beats: a beat lasts
//   padBefore + its clips + gaps between clips + padAfter
// (or longer, with minDuration), rounded up to whole frames. Re-recording a line
// therefore re-syncs the whole video. Cues name moments inside a beat (a word or
// phrase from the narration) and resolve to seconds from the ElevenLabs
// character timestamps, so animations land on the words they illustrate.
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {command, episodePaths, probe, readJson, sha256, writeJson} from './paths.mjs';
import {readLedger} from './ledger.mjs';

const DEFAULTS = {gap: 0.35, padBefore: 0.4, padAfter: 0.6, transition: 0.4};
const BUILT_IN = new Set(['intro', 'outro', 'cartela', 'placeholder']);
const fail = message => { throw Error(message); };
const finite = (v, min = 0) => Number.isFinite(v) && v >= min;
const fold = s => s.normalize('NFC').toLocaleLowerCase('es').replace(/\s+/g, ' ');

export function outputResolution(t) {
  const {width, height} = t.resolution ?? {width: 3840, height: 2160};
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 320 || width > 3840 || width % 2 || width * 9 !== height * 16)
    fail('resolution must be an even 16:9 size up to 3840x2160');
  return {width, height};
}

/** Seconds (from clip start) of a phrase in one clip, using its character alignment. */
export function phraseTime(timing, phrase, {occurrence = 1, edge = 'start'} = {}) {
  const a = timing.alignment;
  const joined = fold(a.characters.join(''));
  const needle = fold(phrase);
  let index = -1;
  for (let n = 0; n < occurrence; n++) { index = joined.indexOf(needle, index + 1); if (index < 0) return null; }
  // Folding can change length only for exotic characters; clamp to stay in range.
  const first = Math.min(index, a.starts.length - 1), last = Math.min(index + needle.length - 1, a.ends.length - 1);
  return edge === 'end' ? a.ends[last] : a.starts[first];
}

export function resolveTimeline({timeline, manifest, timings, ledger = null, episode = {}}) {
  if (timeline.version !== 1) fail('timeline.json must have "version": 1');
  const fps = timeline.fps ?? 60;
  if (!Number.isInteger(fps) || fps < 1 || fps > 60) fail('fps must be an integer from 1 to 60');
  const resolution = outputResolution(timeline);
  const defaults = {...DEFAULTS, ...timeline.defaults};
  const frames = s => Math.ceil(s * fps - 1e-6) / fps;
  if (!Array.isArray(timeline.beats) || !timeline.beats.length) fail('timeline.json has no beats');

  const order = new Map(manifest.lines.map((l, i) => [l.id, i]));
  const byId = new Map(manifest.lines.map(l => [l.id, l]));
  const used = new Set(), ids = new Set(), warnings = [];
  let lastIndex = -1, clock = 0;
  const beats = [], schedule = [];

  for (const [i, b] of timeline.beats.entries()) {
    const where = `beat ${i + 1}${b.id ? ` (${b.id})` : ''}`;
    if (typeof b.id !== 'string' || !b.id || ids.has(b.id)) fail(`${where}: needs a unique "id"`);
    ids.add(b.id);
    if (typeof b.visual !== 'string' || !b.visual) fail(`${where}: needs a "visual" (a name from visuals.ts or ${[...BUILT_IN].join(', ')})`);
    const lines = b.lines ?? [];
    if (!Array.isArray(lines)) fail(`${where}: "lines" must be a list of narration IDs`);
    const pad = {before: b.padBefore ?? defaults.padBefore, after: b.padAfter ?? defaults.padAfter, gap: b.gap ?? defaults.gap};
    for (const [k, v] of Object.entries(pad)) if (!finite(v)) fail(`${where}: invalid ${k}`);

    // pauseAfter: {lineId: seconds} adds silence after one line, inside the beat, so a
    // reveal can breathe without splitting the visual in two.
    const pauseAfter = b.pauseAfter ?? {};
    for (const [id, s] of Object.entries(pauseAfter)) {
      if (!lines.includes(id)) fail(`${where}: pauseAfter names ${id}, which is not in this beat`);
      if (!finite(s) || s < 0 || s > 10) fail(`${where}: pauseAfter ${id} must be 0–10 seconds`);
    }
    let t = pad.before;
    const placed = [];
    for (const [n, lineId] of lines.entries()) {
      if (!order.has(lineId)) fail(`${where}: unknown narration line ${lineId}. Re-run "narration" after script edits and update the timeline.`);
      if (used.has(lineId)) fail(`${where}: ${lineId} is used twice`);
      if (order.get(lineId) !== lastIndex + 1) {
        const missing = manifest.lines[lastIndex + 1]?.id;
        fail(`${where}: ${lineId} is out of order; ${missing} must come first (every line is used once, in script order)`);
      }
      used.add(lineId); lastIndex = order.get(lineId);
      const timing = timings.get(lineId);
      if (!timing) fail(`${where}: missing audio for ${lineId}. Run "audio" (or "audio --placeholder").`);
      if (timing.text !== (byId.get(lineId).spoken ?? byId.get(lineId).text))
        fail(`${where}: audio for ${lineId} was recorded from different text. Run "audio" again.`);
      if (n > 0) t += pad.gap;
      placed.push({id: lineId, text: byId.get(lineId).text, start: +t.toFixed(4), duration: timing.duration,
        audio: `${lineId}.wav`, provider: timing.provider, alignmentSource: timing.alignmentSource});
      t += timing.duration + (pauseAfter[lineId] ?? 0);
    }
    const natural = lines.length ? t + pad.after : 0;
    if (!lines.length && !finite(b.duration ?? b.minDuration, 1 / fps)) fail(`${where}: a beat without narration needs "duration" (seconds)`);
    if (b.duration !== undefined && lines.length && b.duration + 1e-6 < natural)
      fail(`${where}: duration ${b.duration}s is shorter than its narration (${natural.toFixed(2)}s). Use minDuration, or remove duration and let the audio set it.`);
    const duration = frames(Math.max(natural, b.duration ?? 0, b.minDuration ?? 0));
    const transition = i === 0 ? 0 : (b.transition ?? defaults.transition);
    if (!finite(transition) || transition > Math.min(2, duration)) fail(`${where}: transition must be 0–2s and not longer than the beat`);

    // Cues: built-in line starts/ends, then named phrases or explicit times.
    const cues = {start: 0, end: duration};
    for (const p of placed) { cues[p.id] = p.start; cues[p.id + ':end'] = +(p.start + p.duration).toFixed(4); }
    for (const [name, spec0] of Object.entries(b.cues ?? {})) {
      // A string naming a built-in cue (a line ID, "<id>:end") is an alias for it.
      if (typeof spec0 === 'string' && spec0 in cues) { cues[name] = cues[spec0]; continue; }
      const spec = typeof spec0 === 'string' ? {phrase: spec0} : spec0;
      if (finite(spec.at)) { if (spec.at > duration) fail(`${where}: cue ${name} is after the beat ends`); cues[name] = spec.at; continue; }
      if (typeof spec.phrase !== 'string') fail(`${where}: cue ${name} needs "phrase" or "at"`);
      const candidates = spec.line ? placed.filter(p => p.id === spec.line) : placed;
      if (spec.line && !candidates.length) fail(`${where}: cue ${name} refers to ${spec.line}, which is not in this beat`);
      let found = null;
      for (const p of candidates) {
        const s = phraseTime(timings.get(p.id), spec.phrase, spec);
        if (s !== null) { found = {p, s}; break; }
      }
      if (!found) fail(`${where}: cue ${name}: "${spec.phrase}" is not spoken in ${candidates.map(p => p.id).join(', ') || 'this beat (no narration)'}`);
      if (found.p.alignmentSource !== 'elevenlabs') warnings.push(`${b.id}: cue ${name} uses estimated timing (placeholder or missing alignment)`);
      cues[name] = +(found.p.start + found.s + (spec.offset ?? 0)).toFixed(4);
    }

    for (const p of placed) schedule.push({id: p.id, beat: b.id, start: +(clock + p.start).toFixed(4), duration: p.duration, audio: p.audio});
    const sources = b.sources ?? [];
    if (!Array.isArray(sources)) fail(`${where}: "sources" must be a list of ledger IDs`);
    if (ledger) for (const s of sources) if (!ledger.has(s)) fail(`${where}: source ${s} is not in the ledger`);
    if (!BUILT_IN.has(b.visual) && !b.sourceLabel && b.sourceLabel !== false && lines.length && /\d/.test(placed.map(p => p.text).join(' ')))
      warnings.push(`${b.id}: narration has figures but the beat has no sourceLabel (rule: every figure carries source and date on screen)`);
    beats.push({id: b.id, visual: b.visual, props: b.props ?? {}, start: +clock.toFixed(4), duration, transition,
      sourceLabel: b.sourceLabel ?? null, sources, chapter: b.chapter ?? null, section: b.section ?? null, lines: placed, cues});
    clock = +(clock + duration).toFixed(6);
  }
  const unused = manifest.lines.filter(l => !used.has(l.id)).map(l => l.id);
  if (unused.length) fail(`Narration lines not placed in any beat: ${unused.join(', ')}`);

  // Chapters: an explicit beat "chapter" title wins; otherwise each script section
  // starts a chapter at the first beat that speaks one of its lines, or at a lineless
  // beat (a splash) that names its section with "section": n.
  const sectionTitle = new Map(manifest.sections.map(s => [s.n, s.title]));
  const chapters = [], seen = new Set();
  for (const b of beats) {
    if (b.chapter === false) continue;
    const section = b.lines.length ? byId.get(b.lines[0].id).section : b.section;
    if (typeof b.chapter === 'string') chapters.push({at: b.start, title: b.chapter, beat: b.id});
    else if (section !== null && !seen.has(section)) chapters.push({at: b.start, title: sectionTitle.get(section), beat: b.id});
    if (section !== null) seen.add(section);
  }
  if (chapters.length) chapters[0] = {...chapters[0], at: 0};

  // Sources for the description: what beats cite, then what the script sections cite.
  const sourceIds = [...new Set([...beats.flatMap(b => b.sources), ...manifest.sections.flatMap(s => s.sources ?? [])])];
  if (ledger) for (const s of sourceIds) if (!ledger.has(s)) warnings.push(`source ${s} (cited in the script) is not in the ledger`);

  const animatic = schedule.length > 0 && beats.some(b => b.lines.some(l => l.provider !== 'elevenlabs'));
  return {version: 1, episode: episode.id, title: episode.title ?? null, fps, resolution, duration: clock, animatic,
    beats, schedule, chapters, sources: sourceIds, music: timeline.music ?? null, warnings};
}

function validateMusic(music, media) {
  if (!music) return null;
  const a = music.attribution, text = v => typeof v === 'string' && v.trim().length > 0;
  if (typeof music.file !== 'string' || music.file.includes('/')) fail('music.file must be a file name in production/public/<episode>/music/');
  for (const k of ['volume', 'start', 'fadeIn', 'fadeOut']) if (music[k] !== undefined && !finite(music[k])) fail(`Invalid music ${k}`);
  if (music.volume !== undefined && (music.volume === 0 || music.volume > 1)) fail('music.volume must be in (0, 1]');
  // Licensed music is usable only with its credit, so the plan carries the licensor's exact wording.
  if (!a || !text(a.title) || !text(a.artist) || !text(a.text)) fail('music needs attribution with title, artist and the licensor\'s exact text');
  const p = media(music.file);
  if (!p.audio) fail('music file has no audio stream');
  return {...music, duration: p.duration};
}

function buildSoundtrack(resolved, paths) {
  const args = ['-hide_banner', '-loglevel', 'error', '-y'], filters = [], voices = [];
  let index = 0;
  for (const v of resolved.schedule) {
    args.push('-i', join(paths.audio, v.audio));
    filters.push(`[${index++}:a]aresample=48000,asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=7,adelay=${Math.round(v.start * 1000)}:all=1[n${index}]`);
    voices.push(`[n${index}]`);
  }
  const mix = [], m = resolved.music, d = resolved.duration;
  const duck = !!m && m.duck !== false && voices.length > 0;
  if (voices.length) {
    if (duck) {
      filters.push(`${voices.join('')}amix=inputs=${voices.length}:normalize=0:dropout_transition=0,asplit=2[voice][keyRaw]`, '[keyRaw]apad[key]');
      mix.push('[voice]');
    } else if (voices.length > 1) {
      filters.push(`${voices.join('')}amix=inputs=${voices.length}:normalize=0:dropout_transition=0[voice]`); mix.push('[voice]');
    } else mix.push(voices[0]);
  }
  if (m) {
    const fadeIn = Math.min(m.fadeIn ?? 2, d / 2), fadeOut = Math.min(m.fadeOut ?? 4, d / 2);
    args.push('-stream_loop', '-1', '-ss', String(m.start ?? 0), '-i', join(paths.music, m.file));
    filters.push(`[${index++}:a]aresample=48000,asetpts=PTS-STARTPTS,atrim=duration=${d},volume=${m.volume ?? 0.12},afade=t=in:d=${fadeIn},afade=t=out:st=${d - fadeOut}:d=${fadeOut}[bed]`);
    if (duck) { filters.push('[bed][key]sidechaincompress=threshold=0.02:ratio=4:attack=20:release=500[ducked]'); mix.push('[ducked]'); }
    else mix.push('[bed]');
  }
  if (!mix.length) {
    // A silent episode still needs an audio stream for the encoder and players.
    args.push('-f', 'lavfi', '-t', String(d), '-i', 'anullsrc=r=48000:cl=stereo');
    mix.push(`[${index++}:a]`);
  }
  filters.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:dropout_transition=0,alimiter=limit=0.95:latency=1,apad,atrim=duration=${d}[out]`);
  mkdirSync(paths.generated, {recursive: true});
  command('ffmpeg', [...args, '-filter_complex', filters.join(';'), '-map', '[out]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', paths.soundtrack + '.tmp.wav']);
  command('mv', [paths.soundtrack + '.tmp.wav', paths.soundtrack]);
}

/** Validate, resolve and (if inputs changed) rebuild the soundtrack. Used by the CLI and by Vite. */
export function prepare(id, {log = () => {}} = {}) {
  const paths = episodePaths(id);
  if (!existsSync(paths.narration)) fail(`Missing ${paths.narration}. Run "narration" first.`);
  if (!existsSync(paths.timeline)) fail(`Missing ${paths.timeline}. Run "scaffold" to start one.`);
  const episode = {id, ...readJson(paths.config)};
  const manifest = readJson(paths.narration), timeline = readJson(paths.timeline);
  const timings = new Map();
  for (const l of manifest.lines) {
    const f = join(paths.audio, l.id + '.json');
    if (existsSync(f) && existsSync(join(paths.audio, l.id + '.wav'))) timings.set(l.id, readJson(f));
  }
  const ledger = episode.ledger ? readLedger(join(paths.folder, episode.ledger)) : null;
  const resolved = resolveTimeline({timeline, manifest, timings, ledger, episode});
  resolved.music = validateMusic(resolved.music, file => probe(join(paths.music, file)));
  const assets = [...resolved.schedule.map(v => join(paths.audio, v.audio)), ...(resolved.music ? [join(paths.music, resolved.music.file)] : [])];
  const fingerprint = sha256(JSON.stringify({schedule: resolved.schedule, music: resolved.music, duration: resolved.duration, v: 1,
    assets: assets.map(f => [f, statSync(f).size, statSync(f).mtimeMs])}));
  const stamp = join(paths.generated, 'soundtrack.sha256');
  if (!(existsSync(stamp) && readFileSync(stamp, 'utf8') === fingerprint && existsSync(paths.soundtrack))) {
    log('Mixing soundtrack…');
    buildSoundtrack(resolved, paths);
    mkdirSync(paths.generated, {recursive: true});
    writeFileSync(stamp, fingerprint);
  }
  resolved.credits = resolved.music ? [{kind: 'music', ...resolved.music.attribution}] : [];
  writeJson(paths.resolved, resolved);
  return {paths, episode, resolved};
}
