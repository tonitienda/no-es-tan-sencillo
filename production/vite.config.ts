import {defineConfig} from 'vite';
import motionCanvasModule from '@motion-canvas/vite-plugin';
import {fileURLToPath} from 'node:url';
// Node-side pipeline helpers; the browser scene only imports the resolved JSON.
// @ts-ignore JavaScript module, covered by production/test.
import {prepare} from './tools/timeline.mjs';
// @ts-ignore
import {encoderPlugin} from './tools/encoder.mjs';

const episode = process.env.EPISODE;
if (!episode) throw Error('Set EPISODE (e.g. EPISODE=03-vivienda), or use: npm run video -- 03-vivienda preview');
const production = fileURLToPath(new URL('.', import.meta.url));
const root = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig(() => {
  // Validate and retime before the editor opens, so preview always matches the audio.
  const {paths, resolved} = prepare(episode, {log: console.log});
  for (const w of resolved.warnings) console.warn('warning:', w);
  return {
    root: production,
    publicDir: 'public',
    plugins: [
      motionCanvasModule.default({project: `${paths.work}/project.ts`}),
      encoderPlugin({paths, resolved, draft: process.env.RENDER_DRAFT === '1'}),
    ],
    server: {host: '127.0.0.1', fs: {allow: [root]}},
    // Rendering happens in current Chromium only; no need to down-level syntax.
    esbuild: {target: 'es2022'},
    optimizeDeps: {esbuildOptions: {target: 'es2022'}},
  };
});
