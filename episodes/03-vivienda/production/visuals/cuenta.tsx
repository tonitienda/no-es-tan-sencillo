// S2 · K03 la cuenta, K04 la cola, K05 las cuatro preguntas.
import {Circle, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {Cond, Frame, QUESTIONS} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {brand, Grid, Label, Plane, rgba, show, TL, until} from './ui';

const H = brand.data.hogares, T = brand.data.terminadas;

/** K03: 26,6 M dwellings against 18,5 M households, one tile = 100.000. */
export const cuenta: Visual = function* (view, ctx) {
  const viv = createRef<Grid>(), hog = createRef<Grid>(), vivL = createRef<Node>(), hogL = createRef<Node>(), ratio = createRef<Node>(), note = createRef<Txt>();
  view.add(<Frame>
    <Plane top={560} alpha={0.35}/>
    <Grid ref={viv} x={160} y={600} count={266} cols={19} step={22} tile={18} fill={brand.tile} fromBottom/>
    <Grid ref={hog} x={710} y={600} count={185} cols={19} step={22} tile={18} fill={H} glow={rgba(H, 0.6)} fromBottom/>
    <Node ref={vivL} opacity={0}>
      <Cond offset={TL} x={160} y={196} text="26,6 M" fontSize={64} fill={brand.ivory}/>
      <Label x={162} y={262} text="viviendas" fontSize={20}/>
    </Node>
    <Node ref={hogL} opacity={0}>
      <Cond offset={TL} x={710} y={286} text="18,5 M" fontSize={64} fill={H}/>
      <Label x={712} y={352} text="hogares" fontSize={20}/>
    </Node>
    <Node ref={ratio} opacity={0}>
      <Cond offset={TL} x={160} y={64} text="1,44" fontSize={92} fill={brand.ivory}/>
      <Label x={330} y={98} text="viviendas por hogar" fontSize={22} fill={brand.text}/>
    </Node>
    <Txt ref={note} offset={TL} x={160} y={616} text="Cada baldosa: 100.000. Eje desde cero." fontFamily={brand.mono} fontSize={13} fill={brand.muted} opacity={0}/>
  </Frame>);
  viv().shown(0); hog().shown(0);
  yield* until(ctx, 'viviendas');
  yield* all(viv().shown(1, 1.6, easeInOutCubic), show(vivL()), note().opacity(1, 0.6));
  yield* until(ctx, 'hogares');
  yield* all(hog().shown(1, 1.4, easeInOutCubic), show(hogL()));
  yield* until(ctx, 'ratio');
  yield* show(ratio(), 0.6);
};

/** K04: 240.000 new households a year, 92.000 finished dwellings; the rest float. */
export const cola: Visual = function* (view, ctx) {
  const homes = Array.from({length: 9}, (_, i) => [168 + 72 * i, 548]);
  const floats = [[850, 470], [892, 440], [934, 414], [976, 392], [1018, 374], [1060, 360], [1102, 350], [1144, 344],
    [872, 404], [916, 370], [962, 344], [1008, 326], [1054, 312], [1100, 302], [1146, 296]];
  const lights = [...homes, ...floats].map(() => createRef<Circle>()), tiles = homes.map(() => createRef<Rect>());
  const hogL = createRef<Node>(), terL = createRef<Node>(), where = createRef<Txt>(), sliver = createRef<Rect>();
  view.add(<Frame>
    <Plane top={600} alpha={0.3}/>
    {homes.map(([x], i) => <Rect ref={tiles[i]} x={x - 28} y={520} offset={TL} width={56} height={56} radius={4} fill="#14231F" stroke={T} lineWidth={1.5} end={0}/>)}
    <Rect ref={sliver} x={788} y={520} offset={TL} width={0} height={56} radius={2} fill="#14231F" stroke={T} lineWidth={1.5}/>
    {lights.map((r, i) => <Circle ref={r} size={24} fill={H} shadowColor={H} shadowBlur={18} opacity={0}
      x={980 + ((i * 37) % 160) - 80} y={200 + ((i * 53) % 120)}/>)}
    <Node ref={hogL} opacity={0}>
      <Cond offset={TL} x={140} y={96} text="240.000" fontSize={72} fill={H}/>
      <Label x={142} y={170} text="hogares nuevos al año" fontSize={20}/>
    </Node>
    <Node ref={terL} opacity={0}>
      <Cond offset={TL} x={140} y={214} text="92.000" fontSize={72} fill={T}/>
      <Label x={142} y={288} text="viviendas terminadas al año" fontSize={20}/>
    </Node>
    <Txt ref={where} offset={[1, -1]} x={1170} y={150} text="¿Dónde vive?" fontFamily={brand.serif} fontStyle="italic" fontSize={64} fill={brand.text} opacity={0}/>
    <Txt offset={TL} x={140} y={604} text="Cada luz y cada baldosa: 10.000." fontFamily={brand.mono} fontSize={13} fill={brand.muted}/>
  </Frame>);
  yield* until(ctx, 'hogares');
  yield* all(show(hogL()), sequence(0.04, ...lights.map(l => l().opacity(1, 0.4))));
  yield* until(ctx, 'terminadas');
  yield* all(show(terL()), sequence(0.12, ...tiles.map(t => t().end(1, 0.5))), sliver().width(14, 0.5));
  // Terminated tiles are drawn edge to edge, then inhabited.
  yield* all(...lights.map((l, i) => {
    const [x, y] = i < 9 ? homes[i] : floats[i - 9];
    return l().position([x, y], 1.2, easeInOutCubic);
  }), ...tiles.map(t => t().fill(rgba(H, 0.25), 1.2)));
  yield* until(ctx, 'resto');
  yield* all(...lights.slice(9).map((l, i) => l().opacity(0.55 + 0.45 * ((i % 3) / 2), 0.8)));
  yield* until(ctx, 'donde');
  yield* show(where(), 0.6);
};

/** K05: the four questions, full size, lit one by one; then they dock in the HUD. */
export const preguntas: Visual = function* (view, ctx) {
  const blocks = QUESTIONS.map(() => createRef<Rect>()), words = QUESTIONS.map(() => createRef<Txt>()), labels = QUESTIONS.map(() => createRef<Cond>());
  const head = createRef<Txt>();
  view.add(<Frame>
    <Plane top={470} alpha={0.35}/>
    <Txt ref={head} offset={TL} x={118} y={96} text="Las mismas cuatro, para cada frase." fontFamily={brand.serif} fontStyle="italic" fontSize={40} fill={brand.text} opacity={0}/>
    {QUESTIONS.map((_, i) => <Rect x={1280 - 40 - 92 * (3.5 - i) - 6 * (3 - i)} y={43} width={92} height={30} radius={6} stroke={brand.edge} lineWidth={1.5} lineDash={[4, 3]}/>)}
    {QUESTIONS.map((q, i) => <Rect ref={blocks[i]} x={118 + 120 + i * 268} y={325} width={240} height={310} radius={14}
      fill={brand.panelDeep} stroke={brand.edge} lineWidth={1.5} opacity={0}>
      <Cond ref={labels[i]} text={q} fontSize={36} fontWeight={800} fill={brand.muted} y={-10}/>
      <Txt ref={words[i]} text="pendiente" fontFamily={brand.mono} fontSize={16} fill={brand.muted} y={40}/>
    </Rect>)}
  </Frame>);
  yield* all(...blocks.map(b => b().opacity(1, 0.6)));
  for (let i = 0; i < 4; i++) {
    yield* until(ctx, `q${i}`);
    yield* all(blocks[i]().stroke(brand.ivory, 0.3), blocks[i]().shadowColor(rgba(brand.ivory, 0.35), 0.3), blocks[i]().shadowBlur(24, 0.3),
      labels[i]().fill(brand.ivory, 0.3), words[i]().fill(brand.soft, 0.3));
  }
  yield* show(head());
  // Dock: the same four chips, same size, now in the HUD.
  const dock = ctx.remaining() - 1.4;
  if (dock > 0) yield* waitFor(dock);
  yield* all(head().opacity(0, 0.4), ...blocks.map((b, i) => all(
    b().position([1280 - 40 - 92 * (3.5 - i) - 6 * (3 - i), 43], 1.1, easeInOutCubic), b().size([92, 30], 1.1, easeInOutCubic),
    b().radius(6, 1.1), b().shadowBlur(0, 1.1), labels[i]().fontSize(13, 1.1, easeInOutCubic), labels[i]().y(0, 1.1),
    words[i]().opacity(0, 0.3), b().stroke(brand.edge, 1.1), labels[i]().fill(brand.muted, 1.1, easeOutCubic))));
};
