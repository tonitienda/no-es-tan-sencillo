// Browser half of `video <episode> stills`: renders one frame at time t and hands
// its PNG to the Node side (exposed as window.__netesStill by tools/stills.mjs).
import {Renderer, Vector2, type Exporter, type Project} from '@motion-canvas/core';
import {brand} from './brand';

type Save = (time: number, png: string) => Promise<void>;
/** The exporter is registered once per page, so the time it saves under lives here. */
let current = 0;

export async function renderStill(project: Project, name: string, t: number, scale: number) {
  current = t;
  const save = (window as unknown as {__netesStill: Save}).__netesStill;
  class Still implements Exporter {
    static id = 'netes/still'; static displayName = 'Review still';
    static meta() { return null as never; }
    static async create() { return new Still(); }
    private done = false;
    async start() {}
    async handleFrame(canvas: HTMLCanvasElement) { if (!this.done) { this.done = true; await save(current, canvas.toDataURL('image/png')); } }
    async stop() {}
  }
  // The renderer looks exporters up in the project meta, built when the project loads.
  const list = (project.meta.rendering.exporter as unknown as {exporters: unknown[]}).exporters;
  if (!list.some(e => (e as typeof Still).id === Still.id)) list.push(Still);
  project.logger.onLogged.subscribe(entry => { if (entry.level === 'error') console.error(entry.message, entry.stack); });
  // fps 10 over a 0.1 s range: exactly one frame, at t.
  await new Renderer(project).render({name, size: new Vector2(1920, 1080), resolutionScale: scale, colorSpace: 'srgb',
    background: brand.night, fps: 10, range: [t, t + 0.1], exporter: {name: 'netes/still', options: {}}});
}
