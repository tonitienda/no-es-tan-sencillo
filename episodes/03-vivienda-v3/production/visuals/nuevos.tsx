// New visuals for 03-vivienda-v2 (script v3): the agenda, the worked example of the
// four questions, the numbered section splashes and the two promises. They build
// from the series kit and the v1 helpers, so they read as the same video.
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, sequence, type ThreadGenerator} from '@motion-canvas/core';
import {Cond, Frame, Pill, R1Chip, R2Card, Serif, type Mark} from '../../../../production/src/kit';
import type {Visual, VisualContext} from '../../../../production/src/timeline';
import {brand, Label, Para, Plane, rgba, show, TL, until} from '../../../03-vivienda/production/visuals/ui';

const Kicker = ({text, x = 72, y = 96}: {text: string; x?: number; y?: number}) =>
  <Txt offset={TL} x={x} y={y} text={text.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={14} letterSpacing={2} fill={brand.muted}/>;

function* cued(ctx: VisualContext, items: [Node, string | undefined][], seconds = 0.5): ThreadGenerator {
  for (const [node, cue] of items) { yield* until(ctx, cue); yield* show(node, seconds); }
}

// ── splash: a short pause that opens a section ────────────────────────────────
/** props: n ("1"), of ("5"), title, sub (the sentence under test, optional). Lineless; give it a duration and "section". */
export const splash: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {n: string; of?: string; title: string; sub?: string};
  const num = createRef<Txt>(), title = createRef<Cond>(), rule = createRef<Rect>(), sub = createRef<Txt>();
  view.add(<Frame>
    <Plane top={500} alpha={0.22}/>
    <Txt ref={num} x={640} y={232} text={`${p.n}${p.of ? ` / ${p.of}` : ''}`} fontFamily={brand.mono} fontWeight={500} fontSize={22} letterSpacing={4} fill={brand.muted} opacity={0}/>
    <Cond ref={title} x={640} y={322} text={p.title.toUpperCase()} fontSize={p.title.length > 14 ? 76 : 108} lineHeight="92%" fill={brand.ivory}
      shadowColor="rgba(242,237,228,0.16)" shadowBlur={36} opacity={0} scale={0.97}/>
    <Rect ref={rule} x={640} y={398} width={0} height={2} fill={brand.ivory}/>
    {p.sub && <Serif ref={sub} x={640} y={452} text={p.sub} fontSize={34} fill={brand.soft} opacity={0}/>}
  </Frame>);
  yield* sequence(0.15,
    num().opacity(1, 0.4),
    all(title().opacity(1, 0.45), title().scale(1, 0.6, easeOutCubic)),
    rule().width(220, 0.5, easeOutCubic),
    ...(p.sub ? [sub().opacity(1, 0.5)] : []),
  );
};

// ── agenda: what the video covers, and the chapters ───────────────────────────
type AgendaProps = {items: {n?: string; title: string; cue?: string}[]; chaptersCue?: string; chaptersText?: string};

export const agenda: Visual = function* (view, ctx) {
  const p = ctx.beat.props as AgendaProps;
  const rows = p.items.map(() => createRef<Node>()), segs = p.items.map(() => createRef<Rect>()), foot = createRef<Node>();
  const BAR_X = 118, BAR_W = 1044, gap = 6, segW = (BAR_W - gap * (p.items.length - 1)) / p.items.length;
  view.add(<Frame>
    <Kicker text="Hoy" x={118}/>
    {p.items.map((it, i) => <Node ref={rows[i]} opacity={0}>
      <Txt offset={TL} x={118} y={142 + i * 62} text={it.n ?? ''} fontFamily={brand.mono} fontSize={18} fill={brand.muted}/>
      <Cond offset={TL} x={170} y={134 + i * 62} text={it.title} fontSize={44} fontWeight={800} fill={brand.ivory}/>
    </Node>)}
    <Node ref={foot} opacity={0}>
      {/* A chapter bar like the player's: one segment per topic. */}
      {p.items.map((_, i) => <Rect ref={segs[i]} x={BAR_X + i * (segW + gap)} y={548} offset={[-1, 0]} width={segW} height={6} radius={3} fill={brand.edge}/>)}
      <Serif offset={TL} x={118} y={572} text={p.chaptersText ?? 'Usa los capítulos para ir a la que te interese.'} fontSize={30} fill={brand.text}/>
    </Node>
  </Frame>);
  yield* cued(ctx, p.items.map((it, i) => [rows[i](), it.cue]), 0.4);
  yield* until(ctx, p.chaptersCue);
  yield* show(foot());
  yield* sequence(0.12, ...segs.map(s => s().fill(brand.ivory, 0.3)));
};

// ── ejemplo: the four questions applied to one sentence ───────────────────────
type EjemploProps = {quote: string; who: string; mark?: Mark;
  rows: {ask?: string; cue?: string; answer: string; detail: string}[]; outro?: string; outroCue?: string};

export const ejemplo: Visual = function* (view, ctx) {
  const p = ctx.beat.props as EjemploProps;
  const card = createRef<Rect>(), outro = createRef<Txt>();
  const pend = p.rows.map(() => createRef<Node>()), done = p.rows.map(() => createRef<Node>()), body = p.rows.map(() => createRef<Node>());
  const Y = (i: number) => 120 + i * 108;
  view.add(<Frame>
    <Kicker text="Un ejemplo"/>
    <R2Card ref={card} quote={`«${p.quote}»`} who={p.who} x={72} y={130} width={360} fontSize={44} opacity={0}/>
    {p.mark && <Pill mark={p.mark} x={72} y={300} offset={TL}/>}
    {p.rows.map((r, i) => <Node>
      <Node ref={pend[i]} opacity={0.6}><R1Chip q={i} state="p" x={570} y={Y(i) + 30} width={150} height={44} fontSize={18}/></Node>
      <Node ref={done[i]} opacity={0}><R1Chip q={i} state="r" x={570} y={Y(i) + 30} width={150} height={44} fontSize={18}/></Node>
      <Node ref={body[i]} opacity={0}>
        <Cond offset={TL} x={672} y={Y(i) + 6} text={r.answer} fontSize={40} fontWeight={800} fill={brand.ivory}/>
        <Para x={672} y={Y(i) + 52} width={540} fontSize={17} text={r.detail}/>
      </Node>
    </Node>)}
    {p.outro && <Serif ref={outro} offset={TL} x={72} y={566} text={p.outro} fontSize={32} fill={brand.text} opacity={0}/>}
  </Frame>);
  yield* show(card());
  for (let i = 0; i < p.rows.length; i++) {
    const r = p.rows[i];
    yield* until(ctx, r.ask);
    yield* pend[i]().opacity(1, 0.3);
    yield* until(ctx, r.cue);
    yield* all(done[i]().opacity(1, 0.4), pend[i]().opacity(0, 0.4), show(body[i]()));
  }
  if (p.outro) { yield* until(ctx, p.outroCue); yield* all(show(outro()), ...body.map(b => b().opacity(0.5, 0.5))); }
};

// ── promesas: both big parties promise; what can be measured of each ──────────
type Figure = {value: string; label: string; cue?: string; mark?: Mark};
type PromesasProps = {
  left: {quote: string; who: string; cue?: string}; right: {quote: string; who: string; cue?: string};
  deliveredTitle: string; deliveredCue?: string; delivered: Figure[]; statement?: string; statementCue?: string;
  noRecord?: {title: string; body: string; cue?: string}; chain?: {text: string; cue?: string}[];
};

export const promesas: Visual = function* (view, ctx) {
  const p = ctx.beat.props as PromesasProps;
  const left = createRef<Rect>(), right = createRef<Rect>(), dTitle = createRef<Txt>(), stmt = createRef<Txt>(), none = createRef<Node>();
  const figs = p.delivered.map(() => createRef<Node>()), chain = (p.chain ?? []).map(() => createRef<Rect>());
  const leftSide = createRef<Node>();
  view.add(<Frame>
    <Kicker text="Las promesas"/>
    <Node ref={leftSide}>
      <R2Card ref={left} quote={p.left.quote} who={p.left.who} x={72} y={124} width={540} fontSize={32} opacity={0}/>
      <Txt ref={dTitle} offset={TL} x={72} y={280} text={p.deliveredTitle.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={13} letterSpacing={1.5} fill={brand.muted} opacity={0}/>
      {p.delivered.map((f, i) => <Node ref={figs[i]} opacity={0}>
        <Cond offset={TL} x={72 + i * 184} y={312} text={f.value} fontSize={40} fill={i === p.delivered.length - 1 ? brand.data.terminadas : brand.ivory}/>
        <Label x={74 + i * 184} y={360} text={f.label} fontSize={14} width={168} textWrap/>
        {f.mark && <Pill mark={f.mark} size={11} x={74 + i * 184} y={420} offset={TL}/>}
      </Node>)}
      {p.statement && <Serif ref={stmt} offset={TL} x={72} y={500} text={p.statement} fontSize={36} width={560} textWrap fill={brand.text} opacity={0}/>}
    </Node>
    <R2Card ref={right} quote={p.right.quote} who={p.right.who} x={668} y={124} width={540} fontSize={32} opacity={0}/>
    {p.noRecord && <Node ref={none} opacity={0}>
      <Txt offset={TL} x={668} y={280} text={p.noRecord.title.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={13} letterSpacing={1.5} fill={brand.muted}/>
      <Para x={668} y={306} width={540} fontSize={20} fill={brand.text} text={p.noRecord.body}/>
    </Node>}
    {(p.chain ?? []).map((c, i) => <Rect ref={chain[i]} layout offset={TL} x={668 + i * 26} y={392 + i * 58} padding={[10, 18]} radius={8}
      stroke={brand.ivory} lineWidth={1.5} fill={rgba(brand.panel, 0.9)} opacity={0}>
      <Cond text={c.text} fontSize={28} fontWeight={800} fill={brand.ivory}/>
    </Rect>)}
  </Frame>);
  yield* until(ctx, p.left.cue); yield* show(left());
  yield* until(ctx, p.right.cue); yield* show(right());
  yield* until(ctx, p.deliveredCue); yield* show(dTitle());
  yield* cued(ctx, p.delivered.map((f, i) => [figs[i](), f.cue]));
  if (p.statement) { yield* until(ctx, p.statementCue); yield* show(stmt(), 0.6); }
  if (p.noRecord) { yield* until(ctx, p.noRecord.cue); yield* all(leftSide().opacity(0.4, 0.6), show(none())); }
  yield* cued(ctx, (p.chain ?? []).map((c, i) => [chain[i](), c.cue]), 0.4);
};

// ── v3 (script v4): the thesis, the "qué significa" summaries and the lever recap ──
// One strip of six levers runs through the video: it appears with the thesis, each
// summary lights its own lever and keeps the earlier ones, and the close shows all six.
export const LEVERS = [
  {title: 'Construir', short: 'llega tarde'},
  {title: 'Vacías', short: 'una parte, en algunas ciudades'},
  {title: 'Turísticos', short: 'un problema local'},
  {title: 'Topes', short: 'reparte, no reduce'},
  {title: 'Extranjeros', short: 'una parte pequeña'},
  {title: 'Vivienda pública', short: 'una generación'},
];
type LeverState = 'off' | 'on' | 'done';
const LX = 72, LW = 1136, LG = 12, lw = (LW - LG * 5) / 6;

/** The strip: six cells; `refs` lets a visual light one later. Short verdicts sit under done cells. */
function LeverStrip({y, states, cells, notes}: {y: number; states: LeverState[]; cells: ReturnType<typeof createRef<Rect>>[]; notes: ReturnType<typeof createRef<Txt>>[]}) {
  return <Node>
    {LEVERS.map((l, i) => <Node>
      <Rect ref={cells[i]} offset={TL} x={LX + i * (lw + LG)} y={y} width={lw} height={46} radius={8} lineWidth={1.5}
        stroke={states[i] === 'off' ? brand.edge : brand.ivory} fill={states[i] === 'done' ? rgba(brand.panel, 0.95) : rgba(brand.panel, 0.4)}
        opacity={states[i] === 'off' ? 0.55 : 1}>
        <Cond text={l.title} fontSize={22} fontWeight={800} fill={states[i] === 'off' ? brand.muted : brand.ivory}/>
      </Rect>
      <Txt ref={notes[i]} offset={TL} x={LX + i * (lw + LG) + 2} y={y + 56} width={lw} textWrap text={l.short}
        fontFamily={brand.sans} fontSize={15} fill={brand.soft} opacity={states[i] === 'done' ? 1 : 0}/>
    </Node>)}
  </Node>;
}
const strip = () => ({cells: LEVERS.map(() => createRef<Rect>()), notes: LEVERS.map(() => createRef<Txt>())});

/** props: line (the thesis), lineCue; the six levers appear first, unlit. */
export const tesis: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {line: string; lineCue?: string; kicker?: string};
  const s = strip(), line = createRef<Txt>(), group = createRef<Node>();
  view.add(<Frame>
    <Kicker text={p.kicker ?? 'La idea'}/>
    <Node ref={group} opacity={0}><LeverStrip y={200} states={LEVERS.map(() => 'off')} {...s}/></Node>
    <Serif ref={line} offset={TL} x={72} y={330} width={1136} textWrap text={p.line} fontSize={64} fill={brand.ivory} opacity={0}/>
  </Frame>);
  yield* show(group(), 0.6);
  yield* until(ctx, p.lineCue);
  yield* all(show(line(), 0.7), ...s.cells.map(c => c().stroke(brand.ivory, 0.6)));
};

type ResumenProps = {title: string; points: {text: string; cue?: string}[]; verdict: string; verdictCue?: string; lever?: number | 'all'};

/**
 * "Qué significa": two or three short points, then the verdict, then this lever joins the strip.
 * lever: the index this summary lights (earlier ones show as done); 'all' = every lever done;
 * omitted = none tested yet.
 */
export const resumen: Visual = function* (view, ctx) {
  const p = ctx.beat.props as ResumenProps;
  const k = typeof p.lever === 'number' ? p.lever : -1;
  const states: LeverState[] = LEVERS.map((_, i) => (p.lever === 'all' || i < k ? 'done' : 'off'));
  const s = strip(), pts = p.points.map(() => createRef<Txt>()), verdict = createRef<Txt>(), rule = createRef<Rect>();
  view.add(<Frame>
    <Kicker text={`Qué significa · ${p.title}`}/>
    {p.points.map((pt, i) => <Serif ref={pts[i]} offset={TL} x={72} y={140 + i * 64} width={1136} textWrap text={pt.text} fontSize={36} fill={brand.text} opacity={0}/>)}
    <Rect ref={rule} offset={TL} x={72} y={150 + p.points.length * 64} width={0} height={2} fill={brand.ivory}/>
    <Cond ref={verdict} offset={TL} x={72} y={172 + p.points.length * 64} width={1136} textWrap text={p.verdict} fontSize={46} fontWeight={800} lineHeight="105%" fill={brand.ivory} opacity={0}/>
    <LeverStrip y={560} states={states} {...s}/>
  </Frame>);
  yield* cued(ctx, p.points.map((pt, i) => [pts[i](), pt.cue]), 0.5);
  yield* until(ctx, p.verdictCue);
  yield* all(rule().width(220, 0.5, easeOutCubic), show(verdict(), 0.6));
  if (k >= 0) {
    const c = s.cells[k]();
    yield* all(c.opacity(1, 0.5), c.stroke(brand.ivory, 0.5), c.fill(rgba(brand.panel, 0.95), 0.5),
      (c.children()[0] as Txt).fill(brand.ivory, 0.5), s.notes[k]().opacity(1, 0.6));
  }
};

type PalancasProps = {cues?: (string | undefined)[]; line: string; lineCue?: string; datosCue?: string;
  questions?: (string | undefined)[]; last?: string; lastCue?: string};

/** The close: six cards with their verdicts, the thesis, then the four questions and one more. */
export const palancas: Visual = function* (view, ctx) {
  const p = ctx.beat.props as PalancasProps;
  const cards = LEVERS.map(() => createRef<Node>()), line = createRef<Txt>(), grid = createRef<Node>();
  const chips = [0, 1, 2, 3].map(() => createRef<Node>()), last = createRef<Txt>();
  const cw = (1136 - 2 * 16) / 3;
  view.add(<Frame>
    <Kicker text="Las seis palancas"/>
    <Node ref={grid}>
      {LEVERS.map((l, i) => <Node ref={cards[i]} opacity={0}>
        <Rect offset={TL} x={72 + (i % 3) * (cw + 16)} y={130 + Math.floor(i / 3) * 132} width={cw} height={116} radius={10}
          stroke={brand.ivory} lineWidth={1.5} fill={rgba(brand.panel, 0.9)}/>
        <Cond offset={TL} x={96 + (i % 3) * (cw + 16)} y={150 + Math.floor(i / 3) * 132} text={l.title} fontSize={38} fontWeight={800} fill={brand.ivory}/>
        <Txt offset={TL} x={98 + (i % 3) * (cw + 16)} y={202 + Math.floor(i / 3) * 132} text={l.short} fontFamily={brand.sans} fontSize={20} fill={brand.soft}/>
      </Node>)}
    </Node>
    <Serif ref={line} offset={TL} x={72} y={430} width={1136} textWrap text={p.line} fontSize={48} fill={brand.ivory} opacity={0}/>
    {[0, 1, 2, 3].map(i => <Node ref={chips[i]} opacity={0}>
      <R1Chip q={i} state="p" focus x={72 + 140 + i * 288} y={560} width={276} height={52} fontSize={26}/>
    </Node>)}
    {p.last && <Serif ref={last} offset={TL} x={72} y={612} text={p.last} fontSize={30} fill={brand.text} opacity={0}/>}
  </Frame>);
  yield* cued(ctx, cards.map((c, i) => [c(), p.cues?.[i]]), 0.45);
  yield* until(ctx, p.lineCue);
  yield* show(line(), 0.7);
  yield* until(ctx, p.datosCue);
  yield* grid().opacity(0.25, 0.6);
  yield* cued(ctx, chips.map((c, i) => [c(), p.questions?.[i]]), 0.4);
  if (p.last) { yield* until(ctx, p.lastCue); yield* show(last(), 0.6); }
};
