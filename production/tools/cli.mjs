#!/usr/bin/env node
// npm run video -- <episode> <step> [options]
import {spawn} from 'node:child_process';
import {join} from 'node:path';
import {episodePaths, loadEnv, production, root} from './paths.mjs';
import {extractNarration} from './narration.mjs';
import {generateAudio} from './audio.mjs';
import {prepare} from './timeline.mjs';
import {scaffold} from './scaffold.mjs';
import {render} from './render.mjs';
import {stills} from './stills.mjs';
import {checkRender} from './check-render.mjs';
import {writeYoutube} from './youtube.mjs';

const HELP = `Usage: npm run video -- <episode> <step> [options]

Steps, in order:
  narration          Extract narration lines from the script (episode.json "script")
  scaffold           Create timeline.json, visuals.ts, project.ts, scene.tsx if missing
  audio              Generate ElevenLabs narration with word timings (cached; only changed lines cost)
      --placeholder  Free local voice for an animatic (macOS "say", else a tone)
      --dry-run      Show what would be requested
      --only s4-02,s4-03
  sync               Retime the timeline to the measured audio and mix the soundtrack
  preview            Open the Motion Canvas editor with synchronized sound
  render             Export the video (4K/60 from timeline.json)
      --draft        1080p/30 review export (<episode>.draft.mp4)
      --preview-check  Only check that the editor opens
  stills             Save review PNGs of the real scene (no audio), to compare with the design boards
      --every 4      One still every 4 s (or --at 12,95.5), optionally --from/--to, --scale 0.5
  check              Verify the export: format, frames, black frames, audible narration
  youtube            Write youtube.md: title, description, chapters, sources, credits, tags
  all                narration, audio, sync, render, check, youtube (add --draft or --placeholder)

Example: npm run video -- 03-vivienda all --placeholder --draft`;

const [id, step, ...rest] = process.argv.slice(2);
const flag = name => rest.includes(name);
const option = name => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const log = console.log;

async function run(step) {
  switch (step) {
    case 'narration': {
      const m = extractNarration(id);
      const open = m.lines.filter(l => l.placeholders.length);
      log(`${m.lines.length} lines in ${m.sections.length} sections, ${m.screens.length} screens (${m.lines.reduce((n, l) => n + l.text.length, 0)} characters) from ${m.script}`);
      for (const l of open) log(`  open alternative in ${l.id}: ${l.placeholders.join(' ')}`);
      return;
    }
    case 'scaffold': return scaffold(id, {log});
    case 'audio': return generateAudio({id, placeholder: flag('--placeholder'), dryRun: flag('--dry-run'), only: option('--only')?.split(','), log});
    case 'sync': {
      const {resolved, paths} = prepare(id, {log});
      log(`${id}: ${resolved.beats.length} beats, ${resolved.schedule.length} narration clips, ${resolved.duration.toFixed(2)} s${resolved.animatic ? ' (animatic: placeholder voice)' : ''}`);
      for (const w of resolved.warnings) log(`  warning: ${w}`);
      log(`  ${paths.resolved}`);
      return;
    }
    case 'preview': {
      prepare(id, {log});
      const vite = spawn(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), '--config', join(production, 'vite.config.ts')],
        {stdio: 'inherit', env: {...process.env, EPISODE: id}, cwd: production});
      await new Promise(resolve => vite.on('close', resolve));
      return;
    }
    case 'render': return render(id, {draft: flag('--draft'), previewCheck: flag('--preview-check'), log});
    case 'stills': return stills(id, {every: +(option('--every') ?? 4), at: option('--at')?.split(',').map(Number),
      from: +(option('--from') ?? 0), to: option('--to') ? +option('--to') : undefined, scale: +(option('--scale') ?? 0.5), log});
    case 'check': return checkRender(id, {draft: flag('--draft'), log});
    case 'youtube': return writeYoutube(id, {log});
    case 'all':
      for (const s of ['narration', 'audio', 'sync', 'render', 'check', 'youtube']) { log(`\n== ${s}`); await run(s); }
      return;
    default: throw Error(HELP);
  }
}

if (!id || !step || id === '--help' || step === '--help') { log(HELP); process.exit(id ? 0 : 1); }
loadEnv();
try { episodePaths(id); await run(step); }
catch (e) { console.error(e.message); process.exitCode = 1; }
