import {Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic} from '@motion-canvas/core';
import {brand} from '../brand';
import type {Visual} from '../timeline';

const X = (x: number) => x - 960, Y = (y: number) => y - 540;
type Bar = {label: string; value: number; display?: string; color?: keyof typeof brand.data | string; cue?: string};

/**
 * Example visual: horizontal bars on a shared scale that starts at zero
 * (inventory rule 5). Each bar grows when its cue is spoken.
 *
 *   {"visual": "barras", "lines": ["s2-01"],
 *    "props": {"title": "Censo de 2021", "bars": [
 *      {"label": "Viviendas", "value": 26.6, "display": "26,6 M", "color": "viviendas", "cue": "viviendas"},
 *      {"label": "Hogares", "value": 18.5, "display": "18,5 M", "color": "hogares", "cue": "hogares"}]},
 *    "cues": {"viviendas": "26,6 millones", "hogares": "18,5 millones"}}
 */
export const barras: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {title?: string; note?: string; bars: Bar[]; max?: number};
  const max = p.max ?? Math.max(...p.bars.map(b => b.value));
  const left = 420, span = 1180, rowHeight = 132, top = 360;
  const colour = (c?: string) => (c && c in brand.data ? brand.data[c as keyof typeof brand.data] : c) ?? brand.ink;
  const bars = p.bars.map(() => createRef<Rect>()), values = p.bars.map(() => createRef<Txt>());
  view.add(<>
    <Rect width={1920} height={1080} fill={brand.paper}/>
    {p.title && <Txt text={p.title} x={X(112)} y={Y(150)} offset={[-1, -1]} width={1696} textWrap fontFamily={brand.sans}
      fontWeight={700} fontSize={56} lineHeight={66} fill={brand.ink}/>}
    <Rect x={X(left)} y={Y(top - 30) + (p.bars.length * rowHeight) / 2} width={2} height={p.bars.length * rowHeight + 20} fill={brand.ink}/>
    {p.bars.map((b, i) => <Node>
      <Txt text={b.label} x={X(left - 32)} y={Y(top + i * rowHeight + 30)} offset={[1, 0]} fontFamily={brand.sans}
        fontSize={38} fontWeight={600} fill={brand.ink}/>
      <Rect ref={bars[i]} x={X(left)} y={Y(top + i * rowHeight + 30)} offset={[-1, 0]} width={0} height={72} fill={colour(b.color)}/>
      <Txt ref={values[i]} text={b.display ?? String(b.value)} x={X(left + 24)} y={Y(top + i * rowHeight + 30)} offset={[-1, 0]}
        fontFamily={brand.sans} fontWeight={800} fontSize={44} fill={brand.ink} opacity={0}/>
    </Node>)}
    {p.note && <Txt text={p.note} x={X(112)} y={Y(880)} offset={[-1, -1]} width={1696} textWrap fontFamily={brand.sans}
      fontSize={28} fill={brand.muted}/>}
  </>);
  for (const [i, b] of p.bars.entries()) {
    if (b.cue) yield* ctx.untilCue(b.cue);
    const width = span * b.value / max;
    yield* all(
      bars[i]().width(width, 0.7, easeOutCubic),
      values[i]().x(X(left + width + 24), 0.7, easeOutCubic),
      values[i]().opacity(1, 0.4),
    );
  }
};
