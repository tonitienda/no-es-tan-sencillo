// New visuals for script v5 (07-guion-v5.md): the cold open on the two official
// figures, the place clue, the open question that stays on screen, the campaign
// phrases, and the table that gains one row per phrase. They build from the series
// kit and the v1 helpers, so they read as the same video.
//
// Two decorators live here too: `withSlot` adds the open-question chip to any
// visual from `props.slot`, and `stopBefore` cuts a shared visual at a cue.
import {Circle, Node, Rect, Txt, type RectProps} from '@motion-canvas/2d';
import {all, cancel, createRef, easeInOutCubic, easeOutCubic, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {Cond, Frame, Pill, R1Chip, Serif} from '../../../../production/src/kit';
import type {Visual, VisualContext} from '../../../../production/src/timeline';
import {brand, Grid, Label, Para, rgba, show, TL, until} from '../../../03-vivienda/production/visuals/ui';

const H = brand.data.hogares, V = brand.data.vacias;
const Kicker = ({text, x = 72, y = 96}: {text: string; x?: number; y?: number}) =>
  <Txt offset={TL} x={x} y={y} text={text.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={14} letterSpacing={2} fill={brand.muted}/>;
const Small = (p: {x: number; y: number; text: string; fill?: string}) =>
  <Txt offset={TL} x={p.x} y={p.y} text={p.text} fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={p.fill ?? brand.muted}/>;

// ── gancho: the two official figures, from the first frame ────────────────────
/**
 * Cues: viviendas, hogares, ratio, faltan (the counts dim), deficit (the figure),
 * oficiales (both come back: both are official), pregunta. Every tile is 100.000.
 */
export const gancho: Visual = function* (view, ctx) {
  const viv = createRef<Grid>(), hog = createRef<Grid>(), vivL = createRef<Node>(), hogL = createRef<Node>();
  const counts = createRef<Node>(), ratio = createRef<Node>(), gap = createRef<Node>(), ask = createRef<Txt>();
  view.add(<Frame>
    <Node ref={counts}>
      <Grid ref={viv} x={72} y={452} count={266} cols={19} step={17} tile={13} radius={2} fromBottom fill={brand.tile} stroke={brand.edge}/>
      <Grid ref={hog} x={440} y={452} count={185} cols={19} step={17} tile={13} radius={2} fromBottom fill={rgba(H, 0.8)}/>
      <Node ref={vivL} opacity={0}>
        <Cond offset={TL} x={72} y={466} text="26,6 millones" fontSize={48} fill={brand.ivory}/>
        <Label x={74} y={520} text="viviendas" fontSize={20} fill={brand.text}/>
      </Node>
      <Node ref={hogL} opacity={0}>
        <Cond offset={TL} x={440} y={466} text="18,5 millones" fontSize={48} fill={H}/>
        <Label x={442} y={520} text="hogares" fontSize={20} fill={brand.text}/>
      </Node>
      <Small x={72} y={196} text="CADA BALDOSA: 100.000"/>
    </Node>
    <Node ref={ratio} opacity={0}>
      <Small x={836} y={112} text="SOBRE EL PAPEL"/>
      <Cond offset={TL} x={832} y={132} text="1,4" fontSize={120} fill={brand.ivory}/>
      <Label x={836} y={258} text="viviendas por cada hogar" fontSize={20} fill={brand.text}/>
    </Node>
    <Node ref={gap} opacity={0}>
      <Small x={836} y={322} text="Y, SIN EMBARGO, FALTAN"/>
      <Cond offset={TL} x={832} y={342} text="−750.000" fontSize={92} fill={brand.ivory} shadowColor="rgba(242,237,228,0.25)" shadowBlur={28}/>
      <Label x={836} y={444} text="viviendas, según el Banco de España" fontSize={20} fill={brand.text}/>
      <Label x={836} y={474} text="hogares nuevos − viviendas terminadas · 2021-2025" fontSize={15}/>
    </Node>
    <Serif ref={ask} offset={TL} x={72} y={572} text="¿Cómo pueden ser ciertas las dos?" fontSize={50} fill={brand.ivory} opacity={0}/>
  </Frame>);
  // No header and no fade: tiles are already rising on the first frame.
  viv().shown(0.12); hog().shown(0);
  yield viv().shown(1, 1.6, easeOutCubic);
  yield* until(ctx, 'viviendas'); yield* show(vivL(), 0.4);
  yield* until(ctx, 'hogares'); yield* all(hog().shown(1, 1.1, easeOutCubic), show(hogL(), 0.4));
  yield* until(ctx, 'ratio'); yield* show(ratio());
  yield* until(ctx, 'faltan'); yield* all(counts().opacity(0.35, 0.6), ratio().opacity(0.4, 0.6));
  yield* until(ctx, 'deficit'); yield* show(gap(), 0.6);
  yield* until(ctx, 'oficiales'); yield* all(counts().opacity(1, 0.5), ratio().opacity(1, 0.5));
  yield* until(ctx, 'pregunta'); yield* show(ask(), 0.6);
};

// ── lugares: Zamora and Madrid, the place clue (and its callback at the end) ──
/** props: kicker, statement, statementCue. Cues: zamora, madrid. */
export const lugares: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {kicker?: string; statement?: string; statementCue?: string};
  const places = [['Provincia de Zamora', '50,5%', 50, 110], ['Provincia de Madrid', '9,9%', 10, 668]] as const;
  const refs = places.map(() => createRef<Node>()), stmt = createRef<Txt>();
  view.add(<Frame>
    <Kicker text={p.kicker ?? 'Primera pista: el lugar'} x={110}/>
    {places.map(([name, label, n, x], k) => <Node ref={refs[k]} opacity={0}>
      <Grid x={x} y={136} count={100} cols={10} step={32} tile={26} radius={3} paint={i => (i < n ? brand.night : null)} fill={rgba(H, 0.45)}/>
      <Grid x={x} y={136} count={n} cols={10} step={32} tile={26} radius={3} fill={brand.night} stroke={V}/>
      <Cond offset={TL} x={x + 338} y={132} text={label} fontSize={72} fill={brand.ivory}/>
      <Label x={x + 342} y={212} text={name} fontSize={20} fill={brand.text}/>
      {/* The report's term is «sin uso residencial»; on screen it is spelled out. */}
      <Label x={x + 342} y={246} text="de las viviendas: nadie vive en ellas de forma habitual" fontSize={16} lineHeight="132%" fill={brand.text} width={186} textWrap/>
      <Label x={x + 342} y={340} text="Segundas residencias, vacías u otros usos" fontSize={14} lineHeight="132%" width={186} textWrap/>
    </Node>)}
    {p.statement && <Serif ref={stmt} offset={TL} x={110} y={492} width={1060} textWrap text={p.statement} fontSize={40} lineHeight="118%" fill={brand.ivory} opacity={0}/>}
  </Frame>);
  yield* until(ctx, 'zamora'); yield* show(refs[0]());
  yield* until(ctx, 'madrid'); yield* show(refs[1]());
  if (p.statement) { yield* until(ctx, p.statementCue); yield* show(stmt(), 0.6); }
};

// ── pregunta: the question the video keeps open ───────────────────────────────
/** Cues: falta, donde, guarda (the question shrinks into the HUD slot; pair with slot.enterCue). */
export const pregunta: Visual = function* (view, ctx) {
  const pre = createRef<Node>(), q = createRef<Txt>(), keep = createRef<Txt>();
  view.add(<Frame>
    <Node ref={pre} opacity={0}>
      <Cond x={640} y={196} text="−750.000" fontSize={84} fill={brand.ivory}/>
      <Label offset={[0, 0]} x={640} y={258} text="viviendas que faltan" fontSize={20} fill={brand.text}/>
    </Node>
    <Serif ref={q} x={640} y={390} text="¿Dónde viven esos hogares?" fontSize={92} fill={brand.ivory} opacity={0}/>
    <Txt ref={keep} x={640} y={390} text="LA PREGUNTA QUEDA ABIERTA HASTA EL FINAL" fontFamily={brand.mono} fontSize={15} letterSpacing={2} fill={brand.soft} opacity={0}/>
  </Frame>);
  yield* until(ctx, 'falta'); yield* show(pre());
  yield* until(ctx, 'donde'); yield* show(q(), 0.6);
  yield* until(ctx, 'guarda');
  yield* all(q().position([200, 43], 0.7, easeInOutCubic), q().scale(0.16, 0.7, easeInOutCubic), q().opacity(0, 0.7), pre().opacity(0.35, 0.6));
  yield* keep().opacity(1, 0.5);
};

// ── campana: the one-lever phrases of the campaign ────────────────────────────
type CampanaProps = {kicker: string; frases: {text: string; cue?: string}[]; mark?: string; close?: string; closeCue?: string};

export const campana: Visual = function* (view, ctx) {
  const p = ctx.beat.props as CampanaProps;
  const cards = p.frases.map(() => createRef<Rect>()), close = createRef<Txt>(), mark = createRef<Rect>(), name = createRef<Txt>();
  view.add(<Frame>
    <Kicker text={p.kicker}/>
    {/* The brand enters here, small and over the narration: no separate title card. */}
    <Txt ref={name} offset={[1, 0]} x={1240} y={43} text={brand.name} fontFamily={brand.mono} fontWeight={500} fontSize={13} letterSpacing={3} fill={brand.soft} opacity={0}/>
    {p.frases.map((f, i) => <Rect ref={cards[i]} layout offset={TL} x={72 + i * 64} y={148 + i * 108} padding={[14, 24]} radius={12} fill={brand.panel} opacity={0}>
      <Serif text={`«${f.text}»`} fontSize={46} fill={brand.ivory}/>
    </Rect>)}
    {p.mark && <Pill ref={mark} mark={{kind: 'nuestra', text: p.mark}} x={72} y={500} offset={TL} opacity={0}/>}
    {p.close && <Serif ref={close} offset={TL} x={820} y={250} width={400} textWrap text={p.close} fontSize={42} lineHeight="116%" fill={brand.text} opacity={0}/>}
  </Frame>);
  yield name().opacity(1, 0.8);
  for (let i = 0; i < cards.length; i++) {
    yield* until(ctx, p.frases[i].cue);
    yield* show(cards[i](), 0.4);
    if (i === 0 && p.mark) yield mark().opacity(1, 0.5);
  }
  if (p.close) { yield* until(ctx, p.closeCue); yield* show(close(), 0.6); }
};

// ── linea: one or two sentences, nothing else ─────────────────────────────────
/** props: kicker, lines [{text, cue, soft}], size. For the thesis and the short bridges. */
export const linea: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {kicker?: string; lines: {text: string; cue?: string; soft?: boolean}[]; size?: number};
  const refs = p.lines.map(() => createRef<Txt>()), size = p.size ?? 64;
  view.add(<Frame>
    {p.kicker && <Kicker text={p.kicker} y={180}/>}
    <Rect layout direction="column" gap={size * 0.45} offset={TL} x={72} y={226} width={1136}>
      {p.lines.map((l, i) => <Serif ref={refs[i]} text={l.text} fontSize={size} lineHeight="112%" textWrap fill={l.soft ? brand.soft : brand.ivory} opacity={0}/>)}
    </Rect>
  </Frame>);
  // Opacity only: these are layout children, so their position is not ours to move.
  for (let i = 0; i < refs.length; i++) { yield* until(ctx, p.lines[i].cue); yield* refs[i]().opacity(1, 0.6); }
};

// ── tabla: one row per phrase, filled as the video goes ───────────────────────
// Each cell is the row summary the narration says out loud, shortened.
export const ROWS: [string, string, string][] = [
  ['Viviendas vacías', 'Existen, pero la mayoría está donde no falta vivienda.', 'Cubre una parte del déficit, en algunas ciudades.'],
  ['Pisos turísticos', 'Limitarlos puede aliviar algunos barrios.', 'Resuelve un problema local.'],
  ['Construir', 'Necesario, pero lento; el suelo no está donde falta.', 'Llega tarde y no siempre al sitio correcto.'],
  ['Topes al alquiler', 'Protegen a quien ya alquila; para quien busca, efecto dudoso.', 'Reparte el problema, pero no lo reduce.'],
  ['Compra extranjera', 'Limitarla cambiaría algo en la costa.', 'Toca una parte pequeña del mercado.'],
  ['Vivienda pública', 'Apunta a quien más lo necesita.', 'Tarda una generación.'],
];
type TablaProps = {
  kicker?: string;
  /** The four questions first, then the empty table (cues q0..q3, tabla). */
  intro?: {line: string};
  /** Rows already filled when the beat starts. */
  filled?: number;
  /** The row this beat fills, on cues "hace" and "sola". */
  row?: number;
  /** A row to point at without filling it. */
  focus?: {row: number; cue?: string};
  groups?: {from: number; to: number; text: string; cue?: string}[];
  /** Cue that lights the "lo que hace" header (final table). */
  headCue?: string;
  thesis?: string; thesisCue?: string;
  note?: string; noteCue?: string;
};
const T = {x: 96, w: 1120, y: 150, pitch: 78, h: 70, c1: 346, w1: 420, c2: 786, w2: 414};

export const tabla: Visual = function* (view, ctx) {
  const p = ctx.beat.props as TablaProps;
  const filled = p.filled ?? 0;
  const rows = ROWS.map(() => ({bg: createRef<Rect>(), name: createRef<Txt>(), a: createRef<Txt>(), b: createRef<Txt>(), pa: createRef<Rect>(), pb: createRef<Rect>()}));
  const table = createRef<Node>(), stage = createRef<Node>(), chips = [0, 1, 2, 3].map(() => createRef<Node>());
  const kicker = createRef<Node>(), thesis = createRef<Txt>(), note = createRef<Node>(), h1 = createRef<Txt>(), h2 = createRef<Txt>();
  const groups = (p.groups ?? []).map(() => createRef<Node>());
  const rowY = (i: number) => T.y + i * T.pitch;
  const Head = (q: {x: number; text: string; r?: ReturnType<typeof createRef<Txt>>}) =>
    <Txt ref={q.r} offset={TL} x={q.x} y={128} text={q.text} fontFamily={brand.mono} fontWeight={500} fontSize={12} letterSpacing={1.5} fill={brand.muted}/>;
  view.add(<Frame>
    {p.intro && <Node ref={stage}>
      <Serif x={640} y={236} text={p.intro.line} fontSize={60} fill={brand.ivory}/>
      {chips.map((c, i) => <Node ref={c} opacity={0}>
        <R1Chip q={i} state="p" focus x={640 + (i - 1.5) * 244} y={392} width={224} height={72} fontSize={30}/>
      </Node>)}
    </Node>}
    <Node ref={table} opacity={p.intro ? 0 : 1}>
      <Node ref={kicker}>{p.kicker && <Kicker text={p.kicker} x={T.x} y={92}/>}</Node>
      {p.thesis && <Serif ref={thesis} offset={TL} x={T.x} y={72} text={p.thesis} fontSize={38} fill={brand.ivory} opacity={0}/>}
      <Head x={T.x + 16} text="PALANCA"/>
      <Head x={T.c1} text="LO QUE HACE" r={h1}/>
      <Head x={T.c2} text="POR SÍ SOLA" r={h2}/>
      {ROWS.map(([name, a, b], i) => {
        const done = i < filled, y = rowY(i), mid = y + T.h / 2;
        return <Node>
          <Rect ref={rows[i].bg} offset={TL} x={T.x} y={y} width={T.w} height={T.h} radius={8} lineWidth={1.5}
            fill={rgba(brand.panel, done ? 1 : 0.55)} stroke={brand.rule}/>
          <Txt offset={[-1, 0]} x={T.x + 16} y={mid} text={`${i + 1}`} fontFamily={brand.mono} fontSize={14} fill={brand.muted}/>
          <Cond ref={rows[i].name} offset={[-1, 0]} x={T.x + 44} y={mid} text={name} fontSize={26} fontWeight={800} fill={done ? brand.ivory : brand.muted}/>
          <Rect ref={rows[i].pa} offset={[-1, 0]} x={T.c1} y={mid} width={T.w1 - 24} height={38} radius={6} stroke={brand.edge} lineWidth={1.2} lineDash={[4, 4]} opacity={done ? 0 : 1}/>
          <Rect ref={rows[i].pb} offset={[-1, 0]} x={T.c2} y={mid} width={T.w2 - 24} height={38} radius={6} stroke={brand.edge} lineWidth={1.2} lineDash={[4, 4]} opacity={done ? 0 : 1}/>
          <Txt ref={rows[i].a} offset={[-1, 0]} x={T.c1} y={mid} width={T.w1 - 24} textWrap text={a} fontFamily={brand.sans} fontSize={17} lineHeight="128%" fill={brand.text} opacity={done ? 1 : 0}/>
          <Txt ref={rows[i].b} offset={[-1, 0]} x={T.c2} y={mid} width={T.w2 - 24} textWrap text={b} fontFamily={brand.sans} fontSize={17} fontWeight={600} lineHeight="128%" fill={brand.ivory} opacity={done ? 1 : 0}/>
        </Node>;
      })}
      {(p.groups ?? []).map((g, i) => {
        const top = rowY(g.from), bottom = rowY(g.to) + T.h;
        return <Node ref={groups[i]} opacity={0}>
          <Rect offset={TL} x={84} y={top} width={2} height={bottom - top} fill={brand.ivory}/>
          <Txt x={66} y={(top + bottom) / 2} rotation={-90} text={g.text.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={12} letterSpacing={1.5} fill={brand.ivory}/>
        </Node>;
      })}
      {p.note && <Node ref={note} opacity={0}><Small x={T.x} y={626} text={p.note.toUpperCase()} fill={brand.soft}/></Node>}
    </Node>
  </Frame>);

  const light = (i: number) => all(rows[i].bg().stroke(brand.ivory, 0.5), rows[i].name().fill(brand.ivory, 0.5));
  if (p.intro) {
    for (let i = 0; i < 4; i++) { yield* until(ctx, `q${i}`); yield* show(chips[i](), 0.35); }
    yield* until(ctx, 'tabla');
    yield* stage().opacity(0, 0.4);
    yield* show(table(), 0.6);
  }
  if (p.focus) { yield* until(ctx, p.focus.cue); yield* light(p.focus.row); }
  for (let i = 0; i < groups.length; i++) { yield* until(ctx, p.groups![i].cue); yield* show(groups[i](), 0.5, 0); }
  if (p.row !== undefined) {
    const r = rows[p.row];
    yield* light(p.row);
    yield* until(ctx, 'hace'); yield* all(r.pa().opacity(0, 0.3), r.a().opacity(1, 0.5), r.bg().fill(brand.panel, 0.5));
    yield* until(ctx, 'sola'); yield* all(r.pb().opacity(0, 0.3), r.b().opacity(1, 0.5));
  }
  if (p.headCue) { yield* until(ctx, p.headCue); yield* h1().fill(brand.ivory, 0.4); }
  if (p.thesis) { yield* until(ctx, p.thesisCue); yield* all(kicker().opacity(0, 0.3), show(thesis(), 0.6), h2().fill(brand.ivory, 0.4)); }
  if (p.note) { yield* until(ctx, p.noteCue); yield* note().opacity(1, 0.5); }
};

// ── withSlot: the open question, docked top left ──────────────────────────────
/**
 * props.slot: "open" | "answered" | {state, enterCue, pulseCue, answerCue}.
 * Beats without `slot` are left untouched (the hook, before the question is asked;
 * the end screen). It sits on the HUD row, opposite the four questions.
 */
type Slot = 'open' | 'answered' | {state?: 'open' | 'answered'; enterCue?: string; pulseCue?: string; answerCue?: string};

function SlotChip({answered, ...props}: {answered: boolean} & RectProps) {
  const ink = answered ? brand.night : brand.ivory;
  return <Rect layout alignItems="center" gap={8} height={30} padding={[0, 12]} radius={6} lineWidth={1.5} offset={[-1, 0]} x={56} y={43}
    stroke={answered ? undefined : brand.ivory} lineDash={answered ? undefined : [5, 4]} fill={answered ? brand.ivory : rgba(brand.night, 0.9)} {...props}>
    <Circle size={8} fill={answered ? brand.night : H}/>
    <Cond text="¿DÓNDE VIVEN ESOS HOGARES?" fontSize={13} fontWeight={800} fill={ink}/>
    <Txt text={answered ? 'respondida' : 'abierta'} fontFamily={brand.mono} fontSize={11} fontWeight={500} fill={answered ? brand.night : brand.muted}/>
  </Rect>;
}
function* pulse(node: Node): ThreadGenerator {
  yield* node.scale(1.14, 0.25, easeOutCubic).to(1, 0.4, easeInOutCubic);
}

// ── ritmo: how long the public stock takes, in the order v5 tells it ──────────
/**
 * The pace half of the shared `publica` chart, with the nineties first: v5 says
 * "18 años" before "un siglo". Cues: once (the 2025 pace), noventa (the nineties
 * pace), dieciocho (its bar), siglo (the 2025 bar). Both bars share one scale.
 */
export const ritmo: Visual = function* (view, ctx) {
  const T = brand.data.terminadas, W = 1136, Y1 = 150, Y2 = 320;
  const now = createRef<Node>(), then = createRef<Node>(), slow = createRef<Rect>(), fast = createRef<Rect>();
  const slowL = createRef<Node>(), fastL = createRef<Node>(), scale = createRef<Node>();
  const track = (y: number) => <Rect x={72} y={y + 86} offset={TL} width={W} height={28} radius={3} stroke={brand.edge} lineWidth={1}/>;
  view.add(<Frame>
    <Kicker text="Llegar a la media · 1,1 millones de viviendas · ¿a qué ritmo?"/>
    <Node ref={now} opacity={0}>
      <Label x={74} y={Y1} text="Protegidas terminadas en 2025" fontSize={18} fill={brand.text}/>
      <Cond offset={TL} x={72} y={Y1 + 26} text="11.000 al año" fontSize={44} fill={brand.ivory}/>
      {track(Y1)}
      <Rect ref={slow} x={72} y={Y1 + 86} offset={TL} width={0} height={28} radius={3} fill={rgba(T, 0.6)}/>
      <Node ref={slowL} opacity={0}><Cond offset={[1, -1]} x={72 + W} y={Y1 + 26} text="~100 años · 2126" fontSize={44} fill={T}/></Node>
    </Node>
    <Node ref={then} opacity={0}>
      <Label x={74} y={Y2} text="Media de los años noventa" fontSize={18} fill={brand.text}/>
      <Cond offset={TL} x={72} y={Y2 + 26} text="62.000 al año" fontSize={44} fill={brand.ivory}/>
      {track(Y2)}
      <Rect ref={fast} x={72} y={Y2 + 86} offset={TL} width={0} height={28} radius={3} fill={T}/>
      <Node ref={fastL} opacity={0}><Cond offset={TL} x={72 + W * 0.18 + 14} y={Y2 + 78} text="~18 años" fontSize={44} fill={T}/></Node>
    </Node>
    <Node ref={scale} opacity={0}><Small x={72} y={Y2 + 140} text="SI FUERAN TODAS PÚBLICAS Y NO SE VENDIERAN · ESCALA DE LAS DOS BARRAS: 100 AÑOS"/></Node>
  </Frame>);
  yield* until(ctx, 'once');
  yield* show(now());
  yield* until(ctx, 'noventa');
  yield* all(show(then()), scale().opacity(1, 0.5));
  yield* until(ctx, 'dieciocho');
  yield* all(fast().width(W * 0.18, 0.8, easeOutCubic), fastL().opacity(1, 0.6));
  yield* until(ctx, 'siglo');
  yield* all(slow().width(W, 1.8, easeInOutCubic), slowL().opacity(1, 0.6));
};

// ── anual: homes finished against new households, one year at a time ─────────
type AnualRow = {title: string; viv: number; hog: number; result: string; lines?: {text: string; cue?: string; strong?: boolean}[]};
/**
 * props: rows, note. Every bar shares one scale (250.000 = full width), so a row
 * reads against the others. Cues: viv, hog (the two words, defined first); then
 * per row k: r{k} (title and homes), r{k}h (households), r{k}x (the difference),
 * and each line's own cue; nota (the footer, and every row back to full).
 */
export const anual: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {rows: AnualRow[]; note?: string};
  const T = brand.data.terminadas, X = 268, W = 440, MAX = 250_000, COL = 880, Y0 = 138, PITCH = 152;
  const px = (v: number) => (v / MAX) * W, fmt = (v: number) => v.toLocaleString('es-ES');
  const intro = createRef<Node>(), defs = [createRef<Node>(), createRef<Node>()], note = createRef<Node>();
  const rows = p.rows.map(r => ({all: createRef<Node>(), viv: createRef<Node>(), hog: createRef<Node>(), vbar: createRef<Rect>(), hbar: createRef<Rect>(),
    gap: createRef<Rect>(), res: createRef<Node>(), lines: (r.lines ?? []).map(() => createRef<Txt>())}));
  const Def = (q: {i: number; y: number; color: string; name: string; text: string}) => <Node ref={defs[q.i]} opacity={0}>
    <Rect offset={TL} x={72} y={q.y + 18} width={24} height={24} radius={3} fill={q.color}/>
    <Cond offset={TL} x={112} y={q.y} text={q.name} fontSize={52} fill={brand.ivory}/>
    <Para x={112} y={q.y + 68} width={920} fontSize={22} fill={brand.text} text={q.text}/>
  </Node>;
  view.add(<Frame>
    <Kicker text="La cuenta, año a año · todas las barras, a la misma escala"/>
    <Node ref={intro}>
      <Def i={0} y={160} color={T} name="Viviendas terminadas" text="Las que se acaban de construir cada año."/>
      <Def i={1} y={320} color={H} name="Hogares nuevos"
        text="Cada persona o familia que necesita una vivienda más: jóvenes que se independizan, parejas que se separan, gente que llega de fuera."/>
    </Node>
    {p.rows.map((r, k) => {
      const y = Y0 + k * PITCH, top = (j: number) => y + 40 + j * 34;
      const lack = r.hog > r.viv, lo = Math.min(r.viv, r.hog), hi = Math.max(r.viv, r.hog);
      const Bar = (q: {j: number; name: string; value: number; color: string; node: typeof rows[0]['viv']; bar: typeof rows[0]['vbar']}) => <Node ref={q.node} opacity={0}>
        <Label x={72} y={top(q.j) + 4} text={q.name} fontSize={15} fill={brand.text}/>
        <Rect ref={q.bar} offset={TL} x={X} y={top(q.j)} width={0} height={26} radius={3} fill={q.color}/>
        <Cond offset={[1, -1]} x={X + W + 96} y={top(q.j) - 3} text={fmt(q.value)} fontSize={26} fill={q.color}/>
      </Node>;
      return <Node ref={rows[k].all} opacity={0}>
        <Cond offset={TL} x={72} y={y} text={r.title} fontSize={28} fontWeight={800} fill={brand.ivory}/>
        <Bar j={0} name="Viviendas terminadas" value={r.viv} color={T} node={rows[k].viv} bar={rows[k].vbar}/>
        <Bar j={1} name="Hogares nuevos" value={r.hog} color={H} node={rows[k].hog} bar={rows[k].hbar}/>
        {/* The difference, dashed, on the shorter bar's row. */}
        <Rect ref={rows[k].gap} offset={TL} x={X + px(lo)} y={top(lack ? 0 : 1)} width={px(hi - lo)} height={26} radius={3}
          stroke={brand.ivory} lineWidth={1.5} lineDash={[5, 4]} opacity={0}/>
        <Node ref={rows[k].res} opacity={0}><Cond offset={TL} x={COL} y={y - 4} text={r.result} fontSize={44} fill={brand.ivory}/></Node>
        {(r.lines ?? []).map((l, j) => <Label ref={rows[k].lines[j]} x={COL + 2} y={y + 54 + j * 26} text={l.text} fontSize={17}
          fontWeight={l.strong ? 700 : 400} fill={l.strong ? brand.ivory : brand.text} opacity={0}/>)}
      </Node>;
    })}
    {p.note && <Node ref={note} opacity={0}><Small x={72} y={606} text={p.note.toUpperCase()} fill={brand.soft}/></Node>}
  </Frame>);

  yield* until(ctx, 'viv'); yield* show(defs[0]());
  yield* until(ctx, 'hog'); yield* show(defs[1]());
  for (let k = 0; k < rows.length; k++) {
    const r = p.rows[k], n = rows[k];
    yield* until(ctx, `r${k}`);
    if (k === 0) yield* intro().opacity(0, 0.35);
    yield* all(...rows.slice(0, k).map(q => q.all().opacity(0.4, 0.5)),
      show(n.all(), 0.4), n.viv().opacity(1, 0.4), n.vbar().width(px(r.viv), 0.8, easeOutCubic));
    yield* until(ctx, `r${k}h`);
    yield* all(n.hog().opacity(1, 0.4), n.hbar().width(px(r.hog), 0.8, easeOutCubic));
    yield* until(ctx, `r${k}x`);
    yield* all(n.gap().opacity(1, 0.4), show(n.res(), 0.5));
    for (let j = 0; j < n.lines.length; j++) { yield* until(ctx, r.lines![j].cue); yield* n.lines[j]().opacity(1, 0.4); }
  }
  if (p.note) { yield* until(ctx, 'nota'); yield* all(...rows.map(q => q.all().opacity(1, 0.5)), note().opacity(1, 0.5)); }
};

// ── resta: where the 60% and the deficit come from ───────────────────────────
/**
 * The shared `rango` chart with the warning spelled out: nobody counted house by
 * house; both figures come from one subtraction; the last real count is 2021.
 * Cues: (start) the warning, resta, censo, bajo, alto, arellano.
 */
export const resta: Visual = function* (view, ctx) {
  const X0 = 100, X1 = 1180, MAX = 1_000_000, X = (v: number) => X0 + (v / MAX) * (X1 - X0);
  const band = createRef<Rect>(), lo = createRef<Node>(), hi = createRef<Node>(), sum = createRef<Node>(), censo = createRef<Node>();
  const axis = createRef<Node>(), arellano = createRef<Node>(), warn = createRef<Node>();
  view.add(<Frame>
    <Node ref={warn} opacity={0}>
      <Kicker text="Una advertencia sobre ese 60%"/>
      <Txt offset={TL} x={72} y={122} fontFamily={brand.sans} fontWeight={500} fontSize={28} fill={brand.text}
        text="Nadie ha contado, casa por casa, dónde entraron esos hogares."/>
    </Node>
    <Node ref={sum} opacity={0}>
      <Txt offset={TL} x={72} y={168} fontFamily={brand.sans} fontWeight={600} fontSize={28} fill={brand.ivory}
        text="Sale de una resta: hogares nuevos − viviendas terminadas."/>
    </Node>
    <Node ref={censo} opacity={0}><Small x={72} y={220} text="ÚLTIMO RECUENTO DE VACÍAS Y SEGUNDAS RESIDENCIAS: CENSO DE 2021" fill={brand.soft}/></Node>
    <Node ref={axis} opacity={0}>
      <Small x={X0} y={262} text="EL DÉFICIT, SEGÚN LA SERIE OFICIAL QUE SE USE"/>
      <Rect x={X0} y={400} offset={[-1, 0]} width={X1 - X0} height={2} fill={brand.edge}/>
      {[0, 250_000, 500_000, 750_000, 1_000_000].map(v => <Txt x={X(v)} y={454} text={v.toLocaleString('es-ES')} fontFamily={brand.mono} fontSize={14} fill={brand.muted}/>)}
    </Node>
    <Rect ref={band} x={X(570_000)} y={400} offset={[-1, 0]} width={0} height={64} radius={6} fill={rgba(brand.ivory, 0.12)} stroke={brand.ivory} lineWidth={1.5} lineDash={[6, 4]}/>
    <Node ref={lo} opacity={0}><Cond x={X(570_000)} y={324} text="570.000" fontSize={56} fill={brand.ivory}/></Node>
    <Node ref={hi} opacity={0}><Cond x={X(840_000)} y={324} text="840.000" fontSize={56} fill={brand.ivory}/></Node>
    <Node ref={arellano} opacity={0}>
      <Rect x={X(0)} y={496} offset={[-1, 0]} width={X(150_000) - X0} height={14} radius={7} fill={rgba(brand.soft, 0.25)}/>
      <Para x={72} y={522} width={1000} fontSize={20} text="Otros, como Arellano y Roca, niegan que haya un déficit grave. El próximo censo debería aclararlo."/>
    </Node>
  </Frame>);
  yield* show(warn());
  yield* until(ctx, 'resta'); yield* show(sum());
  yield* until(ctx, 'censo'); yield* censo().opacity(1, 0.5);
  yield* until(ctx, 'bajo'); yield* all(axis().opacity(1, 0.4), show(lo()));
  yield* until(ctx, 'alto'); yield* all(show(hi()), band().width(X(840_000) - X(570_000), 0.9, easeInOutCubic));
  yield* until(ctx, 'arellano'); yield* show(arellano());
};

// ── withHeader: say what the chart is about before it draws ──────────────────
/** props.header: {kicker, text, y}. For shared charts that start without context. */
export const withHeader = (visual: Visual): Visual => function* (view, ctx) {
  const h = ctx.beat.props.header as {kicker: string; text?: string; y?: number} | undefined;
  if (h) view.add(<Frame>
    <Kicker text={h.kicker} y={h.y ?? 96}/>
    {h.text && <Label x={72} y={(h.y ?? 96) + 26} text={h.text} fontSize={18} fill={brand.text}/>}
  </Frame>);
  yield* visual(view, ctx) ?? waitFor(0);
};

export const withSlot = (visual: Visual): Visual => function* (view, ctx) {
  const raw = ctx.beat.props.slot as Slot | undefined;
  if (!raw) { yield* visual(view, ctx) ?? waitFor(0); return; }
  const s = typeof raw === 'string' ? {state: raw} : raw;
  const body = createRef<Node>(), open = createRef<Rect>(), done = createRef<Rect>();
  // Two layers, so the chip stays above whatever the visual adds later.
  view.add(<Node ref={body}/>);
  view.add(<Frame>
    <SlotChip ref={open} answered={false} opacity={s.state === 'answered' || s.enterCue ? 0 : 1}/>
    <SlotChip ref={done} answered opacity={s.state === 'answered' ? 1 : 0}/>
  </Frame>);
  function* chip(): ThreadGenerator {
    if (s.enterCue) { yield* until(ctx, s.enterCue); yield* waitFor(0.4); yield* open().opacity(1, 0.4); yield* pulse(open()); }
    if (s.pulseCue) { yield* until(ctx, s.pulseCue); yield* pulse(open()); yield* pulse(open()); }
    if (s.answerCue) { yield* until(ctx, s.answerCue); yield* pulse(open()); yield* all(open().opacity(0, 0.5), done().opacity(1, 0.5)); }
  }
  yield* all(visual(body(), ctx) ?? waitFor(0), chip());
};

// ── stopBefore: reuse a shared visual up to a cue ─────────────────────────────
/**
 * The v1 visuals skip a cue the beat does not define, so leaving a cue out makes
 * them run ahead rather than stop. This hands the visual a context where those
 * cues exist but never arrive, and cancels it when the beat ends.
 */
export const stopBefore = (visual: Visual, ...names: string[]): Visual => function* (view, ctx) {
  const cues = {...ctx.beat.cues};
  for (const n of names) cues[n] = Number.MAX_SAFE_INTEGER;
  const cut: VisualContext = {...ctx, beat: {...ctx.beat, cues},
    untilCue: name => (names.includes(name) ? waitFor(1e6) : ctx.untilCue(name))};
  const task = visual(view, cut);
  if (!task) return;
  yield task;
  yield* waitFor(Math.max(0, ctx.remaining()));
  cancel(task);
};
