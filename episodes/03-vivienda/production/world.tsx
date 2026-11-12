// The episode's world (Mundo board): Spain at night, tilted, made of tiles.
// Each tile is a dwelling (or a block of them); the light inside is a household.
// Tiles are projected by code and drawn in one pass, not rasterised, so the
// camera can travel across the same map without cuts.
//
// Map space is the design's 1040x820 SVG viewBox. TileMap lives inside a
// `Frame` (1280x720 design space, top-left origin), so its screen positions
// read straight off the keyframes.
import {Node, type NodeProps} from '@motion-canvas/2d';
import {BBox, createSignal, type SimpleSignal} from '@motion-canvas/core';
import {brand} from '../../../production/src/brand';

/** Approximate outline without islands (base map with licence still pending). */
export const SPAIN: [number, number][] = [[120,30],[200,45],[296,40],[400,60],[456,55],[520,65],[616,62],[648,90],[704,115],[784,130],[824,115],[896,150],[1016,160],[1016,210],[936,260],[840,295],[824,330],[760,400],[736,450],[776,520],[720,570],[696,640],[632,670],[592,730],[520,725],[408,730],[328,795],[280,760],[248,720],[168,680],[160,640],[200,600],[176,550],[200,500],[160,430],[208,380],[216,300],[264,240],[232,205],[160,215],[104,210],[48,190],[48,140],[16,110],[24,80],[96,50]];
/** Catalonia (approximate, for the tensioned-zone reading lock). */
export const CATALUNA: [number, number][] = [[800,140],[824,115],[896,150],[1016,160],[1016,210],[936,260],[840,295],[824,330],[796,300],[806,220]];

export const CITY = {
  madrid: [464, 360], barcelona: [925, 262], valencia: [722, 452], sevilla: [282, 661], malaga: [410, 716],
  bilbao: [526, 84], alicante: [712, 560], coruna: [96, 120], zaragoza: [690, 236], zamora: [250, 250],
} as const satisfies Record<string, [number, number]>;

/** City light pools: [u, v, radius]. */
const POOLS: [number, number, number][] = [[464,360,170],[925,262,140],[722,452,100],[282,661,95],[410,716,90],[526,84,80],[712,560,80],[96,120,70],[690,236,70]];

export type TileKind = 'dwelling' | 'hollow' | 'tourist';
export type Tile = {u: number; v: number; i: number; j: number; kind: TileKind; glow: number; dist: number};

function inside(poly: [number, number][], x: number, y: number) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
export const inPolygon = inside;

const poolAlpha = (d: number, r: number) => {
  const t = d / r;
  if (t >= 1) return 0;
  return t < 0.55 ? 1 - (0.65 * t) / 0.55 : 0.35 * (1 - (t - 0.55) / 0.45);
};

const STEP = 14, SIZE = 9;
const TILES: Tile[] = (() => {
  const out: Tile[] = [];
  const [mx, my] = CITY.madrid;
  for (let j = 0; j * STEP < 820; j++) for (let i = 0; i * STEP < 1040; i++) {
    const u = i * STEP + 6.5, v = j * STEP + 6.5;
    if (!inside(SPAIN, u, v)) continue;
    let glow = 0;
    for (const [px, py, r] of POOLS) glow = Math.max(glow, poolAlpha(Math.hypot(u - px, v - py), r));
    const kind: TileKind = i % 8 === 4 && j % 7 === 3 ? 'tourist' : i % 3 === 1 && j % 3 === 1 ? 'hollow' : 'dwelling';
    out.push({u, v, i, j, kind, glow, dist: Math.hypot(u - mx, v - my)});
  }
  return out;
})();
export const tiles = TILES;

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a: [number, number, number], b: [number, number, number], t: number) {
  t = Math.max(0, Math.min(1, t));
  return `rgb(${a[0] + (b[0] - a[0]) * t | 0},${a[1] + (b[1] - a[1]) * t | 0},${a[2] + (b[2] - a[2]) * t | 0})`;
}

/** Override a tile's paint: return a colour, or null to draw it normally. */
export type Paint = (t: Tile) => string | null;

export interface TileMapProps extends NodeProps {
  /** Camera: map point (cx, cy) lands on screen point (sx, sy). */
  cx?: number; cy?: number; sx?: number; sy?: number; zoom?: number;
  /** Degrees. tilt is rotateX (0 = straight overhead), turn is rotateZ. */
  tilt?: number; turn?: number;
  /** Perspective distance and vanishing point (design px). */
  persp?: number; vx?: number; vy?: number;
  /** 0..1: how lit the cities are. reveal: radial switch-on from Madrid (A1). */
  lit?: number; reveal?: number; ambient?: number;
  /** 0..1 visibility of the empty (hollow) and tourist tiles. */
  hollows?: number; tourists?: number;
  dim?: string; light?: string;
  paint?: Paint;
}

export class TileMap extends Node {
  public readonly cx: SimpleSignal<number>; public readonly cy: SimpleSignal<number>;
  public readonly sx: SimpleSignal<number>; public readonly sy: SimpleSignal<number>;
  public readonly zoom: SimpleSignal<number>; public readonly tilt: SimpleSignal<number>; public readonly turn: SimpleSignal<number>;
  public readonly persp: SimpleSignal<number>; public readonly vx: SimpleSignal<number>; public readonly vy: SimpleSignal<number>;
  public readonly lit: SimpleSignal<number>; public readonly reveal: SimpleSignal<number>; public readonly ambient: SimpleSignal<number>;
  public readonly hollows: SimpleSignal<number>; public readonly tourists: SimpleSignal<number>;
  public readonly dim: SimpleSignal<string>; public readonly light: SimpleSignal<string>;
  public paint: Paint | undefined;

  public constructor(props: TileMapProps) {
    super(props);
    const s = <T,>(v: T) => createSignal(v);
    this.cx = s(props.cx ?? 520); this.cy = s(props.cy ?? 246);
    this.sx = s(props.sx ?? 640); this.sy = s(props.sy ?? 546);
    this.zoom = s(props.zoom ?? 1); this.tilt = s(props.tilt ?? 62); this.turn = s(props.turn ?? -6);
    this.persp = s(props.persp ?? 1100); this.vx = s(props.vx ?? 640); this.vy = s(props.vy ?? 144);
    this.lit = s(props.lit ?? 1); this.reveal = s(props.reveal ?? 1); this.ambient = s(props.ambient ?? 0.165);
    this.hollows = s(props.hollows ?? 1); this.tourists = s(props.tourists ?? 0);
    this.dim = s(props.dim ?? brand.tile); this.light = s(props.light ?? brand.data.hogares);
    this.paint = props.paint;
  }

  /** Screen position (design px) and scale of a map point under the current camera. */
  public project(u: number, v: number) {
    const z0 = this.zoom(), t = (this.tilt() * Math.PI) / 180, a = (this.turn() * Math.PI) / 180;
    const X = (u - this.cx()) * z0, Y = (v - this.cy()) * z0;
    const x = X * Math.cos(a) - Y * Math.sin(a), y = X * Math.sin(a) + Y * Math.cos(a);
    const yy = y * Math.cos(t), z = -y * Math.sin(t);
    const P = this.persp(), k = P / Math.max(1, P + z);
    const vx = this.vx(), vy = this.vy(), ax = this.sx() + x, ay = this.sy() + yy;
    return {x: vx + (ax - vx) * k, y: vy + (ay - vy) * k, k: k * z0};
  }

  /** The map draws itself, so filters (blur) need the whole frame as their cache. */
  protected override getCacheBBox() { return new BBox(-200, -200, 1680, 1120); }

  protected override draw(ctx: CanvasRenderingContext2D) {
    const dim = hex(this.dim()), light = hex(this.light()), hollowEdge = hex(brand.data.vacias), tour = hex(brand.data.turisticos);
    const night = hex(brand.night);
    const lit = this.lit(), reveal = this.reveal(), ambient = this.ambient(), hollows = this.hollows(), tourists = this.tourists();
    const maxD = 760, front = reveal * maxD;
    const outline = SPAIN.map(([u, v]) => this.project(u, v));
    ctx.save();
    ctx.beginPath();
    outline.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = brand.ground;
    ctx.fill();
    const h = SIZE / 2;
    for (const t of TILES) {
      const c = this.project(t.u, t.v);
      if (c.x < -60 || c.x > 1340 || c.y < -60 || c.y > 780) continue;
      const p1 = this.project(t.u - h, t.v - h), p2 = this.project(t.u + h, t.v - h), p3 = this.project(t.u + h, t.v + h), p4 = this.project(t.u - h, t.v + h);
      const on = reveal >= 1 ? 1 : Math.max(0, Math.min(1, (front - t.dist) / 60));
      const alpha = ambient + (t.glow - ambient) * lit * (t.glow > ambient ? 1 : 0);
      let fill = mix(dim, light, Math.max(0, alpha) * on), stroke: string | null = null;
      const custom = this.paint?.(t);
      if (custom) fill = custom;
      else if (t.kind === 'hollow' && hollows > 0) { fill = mix(dim, night, hollows); stroke = mix(dim, hollowEdge, hollows); }
      else if (t.kind === 'tourist' && tourists > 0) fill = mix(dim, tour, tourists);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2 * c.k; ctx.stroke(); }
    }
    // Light pools: practical light only, the households are the source.
    if (lit > 0) {
      ctx.save();
      ctx.beginPath();
      outline.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.clip();
      ctx.globalCompositeOperation = 'lighter';
      for (const [u, v, r] of POOLS) {
        const c = this.project(u, v);
        const on = reveal >= 1 ? 1 : Math.max(0, Math.min(1, (front - Math.hypot(u - CITY.madrid[0], v - CITY.madrid[1])) / 60));
        if (!on) continue;
        const R = r * c.k * 0.9;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R);
        g.addColorStop(0, `rgba(245,184,90,${0.16 * lit * on})`);
        g.addColorStop(1, 'rgba(245,184,90,0)');
        ctx.fillStyle = g;
        ctx.save();
        ctx.translate(c.x, c.y); ctx.scale(1, Math.max(0.2, Math.cos((this.tilt() * Math.PI) / 180))); ctx.translate(-c.x, -c.y);
        ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.beginPath();
    outline.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.strokeStyle = brand.edge;
    ctx.lineWidth = 2 * this.zoom();
    ctx.stroke();
    ctx.restore();
    super.draw(ctx);
  }
}
