// Writes episodes/<id>/production/youtube.md: title, description with chapters
// (from the measured timeline), sources (from the ledger), credits, tags and
// upload notes. It never uploads or changes anything on YouTube.
import {existsSync} from 'node:fs';
import {join, relative} from 'node:path';
import {episodePaths, readJson, root, writeText} from './paths.mjs';
import {readLedger} from './ledger.mjs';

const LIMIT = 5000; // YouTube description limit, in characters
export const timecode = s => {
  const t = Math.floor(s), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), sec = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

/** YouTube chapters: first at 0:00, at least three, each at least 10 s long. */
export function youtubeChapters(chapters, duration) {
  const kept = [], dropped = [];
  for (const c of chapters) {
    if (kept.length && c.at - kept.at(-1).at < 10) { dropped.push(c); continue; }
    kept.push(c);
  }
  while (kept.length > 1 && duration - kept.at(-1).at < 10) dropped.push(kept.pop());
  if (kept.length) kept[0] = {...kept[0], at: 0};
  return {chapters: kept.length >= 3 ? kept : [], dropped, valid: kept.length >= 3};
}

const MARK = {C: ' [cálculo nuestro]', S: ' [citado por terceros]'};
export function sourceLines(ids, ledger) {
  return ids.map(id => {
    const e = ledger?.get(id);
    if (!e) return `${id}`;
    const mark = [...new Set((e.level ?? '').match(/[PSC]/g) ?? [])].map(l => MARK[l] ?? '').join('');
    return `${id} · ${e.title}${mark}${e.urls[0] ? ` — ${e.urls[0]}` : ''}`;
  });
}

export function youtubeMarkdown({episode, resolved, ledger, check}) {
  const y = episode.youtube ?? {};
  const warnings = [...resolved.warnings];
  if (resolved.animatic) warnings.unshift('Narración provisional (placeholder): esto es un animatic. Genera la voz con ElevenLabs antes de publicar.');
  if (!y.title) warnings.push('Falta youtube.title en episode.json.');
  const {chapters, dropped, valid} = youtubeChapters(resolved.chapters, resolved.duration);
  if (!valid) warnings.push('Menos de tres capítulos válidos: YouTube no mostraría capítulos.');
  for (const d of dropped) warnings.push(`Capítulo omitido por durar menos de 10 s: ${timecode(d.at)} ${d.title}`);

  const outro = resolved.beats.findLast(b => b.visual === 'outro');
  if (outro && outro.duration < 5) warnings.push('La pantalla final dura menos de 5 s: YouTube no permite elementos finales.');

  const credits = (resolved.credits ?? []).map(c => c.text);
  const disclosure = y.voiceDisclosure ?? 'La narración usa una voz sintética generada con ElevenLabs a partir de nuestro guion.';
  const head = [...(y.description ?? [])];
  const chapterBlock = chapters.length ? ['CAPÍTULOS', ...chapters.map(c => `${timecode(c.at)} ${c.title}`)] : [];
  const tail = [
    ...(y.corrections ? [y.corrections] : ['Si encuentras un error, dínoslo en los comentarios: corregimos y lo anotamos aquí.']),
    disclosure,
    ...(credits.length ? ['MÚSICA', ...credits] : []),
    ...(y.hashtags?.length ? [y.hashtags.join(' ')] : []),
  ];
  const fullSources = ['FUENTES', '[C] cálculo nuestro · [S] citado por terceros, sin leer aún el original', ...sourceLines(resolved.sources, ledger),
    ...(y.ledgerUrl ? [`Registro completo de fuentes: ${y.ledgerUrl}`] : [])];
  const shortSources = y.ledgerUrl ? ['FUENTES', `Registro completo, con enlaces y fecha de cada dato: ${y.ledgerUrl}`] : null;
  const compose = sources => [head.join('\n\n'), chapterBlock.join('\n'), sources.join('\n'), tail.join('\n\n')].filter(Boolean).join('\n\n');
  let description = compose(fullSources);
  if (description.length > LIMIT) {
    if (shortSources) { description = compose(shortSources); warnings.push(`La lista de fuentes no cabe en ${LIMIT} caracteres: la descripción enlaza al registro.`); }
    else warnings.push(`La descripción tiene ${description.length} caracteres (límite ${LIMIT}). Añade youtube.ledgerUrl para enlazar el registro.`);
  }

  const lines = [
    `# ${resolved.title ?? episode.id} — YouTube`, '',
    'Copia para la subida. Este archivo no publica ni cambia nada en YouTube.', '',
    ...(warnings.length ? ['> **Revisar antes de subir**', ...warnings.map(w => `> - ${w}`), ''] : []),
    '## Título', '', y.title ?? '(pendiente)', '',
    ...(y.alternatives?.length ? ['## Alternativas', '', ...y.alternatives.map(a => `- ${a}`), ''] : []),
    '## Descripción', '', '```text', description, '```', '',
    `${description.length} / ${LIMIT} caracteres.`, '',
    '## Etiquetas', '', (y.tags ?? []).join(', ') || '(pendiente)', '',
    '## Notas de subida', '',
    `- Duración: ${timecode(resolved.duration)} (${resolved.duration.toFixed(3)} s). Idioma: ${y.language ?? 'español (España)'}.${y.category ? ` Categoría: ${y.category}.` : ''}`,
    ...(outro ? [`- Pantalla final: de ${timecode(outro.start)} a ${timecode(outro.start + outro.duration)} (${outro.duration.toFixed(1)} s). Coloca dos vídeos y el botón de suscripción sobre los paneles; ver production/templates/end-screen-guides.svg.`] : []),
    '- Marca «contenido alterado o sintético» si YouTube lo pide para voz generada; revisa la política vigente al subir.',
    `- Exportación: ${check?.file ? `${relative(root, check.file)} (${check.width}x${check.height}, ${check.fps} fps, comprobada)` : 'sin comprobar todavía (ejecuta "check")'}.`,
    `- Narración: ${resolved.schedule.length} clips; fuentes citadas: ${resolved.sources.length}.`,
    '',
  ];
  return {markdown: lines.join('\n'), description, chapters, warnings};
}

export function writeYoutube(id, {log = console.log} = {}) {
  const paths = episodePaths(id);
  const episode = {id, ...readJson(paths.config)};
  if (!existsSync(paths.resolved)) throw Error('Run "sync" first.');
  const resolved = readJson(paths.resolved);
  const ledger = episode.ledger ? readLedger(join(paths.folder, episode.ledger)) : null;
  const check = existsSync(paths.renderCheck) ? readJson(paths.renderCheck) : null;
  const out = youtubeMarkdown({episode, resolved, ledger, check});
  writeText(paths.youtube, out.markdown);
  log(`Wrote ${paths.youtube} (${out.chapters.length} chapters, ${out.description.length} characters${out.warnings.length ? `, ${out.warnings.length} items to review` : ''})`);
  return out;
}
