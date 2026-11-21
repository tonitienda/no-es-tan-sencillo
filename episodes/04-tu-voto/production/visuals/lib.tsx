// Episode 04 · the counting room. One set of actors for the whole video:
//   a ballot envelope (your vote), party columns on a floor, the 3% line,
//   and a hemicycle of seats. Every option is a different path for the same
//   envelope through those three things.
//
// Design space: 1280x720, top-left origin, inside `Frame` (see production/src/kit).
// Colour has one meaning each, and none reads as a party colour:
//   amber  = a valid vote (your vote)      ivory = a seat, a party with seats
//   teal   = the 3% line                   lilac = public money
//   white outline = blank vote             grey + cross = null vote
import {Circle, Line, Node, Rect, Txt, type NodeProps, type TxtProps} from '@motion-canvas/2d';
import {all, BBox, createRef, createSignal, easeInCubic, easeInOutCubic, easeOutBack, easeOutCubic, waitFor,
  type SimpleSignal, type ThreadGenerator} from '@motion-canvas/core';
import {brand} from '../../../../production/src/brand';
import {Cond} from '../../../../production/src/kit';

export {brand};
export const TL: [number, number] = [-1, -1];
export const VOTE = brand.data.hogares, LINE3 = brand.data.terminadas, MONEY = brand.data.turisticos;
export const SEAT = brand.ivory, NULLC = '#8893A3', BLANKC = '#EEF1F5';
/** Neutral party tones by lightness, so they never read as party colours. */
export const TONES = ['#F2EDE4', '#C9CED6', '#A3ADBA', '#7D8898', '#5E6878', '#4A5363', '#3C4452'];

function rgb(c: string) { const n = parseInt(c.slice(1, 7), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; }
export const rgba = (c: string, a: number) => `rgba(${rgb(c)},${a})`;

/** 1340 → "1.340" (es-ES leaves four-digit numbers ungrouped; the script does not). */
export const fmt = (n: number, decimals = 0) => {
  const [i, d] = Math.abs(n).toFixed(decimals).split('.');
  return (n < 0 ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (d ? ',' + d : '');
};

// ── Text ─────────────────────────────────────────────────────────────────────
type TextProps = Omit<TxtProps, 'fill'> & {size?: number; fill?: string; anchor?: [number, number]};
export function Big({size = 72, fill = brand.ivory, anchor = TL, ...rest}: TextProps) {
  return <Cond offset={anchor} fontSize={size} fill={fill} {...rest}/>;
}
export function Tag({size = 15, fill = brand.soft, anchor = TL, ...rest}: TextProps) {
  return <Txt offset={anchor} fontFamily={brand.mono} fontSize={size} letterSpacing={1} fill={fill} {...rest}/>;
}

// ── Timing helpers ───────────────────────────────────────────────────────────
import type {VisualContext} from '../../../../production/src/timeline';
/** Wait for a cue when this beat defines it; otherwise carry on. */
export function* until(ctx: VisualContext, name?: string): ThreadGenerator {
  if (name && name in ctx.beat.cues) yield* ctx.untilCue(name);
}
export function* appear(node: Node, seconds = 0.5, lift = 12): ThreadGenerator {
  const y = node.y();
  node.y(y + lift);
  yield* all(node.opacity(1, seconds), node.y(y, seconds, easeOutCubic));
}
export function* pop(node: Node, seconds = 0.45): ThreadGenerator {
  node.scale(0.6);
  yield* all(node.opacity(1, seconds * 0.6), node.scale(1, seconds, easeOutBack));
}

// ── The envelope ─────────────────────────────────────────────────────────────
export type EnvelopeKind = 'vote' | 'blank' | 'null' | 'double' | 'party';
/** A ballot envelope, 84x56 at scale 1. `kind` decides what is inside. */
export function Envelope({kind = 'vote', tint = VOTE, ...props}: {kind?: EnvelopeKind; tint?: string} & NodeProps) {
  const w = 84, h = 56;
  const paper = kind === 'blank' ? undefined : kind === 'null' ? NULLC : tint;
  return <Node {...props}>
    {paper && <Rect y={-16} width={58} height={44} radius={3} fill={paper} rotation={kind === 'null' ? -8 : 0}/>}
    {(kind === 'null' || kind === 'double') && <Rect x={10} y={-20} width={58} height={44} radius={3} fill={kind === 'null' ? '#B7C0CC' : tint} rotation={8}/>}
    <Rect width={w} height={h} radius={5} fill={brand.panel} stroke={kind === 'blank' ? BLANKC : brand.edge} lineWidth={2}/>
    <Line points={[[-w / 2 + 4, -h / 2 + 4], [0, 6], [w / 2 - 4, -h / 2 + 4]]} stroke={kind === 'blank' ? BLANKC : brand.edge} lineWidth={2}/>
    {kind === 'null' && <Node>
      <Line points={[[-30, -26], [30, 26]]} stroke={NULLC} lineWidth={6} lineCap="round"/>
      <Line points={[[-30, 26], [30, -26]]} stroke={NULLC} lineWidth={6} lineCap="round"/>
    </Node>}
  </Node>;
}

/** A coin of public money. `crossed` shows it is not paid. */
export function Coin({label = '€', crossed = false, size = 46, ...props}: {label?: string; crossed?: boolean; size?: number} & NodeProps) {
  return <Node {...props}>
    <Circle size={size} fill={crossed ? brand.panel : MONEY} stroke={MONEY} lineWidth={2} opacity={crossed ? 0.7 : 1}/>
    <Cond text={label} fontSize={size * 0.5} fill={crossed ? MONEY : brand.night}/>
    {crossed && <Line points={[[-size * 0.6, size * 0.6], [size * 0.6, -size * 0.6]]} stroke={brand.night} lineWidth={9} lineCap="round"/>}
    {crossed && <Line points={[[-size * 0.6, size * 0.6], [size * 0.6, -size * 0.6]]} stroke={MONEY} lineWidth={3} lineCap="round"/>}
  </Node>;
}

/** A single seat, as drawn in the hemicycle. */
export function SeatDot({fill = SEAT, size = 18, empty = false, ...props}: {fill?: string; size?: number; empty?: boolean} & NodeProps) {
  return <Circle size={size} fill={empty ? undefined : fill} stroke={empty ? brand.muted : undefined} lineWidth={empty ? 2 : 0}
    lineDash={empty ? [3, 3] : undefined} {...props}/>;
}

// ── Hemicycle ────────────────────────────────────────────────────────────────
export interface HemiProps extends NodeProps { seats: number; radius: number; inner?: number; dot?: number }
/**
 * `seats` dots on concentric arcs, numbered left to right so blocks stay together.
 * Each seat's paint comes from `paint(i)`: a colour, 'empty' (dashed ring), or null (unlit).
 */
export class Hemi extends Node {
  public readonly lit: SimpleSignal<number>;
  public paint: (i: number) => string | null = () => SEAT;
  public readonly pos: {x: number; y: number}[];
  private readonly dot: number;
  public constructor({seats, radius, inner = radius * 0.42, dot, ...props}: HemiProps) {
    super(props);
    this.lit = createSignal(1);
    const rows = Math.max(1, Math.round(Math.sqrt(seats / 4)));
    const radii = Array.from({length: rows}, (_, r) => rows === 1 ? radius : inner + ((radius - inner) * r) / (rows - 1));
    const total = radii.reduce((a, b) => a + b, 0);
    let left = seats;
    const counts = radii.map((r, i) => { const c = i === rows - 1 ? left : Math.round((seats * r) / total); left -= c; return c; });
    const all: {x: number; y: number; a: number}[] = [];
    radii.forEach((r, i) => {
      const n = counts[i];
      for (let k = 0; k < n; k++) {
        const a = n === 1 ? Math.PI / 2 : Math.PI - (Math.PI * k) / (n - 1);
        all.push({x: Math.cos(a) * r, y: -Math.sin(a) * r, a});
      }
    });
    all.sort((p, q) => q.a - p.a);
    this.pos = all.map(({x, y}) => ({x, y}));
    this.dot = dot ?? Math.min(22, Math.max(5, ((Math.PI * radius) / Math.max(1, counts[rows - 1])) * 0.72));
  }
  protected override getCacheBBox() { return new BBox(-1400, -1400, 2800, 2800); }
  protected override draw(ctx: CanvasRenderingContext2D) {
    const n = Math.round(this.pos.length * this.lit());
    ctx.save();
    this.pos.forEach((p, i) => {
      const c = i < n ? this.paint(i) : null;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.dot / 2, 0, Math.PI * 2);
      if (c === 'empty') { ctx.setLineDash([3, 3]); ctx.strokeStyle = brand.muted; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.fillStyle = c ?? brand.chip; ctx.fill(); }
    });
    ctx.restore();
    super.draw(ctx);
  }
  public seatSize() { return this.dot; }
}

// ── Party columns, D'Hondt and the 3% line ───────────────────────────────────
export type Party = {name: string; votes: number; tone?: string};
export interface Columns {
  node: Node;
  votes: SimpleSignal<number>[];
  divisor: SimpleSignal<number>[];
  blank: SimpleSignal<number>;
  out: SimpleSignal<number>[]; // 1 = below the 3%: greyed out
  valid: () => number;
  /** Screen position of the top of a party's current quotient. */
  top: (i: number) => [number, number];
  x: (i: number) => number;
  lineY: () => number;
  lineNode: Node;
  colour: (i: number) => string;
}

/**
 * Columns standing on a floor at (x, base). Heights share one scale (`max` votes = `height` px).
 * The solid part is the current D'Hondt quotient (votes / divisor); the ghost is all the votes.
 */
export function makeColumns({x, base, width, height, max, parties, blank = 0, barWidth = 64, showNames = true, showLine = true, lineLabel = '3%'}:
  {x: number; base: number; width: number; height: number; max: number; parties: Party[]; blank?: number; barWidth?: number;
   showNames?: boolean; showLine?: boolean; lineLabel?: string}): Columns {
  const votes = parties.map(p => createSignal(p.votes));
  const divisor = parties.map(() => createSignal(1));
  const out = parties.map(() => createSignal(0));
  const blankS = createSignal(blank);
  const valid = () => votes.reduce((a, v) => a + v(), 0) + blankS();
  const px = (n: number) => (n / max) * height;
  const step = width / parties.length;
  const cx = (i: number) => x + step * (i + 0.5);
  const colour = (i: number) => parties[i].tone ?? TONES[Math.min(i, TONES.length - 1)];
  const lineY = () => base - px(0.03 * valid());
  const line = createRef<Node>();
  const node = <Node>
    <Rect x={x + width / 2} y={base + 1} width={width + 40} height={2} fill={brand.rule}/>
    {parties.map((p, i) => <Node>
      <Rect x={cx(i)} y={base} offset={[0, 1]} width={barWidth} height={() => px(votes[i]())} radius={[4, 4, 0, 0]}
        fill={() => rgba(colour(i), 0.16 * (1 - out[i]() * 0.6))} stroke={() => rgba(colour(i), 0.4 * (1 - out[i]() * 0.6))} lineWidth={1.5} lineDash={[4, 4]}/>
      <Rect x={cx(i)} y={base} offset={[0, 1]} width={barWidth} height={() => px(votes[i]() / divisor[i]())} radius={[4, 4, 0, 0]}
        fill={() => out[i]() > 0.5 ? brand.tile : colour(i)} opacity={() => 1 - out[i]() * 0.55}/>
      {showNames && <Cond x={cx(i)} y={base + 30} text={p.name} fontSize={26} fill={() => out[i]() > 0.5 ? brand.muted : brand.text}/>}
    </Node>)}
    {showLine && <Node ref={line}>
      <Line points={() => [[x - 20, lineY()], [x + width + 20, lineY()]]} stroke={LINE3} lineWidth={3} lineDash={[10, 6]}/>
      <Cond offset={[-1, 0]} x={x + width + 30} y={lineY} text={lineLabel} fontSize={28} fill={LINE3}/>
    </Node>}
  </Node>;
  return {node, votes, divisor, blank: blankS, out, valid, x: cx, colour,
    top: i => [cx(i), base - px(votes[i]() / divisor[i]())], lineY, lineNode: line() ?? node};
}

/** Order in which D'Hondt gives out `seats` (only parties not `excluded`). */
export function dhondtOrder(votes: number[], seats: number, excluded: boolean[] = []) {
  const div = votes.map(() => 1), order: number[] = [];
  for (let s = 0; s < seats; s++) {
    let best = -1;
    votes.forEach((v, i) => { if (!excluded[i] && (best < 0 || v / div[i] > votes[best] / div[best])) best = i; });
    order.push(best); div[best]++;
  }
  return order;
}

/**
 * Animate D'Hondt: for each seat, the tallest solid column pays it. A seat flies
 * from the top of that column into the hemicycle, and the column divides.
 */
export function* dealSeats(view: Node, cols: Columns, hemi: Hemi, owners: number[], order: number[], per = 0.55, fly = true): ThreadGenerator {
  const origin = hemi.position();
  for (let s = 0; s < order.length; s++) {
    const w = order[s];
    if (fly) {
      const [tx, ty] = cols.top(w);
      const p = hemi.pos[s];
      const d = <Circle x={tx} y={ty} size={hemi.seatSize() * 1.3} fill={cols.colour(w)} shadowColor={cols.colour(w)} shadowBlur={14}/> as Circle;
      view.add(d);
      yield* all(d.position([origin.x + p.x, origin.y + p.y], per * 0.7, easeInOutCubic), d.size(hemi.seatSize(), per * 0.7),
        cols.divisor[w](cols.divisor[w]() + 1, per * 0.7, easeInOutCubic));
      owners[s] = w; d.remove();
      yield* waitFor(per * 0.3);
    } else {
      owners[s] = w; cols.divisor[w](cols.divisor[w]() + 1);
      yield* waitFor(per);
    }
  }
}

// ── Answer grid (the four questions × six options) ───────────────────────────
export const OPTIONS = ['Partido\ncon escaño', 'Partido\nsin escaño', 'Nulo', 'Blanco', 'Escaños\nen Blanco', 'No ir'];
export const ROWS = ['¿Escaños?', '¿Cuenta\npara el 3%?', '¿Dinero?', '¿Qué queda?'];
/** 'y' yes · 'n' no · 'h' only sometimes · '' not yet answered. */
export type Answer = 'y' | 'n' | 'h' | '';
export function answerCell(a: Answer, size: number) {
  if (a === 'y') return <Circle size={size} fill={SEAT}/>;
  if (a === 'h') return <Node><Circle size={size} stroke={SEAT} lineWidth={2}/><Rect x={-size / 4} width={size / 2} height={size} fill={SEAT} clip/></Node>;
  if (a === 'n') return <Circle size={size} stroke={brand.faint} lineWidth={2}/>;
  return <Circle size={size * 0.35} fill={brand.rule}/>;
}

export function* flyTo(node: Node, to: [number, number], seconds = 0.8, curve = easeInOutCubic): ThreadGenerator {
  yield* node.position(to, seconds, curve);
}
export function* drop(node: Node, toY: number, seconds = 0.6): ThreadGenerator {
  yield* node.y(toY, seconds, easeInCubic);
}
