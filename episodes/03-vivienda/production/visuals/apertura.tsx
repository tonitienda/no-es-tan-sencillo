// K01 · tres frases, and A1 · the title card that switches the city on.
import {blur, Gradient, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, sequence} from '@motion-canvas/core';
import {Cond, Frame, Pill} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {TileMap} from '../world';
import {brand, hold, TL, until} from './ui';

type Phrase = {pre: string; num: string; post: string};

/** The night city behind K01: present, blurred, not the subject. */
function city(props: Partial<ConstructorParameters<typeof TileMap>[0]> = {}) {
  return <TileMap cx={520} cy={0} sx={640} sy={380} zoom={1.115} tilt={66} turn={0} persp={1000} vx={640} vy={0}
    dim={brand.ground} hollows={0} {...props}/>;
}
const fadeTop = (y: number, h = 120) => <Rect x={0} y={y} offset={TL} width={1280} height={h}
  fill={new Gradient({type: 'linear', from: [0, -h / 2], to: [0, h / 2],
    stops: [{offset: 0, color: brand.night}, {offset: 1, color: 'rgba(11,14,20,0)'}]})}/>;

const whole = (p: Phrase) => p.pre + p.num + p.post;
/** Serif sentence with its figure set in condensed Archivo, top-left anchored. */
function sentence(p: Phrase, size: number, width: number) {
  return <Txt offset={TL} fontFamily={brand.serif} fontStyle="italic" fontSize={size} lineHeight="104%" fill={brand.text} width={width} textWrap>
    {[p.pre, ...(p.num ? [<Cond text={p.num} fontWeight={800} fill={brand.ivory} fontSize={size}/>] : []), ...(p.post ? [p.post] : [])]}
  </Txt>;
}

/**
 * K01: one sentence in focus, the next ones waiting further back in the sky.
 * Each line of s1-01..03 brings the next sentence forward; s1-04 lines the three
 * up together for "las tres señalan algo real".
 */
export const frases: Visual = function* (view, ctx) {
  const phrases = (ctx.beat.props.phrases ?? []) as Phrase[];
  const clean = phrases;
  const focus = clean.map(() => createRef<Node>()), sky = clean.map(() => createRef<Txt>());
  const counter = createRef<Txt>(), head = createRef<Node>(), stack = createRef<Rect>();
  const skyPos = [{x: 1200, y: 70, s: 24, o: 0.35, b: 2.5}, {x: 1080, y: 30, s: 20, o: 0.25, b: 3.5}];
  view.add(<Frame>
    <Node filters={[blur(5)]} opacity={0.85}>{city()}</Node>
    {fadeTop(340)}
    {clean.map((p, i) => <Txt ref={sky[i]} text={`${whole(p).split('. ')[0]}…»`}
      fontFamily={brand.serif} fontStyle="italic" fontSize={24} fill={brand.muted} offset={[1, -1]}
      x={(skyPos[i - 1] ?? skyPos[0]).x} y={(skyPos[i - 1] ?? skyPos[0]).y} opacity={0} filters={[blur(2.5)]}/>)}
    <Node ref={head} x={120} y={150}>
      <Rect layout x={0} y={0} offset={TL} gap={12} alignItems="center">
        <Pill mark={{kind: 'nuestra', text: 'frase resumida por nosotros'}} size={14}/>
        <Txt ref={counter} text="1 / 3" fontFamily={brand.mono} fontSize={14} fill={brand.muted}/>
      </Rect>
      {clean.map((p, i) => <Node ref={focus[i]} x={0} y={52} opacity={i ? 0 : 1}>{sentence(p, 72, 960)}</Node>)}
    </Node>
    <Rect ref={stack} layout direction="column" gap={30} x={120} y={150} offset={TL} opacity={0} alignItems="start">
      <Pill mark={{kind: 'nuestra', text: 'frases resumidas por nosotros'}} size={14}/>
      {clean.map(p => sentence(p, 40, 1000))}
    </Rect>
  </Frame>);
  // The sky holds the sentences still to come.
  yield* all(...sky.slice(1).map((s, i) => s().opacity(skyPos[i].o, 0.8)));
  for (let i = 1; i < clean.length; i++) {
    yield* until(ctx, `s1-0${i + 1}`);
    const out = focus[i - 1](), next = focus[i](), from = sky[i]();
    next.position([from.x() - from.width() - 120, from.y() - 150]); next.scale(0.33);
    counter().text(`${i + 1} / ${clean.length}`);
    yield* all(
      out.opacity(0, 0.5), out.y(out.y() - 40, 0.6, easeInOutCubic), out.filters.blur(4, 0.5),
      from.opacity(0, 0.3),
      next.opacity(1, 0.7), next.position([0, 52], 0.8, easeInOutCubic), next.scale(1, 0.8, easeInOutCubic),
      ...sky.slice(i + 1).map((s, j) => all(s().position.x(skyPos[j].x, 0.8), s().position.y(skyPos[j].y, 0.8), s().opacity(skyPos[j].o, 0.8))),
    );
  }
  yield* until(ctx, 's1-04');
  yield* all(focus[clean.length - 1]().opacity(0, 0.5), head().opacity(0, 0.5), stack().opacity(1, 0.8));
  yield* until(ctx, 'preguntas');
  yield* stack().opacity(0.45, 0.8);
};

/**
 * A1 · title card. The struck «evidente» and the series name over the city,
 * which switches on radially from Madrid. `small` is the quiet end card.
 */
export const cartela: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {text?: string; sub?: string; struck?: string; small?: boolean};
  const map = createRef<TileMap>(), title = createRef<Cond>(), sub = createRef<Node>(), strike = createRef<Rect>(), word = createRef<Txt>();
  view.add(<Frame>
    <TileMap ref={map} zoom={0.8} sy={500} reveal={p.small ? 1 : 0} lit={p.small ? 0.5 : 1} hollows={0} dim={brand.ground} opacity={p.small ? 0.5 : 1}/>
    {fadeTop(300, 160)}
    <Node ref={sub} x={640} y={p.small ? 150 : 218} opacity={0}>
      {p.struck
        ? <Rect layout gap={14} alignItems="baseline">
            <Txt text={p.sub ?? ''} fontFamily={brand.serif} fontStyle="italic" fontSize={34} fill={brand.soft}/>
            <Rect>
              <Txt ref={word} text={p.struck} fontFamily={brand.serif} fontStyle="italic" fontSize={34} fill={brand.soft}/>
              <Rect ref={strike} layout={false} x={0} y={4} width={0} height={3} fill={brand.ivory}/>
            </Rect>
          </Rect>
        : <Txt text={p.sub ?? ''} fontFamily={brand.mono} fontSize={18} fill={brand.soft}/>}
    </Node>
    <Cond ref={title} text={p.text ?? brand.name} x={640} y={p.small ? 250 : 312} fontSize={p.small ? 64 : 136} lineHeight="92%" shadowColor="rgba(242,237,228,0.18)" shadowBlur={40}
      fill={brand.ivory} opacity={0} scale={0.97}/>
  </Frame>);
  if (p.small) { yield* all(title().opacity(1, 0.5), title().scale(1, 0.6, easeOutCubic), sub().opacity(1, 0.6)); return yield* hold(ctx); }
  yield* sequence(0.35,
    all(sub().opacity(1, 0.4), map().reveal(1, 2.4, easeInOutCubic)),
    strike().width(word().width() + 8, 0.35, easeOutCubic),
    all(title().opacity(1, 0.4), title().scale(1, 0.7, easeOutCubic)),
  );
};
