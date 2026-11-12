// Shared locations and small helpers for the episode pipeline.
// Source of truth per episode lives in episodes/<id>/production/;
// media lives in production/public/<id>/ so Vite can serve it to Motion Canvas.
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, renameSync, writeFileSync, mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const production = join(root, 'production');

export function episodePaths(id) {
  if (!/^[0-9a-z][0-9a-z-]*$/.test(id ?? '')) throw Error(`Invalid episode ID "${id}". Use the folder name, e.g. 03-vivienda.`);
  const folder = join(root, 'episodes', id);
  if (!existsSync(folder)) throw Error(`Missing episode folder episodes/${id}`);
  const work = join(folder, 'production');
  const pub = join(production, 'public', id);
  return {
    id, folder, work, pub,
    config: join(work, 'episode.json'),
    narration: join(work, 'narration.json'),
    timeline: join(work, 'timeline.json'),
    build: join(work, 'build'),
    resolved: join(work, 'build', 'timeline.resolved.json'),
    renderCheck: join(work, 'render-validation.json'),
    youtube: join(work, 'youtube.md'),
    audio: join(pub, 'audio'),
    music: join(pub, 'music'),
    generated: join(pub, 'generated'),
    soundtrack: join(pub, 'generated', 'soundtrack.wav'),
    output: join(production, 'output'),
  };
}

export const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
export function writeJson(file, value) {
  mkdirSync(dirname(file), {recursive: true});
  writeFileSync(file + '.tmp', JSON.stringify(value, null, 2) + '\n');
  renameSync(file + '.tmp', file);
}
export function writeText(file, text) {
  mkdirSync(dirname(file), {recursive: true});
  writeFileSync(file + '.tmp', text);
  renameSync(file + '.tmp', file);
}
export const sha256 = data => createHash('sha256').update(data).digest('hex');

export function command(bin, args, options = {}) {
  const r = spawnSync(bin, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options});
  if (r.error) throw Error(`${bin}: ${r.error.message}`);
  if (r.status !== 0) throw Error(`${bin} failed: ${r.stderr?.slice(-2000)}`);
  return r.stdout;
}

export function probe(path) {
  if (!existsSync(path)) throw Error(`Missing media: ${path}`);
  const p = JSON.parse(command('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', path]));
  const duration = Number(p.format.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw Error(`Invalid media duration: ${path}`);
  return {duration, audio: p.streams.some(s => s.codec_type === 'audio'), video: p.streams.some(s => s.codec_type === 'video')};
}

/** Shell environment wins, then .env.local, then .env. Never print their contents. */
export function loadEnv() {
  for (const name of ['.env.local', '.env']) if (existsSync(join(root, name))) process.loadEnvFile(join(root, name));
}
