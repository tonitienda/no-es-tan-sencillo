// Headless export: Vite serves the Motion Canvas project, Playwright's Chromium
// renders every frame, and the encoder plugin pipes them into FFmpeg with the
// mixed soundtrack. Ported from agent-world-lab's episode.mjs --render.
import {join} from 'node:path';
import {production} from './paths.mjs';
import {prepare} from './timeline.mjs';
import {renderTarget} from './encoder.mjs';
import {watchRender} from './render-watchdog.mjs';

export async function render(id, {draft = false, previewCheck = false, log = console.log} = {}) {
  const {paths, resolved} = prepare(id, {log});
  const target = renderTarget(paths, resolved, draft);
  if (resolved.animatic && !draft) log('Placeholder narration present: writing an animatic, not the final video.');
  process.env.EPISODE = id;
  process.env.RENDER_DRAFT = draft ? '1' : '';
  const {createServer} = await import('vite');
  let chromium;
  try { ({chromium} = await import('playwright')); }
  catch { throw Error('Playwright is missing. Run: npm install && npx playwright install chromium'); }
  const server = await createServer({
    configFile: join(production, 'vite.config.ts'),
    // Prebundle the full render entry set and disable discovery/HMR so Vite never
    // reloads the page in the middle of a long export.
    optimizeDeps: {noDiscovery: true, esbuildOptions: {target: 'es2022'}, include: ['@motion-canvas/core', '@motion-canvas/2d', '@motion-canvas/2d/lib/jsx-runtime', '@motion-canvas/ui']},
    server: {port: 9100, strictPort: false, hmr: false},
    logLevel: process.env.VITE_LOG ?? 'warn',
  });
  let browser;
  try {
    await server.listen();
    const {port} = server.httpServer.address();
    browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    const errors = [];
    // The editor's update check (registry.npmjs.org) fails offline; that is not a render problem.
    page.on('pageerror', e => { if (previewCheck && e.message === 'Failed to fetch') return; errors.push(e.message); console.error('Browser error:', e.message); });
    page.on('console', m => { if (m.type() === 'error') console.error(m.text()); });
    if (previewCheck) {
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForTimeout(5000);
      const track = await page.request.get(`http://127.0.0.1:${port}/${id}/generated/soundtrack.wav`);
      if (errors.length || !track.ok() || await page.locator('canvas').count() === 0) throw Error('Editor preview failed: ' + errors.join('; '));
      log('Editor opens, canvas present, soundtrack served, no page errors.');
      return null;
    }
    await page.goto(`http://127.0.0.1:${port}/render.html`);
    await page.evaluate(() => document.fonts.ready);
    const totalFrames = Math.round(resolved.duration * target.fps);
    log(`Rendering ${resolved.duration.toFixed(1)} s, ${totalFrames} frames at ${target.width}x${target.height}/${target.fps} → ${target.file}`);
    const result = await watchRender(page, () => page.evaluate(async ({project, name, duration, fps, resolution}) => {
      const {default: p} = await import(/* @vite-ignore */ `/@fs${project}?project`);
      const {renderEpisode} = await import('/src/render-client.ts');
      return renderEpisode(p, name, duration, fps, resolution);
    }, {project: join(paths.work, 'project.ts'), name: id, duration: resolved.duration, fps: target.fps,
      resolution: {width: target.width, height: target.height}}), {totalFrames, log});
    if (result !== 0) throw Error(`Motion Canvas render failed (result ${result})`);
    return target.file;
  } finally {
    await browser?.close();
    await server.close();
  }
}
