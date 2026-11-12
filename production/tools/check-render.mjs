// Verifies an exported MP4 against the resolved timeline: format, frame count,
// decodability, no black frames, and audible speech in every narration window.
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {command, episodePaths, readJson, writeJson} from './paths.mjs';
import {renderTarget} from './encoder.mjs';

export function checkRender(id, {draft = false, log = console.log} = {}) {
  const paths = episodePaths(id);
  const resolved = readJson(paths.resolved);
  const target = renderTarget(paths, resolved, draft);
  if (!existsSync(target.file)) throw Error(`Missing ${target.file}. Run "render" first.`);
  const info = JSON.parse(command('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', target.file]));
  const video = info.streams.find(s => s.codec_type === 'video'), audio = info.streams.find(s => s.codec_type === 'audio');
  const problems = [];
  if (!video || !audio) problems.push('missing video or audio stream');
  if (video && (video.width !== target.width || video.height !== target.height)) problems.push(`size ${video.width}x${video.height}, expected ${target.width}x${target.height}`);
  if (video && video.avg_frame_rate !== `${target.fps}/1`) problems.push(`frame rate ${video.avg_frame_rate}, expected ${target.fps}/1`);
  if (Math.abs(Number(info.format.duration) - resolved.duration) > 0.1) problems.push(`duration ${info.format.duration}s, expected ${resolved.duration}s`);
  if (video && Math.abs(Number(video.nb_frames) - Math.round(resolved.duration * target.fps)) > 1) problems.push(`${video.nb_frames} frames, expected ${Math.round(resolved.duration * target.fps)}`);
  const decode = spawnSync('ffmpeg', ['-hide_banner', '-i', target.file, '-vf', 'blackdetect=d=0.04:pix_th=0.04:pic_th=0.98', '-f', 'null', '-'], {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
  if (decode.status !== 0 || /Error while decoding|Invalid data found/.test(decode.stderr)) problems.push('decode errors');
  const black = [...decode.stderr.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map(m => ({start: +m[1], end: +m[2]}));
  if (black.length) problems.push('black frames: ' + JSON.stringify(black));
  const narration = [];
  for (const v of resolved.schedule) {
    const r = spawnSync('ffmpeg', ['-hide_banner', '-ss', String(v.start), '-t', String(v.duration), '-i', target.file, '-vn', '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
    const level = Number(r.stderr.match(/mean_volume: ([-\d.]+) dB/)?.[1]);
    if (r.status !== 0 || !Number.isFinite(level) || level < -42) problems.push(`silent narration ${v.id} at ${v.start}s`);
    narration.push({id: v.id, at: v.start, meanDb: level});
  }
  const result = {file: target.file, kind: target.kind ?? 'final', duration: Number(info.format.duration), frames: Number(video?.nb_frames),
    width: video?.width, height: video?.height, fps: target.fps, blackIntervals: black, narration, problems};
  if (!draft) writeJson(paths.renderCheck, result);
  if (problems.length) throw Error(`Render check failed for ${target.file}:\n- ${problems.join('\n- ')}`);
  log(`Render OK: ${target.file} (${result.width}x${result.height}, ${target.fps} fps, ${result.duration.toFixed(2)} s, ${narration.length} narration windows)`);
  return result;
}
