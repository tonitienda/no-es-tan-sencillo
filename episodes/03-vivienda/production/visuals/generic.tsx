// The E-beats: no keyframe of their own, so they follow the Sistema board.
// Serif only for sentences, condensed Archivo for figures, Inter for labels,
// Plex Mono for sources; the HUD (R1 top right, R3 bottom left) frames them.
import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {Cond, Frame, Pill, R2Card, Serif, type Mark} from '../../../../production/src/kit';
import type {Visual, VisualContext} from '../../../../production/src/timeline';
import {brand, Label, Para, rgba, show, TL, until} from './ui';

const C = (name?: string) => (name && name in brand.data ? brand.data[name as keyof typeof brand.data] : name ?? brand.ivory);
const Kicker = (props: {text: string; x?: number; y?: number}) =>
  <Txt offset={TL} x={props.x ?? 72} y={props.y ?? 96} text={props.text.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={14} letterSpacing={2} fill={brand.muted}/>;

/** Reveal each [node, cue] pair when its cue is spoken, in order. */
function* cued(ctx: VisualContext, items: [Node, string | undefined][], seconds = 0.5): ThreadGenerator {
  for (const [node, cue] of items) { yield* until(ctx, cue); yield* show(node, seconds); }
}
/** Statement at the bottom: the beat's conclusion, as a sentence. */
const statementNode = (text: string | undefined, ref: ReturnType<typeof createRef<Txt>>) =>
  text ? <Serif ref={ref} text={text} offset={TL} x={72} y={540} fontSize={42} width={1100} textWrap opacity={0}/> : null;

// ── frase: the sentence under test, and what it gets right ────────────────────
type FraseProps = {kicker?: string; quote?: string; who?: string; right?: string; note?: string; noteCue?: string; mark?: Mark;
  figures?: {value: string; label: string; cue?: string}[]; list?: string[]; quote2?: string; who2?: string; quote2Cue?: string};

export const frase: Visual = function* (view, ctx) {
  const p = ctx.beat.props as FraseProps;
  const card = createRef<Rect>(), card2 = createRef<Rect>(), right = createRef<Node>(), note = createRef<Txt>();
  const figs = (p.figures ?? []).map(() => createRef<Node>()), items = (p.list ?? []).map(() => createRef<Rect>());
  view.add(<Frame>
    <Kicker text={p.kicker ?? ''}/>
    {p.quote && <R2Card ref={card} quote={`«${p.quote}»`} who={p.who ?? ''} x={72} y={130} width={p.quote2 ? 520 : 640} fontSize={40} opacity={0}/>}
    {p.quote2 && <R2Card ref={card2} quote={`«${p.quote2}»`} who={p.who2 ?? ''} x={660} y={130} width={520} fontSize={40} opacity={0}/>}
    {p.list && <Rect layout direction="column" gap={18} x={72} y={140} offset={TL}>
      {p.list.map((t, i) => <Rect ref={items[i]} layout padding={[18, 24]} radius={12} fill={brand.panel} width={760} opacity={0}>
        <Serif text={`«${t}»`} fontSize={40}/>
      </Rect>)}
    </Rect>}
    {p.right && <Node ref={right} opacity={0}>
      <Txt offset={TL} x={780} y={140} text="LO QUE ACIERTA" fontFamily={brand.mono} fontWeight={500} fontSize={14} letterSpacing={2} fill={brand.data.terminadas}/>
      <Rect x={780} y={168} offset={TL} width={2} height={p.figures ? 300 : 120} fill={brand.data.terminadas}/>
      <Txt offset={TL} x={800} y={166} text={p.right} fontFamily={brand.sans} fontWeight={500} fontSize={26} lineHeight="130%" fill={brand.text} width={420} textWrap/>
      {(p.figures ?? []).map((f, i) => <Node ref={figs[i]} opacity={0}>
        <Cond offset={TL} x={800 + i * 210} y={290} text={f.value} fontSize={72} fill={brand.ivory}/>
        <Label x={800 + i * 210} y={366} text={f.label} fontSize={18} width={190} textWrap/>
      </Node>)}
    </Node>}
    {p.note && <Para ref={note} x={72} y={560} width={1060} text={p.note} fill={brand.muted} opacity={0}/>}
  </Frame>);
  if (p.quote) yield* show(card());
  // No cues for the list: spread the three sentences over the beat.
  if (p.list) for (let i = 0; i < items.length; i++) {
    const wait = (ctx.beat.duration / (items.length + 0.5)) * i - ctx.elapsed();
    if (wait > 0) yield* waitFor(wait);
    yield* items[i]().opacity(1, 0.5);
  }
  if (p.quote2) { yield* until(ctx, p.quote2Cue); yield* show(card2()); }
  if (p.right) {
    yield* until(ctx, 'acierta');
    yield* show(right());
    yield* cued(ctx, (p.figures ?? []).map((f, i) => [figs[i](), f.cue]));
  }
  if (p.note) { yield* until(ctx, p.noteCue); yield* show(note()); }
};

// ── dato: one figure (or a pair, trio, quote) and its caveat ──────────────────
type Fig = {value: string; label: string; cue?: string; mark?: Mark};
type DatoProps = {figure?: string; figureColor?: string; label?: string; figureCue?: string; note?: string; statement?: string; statementCue?: string;
  pairs?: {cue?: string; kicker: string; value: string; label: string; note?: string}[];
  trio?: {title: string; body: string; who?: string; cue?: string}[];
  quoteLines?: {text: string; cue?: string}[]; card?: {quote: string; who: string}; figures?: Fig[]};

export const dato: Visual = function* (view, ctx) {
  const p = ctx.beat.props as DatoProps;
  const fig = createRef<Node>(), note = createRef<Txt>(), stmt = createRef<Txt>(), card = createRef<Rect>();
  const pairs = (p.pairs ?? []).map(() => createRef<Node>()), trio = (p.trio ?? []).map(() => createRef<Node>());
  const lines = (p.quoteLines ?? []).map(() => createRef<Txt>()), figs = (p.figures ?? []).map(() => createRef<Node>());
  view.add(<Frame>
    {p.figure && <Node ref={fig} opacity={0}>
      <Cond offset={TL} x={72} y={110} text={p.figure} fontSize={150} fill={C(p.figureColor)} lineHeight="92%"/>
      <Label x={76} y={262} text={p.label ?? ''} fontSize={26} fill={brand.text} width={1000} textWrap/>
    </Node>}
    {p.figure && p.note && <Para ref={note} x={76} y={330} width={900} fontSize={22} text={p.note} opacity={0}/>}
    {(p.pairs ?? []).map((q, i) => <Node ref={pairs[i]} opacity={0}>
      <Kicker x={72 + i * 580} y={110} text={q.kicker}/>
      <Cond offset={TL} x={72 + i * 580} y={142} text={q.value} fontSize={84} fill={brand.ivory}/>
      <Para x={72 + i * 580} y={240} width={500} fontSize={22} fill={brand.text} text={q.label}/>
      {q.note && <Para x={72 + i * 580} y={330} width={500} fontSize={18} fill={brand.muted} text={q.note}/>}
    </Node>)}
    {(p.trio ?? []).map((q, i) => <Node ref={trio[i]} opacity={0}>
      <Rect x={72 + i * 384} y={120} offset={TL} width={360} height={380} radius={12} fill={brand.panel}/>
      <Cond offset={TL} x={96 + i * 384} y={146} text={q.title.toUpperCase()} fontSize={48} fontWeight={800} fill={brand.ivory}/>
      <Para x={96 + i * 384} y={216} width={312} fontSize={22} fill={brand.text} text={q.body}/>
      {q.who && <Txt offset={TL} x={96 + i * 384} y={460} text={q.who} fontFamily={brand.mono} fontSize={13} fill={brand.soft}/>}
    </Node>)}
    {(p.quoteLines ?? []).map((q, i) => <Serif ref={lines[i]} text={q.text} x={640} y={290 + i * 100} fontSize={56} width={1080} textAlign="center" textWrap opacity={0}/>)}
    {p.card && <R2Card ref={card} quote={`«${p.card.quote}»`} who={p.card.who} x={72} y={120} width={520} fontSize={40} opacity={0}/>}
    {(p.figures ?? []).map((f, i) => <Node ref={figs[i]} opacity={0}>
      <Cond offset={TL} x={680} y={112 + i * 160} text={f.value} fontSize={84} fill={brand.ivory}/>
      <Label x={684} y={196 + i * 160} text={f.label} fontSize={20} width={520} textWrap/>
    </Node>)}
    {statementNode(p.statement, stmt)}
  </Frame>);
  if (p.figure) {
    yield* until(ctx, p.figureCue);
    yield* show(fig(), 0.6);
    if (p.note) yield* show(note());
  }
  if (p.card) yield* show(card());
  yield* cued(ctx, (p.pairs ?? []).map((q, i) => [pairs[i](), q.cue]));
  yield* cued(ctx, (p.trio ?? []).map((q, i) => [trio[i](), q.cue]));
  yield* cued(ctx, (p.figures ?? []).map((f, i) => [figs[i](), f.cue]));
  for (let i = 0; i < lines.length; i++) {
    const cue = p.quoteLines![i].cue;
    if (cue !== 'start') yield* until(ctx, cue);
    yield* lines[i]().opacity(1, 0.7);
  }
  if (p.statement) { yield* until(ctx, p.statementCue); yield* show(stmt(), 0.6); }
};

// ── plazo: a time axis with the dates that matter ─────────────────────────────
type PlazoProps = {from: number; to: number; marks: {year: number; label: string; cue?: string; dashed?: boolean}[]; statement?: string; statementCue?: string};

export const plazo: Visual = function* (view, ctx) {
  const p = ctx.beat.props as PlazoProps;
  const X0 = 100, X1 = 1180, Y = 330, X = (y: number) => X0 + ((y - p.from) / (p.to - p.from)) * (X1 - X0);
  const tick = (p.to - p.from) > 30 ? 10 : 2;
  const progress = createRef<Rect>(), marks = p.marks.map(() => createRef<Node>()), stmt = createRef<Txt>();
  const years: number[] = [];
  for (let y = Math.ceil(p.from / tick) * tick; y <= p.to; y += tick) years.push(y);
  const ordered = [...p.marks].map((m, i) => ({...m, i})).sort((a, b) => a.year - b.year);
  view.add(<Frame>
    <Rect x={X0} y={Y} offset={[-1, 0]} width={X1 - X0} height={2} fill={brand.edge}/>
    <Rect ref={progress} x={X0} y={Y} offset={[-1, 0]} width={0} height={4} fill={brand.ivory}/>
    {years.map(y => <Node>
      <Rect x={X(y)} y={Y + 12} width={1.5} height={10} fill={brand.faint}/>
      <Txt x={X(y)} y={Y + 34} text={String(y)} fontFamily={brand.mono} fontSize={14} fill={brand.muted}/>
    </Node>)}
    {p.marks.map((m, i) => {
      const up = ordered.findIndex(o => o.i === i) % 2 === 0, x = X(m.year);
      return <Node ref={marks[i]} opacity={0}>
        <Line points={[[x, Y], [x, up ? Y - 70 : Y + 70]]} stroke={brand.ivory} lineWidth={1.5} lineDash={m.dashed ? [5, 4] : undefined}/>
        <Rect x={x} y={Y} width={16} height={16} radius={8} fill={m.dashed ? brand.night : brand.ivory} stroke={brand.ivory} lineWidth={2}/>
        <Cond x={x} y={up ? Y - 104 : Y + 104} text={String(Math.floor(m.year))} fontSize={40} fontWeight={800} fill={brand.ivory}/>
        <Txt x={x} y={up ? Y - 140 : Y + 140} text={m.label} fontFamily={brand.sans} fontSize={18} fill={brand.soft} width={300} textAlign="center" textWrap/>
      </Node>;
    })}
    {statementNode(p.statement, stmt)}
  </Frame>);
  for (const m of ordered) {
    yield* until(ctx, m.cue);
    yield* all(progress().width(X(m.dashed ? Math.min(m.year, X1) : m.year) - X0, 0.8, easeInOutCubic), marks[m.i]().opacity(1, 0.6));
  }
  if (p.statement) { yield* until(ctx, p.statementCue); yield* show(stmt(), 0.6); }
};

// ── hogar: the household got smaller (E07) ────────────────────────────────────
/** 1970 ≈ 3,8 people per household, today 2,5: drawn as people-lights per tile. */
export const hogar: Visual = function* (view, ctx) {
  const then = createRef<Node>(), now = createRef<Node>(), solos = createRef<Node>(), older = createRef<Rect>();
  const people = (n: number, x: number) => Array.from({length: Math.ceil(n)}, (_, i) =>
    <Rect x={x + 30 + (i % 2) * 52} y={290 + Math.floor(i / 2) * 52} width={30} height={30} radius={15}
      fill={brand.data.hogares} opacity={i + 1 > n ? n % 1 : 1} shadowColor={brand.data.hogares} shadowBlur={14}/>);
  const tile = (x: number) => <Rect x={x} y={250} offset={TL} width={140} height={140} radius={8} stroke={brand.edge} lineWidth={2} fill={brand.panelDeep}/>;
  view.add(<Frame>
    <Kicker text="Personas por hogar"/>
    <Node ref={then} opacity={0}>
      {tile(110)}{people(3.8, 125)}
      <Cond offset={TL} x={110} y={140} text="~4" fontSize={84} fill={brand.ivory}/>
      <Txt offset={TL} x={110} y={410} text="1970" fontFamily={brand.mono} fontSize={16} fill={brand.muted}/>
    </Node>
    <Node ref={now} opacity={0}>
      {tile(330)}{people(2.5, 345)}
      <Cond offset={TL} x={330} y={140} text="2,5" fontSize={84} fill={brand.data.hogares}/>
      <Txt offset={TL} x={330} y={410} text="HOY" fontFamily={brand.mono} fontSize={16} fill={brand.muted}/>
    </Node>
    <Node ref={solos} opacity={0}>
      <Kicker x={620} y={140} text="Viven solas · 2021"/>
      <Cond offset={TL} x={620} y={170} text="5 M" fontSize={110} fill={brand.ivory}/>
      <Rect x={620} y={310} offset={TL} width={560} height={40} radius={4} stroke={brand.ivory} lineWidth={1.5}/>
      <Rect ref={older} x={620} y={310} offset={TL} width={0} height={40} radius={4} fill={brand.data.hogares}/>
      <Label x={620} y={364} width={560} textWrap fontSize={22} fill={brand.text} text="4 de cada 10, con 65 años o más; la mayoría, mujeres."/>
    </Node>
  </Frame>);
  yield* show(then());
  yield* until(ctx, 'hoy');
  yield* show(now());
  yield* until(ctx, 'solos');
  yield* show(solos());
  yield* until(ctx, 'mayores');
  yield* older().width(560 * 0.4, 0.6, easeOutCubic);
};

// ── estudios: two teams, same data, different answers (E31) ──────────────────
export const estudios: Visual = function* (view, ctx) {
  const head = createRef<Node>(), uno = createRef<Node>(), otro = createRef<Node>(), now = createRef<Node>(), sin = createRef<Txt>();
  const col = (x: number, title: string, who: string, value: string, label: string, ref: ReturnType<typeof createRef<Node>>) =>
    <Node ref={ref} opacity={0}>
      <Rect x={x} y={200} offset={TL} width={540} height={210} radius={12} fill={brand.panel}/>
      <Kicker x={x + 24} y={222} text={title}/>
      <Cond offset={TL} x={x + 24} y={252} text={value} fontSize={72} fill={brand.ivory}/>
      <Para x={x + 24} y={330} width={490} fontSize={20} fill={brand.text} text={label}/>
      <Txt offset={TL} x={x + 24} y={420} text={who} fontFamily={brand.mono} fontSize={13} fill={brand.muted}/>
    </Node>;
  view.add(<Frame>
    <Node ref={head} opacity={0}>
      <Kicker text="Tope catalán de 2020 · dos estudios, registros de fianzas"/>
      <Txt offset={TL} x={72} y={124} text="Precios: cerca de un 5% menores en los dos." fontFamily={brand.sans} fontWeight={500} fontSize={28} fill={brand.text}/>
    </Node>
    {col(72, 'Contratos nuevos · uno', 'Monràs y Montalvo · apoyo de la Generalitat', '−10%', 'casi un −20% según el cálculo', uno)}
    {col(640, 'Contratos nuevos · el otro', 'Jofre-Monseny, Martínez-Mazza y Segú · Ministerio de Ciencia', 'sin caída', 'otra comparación y más meses de datos', otro)}
    <Node ref={now} opacity={0}>
      <Kicker x={72} y={470} text="Tope actual · no comparables"/>
      <Txt offset={TL} x={72} y={498} fontFamily={brand.sans} fontSize={24} fill={brand.text} text="Regulados +0,7%  ·  resto +13,8%"/>
    </Node>
    <Serif ref={sin} offset={TL} x={72} y={550} fontSize={38} text="No hemos encontrado una evaluación causal de este tope." opacity={0}/>
  </Frame>);
  yield* until(ctx, 'precios');
  yield* show(head());
  yield* until(ctx, 'uno');
  yield* show(uno());
  yield* until(ctx, 'otro');
  yield* show(otro());
  if ('actual' in ctx.beat.cues) { yield* until(ctx, 'actual'); yield* all(uno().opacity(0.35, 0.5), otro().opacity(0.35, 0.5), show(now())); }
  else { yield* until(ctx, 'sin'); yield* all(uno().opacity(0.35, 0.5), otro().opacity(0.35, 0.5)); }
  yield* until(ctx, 'sin');
  yield* show(sin(), 0.6);
};

// ── rango: the deficit is a subtraction, so it is a range (E42) ───────────────
export const rango: Visual = function* (view, ctx) {
  const X0 = 100, X1 = 1180, MAX = 1_000_000, X = (v: number) => X0 + (v / MAX) * (X1 - X0);
  const band = createRef<Rect>(), lo = createRef<Node>(), hi = createRef<Node>(), sum = createRef<Node>(), arellano = createRef<Node>();
  view.add(<Frame>
    <Node ref={sum} opacity={0}>
      <Kicker text="Déficit = hogares nuevos − viviendas terminadas"/>
      <Txt offset={TL} x={72} y={124} fontFamily={brand.sans} fontWeight={500} fontSize={28} fill={brand.text}
        text="Desde 2021 nadie las cuenta: es una resta, no un recuento."/>
      <Pill mark="nuestra" x={72} y={172} offset={TL}/>
    </Node>
    <Rect x={X0} y={380} offset={[-1, 0]} width={X1 - X0} height={2} fill={brand.edge}/>
    {[0, 250_000, 500_000, 750_000, 1_000_000].map(v => <Txt x={X(v)} y={420} text={v.toLocaleString('es-ES')} fontFamily={brand.mono} fontSize={14} fill={brand.muted}/>)}
    <Rect ref={band} x={X(570_000)} y={380} offset={[-1, 0]} width={0} height={64} radius={6} fill={rgba(brand.ivory, 0.12)} stroke={brand.ivory} lineWidth={1.5} lineDash={[6, 4]}/>
    <Node ref={lo} opacity={0}><Cond x={X(570_000)} y={300} text="570.000" fontSize={56} fill={brand.ivory}/></Node>
    <Node ref={hi} opacity={0}><Cond x={X(840_000)} y={300} text="840.000" fontSize={56} fill={brand.ivory}/></Node>
    <Node ref={arellano} opacity={0}>
      <Rect x={X(0)} y={480} offset={[-1, 0]} width={X(150_000) - X0} height={14} radius={7} fill={rgba(brand.soft, 0.25)}/>
      <Para x={72} y={510} width={1000} fontSize={20} text="Otros, como Arellano y Roca, niegan que haya un déficit grave. El próximo censo debería aclararlo."/>
    </Node>
  </Frame>);
  yield* until(ctx, 'resta');
  yield* show(sum());
  yield* until(ctx, 'bajo');
  yield* show(lo());
  yield* until(ctx, 'alto');
  yield* all(show(hi()), band().width(X(840_000) - X(570_000), 0.9, easeInOutCubic));
  yield* until(ctx, 'arellano');
  yield* show(arellano());
};
