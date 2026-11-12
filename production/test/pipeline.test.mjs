import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseScript, spokenText, cleanMarkdown} from '../tools/narration.mjs';
import {resolveTimeline, phraseTime} from '../tools/timeline.mjs';
import {estimatedAlignment, audioRequests} from '../tools/audio.mjs';
import {parseLedger} from '../tools/ledger.mjs';
import {scaffoldTimeline} from '../tools/scaffold.mjs';
import {timecode, youtubeChapters, youtubeMarkdown, sourceLines} from '../tools/youtube.mjs';

const SCRIPT = `# Guion
**Cómo leerlo:** notas.

## Antes de grabar
> Esto no se narra.

## 1. Tres frases (0:00)

**PANTALLA:** dos barras.

> El censo contó 26,6 millones de viviendas
> y 18,5 millones de hogares.
>
> Segunda frase con *énfasis* y un [enlace](https://x.org).

**PANTALLA:** NO ES TAN SENCILLO.

## 2. La cuenta (0:29)

> El decreto, que [sigue en vigor / no se convalidó], dice algo.

*Fuentes: V9, V7 [S].*

## 3. Cierre (1:00)

**PANTALLA:** tabla.

> ¿Cuántas, dónde, para quién y para cuándo?
`;

const timing = (id, text, duration) => ({id, text, duration, provider: 'elevenlabs', alignmentSource: 'elevenlabs', alignment: estimatedAlignment(text, duration)});
function fixture() {
  const manifest = parseScript(SCRIPT);
  for (const l of manifest.lines) l.spoken = spokenText(l.text);
  const timings = new Map(manifest.lines.map(l => [l.id, timing(l.id, l.spoken, 4)]));
  return {manifest, timings};
}

test('narration: numbered sections, screens, paragraphs and open alternatives', () => {
  const m = parseScript(SCRIPT);
  assert.deepEqual(m.lines.map(l => l.id), ['s1-01', 's1-02', 's2-01', 's3-01']);
  assert.equal(m.lines[0].text, 'El censo contó 26,6 millones de viviendas y 18,5 millones de hogares.');
  assert.equal(m.lines[1].text, 'Segunda frase con énfasis y un enlace.');
  assert.equal(m.lines[0].screen, 's1-p1');
  assert.equal(m.lines[2].screen, null);
  assert.deepEqual(m.lines[2].placeholders, ['[sigue en vigor / no se convalidó]']);
  assert.deepEqual(m.screens.map(s => s.id), ['s1-p1', 's1-p2', 's3-p1']);
  assert.deepEqual(m.sections.map(s => [s.n, s.title, s.plannedAt]), [[1, 'Tres frases', '0:00'], [2, 'La cuenta', '0:29'], [3, 'Cierre', '1:00']]);
  assert.deepEqual(m.sections[1].sources, ['V9', 'V7']);
  assert.ok(!m.lines.some(l => l.text.includes('no se narra')));
});

test('narration: pronunciation replacements change only the spoken text', () => {
  assert.equal(spokenText('Recargo del IBI y del IVA', [['IBI', 'I-B-I']]), 'Recargo del I-B-I y del IVA');
  assert.equal(cleanMarkdown('**negrita** y _cursiva_'), 'negrita y cursiva');
});

test('timeline: narrated beats take their length from the audio, rounded up to frames', () => {
  const {manifest, timings} = fixture();
  const r = resolveTimeline({manifest, timings, timeline: {version: 1, fps: 60, beats: [
    {id: 'intro', visual: 'intro', duration: 5},
    {id: 'a', visual: 'barras', lines: ['s1-01', 's1-02'], sourceLabel: 'INE', cues: {hogares: '18,5 millones'}},
    {id: 'b', visual: 'placeholder', lines: ['s2-01', 's3-01'], padBefore: 0.25, padAfter: 0.3, gap: 0.5},
    {id: 'outro', visual: 'outro', minDuration: 20, transition: 0},
  ]}});
  const [intro, a, b, outro] = r.beats;
  assert.equal(intro.transition, 0);
  assert.equal(a.start, 5);
  assert.ok(Math.abs(a.duration - (0.4 + 4 + 0.35 + 4 + 0.6)) < 1 / 60);
  assert.equal(Math.round(a.duration * 60), a.duration * 60);
  assert.equal(a.cues['s1-02'], 0.4 + 4 + 0.35);
  assert.ok(a.cues.hogares > 0.4 && a.cues.hogares < 4.4);
  assert.ok(Math.abs(b.duration - 9.05) < 1 / 60);
  assert.equal(outro.duration, 20);
  assert.equal(r.schedule[1].start, +(5 + 4.75).toFixed(4));
  assert.equal(r.animatic, false);
  assert.deepEqual(r.chapters.map(c => [c.at, c.title]), [[0, 'Tres frases'], [b.start, 'La cuenta'], ]);
});

test('timeline: pauseAfter adds silence after one line inside a beat', () => {
  const {manifest, timings} = fixture();
  const tl = pause => ({version: 1, fps: 60, beats: [
    {id: 'a', visual: 'placeholder', lines: ['s1-01', 's1-02', 's2-01', 's3-01'], pauseAfter: pause}]});
  const base = resolveTimeline({manifest, timings, timeline: tl(undefined)}).beats[0];
  const p = resolveTimeline({manifest, timings, timeline: tl({'s1-02': 1.5})}).beats[0];
  assert.equal(p.cues['s1-02'], base.cues['s1-02']);
  assert.ok(Math.abs(p.cues['s2-01'] - base.cues['s2-01'] - 1.5) < 1e-6);
  assert.ok(Math.abs(p.duration - base.duration - 1.5) < 1 / 60);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: tl({'s9-01': 1})}), /not in this beat/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: tl({'s1-01': -1})}), /0–10 seconds/);
});

test('timeline: lines must all be used, once, in script order', () => {
  const {manifest, timings} = fixture();
  const beats = lines => ({version: 1, beats: [{id: 'x', visual: 'placeholder', lines}]});
  assert.throws(() => resolveTimeline({manifest, timings, timeline: beats(['s1-02', 's1-01', 's2-01', 's3-01'])}), /out of order/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: beats(['s1-01', 's1-02', 's2-01'])}), /not placed.*s3-01/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: beats(['s1-01', 's1-01'])}), /used twice/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: beats(['s9-01'])}), /unknown narration line/);
});

test('timeline: stale audio, short durations and bad cues fail before rendering', () => {
  const {manifest, timings} = fixture();
  const all = ['s1-01', 's1-02', 's2-01', 's3-01'];
  const stale = new Map(timings); stale.set('s1-01', timing('s1-01', 'otro texto', 3));
  assert.throws(() => resolveTimeline({manifest, timings: stale, timeline: {version: 1, beats: [{id: 'x', visual: 'p', lines: all}]}}), /different text/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: {version: 1, beats: [{id: 'x', visual: 'p', lines: all, duration: 3}]}}), /shorter than its narration/);
  assert.throws(() => resolveTimeline({manifest, timings, timeline: {version: 1, beats: [{id: 'x', visual: 'p', lines: all, cues: {k: 'palabra ausente'}}]}}), /not spoken/);
  assert.throws(() => resolveTimeline({manifest, timings: new Map(), timeline: {version: 1, beats: [{id: 'x', visual: 'p', lines: all}]}}), /missing audio/);
  const ledger = parseLedger('### V9 - INE [P]\nhttps://ine.es\n');
  assert.throws(() => resolveTimeline({manifest, timings, ledger, timeline: {version: 1, beats: [{id: 'x', visual: 'p', lines: all, sources: ['V99']}]}}), /not in the ledger/);
});

test('cues: phrase lookup uses character timestamps, case-insensitively', () => {
  const t = {alignment: {characters: [...'Hola Mundo hola'], starts: [...'Hola Mundo hola'].map((_, i) => i / 10), ends: [...'Hola Mundo hola'].map((_, i) => (i + 1) / 10)}};
  assert.equal(phraseTime(t, 'mundo'), 0.5);
  assert.equal(phraseTime(t, 'hola', {occurrence: 2}), 1.1);
  assert.equal(phraseTime(t, 'mundo', {edge: 'end'}), 1);
  assert.equal(phraseTime(t, 'adiós'), null);
});

test('placeholder audio makes the result an animatic', () => {
  const {manifest, timings} = fixture();
  timings.set('s3-01', {...timings.get('s3-01'), provider: 'placeholder', alignmentSource: 'estimated'});
  const r = resolveTimeline({manifest, timings, timeline: {version: 1, beats: [{id: 'x', visual: 'placeholder', lines: ['s1-01', 's1-02', 's2-01', 's3-01']}]}});
  assert.equal(r.animatic, true);
});

test('audio requests carry voice, model, language and are fingerprinted by content', () => {
  const lines = [{id: 'a', spoken: 'Uno.'}, {id: 'b', spoken: 'Dos.'}];
  const config = {modelId: 'm', outputFormat: 'mp3_44100_192', languageCode: 'es', narrator: {voiceId: 'v'}};
  const [a, b] = audioRequests(lines, config);
  assert.deepEqual(a.request, {voiceId: 'v', text: 'Uno.', modelId: 'm', outputFormat: 'mp3_44100_192', languageCode: 'es'});
  assert.notEqual(a.fingerprint, b.fingerprint);
  const withContext = audioRequests(lines, {...config, continuity: true});
  assert.equal(withContext[0].request.nextText, 'Dos.');
  assert.notEqual(withContext[0].fingerprint, a.fingerprint);
});

test('scaffold: intro, one beat per screen, silent brand cartela, end screen', () => {
  const m = parseScript(SCRIPT);
  const t = scaffoldTimeline(m, {question: '¿Funciona?'});
  assert.deepEqual(t.beats.map(b => [b.id, b.visual]), [['intro', 'intro'], ['s1-p1', 'placeholder'], ['s1-p2', 'cartela'],
    ['s2-p0', 'placeholder'], ['s3-p1', 'placeholder'], ['outro', 'outro']]);
  assert.deepEqual(t.beats.flatMap(b => b.lines ?? []), m.lines.map(l => l.id));
  assert.equal(t.beats.at(-1).minDuration, 20);
});

test('youtube: chapters follow YouTube rules and sources come from the ledger', () => {
  assert.equal(timecode(0), '0:00'); assert.equal(timecode(3725.9), '1:02:05');
  const {chapters, dropped} = youtubeChapters([{at: 3, title: 'A'}, {at: 8, title: 'B'}, {at: 30, title: 'C'}, {at: 60, title: 'D'}, {at: 95, title: 'E'}], 100);
  assert.deepEqual(chapters.map(c => [c.at, c.title]), [[0, 'A'], [30, 'C'], [60, 'D']]);
  assert.deepEqual(dropped.map(c => c.title), ['B', 'E']);
  const ledger = parseLedger('### V9 - INE, Censo 2021 [P]\nhttps://ine.es/a\n### V33 - La misma prueba [C]\n### V30 - Quién compra [S y C]\n');
  assert.deepEqual(sourceLines(['V9', 'V33', 'V30'], ledger),
    ['V9 · INE, Censo 2021 — https://ine.es/a', 'V33 · La misma prueba [cálculo nuestro]', 'V30 · Quién compra [citado por terceros] [cálculo nuestro]']);
  const resolved = {title: 'T', duration: 100, warnings: [], animatic: false, sources: ['V9'], schedule: [],
    chapters: [{at: 0, title: 'A'}, {at: 30, title: 'C'}, {at: 60, title: 'D'}],
    beats: [{visual: 'outro', start: 80, duration: 20}], credits: [{text: 'Música: X'}]};
  const out = youtubeMarkdown({episode: {id: 'e', youtube: {title: 'T', description: ['Hola.'], tags: ['a']}}, resolved, ledger});
  assert.match(out.description, /CAPÍTULOS\n0:00 A\n0:30 C\n1:00 D/);
  assert.match(out.description, /V9 · INE/);
  assert.match(out.description, /Música: X/);
  assert.match(out.markdown, /Pantalla final: de 1:20 a 1:40/);
});
