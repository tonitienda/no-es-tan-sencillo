// S4–S5 · K06 construir, K07 suelo, K08 vacías.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, sequence} from '@motion-canvas/core';
import {Cond, Frame, makeR4, Pill, R2Card} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {CITY, TileMap} from '../world';
import {brand, Label, Para, rgba, show, Stripes, TL, until} from './ui';

const T = brand.data.terminadas, H = brand.data.hogares, V = brand.data.vacias;

/** K06: a million in four years against what Spain actually finishes, 2004–2025. */
export const construir: Visual = function* (view, ctx) {
  // Terminadas, libre + protegida: OVS boletín 2024, tabla 1.2 (2003-2024); 2025, Banco de España, provisional (ledger V8).
  const FIRST = 2003, done = [503_724, 563_923, 591_604, 658_510, 647_179, 632_218, 424_459, 276_883, 179_351, 133_415, 60_289,
    50_428, 49_472, 44_630, 54_274, 64_044, 78_810, 87_504, 94_728, 89_545, 89_320, 100_980, 92_000];
  const BASE = 580, PEAK_H = 376, px = PEAK_H / Math.max(...done), STEP = 42;
  const heights = done.map(v => v * px), bars = done.map(() => createRef<Rect>());
  const lineY = BASE - 250_000 * px, peak = done.indexOf(Math.max(...done));
  // Optional (v2): new-build permits in 2025, 139.016 (V8, Alimarket [S]). Drawn only when the beat has a "visados" cue.
  const hasVisados = 'visados' in ctx.beat.cues, visY = BASE - 139_016 * px, visados = createRef<Node>();
  const card = createRef<Rect>(), promise = createRef<Node>(), times = createRef<Node>(), max = createRef<Node>(), r4box = createRef<Node>(), counter = createRef<Txt>();
  const r4 = makeR4({x: 660, y: 300, width: 540, color: T});
  view.add(<Frame>
    {done.map((_, i) => {
      const x = 140 + STEP * i, last = i === done.length - 1;
      return <Node>
        <Rect ref={bars[i]} x={x} y={BASE} offset={[-1, 1]} width={34} height={0} fill={last ? rgba(T, 0.2) : rgba(T, 0.55)}
          stroke={last ? T : undefined} lineWidth={1.5} lineDash={last ? [4, 3] : undefined}/>
        {[2003, 2006, 2010, 2015, 2020, 2025].includes(FIRST + i) &&
          <Txt x={x + 17} y={598} text={String(FIRST + i)} fontFamily={brand.mono} fontSize={13} fill={brand.muted}/>}
      </Node>;
    })}
    <R2Card ref={card} quote="«Construirá un millón de viviendas en la próxima legislatura»" who="PP · web del partido · 21 oct. 2026" x={660} y={96} width={540} fontSize={30} opacity={0}/>
    <Node ref={promise} opacity={0}>
      <Line points={[[120, lineY], [1130, lineY]]} stroke={brand.ivory} lineWidth={2} lineDash={[8, 6]}/>
      <Label x={560} y={lineY - 33} text="250.000 al año = un millón en cuatro años" fontSize={18} fill={brand.ivory}/>
    </Node>
    <Node ref={times} opacity={0}>
      <Cond offset={[-1, 0]} x={1110} y={490} text="2,7×" fontSize={56} fill={brand.ivory}/>
      <Txt offset={TL} x={1086} y={540} text="provisional" fontFamily={brand.mono} fontSize={12} fill={brand.muted}/>
    </Node>
    <Node ref={max} opacity={0}>
      <Cond offset={TL} x={140 + STEP * peak - 12} y={124} text={done[peak].toLocaleString('es-ES')} fontSize={36} fill={T}/>
      <Label x={140 + STEP * peak - 10} y={162} text={`${FIRST + peak} · el máximo`} fontSize={15}/>
    </Node>
    {hasVisados && <Node ref={visados} opacity={0}>
      <Line points={[[120, visY], [1130, visY]]} stroke={brand.soft} lineWidth={1.5} lineDash={[3, 5]}/>
      <Label x={560} y={visY - 26} text="visados de obra nueva, 2025: ~139.000" fontSize={15} fill={brand.soft}/>
    </Node>}
    <Node ref={r4box} opacity={0}>
      {r4.node}
      <Txt offset={TL} x={660} y={274} text="DÉFICIT · 750.000 · CADA RANURA 10.000" fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={brand.muted}/>
      <Txt ref={counter} offset={TL} x={660} y={344} text="" fontFamily={brand.mono} fontSize={14} fill={T}/>
      <Pill mark="nuestra" x={1200} y={344} offset={[1, -1]}/>
    </Node>
  </Frame>);
  yield* all(sequence(0.04, ...bars.map((b, i) => b().height(heights[i], 0.5, easeOutCubic))));
  yield* until(ctx, 'promesa');
  yield* show(card());
  yield* until(ctx, 'linea');
  yield* show(promise());
  yield* until(ctx, 'veces');
  yield* show(times());
  yield* until(ctx, 'pasado');
  yield* all(...bars.map((b, i) => b().fill(done[i] > 250_000 ? T : rgba(T, i === done.length - 1 ? 0.2 : 0.3), 0.6)));
  yield* until(ctx, 'maximo');
  yield* show(max());
  if (hasVisados) { yield* until(ctx, 'visados'); yield* show(visados()); }
  yield* until(ctx, 'cuenta');
  yield* all(show(r4box()), card().opacity(0.4, 0.5), promise().opacity(0.4, 0.5), times().opacity(0, 0.4),
    ...(hasVisados ? [visados().opacity(0.4, 0.5)] : []));
  yield* until(ctx, 'cien');
  counter().text('+100.000 / año · cuatro años');
  yield* r4.pulse(100_000, 4);
};

/** K07: buildable land exists, but not where the households are. */
export const suelo: Visual = function* (view, ctx) {
  const map = createRef<TileMap>(), spain = createRef<Node>(), six = createRef<Rect>(), sixL = createRef<Node>(), vox = createRef<Rect>();
  const pins = {madrid: createRef<Node>(), sevilla: createRef<Node>(), barcelona: createRef<Node>()};
  view.add(<Frame>
    <TileMap ref={map} cx={520} cy={246} sx={780} sy={456} zoom={1.1} tilt={58} turn={-6} persp={1100} vx={768} vy={72} hollows={0}/>
    <Node ref={spain} opacity={0}>
      <Rect x={56} y={80} offset={TL} width={420} height={210} radius={12} fill={rgba(brand.panel, 0.92)}/>
      <Txt offset={TL} x={80} y={100} text="SUELO QUE LOS PLANES YA PERMITEN" fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={brand.muted}/>
      <Label x={80} y={128} text="España" fill={brand.text}/>
      <Cond offset={[1, -1]} x={452} y={122} text="7 M" fontSize={30} fill={T}/>
      <Rect x={80} y={158} offset={TL} width={372} height={14} radius={3} fill={T}/>
      <Node ref={sixL} opacity={0}>
        <Label x={80} y={192} text="Seis grandes áreas · 36% de los hogares" fill={brand.text} width={280} textWrap/>
        <Cond offset={[1, -1]} x={452} y={192} text="1,1 M" fontSize={30} fill={T}/>
      </Node>
      <Rect x={80} y={250} offset={TL} width={372} height={14} radius={3} stroke={brand.edge} lineWidth={1}/>
      <Rect ref={six} x={80} y={250} offset={TL} width={0} height={14} radius={3} fill={T}/>
    </Node>
    <R2Card ref={vox} quote="Más suelo, más altura y más densidad." who="Vox · programa de 2025" x={56} y={320} width={420} fontSize={28} opacity={0}/>
  </Frame>);
  const pin = (city: keyof typeof pins, value: string, label: string, stem: number, r: number) => {
    const [u, v] = CITY[city], {x, y, k} = map().project(u, v);
    return <Node ref={pins[city]} opacity={0}>
      <Circle x={x} y={y} width={r * 2 * k} height={r * 2 * k * Math.cos((58 * Math.PI) / 180)} stroke={brand.ivory} lineWidth={1.5} lineDash={[5, 4]}/>
      <Line points={[[x, y], [x, y - stem]]} stroke={brand.ivory} lineWidth={1.5}/>
      <Rect layout direction="column" x={city === "barcelona" ? x + 10 : x - 10} y={y - stem} offset={[city === "barcelona" ? 1 : -1, 1]} padding={[8, 12]} radius={8} fill={rgba(brand.panel, 0.95)}>
        <Cond text={value} fontSize={30} fill={T}/>
        <Txt text={label} fontFamily={brand.sans} fontSize={14} fill={brand.soft}/>
      </Rect>
    </Node>;
  };
  view.add(<Frame>
    {pin('madrid', '550.000', 'Madrid · 19% de sus hogares', 120, 74)}
    {pin('sevilla', '163.000', 'Sevilla · 27%', 70, 40)}
    {pin('barcelona', '~120.000', 'Barcelona · 5,9%', 90, 35)}
  </Frame>);
  yield* until(ctx, 'siete');
  yield* show(spain());
  yield* until(ctx, 'seis');
  yield* all(show(sixL()), six().width(372 * 0.157, 0.8, easeOutCubic), pins.madrid().opacity(1, 0.5), pins.sevilla().opacity(1, 0.5));
  if ('bcn' in ctx.beat.cues) { yield* until(ctx, 'bcn'); yield* pins.barcelona().opacity(1, 0.5); }
  yield* until(ctx, 'vox');
  yield* show(vox());
};

/** K08: empty homes exist, but half of them are where few people live. */
export const vacias: Visual = function* (view, ctx) {
  const fig = createRef<Node>(), r4box = createRef<Node>(), def = createRef<Node>(), bars = createRef<Node>(), vac = createRef<Rect>(), pob = createRef<Rect>(), pobL = createRef<Node>();
  const r4 = makeR4({x: 72, y: 250, width: 640, color: V});
  const W = 1000;
  view.add(<Frame>
    <Node ref={fig} opacity={0}>
      <Cond offset={TL} x={72} y={100} text="~403.000" fontSize={96} fill={brand.ivory}/>
      <Label x={76} y={196} text="vacías en ciudades de más de 250.000 habitantes" fontSize={22} fill={brand.text}/>
    </Node>
    <Node ref={r4box} opacity={0}>
      {r4.node}
      <Txt offset={TL} x={72} y={296} text="~54% DEL DÉFICIT · UNA SOLA VEZ · SI TODAS SIRVIERAN" fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={brand.soft}/>
    </Node>
    <Node ref={def} opacity={0}>
      <Rect x={72} y={340} offset={TL} width={1136} height={64} radius={10} stroke={brand.edge} lineWidth={1.5}/>
      <Txt offset={TL} x={92} y={352} text="VACÍA, EN EL CENSO" fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={V}/>
      <Txt offset={TL} x={92} y={374} fontFamily={brand.sans} fontSize={18} fill={brand.text}
        text="Sin contrato de luz o con consumo muy bajo. Puede ser un piso cerrado o una ruina. Censo 2020."/>
    </Node>
    <Node ref={bars} opacity={0}>
      <Txt offset={TL} x={72} y={440} text="MUNICIPIOS DE MENOS DE 10.000 HABITANTES" fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={brand.muted}/>
      <Label x={72} y={474} text="Vacías" fill={brand.text}/>
      <Rect ref={vac} x={180} y={470} offset={TL} width={0} height={28} clip>
        <Stripes width={W * 0.45} height={28} color={V} step={8} line={3}/>
      </Rect>
      <Cond offset={TL} x={190 + W * 0.45} y={468} text="45%" fontSize={32} fill={V}/>
      <Node ref={pobL} opacity={0}>
        <Label x={72} y={522} text="Población" fill={brand.text}/>
        <Rect ref={pob} x={180} y={518} offset={TL} width={0} height={28} fill={H}/>
        <Cond offset={TL} x={190 + W * 0.2} y={516} text="20%" fontSize={32} fill={H}/>
      </Node>
    </Node>
  </Frame>);
  if (ctx.beat.props.defineFirst) {
    yield* until(ctx, 'que'); yield* show(def());
    yield* until(ctx, 'donde'); yield* all(bars().opacity(1, 0.4), vac().width(W * 0.45, 0.8, easeInOutCubic));
    yield* until(ctx, 'pob'); yield* all(pobL().opacity(1, 0.4), pob().width(W * 0.2, 0.8, easeInOutCubic));
    yield* until(ctx, 'ciudades'); yield* all(def().opacity(0.4, 0.5), bars().opacity(0.4, 0.5), show(fig()));
    yield* until(ctx, 'mitad'); yield* all(show(r4box()), r4.fillTo(403_000));
    return;
  }
  yield* until(ctx, 'ciudades');
  yield* show(fig());
  yield* until(ctx, 'mitad');
  yield* all(show(r4box()), r4.fillTo(403_000));
  yield* until(ctx, 'que');
  yield* show(def());
  yield* until(ctx, 'donde');
  yield* all(fig().opacity(0.4, 0.5), r4box().opacity(0.4, 0.5), bars().opacity(1, 0.4), vac().width(W * 0.45, 0.8, easeInOutCubic));
  yield* until(ctx, 'pob');
  yield* all(pobL().opacity(1, 0.4), pob().width(W * 0.2, 0.8, easeInOutCubic));
};
