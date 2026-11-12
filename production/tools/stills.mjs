// Review stills: renders the real episode scene at a low frame rate and saves
// each frame as a PNG (no audio, no encoding), to compare keyframes against the
// design boards quickly. `--every 4` = one still every 4 s; `--at 12,95.5` =
// those times only; `--from/--to` narrow the range; `--scale 0.5` = 960x540.
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {production} from './paths.mjs';
import {prepare} from './timeline.mjs';

export async function stills(id, {every = 4, at, from = 0, to, scale = 0.5, out, log = console.log} = {}) {
  const {paths, resolved} = prepare(id, {log});
  const dir = out ?? join(paths.output, 'stills');
  mkdirSync(dir, {recursive: true});
  process.env.EPISODE = id;
  const {createServer} = await import('vite');
  const {chromium} = await import('playwright');
  const server = await createServer({
    configFile: join(production, 'vite.config.ts'),
    optimizeDeps: {noDiscovery: true, esbuildOptions: {target: 'es2022'}, include: ['@motion-canvas/core', '@motion-canvas/2d', '@motion-canvas/2d/lib/jsx-runtime', '@motion-canvas/ui']},
    server: {port: 9110, strictPort: false, hmr: false}, logLevel: 'warn',
  });
  let browser;
  try {
    await server.listen();
    const {port} = server.httpServer.address();
    browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => { errors.push(e.message); console.error('Browser error:', e.message); });
    page.on('console', m => { if (m.type() === 'error') console.error(m.text()); });
    const saved = [];
    await page.exposeFunction('__netesStill', (time, data) => {
      const file = join(dir, `${time.toFixed(1).padStart(7, '0')}.png`);
      writeFileSync(file, Buffer.from(data.slice(data.indexOf(',') + 1), 'base64'));
      saved.push(file);
    });
    await page.goto(`http://127.0.0.1:${port}/render.html`);
    await page.evaluate(() => document.fonts.ready);
    const end = Math.min(to ?? resolved.duration, resolved.duration);
    const times = at ?? Array.from({length: Math.floor((end - from) / every) + 1}, (_, i) => from + i * every);
    log(`Rendering ${times.length} stills → ${dir}`);
    for (const t of times) {
      await page.evaluate(async ({project, name, t, scale}) => {
        const {default: p} = await import(/* @vite-ignore */ `/@fs${project}?project`);
        const {renderStill} = await import('/src/still-client.ts');
        await renderStill(p, name, t, scale);
      }, {project: join(paths.work, 'project.ts'), name: id, t, scale});
    }
    if (errors.length) throw Error('Page errors: ' + errors.join('; '));
    log(`Saved ${saved.length} stills.`);
    return saved;
  } finally {
    await browser?.close();
    await server.close();
  }
}
