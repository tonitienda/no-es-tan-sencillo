import {Circle, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {brand} from './brand';
import type {Visual} from './timeline';

// Layout in 1920x1080 top-left coordinates; Motion Canvas centres its origin.
const X = (x: number) => x - 960, Y = (y: number) => y - 540;
type Fact = {label: string; value: string};

function label(text: string, x: number, y: number, color: string = brand.muted, width = 800) {
  return <Txt text={text.toUpperCase()} x={X(x)} y={Y(y)} offset={[-1, -1]} width={width} fontFamily={brand.mono}
    fontSize={18} fontWeight={600} letterSpacing={2} fill={color}/>;
}

/** Opening splash, ~5 s: series mark, episode title, premise and up to four facts. */
export const intro: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {kicker?: string; title?: string; premise?: string; facts?: Fact[]};
  const bar = createRef<Rect>(), mark = createRef<Txt>(), title = createRef<Txt>(), premise = createRef<Txt>(), facts = createRef<Rect>();
  view.add(<>
    <Rect width={1920} height={1080} fill={brand.dark}/>
    <Rect ref={bar} x={X(112)} y={Y(408)} offset={[-1, 0]} width={0} height={14} fill={brand.accent}/>
    <Txt ref={mark} text={brand.name} x={X(112)} y={Y(250)} offset={[-1, -1]} fontFamily={brand.sans} fontWeight={800}
      fontSize={132} letterSpacing={-2} fill="#F3EFE6" opacity={0}/>
    {label(p.kicker ?? '', 116, 214, brand.accent)}
    <Txt ref={title} text={p.title ?? ctx.resolved.title ?? ''} x={X(112)} y={Y(470)} offset={[-1, -1]} width={1500}
      textWrap fontFamily={brand.sans} fontWeight={700} fontSize={64} lineHeight={76} fill="#F3EFE6" opacity={0}/>
    <Txt ref={premise} text={p.premise ?? ''} x={X(112)} y={Y(680)} offset={[-1, -1]} width={1400} textWrap
      fontFamily={brand.sans} fontSize={34} lineHeight={46} fill={brand.darkMuted} opacity={0}/>
    <Rect ref={facts} opacity={0}>
      <Rect x={X(112) + 848} y={Y(900)} width={1696} height={1} fill="#2B2E35"/>
      {(p.facts ?? []).slice(0, 4).map((f, i) => <Node>
        {label(f.label, 112 + i * 425, 930, brand.darkMuted, 400)}
        <Txt text={f.value} x={X(112 + i * 425)} y={Y(962)} offset={[-1, -1]} width={400} textWrap
          fontFamily={brand.sans} fontSize={24} fill="#F3EFE6"/>
      </Node>)}
    </Rect>
  </>);
  yield* all(
    bar().width(560, 0.7, easeOutCubic),
    sequence(0.25,
      all(mark().opacity(1, 0.6), mark().y(Y(230), 0.6, easeOutCubic)),
      title().opacity(1, 0.6),
      premise().opacity(1, 0.6),
      facts().opacity(1, 0.6)),
  );
};

/**
 * End screen: a stable hold (≥ 20 s) with the panels where YouTube's two video
 * elements and subscribe button go. Geometry matches end-screen-guides.svg.
 */
export const outro: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {title?: string; question?: string; prompt?: string; facts?: Fact[]};
  view.add(<>
    <Rect width={1920} height={1080} fill={brand.dark}/>
    {label(brand.name, 112, 96, '#F3EFE6')}
    <Rect x={X(112) + 14} y={Y(132)} width={28} height={4} fill={brand.accent}/>
    <Txt text={p.title ?? 'Gracias por vernos.'} x={X(112)} y={Y(230)} offset={[-1, -1]} width={830} textWrap
      fontFamily={brand.sans} fontWeight={800} fontSize={76} lineHeight={86} fill="#F3EFE6"/>
    {p.question && <Txt text={p.question} x={X(112)} y={Y(470)} offset={[-1, -1]} width={830} textWrap
      fontFamily={brand.sans} fontWeight={700} fontSize={40} lineHeight={52} fill={brand.accent}/>}
    {p.prompt && <Txt text={p.prompt} x={X(112)} y={Y(650)} offset={[-1, -1]} width={830} textWrap
      fontFamily={brand.sans} fontSize={30} lineHeight={42} fill={brand.darkMuted}/>}
    <Rect x={X(1048 + 380)} y={Y(194 + 214)} width={760} height={428} radius={18} fill="#1C1F25"/>
    <Rect x={X(1048 + 200)} y={Y(652 + 112.5)} width={400} height={225} radius={18} fill="#1C1F25"/>
    <Circle x={X(1638)} y={Y(763)} size={198} fill="#1C1F25"/>
    <Rect x={0} y={Y(962)} width={1696} height={1} fill="#2B2E35"/>
    {(p.facts ?? []).slice(0, 2).map((f, i) => <Node>
      {label(f.label, 112 + i * 425, 984, brand.darkMuted, 400)}
      <Txt text={f.value} x={X(112 + i * 425)} y={Y(1011)} offset={[-1, -1]} width={400} fontFamily={brand.sans} fontSize={20} fill="#F3EFE6"/>
    </Node>)}
  </>);
  // Deliberately static: YouTube overlays its elements on this hold.
  yield* waitFor(0);
};

/** Full-screen title card ("cartela"), e.g. NO ES TAN SENCILLO after the cold open. */
export const cartela: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {text?: string; dark?: boolean};
  const dark = p.dark ?? true;
  const text = createRef<Txt>(), mark = createRef<Rect>();
  view.add(<>
    <Rect width={1920} height={1080} fill={dark ? brand.dark : brand.paper}/>
    <Rect ref={mark} y={104} width={0} height={16} fill={brand.accent}/>
    <Txt ref={text} text={p.text ?? brand.name} fontFamily={brand.sans} fontWeight={800} fontSize={150} letterSpacing={-2}
      fill={dark ? '#F3EFE6' : brand.ink} opacity={0} scale={0.96}/>
  </>);
  yield* all(text().opacity(1, 0.35), text().scale(1, 0.6, easeOutCubic), mark().width(text().width() + 40, 0.55, easeOutCubic));
};

/** Inventory rule R3: one fixed line at the bottom with source, date and [C]/[S]/estimación mark. */
export function sourceLabel(text: string): Node {
  return <Rect x={X(56)} y={Y(1028)} offset={[-1, 0]} layout gap={14} alignItems="center" padding={[8, 14]} radius={6} fill="#F3EFE6E6">
    <Txt text="FUENTE" fontFamily={brand.mono} fontSize={16} fontWeight={600} letterSpacing={2} fill={brand.muted}/>
    <Txt text={text} fontFamily={brand.sans} fontSize={22} fill={brand.ink}/>
  </Rect> as Node;
}
