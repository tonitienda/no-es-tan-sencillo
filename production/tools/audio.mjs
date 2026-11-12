// Narration audio: one WAV per narration line, plus a timing file with
// per-character start/end times so visuals can sync to specific words.
//
//   ElevenLabs (default): text-to-speech *with timestamps*. Each API result is cached
//   by a fingerprint of the exact request, so only changed lines cost credits.
//   Placeholder (--placeholder): free local audio for an animatic before the script is
//   frozen. Uses macOS `say` with a Spanish voice when available, otherwise a quiet tone
//   at a speaking-rate estimate. Character times are estimated.
import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, renameSync} from 'node:fs';
import {join} from 'node:path';
import {command, episodePaths, probe, production, readJson, sha256, writeJson} from './paths.mjs';

const cacheDir = join(production, '.cache', 'tts');
const CHARS_PER_SECOND = 15; // measured Spanish narration pace is ~14–16

/** production/voices.json, with an episode's `voice` block (episode.json) merged over it. */
export function voiceConfig(override = {}) {
  const base = readJson(join(production, 'voices.json'));
  const config = {...base, ...override, narrator: {...base.narrator, ...override.narrator}};
  if (!config.modelId || !/^mp3_\d+_\d+$/.test(config.outputFormat ?? '')) throw Error('voices.json needs modelId and an mp3_<rate>_<bitrate> outputFormat.');
  return config;
}

export function audioRequests(lines, config) {
  const narrator = config.narrator ?? {};
  return lines.map((line, i) => {
    const request = {
      voiceId: narrator.voiceId, text: line.spoken ?? line.text, modelId: config.modelId, outputFormat: config.outputFormat,
      ...(config.languageCode ? {languageCode: config.languageCode} : {}),
      ...(narrator.voiceSettings ? {voiceSettings: narrator.voiceSettings} : {}),
      // Neighbouring text improves prosody across clip boundaries, at the cost of
      // regenerating neighbours when a line changes.
      ...(config.continuity ? {previousText: lines[i - 1]?.spoken, nextText: lines[i + 1]?.spoken} : {}),
    };
    return {line, request, fingerprint: sha256(JSON.stringify({provider: 'elevenlabs', timestamps: true, ...request}))};
  });
}

/** Even spread of characters over the clip: a fallback when real alignment is unavailable. */
export function estimatedAlignment(text, duration) {
  const characters = [...text], step = duration / Math.max(1, characters.length);
  return {characters, starts: characters.map((_, i) => +(i * step).toFixed(4)), ends: characters.map((_, i) => +((i + 1) * step).toFixed(4))};
}

function toWav(input, output) {
  command('ffmpeg', ['-y', '-v', 'error', '-i', input, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', '-f', 'wav', output + '.tmp']);
  probe(output + '.tmp');
  renameSync(output + '.tmp', output);
}

function spanishSayVoice() {
  if (process.platform !== 'darwin') return null;
  try {
    const voices = command('say', ['-v', '?']).split('\n');
    const es = voices.find(v => /\bes_ES\b/.test(v)) ?? voices.find(v => /\bes_/.test(v));
    return es ? es.split(/\s{2,}/)[0].trim() : null;
  } catch { return null; }
}

function placeholderClip(text, wav) {
  const voice = spanishSayVoice();
  const tmp = wav + '.src.aiff';
  try {
    if (voice) {
      command('say', ['-v', voice, '-r', '185', '-o', tmp, text]);
      toWav(tmp, wav);
      return `say:${voice}`;
    }
    const duration = Math.max(1, text.length / CHARS_PER_SECOND).toFixed(3);
    // A quiet pulsing tone at syllable rate: audible in review, obviously not a voice.
    command('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i',
      `aevalsrc=0.12*sin(2*PI*170*t)*(0.55+0.45*sin(2*PI*4.2*t)):s=48000:d=${duration}`,
      '-ac', '1', '-c:a', 'pcm_s16le', '-f', 'wav', wav + '.tmp']);
    renameSync(wav + '.tmp', wav);
    return 'tone';
  } finally { rmSync(tmp, {force: true}); }
}

/** Activate a WAV and its timing file, keeping a content-addressed backup of anything it replaces. */
function activate(paths, id, wavSource, timing) {
  mkdirSync(paths.audio, {recursive: true});
  const target = join(paths.audio, id + '.wav');
  const hash = sha256(readFileSync(wavSource));
  if (existsSync(target)) {
    const old = sha256(readFileSync(target));
    if (old === hash) { writeJson(join(paths.audio, id + '.json'), {...timing, sha256: hash}); return; }
    const backup = join(production, '.cache', 'audio-backups', paths.id, old);
    mkdirSync(backup, {recursive: true});
    copyFileSync(target, join(backup, id + '.wav'));
    if (existsSync(join(paths.audio, id + '.json'))) copyFileSync(join(paths.audio, id + '.json'), join(backup, id + '.json'));
  }
  copyFileSync(wavSource, target + '.tmp');
  renameSync(target + '.tmp', target);
  writeJson(join(paths.audio, id + '.json'), {...timing, sha256: hash});
}

export async function generateAudio({id, placeholder = false, dryRun = false, only, client, log = console.log}) {
  const paths = episodePaths(id);
  const manifestRaw = readFileSync(paths.narration);
  const manifest = JSON.parse(manifestRaw);
  const lines = only ? manifest.lines.filter(l => only.includes(l.id)) : manifest.lines;
  if (only && lines.length !== only.length) throw Error(`Unknown line IDs: ${only.filter(o => !lines.some(l => l.id === o)).join(', ')}`);

  if (placeholder) {
    log(`${id}: ${lines.length} placeholder clips (not for publication).`);
    if (dryRun) return {clips: lines.length, pending: lines.length};
    const work = join(production, '.cache', 'placeholder', id);
    mkdirSync(work, {recursive: true});
    for (const line of lines) {
      const text = line.spoken ?? line.text, wav = join(work, line.id + '.wav');
      const provider = placeholderClip(text, wav);
      const {duration} = probe(wav);
      activate(paths, line.id, wav, {id: line.id, provider: 'placeholder', voice: provider, text, duration,
        alignmentSource: 'estimated', alignment: estimatedAlignment(text, duration)});
      log(`Placeholder ${line.id} (${duration.toFixed(2)}s, ${provider})`);
    }
    return {clips: lines.length, pending: 0};
  }

  const unresolved = lines.filter(l => l.placeholders.length);
  if (unresolved.length) throw Error(`Resolve the open alternatives in the script before recording: ${unresolved.map(l => `${l.id} ${l.placeholders.join(' ')}`).join('; ')}. Use --placeholder for an animatic.`);
  const config = voiceConfig(existsSync(paths.config) ? readJson(paths.config).voice : undefined);
  if (!config.narrator?.voiceId) throw Error('Set narrator.voiceId in production/voices.json (an ElevenLabs Spanish voice).');
  const requests = audioRequests(manifest.lines, config).filter(r => lines.includes(r.line));
  const fresh = requests.filter(r => !existsSync(join(cacheDir, r.fingerprint + '.mp3')));
  log(`${id}: ${requests.length} clips; ${fresh.length} API requests, ${fresh.reduce((n, r) => n + r.request.text.length, 0)} characters; model ${config.modelId}; voice ${config.narrator.name ?? config.narrator.voiceId}.`);
  if (dryRun) return {clips: requests.length, pending: fresh.length};
  if (fresh.length && !client && !process.env.ELEVENLABS_API_KEY?.trim()) throw Error('Set ELEVENLABS_API_KEY in .env.local (or the shell) before generating narration.');
  if (fresh.length && !client) {
    const {ElevenLabsClient} = await import('@elevenlabs/elevenlabs-js');
    client = new ElevenLabsClient();
  }

  const lock = join(paths.work, '.audio-lock');
  try { mkdirSync(lock); } catch { throw Error(`Another audio run is active (or ${lock} was left by an interruption; remove it).`); }
  try {
    mkdirSync(cacheDir, {recursive: true});
    const staged = [];
    // Stage every clip before replacing any active audio; API output is cached
    // immediately so a later failure resumes without paying again.
    for (const r of requests) {
      const stem = join(cacheDir, r.fingerprint), mp3 = stem + '.mp3', timingFile = stem + '.alignment.json', wav = stem + '.wav';
      if (!existsSync(mp3)) {
        log(`Generating ${r.line.id}`);
        try {
          const {voiceId, ...body} = r.request;
          const response = await client.textToSpeech.convertWithTimestamps(voiceId, body, {maxRetries: 0, timeoutInSeconds: 180});
          const audio = Buffer.from(response.audioBase64, 'base64');
          if (!audio.length) throw Error('empty audio');
          writeFileSync(timingFile, JSON.stringify(response.alignment ?? null));
          writeFileSync(mp3 + '.tmp', audio);
          probe(mp3 + '.tmp');
          renameSync(mp3 + '.tmp', mp3);
        } catch (error) {
          rmSync(mp3 + '.tmp', {force: true});
          throw Error(`ElevenLabs failed for ${r.line.id} (HTTP ${error.statusCode ?? 'unknown'}: ${error.message?.slice(0, 200)}). Check key, voice access, model and quota. Completed clips are cached; nothing was replaced.`);
        }
      } else log(`Reusing ${r.line.id}`);
      if (!existsSync(wav)) toWav(mp3, wav);
      const {duration} = probe(wav);
      const raw = existsSync(timingFile) ? JSON.parse(readFileSync(timingFile, 'utf8')) : null;
      const alignment = raw?.characters?.length
        ? {characters: raw.characters, starts: raw.characterStartTimesSeconds, ends: raw.characterEndTimesSeconds}
        : estimatedAlignment(r.request.text, duration);
      staged.push({r, wav, timing: {id: r.line.id, provider: 'elevenlabs', voice: config.narrator.name ?? null, voiceId: r.request.voiceId,
        modelId: r.request.modelId, text: r.request.text, fingerprint: r.fingerprint, duration,
        alignmentSource: raw?.characters?.length ? 'elevenlabs' : 'estimated', alignment}});
    }
    if (sha256(readFileSync(paths.narration)) !== sha256(manifestRaw))
      throw Error('narration.json changed during generation. Nothing was activated; rerun.');
    for (const s of staged) activate(paths, s.r.line.id, s.wav, s.timing);
    log(`Activated ${staged.length} clips. Run "sync" to retime the video to their measured durations.`);
    return {clips: staged.length, pending: fresh.length};
  } finally {
    rmSync(lock, {recursive: true, force: true});
  }
}
