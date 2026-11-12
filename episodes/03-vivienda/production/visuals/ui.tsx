// Shared pieces for this episode's visuals. Everything is laid out in design
// space (1280x720, top-left origin) inside a `Frame`, so numbers read straight
// off the keyframes in visuals/design.
import {Node, Rect, Txt, type NodeProps, type TxtProps} from '@motion-canvas/2d';
import {all, BBox, createSignal, easeOutCubic, waitFor, type SimpleSignal, type ThreadGenerator} from '@motion-canvas/core';
import {brand} from '../../../../production/src/brand';
import type {VisualContext} from '../../../../production/src/timeline';

export {brand};
export const TL: [number, number] = [-1, -1];

/** Wait for a cue when this beat defines it; otherwise carry on. */
export function* until(ctx: VisualContext, name?: string): ThreadGenerator {
  if (name && name in ctx.beat.cues) yield* ctx.untilCue(name);
}
/** A cue's time, or a fraction of the beat if it is missing. */
export const cueAt = (ctx: VisualContext, name: string | undefined, fallback: number) =>
  name && name in ctx.beat.cues ? ctx.beat.cues[name] : ctx.beat.duration * fallback;

/** Fade a node in while it settles from a small lift. */
export function* show(node: Node, seconds = 0.5, lift = 10): ThreadGenerator {
  const y = node.y();
  node.y(y + lift);
  yield* all(node.opacity(1, seconds), node.y(y, seconds, easeOutCubic));
}
export function* hide(node: Node, seconds = 0.4): ThreadGenerator { yield* node.opacity(0, seconds); }

/** Run `task` at a cue without blocking the caller. */
export function* at(ctx: VisualContext, name: string | undefined, task: () => ThreadGenerator): ThreadGenerator {
  yield* until(ctx, name);
  yield* task();
}

/** Plain Inter text, top-left anchored. */
export function Label(props: TxtProps) {
  return <Txt fontFamily={brand.sans} fontSize={16} fill={brand.soft} offset={TL} {...props}/>;
}
/** Wrapping text column, top-left anchored. */
export function Para(props: TxtProps & {width: number}) {
  return <Txt fontFamily={brand.sans} fontSize={18} lineHeight="140%" fill={brand.soft} textWrap offset={TL} {...props}/>;
}

function rgb(c: string) {
  const n = parseInt(c.slice(1, 7), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
export const rgba = (c: string, a: number) => `rgba(${rgb(c)},${a})`;

// ── Perspective ground of tiles (the plain the keyframes stand on) ───────────
export interface PlaneProps extends NodeProps {
  top: number; period?: number; tile?: number; color?: string; alpha?: number; tilt?: number; persp?: number; depth?: number;
}
/**
 * A CSS `perspective(P) rotateX(tilt)` tiled plane, hinged on its top edge at
 * `top`, drawn as quads. Same look as the keyframes' repeating-gradient planes.
 */
export class Plane extends Node {
  public readonly alpha: SimpleSignal<number>;
  private readonly o: Required<Omit<PlaneProps, keyof NodeProps | 'alpha'>>;
  public constructor({top, period = 14, tile = 9, color = brand.tile, alpha = 0.6, tilt = 70, persp = 600, depth = 900, ...props}: PlaneProps) {
    super(props);
    this.o = {top, period, tile, color, tilt, persp, depth};
    this.alpha = createSignal(alpha);
  }
  protected override getCacheBBox() { return new BBox(-200, -200, 1680, 1120); }
  protected override draw(ctx: CanvasRenderingContext2D) {
    const {top, period, tile, color, tilt, persp, depth} = this.o;
    const t = (tilt * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const P = (x: number, y: number) => { const k = persp / (persp + y * s); return [640 + (x - 640) * k, top + y * c * k] as const; };
    ctx.save();
    ctx.fillStyle = rgba(color, this.alpha());
    for (let y = 0; y < depth; y += period) {
      const kFar = persp / (persp + y * s);
      if (kFar * period < 0.6) break;
      const span = 760 / kFar;
      for (let x = 640 - span - ((640 - span) % period) - period; x < 640 + span; x += period) {
        const a = P(x, y), b = P(x + tile, y), d = P(x + tile, y + tile), e = P(x, y + tile);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(d[0], d[1]); ctx.lineTo(e[0], e[1]); ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
    super.draw(ctx);
  }
}

// ── Flat grid of counted tiles ("cada baldosa: 100.000") ─────────────────────
export interface GridProps extends NodeProps {
  count: number; cols: number; step: number; tile: number;
  fill?: string; stroke?: string; glow?: string; radius?: number;
  /** Fill from the bottom row up (stacked), or from the top row down. */
  fromBottom?: boolean;
  /** Per-tile override: index → fill colour, or null for the default. */
  paint?: (i: number) => string | null;
}
/** Draws `count` tiles in rows of `cols`; `shown` (0..1) reveals them in order. */
export class Grid extends Node {
  public readonly shown: SimpleSignal<number>;
  public readonly o: GridProps;
  public constructor(props: GridProps) {
    super(props);
    this.o = props;
    this.shown = createSignal(1);
  }
  /** Top-left of tile i in local space. */
  public cell(i: number) {
    const {cols, step, fromBottom} = this.o;
    const c = i % cols, r = Math.floor(i / cols);
    return {x: c * step, y: fromBottom ? -(r + 1) * step : r * step};
  }
  protected override getCacheBBox() { return new BBox(-200, -800, 1680, 1800); }
  protected override draw(ctx: CanvasRenderingContext2D) {
    const {count, tile, fill = brand.tile, stroke, glow, radius = 1} = this.o;
    const n = Math.round(count * this.shown());
    ctx.save();
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 8; }
    for (let i = 0; i < n; i++) {
      const {x, y} = this.cell(i);
      ctx.beginPath();
      ctx.roundRect(x, y, tile, tile, radius);
      ctx.fillStyle = this.o.paint?.(i) ?? fill;
      ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
    }
    ctx.restore();
    super.draw(ctx);
  }
}

/** Diagonal or vertical stripes clipped to a box (hatched = «vacía» or provisional). */
export function Stripes({width, height, color, step = 10, line = 2, vertical = false, ...props}:
  {width: number; height: number; color: string; step?: number; line?: number; vertical?: boolean} & NodeProps) {
  const out = [];
  if (vertical) for (let x = 0; x < width; x += step) out.push(<Rect x={x} y={0} offset={TL} width={line} height={height} fill={color}/>);
  else for (let x = -height; x < width; x += step)
    out.push(<Rect x={x + height / 2} y={height / 2} width={line} height={height * 1.5} rotation={45} fill={color}/>);
  return <Rect width={width} height={height} offset={TL} clip {...props}><Node x={-width / 2} y={-height / 2}>{out}</Node></Rect>;
}

/** Hold until the end of the beat (keeps generator-based visuals readable). */
export function* hold(ctx: VisualContext) { const r = ctx.remaining(); if (r > 0) yield* waitFor(r); }
