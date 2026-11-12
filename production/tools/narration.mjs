// Extracts the spoken narration from a guion written in the house format:
//   ## N. Section title (m:ss)      numbered sections (unnumbered ones are notes)
//   **PANTALLA:** what is on screen  starts a new screen block
//   > paragraph                      blockquote paragraphs are narration, one clip each
// Line IDs are positional (s<section>-<nn>). The timeline must use every line exactly
// once and in order, so inserting a paragraph is caught by validation rather than
// silently shifting audio onto the wrong visual.
import {readFileSync} from 'node:fs';
import {join, relative} from 'node:path';
import {episodePaths, readJson, root, sha256, writeJson} from './paths.mjs';

const SECTION = /^##\s+(\d+)\.\s+(.+?)\s*(?:\((\d+:\d{2})\))?\s*$/;
const SCREEN = /^\*\*PANTALLA:\*\*\s*(.*)$/;
const SOURCES = /^\*Fuentes?:\s*(.+?)\*\s*$/;
/** Editorial alternatives still open in the script, e.g. "[sigue en vigor / no se convalidó]". */
export const PLACEHOLDER = /\[[^\]]*\/[^\]]*\]/g;

export function cleanMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[\s(«"])[*_]([^*_]+)[*_](?=[\s).,;:!?»"]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sourceIds(text) {
  return [...new Set([...text.matchAll(/\bV(\d+)\b/g)].map(m => 'V' + m[1]))];
}

export function parseScript(markdown) {
  const sections = [], screens = [], lines = [];
  let section = null, screen = null, paragraph = [];
  const flush = () => {
    if (!paragraph.length) return;
    const text = cleanMarkdown(paragraph.join(' '));
    paragraph = [];
    if (!text) return;
    if (!section) throw Error(`Narration before the first numbered section: "${text.slice(0, 60)}"`);
    section.count++;
    lines.push({
      id: `s${section.n}-${String(section.count).padStart(2, '0')}`,
      section: section.n,
      screen: screen?.id ?? null,
      text,
      placeholders: text.match(PLACEHOLDER) ?? [],
    });
  };
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const heading = line.match(/^#{1,6}\s/) ? line.match(SECTION) : null;
    if (line.match(/^#{1,6}\s/)) {
      flush();
      if (heading) {
        section = {n: Number(heading[1]), title: cleanMarkdown(heading[2]), plannedAt: heading[3] ?? null, count: 0, screens: 0, sources: []};
        sections.push(section);
        screen = null;
      } else section = line.startsWith('## ') ? null : section; // an unnumbered ## ends narration
      continue;
    }
    if (!section) continue;
    const s = line.match(SCREEN);
    if (s) {
      flush();
      section.screens++;
      screen = {id: `s${section.n}-p${section.screens}`, section: section.n, text: cleanMarkdown(s[1])};
      screens.push(screen);
      continue;
    }
    const f = line.match(SOURCES);
    if (f) { flush(); section.sources.push(...sourceIds(f[1])); continue; }
    if (line.startsWith('>')) {
      const body = line.replace(/^>\s?/, '');
      if (body.trim()) paragraph.push(body.trim()); else flush();
      continue;
    }
    flush();
  }
  flush();
  if (!lines.length) throw Error('No narration found: expected blockquote paragraphs under numbered "## N. Title" sections.');
  const ids = new Set();
  for (const l of lines) { if (ids.has(l.id)) throw Error(`Duplicate section number produces ${l.id}`); ids.add(l.id); }
  return {
    sections: sections.map(({count, screens: _s, ...s}) => ({...s, sources: [...new Set(s.sources)], lines: count})),
    screens,
    lines,
  };
}

/** Text actually sent to the voice: pronunciation replacements from episode.json, in order. */
export function spokenText(text, pronunciation = []) {
  let out = text;
  for (const [from, to] of pronunciation) out = out.split(from).join(to);
  return out.replace(/\s+/g, ' ').trim();
}

export function extractNarration(id) {
  const paths = episodePaths(id);
  const config = readJson(paths.config);
  const scriptFile = join(paths.folder, config.script);
  const markdown = readFileSync(scriptFile, 'utf8');
  const parsed = parseScript(markdown);
  for (const line of parsed.lines) line.spoken = spokenText(line.text, config.pronunciation);
  const manifest = {script: relative(root, scriptFile), scriptSha256: sha256(markdown), ...parsed};
  writeJson(paths.narration, manifest);
  return manifest;
}
