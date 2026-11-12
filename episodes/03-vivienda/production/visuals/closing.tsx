// Dark versions of two shared built-ins, for this episode only (the registry
// lets an episode visual replace a built-in of the same name).
import {Circle, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, waitFor} from '@motion-canvas/core';
import {Cond, Frame, Serif} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {brand, Label, Para, TL, until} from './ui';

type Bar = {label: string; value: number; display?: string; color?: string; cue?: string};
const colour = (c?: string) => (c && c in brand.data ? brand.data[c as keyof typeof brand.data] : c) ?? brand.ivory;

/** Horizontal bars on a shared scale from zero; each grows on its cue. */
export const barras: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {title?: string; note?: string; bars: Bar[]; max?: number};
  const max = p.max ?? Math.max(...p.bars.map(b => b.value));
  const left = 400, span = 680, row = 76, top = 190;
  const bars = p.bars.map(() => createRef<Rect>()), values = p.bars.map(() => createRef<Txt>());
  view.add(<Frame>
    {p.title && <Txt offset={TL} x={72} y={96} width={1000} textWrap text={p.title} fontFamily={brand.sans} fontWeight={600} fontSize={30} lineHeight="125%" fill={brand.text}/>}
    <Rect x={left} y={top - 10} offset={TL} width={1.5} height={p.bars.length * row} fill={brand.edge}/>
    {p.bars.map((b, i) => <Node>
      <Label x={left - 20} y={top + i * row + 6} offset={[1, -1]} text={b.label} fontSize={18} fill={brand.text} width={320} textAlign="right" textWrap/>
      <Rect ref={bars[i]} x={left} y={top + i * row} offset={TL} width={0} height={40} radius={[0, 4, 4, 0]} fill={colour(b.color)}/>
      <Cond ref={values[i]} offset={[-1, 0]} x={left + 14} y={top + i * row + 20} text={b.display ?? String(b.value)} fontSize={36} fill={colour(b.color)} opacity={0}/>
    </Node>)}
    {p.note && <Para x={72} y={540} width={1000} fontSize={20} text={p.note}/>}
  </Frame>);
  for (const [i, b] of p.bars.entries()) {
    yield* until(ctx, b.cue);
    const w = (span * b.value) / max;
    yield* all(bars[i]().width(w, 0.7, easeOutCubic), values[i]().x(left + w + 14, 0.7, easeOutCubic), values[i]().opacity(1, 0.4));
  }
};

/** End screen: static, so YouTube can lay its elements over the empty panels. */
export const outro: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {title?: string; question?: string; prompt?: string};
  view.add(<Frame>
    <Cond offset={TL} x={72} y={64} text={brand.name} fontSize={22} fill={brand.muted}/>
    <Serif offset={TL} x={72} y={140} text={p.title ?? 'Gracias por vernos.'} fontSize={64} width={560} textWrap/>
    {p.question && <Cond offset={TL} x={72} y={300} text={p.question} fontSize={34} fill={brand.ivory} width={560} textWrap lineHeight="115%"/>}
    {p.prompt && <Para x={72} y={420} width={540} fontSize={20} text={p.prompt}/>}
    <Rect x={699} y={129} offset={TL} width={507} height={285} radius={12} fill={brand.panel}/>
    <Rect x={699} y={435} offset={TL} width={267} height={150} radius={12} fill={brand.panel}/>
    <Circle x={1092} y={509} size={132} fill={brand.panel}/>
  </Frame>);
  yield* waitFor(0);
};
