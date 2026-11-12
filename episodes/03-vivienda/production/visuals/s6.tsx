// S6–S9 · K09 giro, K10 topes, K11 pública, K12 volver, K13 cierre.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, sequence} from '@motion-canvas/core';
import {Cond, Frame, makeR4, Pill, QUESTIONS, R1Chip, Serif} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {CATALUNA, CITY, inPolygon, TileMap} from '../world';
import {brand, Grid, Label, Para, rgba, show, TL, until} from './ui';

const T = brand.data.terminadas, H = brand.data.hogares, V = brand.data.vacias, U = brand.data.turisticos;
const Small = (p: {x: number; y: number; text: string; fill?: string}) =>
  <Txt offset={TL} x={p.x} y={p.y} text={p.text} fontFamily={brand.mono} fontSize={12} letterSpacing={1} fill={p.fill ?? brand.muted}/>;

/** K09: tourist flats are small nationally and huge in a few centres. */
export const giro: Visual = function* (view, ctx) {
  const map = createRef<TileMap>(), head = createRef<Node>(), r4box = createRef<Node>(), madrid = createRef<Node>();
  const lens = createRef<Node>(), share = createSignal(11), big = createRef<Cond>(), list = createRef<Node>(), note = createRef<Txt>();
  const r4 = makeR4({x: 64, y: 596, width: 520, height: 30, color: U});
  view.add(<Frame>
    <TileMap ref={map} cx={520} cy={328} sx={300} sy={414} zoom={0.5} tilt={56} turn={-6} persp={900} vx={384} vy={0} tourists={1} hollows={0}/>
  </Frame>);
  const m = map().project(...CITY.malaga), md = map().project(...CITY.madrid);
  view.add(<Frame>
    <Node ref={head} opacity={0}>
      <Cond offset={TL} x={64} y={72} text="1,28%" fontSize={84} fill={U}/>
      <Label x={68} y={154} text="341.001 anuncios · mayo 2026 · de las viviendas" fontSize={18} fill={brand.text}/>
      <Small x={68} y={182} text="EL INE CUENTA ANUNCIOS, NO PISOS"/>
    </Node>
    <Node ref={r4box} opacity={0}>
      {r4.node}
      <Small x={64} y={572} text="≤45% DEL DÉFICIT · UNA SOLA VEZ · COMO MÁXIMO" fill={brand.soft}/>
    </Node>
    <Node ref={madrid} opacity={0}>
      <Circle x={md.x} y={md.y} size={28} stroke={brand.ivory} lineWidth={1.5} lineDash={[4, 3]}/>
      <Cond offset={[-1, 1]} x={md.x + 18} y={md.y - 12} text="Madrid · 0,45%" fontSize={26} fill={brand.ivory}/>
    </Node>
    <Node ref={lens} opacity={0}>
      <Line points={[[m.x, m.y], [640, 96], [640, 516]]} closed fill={rgba(U, 0.08)} stroke={rgba(U, 0.35)} lineWidth={1}/>
      <Circle x={m.x} y={m.y} size={20} stroke={U} lineWidth={2}/>
      <Rect x={640} y={96} offset={TL} width={420} height={420} radius={14} fill={brand.panelDeep} stroke={brand.edge} lineWidth={1.5}/>
      <Grid x={650} y={106} count={100} cols={10} step={40} tile={34} radius={3} fill={brand.tile} paint={i => (i < share() ? U : null)}/>
      <Small x={1082} y={86} text="DEL ALQUILER"/>
      <Cond ref={big} offset={TL} x={1082} y={110} text="10,8%" fontSize={72} fill={U}/>
      <Txt offset={TL} x={1082} y={186} text="España" fontFamily={brand.sans} fontSize={16} fill={brand.soft}/>
    </Node>
    <Node ref={list} opacity={0}>
      {['CENTROS', 'Sevilla · 44,9%', 'Barcelona · 22,2%', '', 'España · 10,8%'].map((t, i) =>
        <Label x={1082} y={300 + i * 28} text={t} fontSize={i ? 18 : 12} fill={i ? brand.text : brand.muted}/>)}
    </Node>
    <Txt ref={note} offset={TL} x={640} y={530} width={600} textWrap fontFamily={brand.sans} fontSize={18} fill={brand.text} opacity={0}
      text="Para la cuenta nacional: una vez, como máximo. Para un barrio: quizá lo que más importa."/>
  </Frame>);
  yield* until(ctx, 'anuncios');
  yield* show(head());
  yield* until(ctx, 'deficit');
  yield* all(show(r4box()), r4.fillTo(341_001));
  yield* until(ctx, 'madrid');
  yield* show(madrid());
  yield* until(ctx, 'alquiler');
  yield* all(madrid().opacity(0, 0.4), show(lens(), 0.6));
  yield* until(ctx, 'malaga');
  big().text('44,6%');
  yield* share(45, 1, easeInOutCubic);
  yield* until(ctx, 'bcn');
  yield* show(list());
  yield* until(ctx, 'dos');
  yield* show(note());
};

/** K10: tensioned zones exist where regions asked for them; Madrid has none. */
export const topes: Visual = function* (view, ctx) {
  const lock = createSignal(0), bars = createRef<Node>(), zero = createRef<Node>();
  const rows: [string, number][] = [['Cataluña', 271], ['Navarra', 21], ['País Vasco', 18], ['Asturias', 5], ['Galicia', 2], ['Madrid', 0]];
  const NAV: [number, number][] = [[560, 70], [640, 80], [660, 160], [590, 190], [560, 130]];
  const PV: [number, number][] = [[480, 60], [560, 70], [560, 120], [490, 115]];
  const lit = (u: number, v: number) => inPolygon(CATALUNA, u, v) || inPolygon(NAV, u, v) || inPolygon(PV, u, v);
  const map = createRef<TileMap>();
  view.add(<Frame>
    <TileMap ref={map} cx={0} cy={0} sx={40} sy={70} zoom={0.673} tilt={0} turn={0} persp={100000} vx={640} vy={360} hollows={0} lit={0.25}
      paint={t => (lock() > 0 && lit(t.u, t.v) ? rgba(brand.ivory, 0.25 + 0.6 * lock()) : null)}/>
  </Frame>);
  const dot = (u: number, v: number) => { const p = map().project(u, v); return <Circle x={p.x} y={p.y} size={12} fill={brand.ivory} opacity={lock}/>; };
  const md = map().project(...CITY.madrid);
  view.add(<Frame>
    {dot(250, 70)}{dot(...CITY.coruna)}
    <Node ref={zero} opacity={0}>
      <Circle x={md.x} y={md.y} size={64} stroke={brand.ivory} lineWidth={2} lineDash={[6, 4]}/>
      <Cond x={md.x} y={md.y} text="0" fontSize={34} fill={brand.ivory}/>
    </Node>
    <Node ref={bars} opacity={0}>
      <Cond offset={TL} x={790} y={96} text="317" fontSize={84} fill={brand.ivory}/>
      <Label x={794} y={180} text="municipios con zona tensionada · septiembre" fontSize={18} fill={brand.text}/>
      {rows.map(([name, n], i) => <Node>
        <Label x={790} y={232 + i * 44} text={name} fontSize={17}/>
        <Rect x={910} y={232 + i * 44} offset={TL} width={Math.max(2, (n / 271) * 280)} height={20} radius={3} fill={n ? brand.ivory : brand.edge}/>
        <Cond offset={TL} x={920 + (n / 271) * 280} y={230 + i * 44} text={String(n)} fontSize={22} fill={brand.soft}/>
      </Node>)}
    </Node>
  </Frame>);
  yield* until(ctx, 'total');
  yield* all(show(bars()), lock(0.5, 0.8));
  yield* until(ctx, 'cat');
  yield* lock(1, 0.6);
  yield* until(ctx, 'madrid');
  yield* show(zero());
};

/** K11: the public stock, how far the target is, and how long it takes. */
export const publica: Visual = function* (view, ctx) {
  const W = 560, X = (pct: number) => (pct / 8) * W;
  const es = createRef<Rect>(), avg = createRef<Node>(), goal = createRef<Node>(), gov = createRef<Node>(), top = createRef<Node>();
  const pace = createRef<Node>(), slow = createRef<Rect>(), fast = createRef<Rect>(), slowL = createRef<Node>(), fastL = createRef<Node>(), where = createRef<Txt>();
  view.add(<Frame>
    <Node ref={top}>
      <Small x={72} y={96} text="PARQUE PÚBLICO · % DE LAS VIVIENDAS PRINCIPALES"/>
      <Label x={72} y={134} text="España" fill={brand.text}/>
      <Rect ref={es} x={200} y={130} offset={TL} width={0} height={28} radius={3} fill={brand.ivory}/>
      <Cond offset={TL} x={210 + X(1.5)} y={128} text="1,5%" fontSize={32} fill={brand.ivory}/>
      <Node ref={avg} opacity={0}>
        <Label x={72} y={184} text="Media de referencia" fill={brand.text}/>
        <Rect x={200} y={180} offset={TL} width={X(7)} height={28} radius={3} stroke={brand.ivory} lineWidth={1.5} lineDash={[6, 4]}/>
        <Cond offset={TL} x={210 + X(7)} y={178} text="~7%" fontSize={32} fill={brand.ivory}/>
      </Node>
      <Node ref={gov} opacity={0}>
        <Rect x={200 + X(1.5)} y={130} offset={TL} width={X(0.9)} height={28} fill={rgba(brand.ivory, 0.3)}/>
        <Txt offset={TL} x={200} y={232} text="+184.000 anunciadas en 2023 → ~2,4%, si todas fueran nuevas" fontFamily={brand.sans} fontSize={17} fill={brand.soft}/>
      </Node>
      <Node ref={goal} opacity={0}>
        <Txt offset={TL} x={860} y={130} text="Llegar ahí" fontFamily={brand.sans} fontSize={18} fill={brand.soft}/>
        <Cond offset={TL} x={860} y={156} text="1,1 millones" fontSize={56} fill={brand.ivory}/>
        <Pill mark="nuestra" x={860} y={222} offset={TL}/>
      </Node>
    </Node>
    <Node ref={pace} opacity={0}>
      <Small x={72} y={300} text="VIVIENDAS PROTEGIDAS TERMINADAS · RITMO HASTA LA MEDIA"/>
      <Label x={72} y={340} text="11.000 al año · 2025" fill={brand.text}/>
      <Rect x={72} y={370} offset={TL} width={1136} height={20} radius={3} stroke={brand.edge} lineWidth={1}/>
      <Rect ref={slow} x={72} y={370} offset={TL} width={0} height={20} radius={3} fill={rgba(T, 0.6)}/>
      <Node ref={slowL} opacity={0}><Cond offset={[1, -1]} x={1208} y={330} text="~100 años · 2126" fontSize={30} fill={T}/></Node>
      <Label x={72} y={420} text="62.000 al año · años noventa" fill={brand.text}/>
      <Rect x={72} y={450} offset={TL} width={1136} height={20} radius={3} stroke={brand.edge} lineWidth={1}/>
      <Rect ref={fast} x={72} y={450} offset={TL} width={0} height={20} radius={3} fill={T}/>
      <Node ref={fastL} opacity={0}><Cond offset={TL} x={72 + 1136 * 0.18 + 12} y={448} text="~18 años" fontSize={30} fill={T}/></Node>
      <Small x={72} y={490} text="SI FUERAN TODAS PÚBLICAS Y NO SE VENDIERAN · ESCALA: 100 AÑOS"/>
    </Node>
    <Para ref={where} x={72} y={540} width={1100} fontSize={20} fill={brand.text} opacity={0}
      text="Sareb: 40.000 viviendas y suelo para 55.000. Cuántas caen donde más hacen falta: no lo sabemos."/>
  </Frame>);
  yield* until(ctx, 'espana');
  yield* es().width(X(1.5), 0.6, easeOutCubic);
  yield* until(ctx, 'media');
  yield* show(avg());
  yield* until(ctx, 'millon');
  yield* show(goal());
  yield* until(ctx, 'gob');
  yield* show(gov());
  yield* until(ctx, 'once');
  yield* all(top().opacity(0.35, 0.5), show(pace()));
  yield* until(ctx, 'siglo');
  yield* all(slow().width(1136, 2.4, easeInOutCubic), slowL().opacity(1, 0.6));
  yield* until(ctx, 'dieciocho');
  yield* all(fast().width(1136 * 0.18, 0.8, easeOutCubic), fastL().opacity(1, 0.6));
  if ('donde' in ctx.beat.cues) { yield* until(ctx, 'donde'); yield* show(where()); }
};

/** K12: where the other households went: mostly into homes that already existed. */
export const volver: Visual = function* (view, ctx) {
  const home = createRef<Circle>(), newT = [0, 1, 2, 3].map(() => createRef<Rect>()), oldT = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const ribbons = [...newT, ...oldT].map(() => createRef<Line>()), lab = createRef<Node>(), usen = createRef<Txt>(), part1 = createRef<Node>();
  const mad = createRef<Node>(), zam = createRef<Node>();
  const tx = (i: number) => (i < 4 ? 172 + 72 * i : 688 + 72 * (i - 4));
  view.add(<Frame>
    <Node ref={part1}>
      <Circle ref={home} x={640} y={110} size={30} fill={H} shadowColor={H} shadowBlur={24}/>
      {ribbons.map((r, i) => <Line ref={r} points={[[640, 124], [640, 200], [tx(i) + 28, 220], [tx(i) + 28, 300]]} radius={40}
        stroke={i < 4 ? T : V} lineWidth={2} opacity={0.7} end={0}/>)}
      {newT.map((r, i) => <Rect ref={r} x={tx(i)} y={300} offset={TL} width={56} height={56} radius={4} fill="#14231F" stroke={T} lineWidth={1.5}/>)}
      {oldT.map((r, i) => <Rect ref={r} x={tx(i + 4)} y={300} offset={TL} width={56} height={56} radius={4} fill={brand.panelDeep} stroke={V} lineWidth={1.5}/>)}
      <Node ref={lab} opacity={0}>
        <Cond offset={TL} x={172} y={376} text="~40%" fontSize={48} fill={T}/>
        <Label x={174} y={430} text="obra nueva" fontSize={18}/>
        <Cond offset={TL} x={688} y={376} text="≥60%" fontSize={48} fill={brand.ivory}/>
        <Label x={690} y={430} text="viviendas que ya existían y tenían otro uso" fontSize={18}/>
      </Node>
      <Serif ref={usen} offset={TL} x={172} y={490} fontSize={40} text="Parte de «que se usen» podría estar pasando ya." opacity={0}/>
    </Node>
    {([['Madrid', '9,9%', 10, 160, mad], ['Zamora', '50,5%', 50, 700, zam]] as const).map(([name, label, n, x, ref]) =>
      <Node ref={ref} opacity={0}>
        <Grid x={x} y={170} count={100} cols={10} step={34} tile={28} radius={3} paint={i => (i < n ? brand.night : null)} fill={rgba(H, 0.45)}/>
        <Grid x={x} y={170} count={n} cols={10} step={34} tile={28} radius={3} fill={brand.night} stroke={V}/>
        <Cond offset={TL} x={x + 360} y={170} text={label} fontSize={72} fill={brand.ivory}/>
        <Label x={x + 364} y={250} text={name} fontSize={20} fill={brand.text}/>
        <Label x={x + 364} y={280} text="sin uso residencial" fontSize={16} width={150} textWrap/>
      </Node>)}
  </Frame>);
  yield* sequence(0.08, ...ribbons.map(r => r().end(1, 0.8, easeInOutCubic)));
  yield* until(ctx, 'sesenta');
  yield* all(show(lab()), ...oldT.map(t => t().fill(rgba(H, 0.3), 0.8)));
  yield* until(ctx, 'usen');
  yield* show(usen(), 0.6);
  yield* until(ctx, 'madrid');
  yield* all(part1().opacity(0, 0.5), show(mad()));
  yield* until(ctx, 'zamora');
  yield* show(zam());
};

/** K13: the closing table, then the four questions at full size. */
export const cierre: Visual = function* (view, ctx) {
  const rows: [string, string, string, string, number?][] = [
    ['Construir', '[decidir] · pulsos /año', 'cada año', '[decidir]'],
    ['Vacías', '≤54%', 'una vez', '[decidir]', 0.54],
    ['Turísticos', '≤45%', 'una vez', 'un barrio: centros de Málaga, Sevilla', 0.45],
    ['Topes', '[decidir]', '[decidir]', '[decidir]'],
    ['Extranjeros', '[decidir]', '[decidir]', '[decidir]'],
    ['Vivienda pública', '[decidir]', '[decidir]', '[decidir]'],
  ];
  const cols = [72, 330, 640, 820], head = createRef<Txt>(), table = createRef<Node>(), r1 = createRef<Node>();
  const rowRefs = rows.map(() => createRef<Node>()), chips = QUESTIONS.map(() => createRef<Node>());
  const ink = (s: string) => (s.startsWith('[') ? brand.faint : brand.text);
  view.add(<Frame>
    <Serif ref={head} offset={TL} x={72} y={64} fontSize={44} text="Ninguna cierra la cuenta sola. Ninguna es inútil." opacity={0}/>
    <Node ref={table}>
      {['FRASE', 'FRENTE AL DÉFICIT (R4)', 'CUENTA', 'DÓNDE IMPORTA'].map((t, i) => <Small x={cols[i]} y={140} text={t}/>)}
      <Rect x={72} y={162} offset={TL} width={1136} height={1} fill={brand.rule}/>
      {rows.map(([name, r4, cuenta, donde, share], i) => <Node ref={rowRefs[i]} opacity={0}>
        <Serif offset={TL} x={cols[0]} y={176 + i * 52} text={name} fontSize={26}/>
        {share !== undefined && <Rect x={cols[1]} y={182 + i * 52} offset={TL} width={180} height={18} radius={3} stroke={brand.ivory} lineWidth={1}>
          <Rect x={-90} offset={[-1, 0]} width={180 * share} height={18} fill={i === 1 ? V : U}/>
        </Rect>}
        <Txt offset={TL} x={cols[1] + (share !== undefined ? 192 : 0)} y={182 + i * 52} text={r4} fontFamily={brand.sans} fontSize={16} fill={ink(r4)}/>
        <Txt offset={TL} x={cols[2]} y={182 + i * 52} text={cuenta} fontFamily={brand.sans} fontSize={16} fill={ink(cuenta)}/>
        <Txt offset={TL} x={cols[3]} y={182 + i * 52} text={donde} fontFamily={brand.sans} fontSize={16} fill={ink(donde)}/>
        <Rect x={72} y={216 + i * 52} offset={TL} width={1136} height={1} fill={rgba(brand.rule, 0.6)}/>
      </Node>)}
    </Node>
    <Node ref={r1}>
      {QUESTIONS.map((_, i) => <Node ref={chips[i]} opacity={0}>
        <R1Chip q={i} state="p" focus x={72 + 140 + i * 288} y={540} width={276} height={52} fontSize={26}/>
      </Node>)}
    </Node>
  </Frame>);
  yield* show(head(), 0.6);
  yield* sequence(0.15, ...rowRefs.map(r => r().opacity(1, 0.4)));
  yield* until(ctx, 'vota');
  yield* table().opacity(0.3, 0.6);
  for (let i = 0; i < 4; i++) { yield* until(ctx, `q${i}`); yield* show(chips[i](), 0.4, 6); }
};
