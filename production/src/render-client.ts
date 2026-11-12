import {Renderer, Vector2, type Project} from '@motion-canvas/core';
import {brand} from './brand';
type Progress = (frame: number) => Promise<void>;
export async function renderEpisode(project: Project, name: string, duration: number, fps: number, resolution: {width: number; height: number}) {
 project.logger.onLogged.subscribe(entry => {if (entry.level === 'error') console.error(entry.message, entry.stack);});
 const renderer = new Renderer(project); let result: number | undefined; let lastReport = -Infinity;
 const progress = (globalThis as typeof globalThis & {__netesRenderProgress?: Progress}).__netesRenderProgress;
 renderer.onFrameChanged.subscribe(frame => {
  if (progress && performance.now() - lastReport >= 1000) {lastReport = performance.now(); void progress(frame).catch(() => {});}
 });
 renderer.onFinished.subscribe(r => result = r);
 // Logical layout is always 1920x1080; 4K renders it at 2x density.
 await renderer.render({name, size: new Vector2(1920, 1080), resolutionScale: resolution.width / 1920, colorSpace: 'srgb',
  background: brand.paper, fps, range: [0, duration], exporter: {name: 'netes/mp4', options: {}}});
 return result;
}
