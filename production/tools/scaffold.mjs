// Starts a timeline from the narration: an intro splash, one placeholder beat per
// PANTALLA block (with the lines spoken under it), and the end screen. It never
// overwrites an existing timeline.json: that file is hand-edited from then on.
import {existsSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {episodePaths, readJson, writeJson} from './paths.mjs';

export function scaffoldTimeline(manifest, episode = {}) {
  const screens = new Map(manifest.screens.map(s => [s.id, s]));
  const sections = new Map(manifest.sections.map(s => [s.n, s]));
  const groups = [];
  // Screens in script order, each with the lines that follow it.
  for (const s of manifest.screens) groups.push({id: s.id, section: s.section, screen: s.text, lines: []});
  for (const l of manifest.lines) {
    const id = l.screen ?? `s${l.section}-p0`;
    let g = groups.find(g => g.id === id);
    if (!g) {
      g = {id, section: l.section, screen: sections.get(l.section)?.title ?? '', lines: []};
      const at = groups.findIndex(x => x.section > l.section || (x.section === l.section));
      groups.splice(at < 0 ? groups.length : at, 0, g);
    }
    g.lines.push(l.id);
  }
  const brandCard = /^no es tan sencillo\.?$/i;
  const beats = [{id: 'intro', visual: 'intro', duration: 5, props: {
    kicker: episode.intro?.kicker ?? episode.title ?? '',
    title: episode.intro?.title ?? episode.question ?? episode.title ?? '',
    premise: episode.intro?.premise ?? '',
    facts: episode.intro?.facts ?? [],
  }}];
  for (const g of groups) {
    const silent = !g.lines.length;
    if (silent && brandCard.test(g.screen.trim())) { beats.push({id: g.id, visual: 'cartela', duration: 2.5, props: {text: 'NO ES TAN SENCILLO'}}); continue; }
    beats.push({id: g.id, visual: 'placeholder', ...(silent ? {duration: 4} : {lines: g.lines}),
      props: {screen: g.screen ?? screens.get(g.id)?.text}, sources: sections.get(g.section)?.sources ?? []});
  }
  beats.push({id: 'outro', visual: 'outro', minDuration: 20, transition: 0, props: {
    title: episode.outro?.title ?? 'Gracias por vernos.',
    question: episode.outro?.question ?? '',
    prompt: episode.outro?.prompt ?? 'Fuentes, fechas y registro completo en la descripción.',
  }});
  return {version: 1, fps: 60, resolution: {width: 3840, height: 2160},
    defaults: {gap: 0.35, padBefore: 0.4, padAfter: 0.6, transition: 0.4}, beats};
}

const VISUALS_TS = `// Visuals for this episode, by name. Beats in timeline.json refer to these names
// ("visual": "dosBarras"). Built-ins: intro, outro, cartela, placeholder.
// See production/README.md, "Writing a visual".
import type {VisualRegistry} from '../../../production/src/timeline';

export const visuals: VisualRegistry = {};
`;
const project = id => `import {makeProject} from '@motion-canvas/core';
import scene from './scene?scene';
import {episodeExporter} from '../../../production/src/exporter';
export default makeProject({scenes: [scene], audio: '/${id}/generated/soundtrack.wav', plugins: [episodeExporter]});
`;
const SCENE = `import resolved from './build/timeline.resolved.json';
import {createEpisodeScene} from '../../../production/src/scene';
import type {Resolved} from '../../../production/src/timeline';
import {visuals} from './visuals';
export default createEpisodeScene(resolved as unknown as Resolved, visuals);
`;

export function scaffold(id, {log = console.log} = {}) {
  const paths = episodePaths(id);
  const manifest = readJson(paths.narration);
  const episode = readJson(paths.config);
  const files = {
    [paths.timeline]: () => writeJson(paths.timeline, scaffoldTimeline(manifest, episode)),
    [join(paths.work, 'visuals.ts')]: f => writeFileSync(f, VISUALS_TS),
    [join(paths.work, 'project.ts')]: f => writeFileSync(f, project(id)),
    [join(paths.work, 'scene.tsx')]: f => writeFileSync(f, SCENE),
  };
  for (const [file, write] of Object.entries(files)) {
    if (existsSync(file)) { log(`Kept ${file}`); continue; }
    write(file); log(`Created ${file}`);
  }
}
