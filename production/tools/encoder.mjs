// Receives PNG frames from the headless Motion Canvas render and pipes them into
// FFmpeg with the mixed soundtrack. Ported from agent-world-lab (backpressure and
// byte uploads avoid Chromium Blob exhaustion on long 4K exports).
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync, renameSync, rmSync} from 'node:fs';
import {join} from 'node:path';

export const DRAFT = {fps: 30, width: 1920, height: 1080};
export function renderTarget(paths, resolved, draft = false) {
  const kind = draft ? 'draft' : resolved.animatic ? 'animatic' : null;
  const {fps, resolution: {width, height}} = draft ? {fps: DRAFT.fps, resolution: DRAFT} : resolved;
  return {fps, width, height, kind, file: join(paths.output, `${paths.id}${kind ? '.' + kind : ''}.mp4`)};
}

export function waitForEncoderDrain(stream, timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (stream.destroyed) { reject(Error('FFmpeg input closed while uploading a frame')); return; }
    const cleanup = () => { clearTimeout(timer); stream.off('drain', drained); stream.off('error', failed); stream.off('close', closed); };
    const drained = () => { cleanup(); resolve(); };
    const failed = error => { cleanup(); reject(error); };
    const closed = () => failed(Error('FFmpeg input closed while uploading a frame'));
    const timer = setTimeout(() => failed(Error('FFmpeg input stalled while uploading a frame')), timeout);
    stream.once('drain', drained); stream.once('error', failed); stream.once('close', closed);
  });
}

export function encoderPlugin({paths, resolved, draft}) {
  const target = renderTarget(paths, resolved, draft);
  const partial = target.file.replace(/\.mp4$/, '.rendering.mp4');
  let encoder, completed, stderr = '', frames = 0;
  return {name: 'netes:encoder', configureServer(server) {
    server.httpServer?.on('close', () => encoder?.kill());
    server.middlewares.use('/__episode-export/', async (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) { res.statusCode = 403; res.end(); return; }
      try {
        const action = req.url?.split('?')[0].replace(/^\//, '');
        if (action === 'start') {
          if (encoder) throw Error('An export is already running');
          const chunks = []; for await (const c of req) chunks.push(c);
          const {fps, width, height} = JSON.parse(Buffer.concat(chunks).toString());
          if (fps !== target.fps || width !== target.width || height !== target.height)
            throw Error(`Render settings must be ${target.width}x${target.height} at ${target.fps} fps (1920x1080 scene, ${target.width / 1920 * 100}% scale)`);
          mkdirSync(paths.output, {recursive: true}); stderr = ''; frames = 0;
          encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', 'pipe:0',
            '-i', paths.soundtrack, '-map', '0:v:0', '-map', '1:a:0', '-t', String(resolved.duration),
            '-c:v', 'libx264', '-preset', draft ? 'veryfast' : 'fast', '-crf', draft ? '23' : '18', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', partial], {stdio: ['pipe', 'ignore', 'pipe']});
          encoder.stderr.on('data', c => { stderr = (stderr + c).slice(-16384); });
          encoder.stdin.on('error', () => {});
          completed = once(encoder, 'close'); completed.catch(() => {});
        } else if (action === 'frame') {
          if (!encoder || encoder.exitCode !== null) throw Error('Encoder is not running: ' + stderr);
          for await (const c of req) if (!encoder.stdin.write(c)) await waitForEncoderDrain(encoder.stdin);
          frames++; if (frames % 600 === 0) console.log(`Encoded ${frames} frames (${(frames / target.fps).toFixed(0)} s)`);
        } else if (action === 'finish') {
          if (!encoder) throw Error('No export started');
          encoder.stdin.end(); const [code] = await completed; encoder = undefined;
          if (code !== 0) throw Error('FFmpeg failed: ' + stderr);
          if (frames < Math.round(resolved.duration * target.fps) - 1) throw Error('Incomplete Motion Canvas render');
          renameSync(partial, target.file); console.log('Rendered ' + target.file);
        } else if (action === 'abort') {
          encoder?.kill(); encoder = undefined; rmSync(partial, {force: true});
        } else throw Error('Unknown export action');
        res.end('ok');
      } catch (e) { res.statusCode = 500; res.end(String(e)); }
    });
  }};
}
