// Series instruments (Sistema v0.1): R1 four questions, R2 sentence card,
// R3 source line, R4 deficit bar, and the three marks. Every visual and the
// scene HUD build from these, so the same thing looks the same all video long.
//
// Coordinates: the design boards are 1280x720. `Frame` scales them to the
// 1920x1080 logical canvas with a top-left origin, so positions can be read
// straight off the boards (left/top in px).
import {Layout, Node, Rect, Txt, type NodeProps, type RectProps, type TxtProps} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {brand} from './brand';

export const DESIGN_SCALE = 1.5;

/** A 1280x720 design frame with a top-left origin, scaled to fill the canvas. */
export function Frame({children, ...props}: NodeProps) {
  return <Node scale={DESIGN_SCALE} x={-960} y={-540} {...props}>{children}</Node>;
}

// Motion Canvas copies only the font properties it knows (family, size, style,
// weight...) onto each text element, and the canvas draws from that element's
// computed `font`. Font stretch is not among them, so nodes opt in with
// `fontStretch` and every text element below them inherits it.
const stretchOf = (node: Node | null): string | undefined => {
  for (let n = node; n; n = n.parent()) { const s = (n as {fontStretch?: string}).fontStretch; if (s) return s; }
  return undefined;
};
const proto = Layout.prototype as unknown as {applyFont(this: Layout): void};
const applyFont = proto.applyFont;
proto.applyFont = function () {
  applyFont.call(this);
  const s = stretchOf(this);
  if (s) this.element.style.fontStretch = s;
};

/** Archivo, condensed (font-stretch 75%): figures and titles. */
export class Cond extends Txt {
  // A getter, not a field: fields are set after super(), and the memoised
  // applyFont has already run by then.
  public get fontStretch() { return 'condensed'; } // a keyword: the computed `font` shorthand (what the canvas reads) can't carry a percentage
  public constructor(props: TxtProps) {
    super({fontFamily: brand.display, fontWeight: 900, lineHeight: '100%', fill: brand.text, ...props});
  }
}

/** Instrument Serif italic: only for sentences, never for data. */
export function Serif(props: TxtProps) {
  return <Txt fontFamily={brand.serif} fontStyle="italic" fill={brand.text} {...props}/>;
}
/** Inter: labels and axes. */
export function Sans(props: TxtProps) {
  return <Txt fontFamily={brand.sans} fontSize={15} fill={brand.soft} {...props}/>;
}
/** IBM Plex Mono: sources, dates, the record. */
export function Mono(props: TxtProps) {
  return <Txt fontFamily={brand.mono} fontSize={13} fill={brand.muted} {...props}/>;
}

// ── Marks ────────────────────────────────────────────────────────────────────
/** nuestra: dashed (we calculated it). segun: filled (not read at source). estimacion: outline (the source estimates). */
export type MarkKind = 'nuestra' | 'segun' | 'estimacion';
export type Mark = MarkKind | {kind: MarkKind; text?: string};
const markText: Record<MarkKind, string> = {nuestra: 'cuenta nuestra', segun: 'según medio', estimacion: '≈ estimación'};

export function Pill({mark, size = 13, ...props}: {mark: Mark; size?: number} & RectProps) {
  const {kind, text} = typeof mark === 'string' ? {kind: mark, text: undefined} : mark;
  const dashed = kind === 'nuestra', filled = kind === 'segun';
  return <Rect layout padding={[size * 0.3, size * 0.75]} radius={999} lineWidth={1.5}
    stroke={filled ? undefined : dashed ? brand.ivory : brand.muted} lineDash={dashed ? [4, 3] : undefined}
    fill={filled ? brand.chip : undefined} {...props}>
    <Txt text={text ?? markText[kind]} fontFamily={brand.mono} fontWeight={500} fontSize={size}
      fontStyle={filled ? 'italic' : 'normal'} fill={dashed ? brand.ivory : brand.soft}/>
  </Rect>;
}

// ── R1 · four questions ─────────────────────────────────────────────────────
export const QUESTIONS = ['¿CUÁNTAS?', '¿DÓNDE?', '¿PARA QUIÉN?', '¿PARA CUÁNDO?'] as const;
/** p pendiente · r respondida · h parcial · x sin respuesta. Same size for all four. */
export type R1State = 'p' | 'r' | 'h' | 'x';
const stateWord: Record<R1State, string> = {p: 'pendiente', r: 'respondida', h: 'parcial', x: 'SIN RESPUESTA'};

/** Parses "rhpp" (one letter per question) into states; anything unknown is pendiente. */
export function r1States(code = 'pppp'): R1State[] {
  return QUESTIONS.map((_, i) => ('prhx'.includes(code[i]) ? code[i] : 'p') as R1State);
}

/** Diagonal hatch for «sin respuesta»: drawn lines clipped to the chip. */
function Hatch({width, height, step = 10}: {width: number; height: number; step?: number}) {
  const lines = [];
  for (let x = -height; x < width; x += step)
    lines.push(<Rect x={x + height / 2 - width / 2} width={3.5} height={height * 1.6} rotation={45} fill={'#F2EDE429'}/>);
  return <Node>{lines}</Node>;
}

/** One R1 chip. `focus` is the question being asked right now. */
export function R1Chip({q, state, focus = false, width, height, fontSize, showWord = false, ...props}:
  {q: number; state: R1State; focus?: boolean; width: number; height: number; fontSize: number; showWord?: boolean} & RectProps) {
  const solid = state === 'r';
  const ink = solid ? brand.night : state === 'p' && !focus ? brand.muted : brand.ivory;
  const line = state === 'p' && !focus ? brand.edge : brand.ivory;
  return <Rect width={width} height={height} radius={height * 0.2} clip lineWidth={focus ? 2 : 1.5} stroke={solid ? undefined : line}
    fill={solid ? brand.ivory : undefined} shadowColor={focus ? '#F2EDE459' : undefined} shadowBlur={focus ? 18 : 0} {...props}>
    {state === 'h' && <Rect x={-width / 4} width={width / 2} height={height} fill={'#F2EDE46B'}/>}
    {state === 'x' && <Hatch width={width} height={height}/>}
    <Cond text={QUESTIONS[q]} fontSize={fontSize} fontWeight={800} fill={ink} y={showWord ? -height * 0.18 : 0}/>
    {showWord && <Txt text={stateWord[state]} fontFamily={brand.mono} fontSize={fontSize * 0.45} fontWeight={500} fill={ink} y={height * 0.28}/>}
  </Rect>;
}

/** R1 docked in the HUD, top right (design: right 40, top 28, 92x30 chips). */
export function R1Hud({code, focus = -1, ...props}: {code?: string; focus?: number} & NodeProps) {
  const states = r1States(code);
  return <Node {...props}>
    {states.map((s, i) => <Node><R1Chip q={i} state={s} focus={i === focus} x={1280 - 40 - 92 * (3.5 - i) - 6 * (3 - i)} y={43}
      width={92} height={30} fontSize={13}/></Node>)}
  </Node>;
}

// ── R2 · sentence card ──────────────────────────────────────────────────────
/** Same style for every party or government: no logos, photos or colour. */
export function R2Card({quote, who, width = 520, fontSize = 30, ...props}: {quote: string; who: string; width?: number; fontSize?: number} & RectProps) {
  return <Rect layout direction="column" gap={10} padding={[18, 22]} radius={12} fill={brand.panel} width={width} offset={[-1, -1]} {...props}>
    <Serif text={quote} fontSize={fontSize} lineHeight="112%" textWrap/>
    <Mono text={who} fill={brand.soft}/>
  </Rect>;
}

// ── R3 · source line ────────────────────────────────────────────────────────
/** Bottom left of the HUD, always on the same screen as the figure. */
export function R3({text, mark}: {text: string; mark?: Mark}) {
  return <Node>
    <Rect x={640} y={650} width={1168} height={1} fill={brand.rule}/>
    <Rect layout x={56} y={672} offset={[-1, 0]} gap={14} alignItems="center">
      <Txt text={text} fontFamily={brand.mono} fontSize={15} fill={brand.soft}/>
      {mark && <Pill mark={mark}/>}
    </Rect>
  </Node>;
}

// ── R4 · deficit bar ────────────────────────────────────────────────────────
/** 75 slots × 10.000 = 750.000. Same scale everywhere in the video. */
export const R4_SLOTS = 75, R4_TOTAL = 750_000;

export function R4Slots({width, height}: {width: number; height: number}) {
  const ticks = [];
  for (let i = 1; i < R4_SLOTS; i++)
    ticks.push(<Rect x={-width / 2 + (width * i) / R4_SLOTS} width={1.5} height={height - 3} fill={'#F2EDE438'}/>);
  return <Node>{ticks}</Node>;
}

/** Build an R4 bar. `fillTo` animates the solid «counts once» fill. */
export function makeR4({x, y, width, height = 34, color = brand.data.turisticos}: {x: number; y: number; width: number; height?: number; color?: string}) {
  const fill = createRef<Rect>(), group = createRef<Node>();
  const node = <Node ref={group}>
    <Rect x={x + width / 2} y={y + height / 2} width={width} height={height} radius={4} lineWidth={1.5} stroke={brand.ivory} clip>
      <R4Slots width={width} height={height}/>
      <Rect ref={fill} x={-width / 2} offset={[-1, 0]} width={0} height={height} fill={color}/>
    </Rect>
  </Node>;
  return {
    node, fill,
    /** Solid fill to a share of 750.000 (counts once). */
    fillTo: (value: number, seconds = 0.8) => fill().width(width * Math.min(1, value / R4_TOTAL), seconds, easeOutCubic),
    /** Yearly fill (A3): `perYear` added once per year, `years` times, as visible pulses. */
    pulse: function* (perYear: number, years: number, seconds = 0.6): ThreadGenerator {
      // One step per year, with a short pause between, so it reads as "every year"
      // and not as the single gesture of fillTo (A3 board).
      const step = width * (perYear / R4_TOTAL);
      for (let year = 0; year < years; year++) {
        const target = Math.min(width, fill().width() + step);
        fill().opacity(0.55);
        yield* all(fill().width(target, seconds * 0.6, easeOutBack), fill().opacity(1, seconds * 0.6));
        if (year < years - 1) yield* waitFor(seconds * 0.4);
      }
    },
    width,
  };
}
