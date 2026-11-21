// S1 seis opciones, preguntas · S2 la provincia, D'Hondt con cinco escaños.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {Frame} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {answerCell, appear, Big, brand, Coin, dealSeats, dhondtOrder, Envelope, Hemi, LINE3, makeColumns, NULLC, OPTIONS, pop,
  rgba, ROWS, SEAT, Tag, TL, TONES, until, VOTE, type Answer} from './lib';

// ── The six options as icons (used again in the closing table) ──────────────
export function OptionIcon({i, ...props}: {i: number} & Record<string, unknown>) {
  switch (i) {
    case 0: return <Node {...props}><Rect y={22} offset={[0, 1]} width={30} height={56} radius={[3, 3, 0, 0]} fill={SEAT}/><Circle x={34} y={-14} size={20} fill={SEAT}/></Node>;
    case 1: return <Node {...props}><Rect y={22} offset={[0, 1]} width={30} height={26} radius={[3, 3, 0, 0]} fill={TONES[4]}/><Circle x={34} y={-14} size={20} stroke={brand.faint} lineWidth={2}/></Node>;
    case 2: return <Envelope kind="null" scale={0.62} {...props}/>;
    case 3: return <Envelope kind="blank" scale={0.62} {...props}/>;
    case 4: return <Node {...props}><Circle size={44} stroke={SEAT} lineWidth={2.5} lineDash={[6, 5]}/><Rect y={-2} width={30} height={20} radius={2} fill={brand.panel} stroke={SEAT} lineWidth={1.5}/></Node>;
    default: return <Node {...props}>
      <Line points={[[-30, 4], [0, -24], [30, 4]]} stroke={brand.soft} lineWidth={3} lineJoin="round"/>
      <Rect y={18} width={44} height={30} stroke={brand.soft} lineWidth={3}/>
      <Envelope kind="vote" scale={0.28} y={20}/>
    </Node>;
  }
}
const SHORT = ['Con escaño', 'Sin escaño', 'Nulo', 'Blanco', 'Escaños\nen Blanco', 'No ir'];
const slotX = (i: number) => 165 + i * 190;

/** S1: one envelope, six ways out. */
export const opciones: Visual = function* (view, ctx) {
  const env = createRef<Node>(), slots = OPTIONS.map(() => createRef<Node>()), paths = OPTIONS.map(() => createRef<Line>());
  const icons = OPTIONS.map(() => createRef<Node>()), lost = createRef<Node>();
  view.add(<Frame>
    {OPTIONS.map((_, i) => <Line ref={paths[i]} points={[[640, 250], [640, 330], [slotX(i), 380], [slotX(i), 430]]} radius={60}
      stroke={rgba(VOTE, 0.5)} lineWidth={2} end={0}/>)}
    <Envelope ref={env} kind="vote" x={640} y={210} scale={1.5} opacity={0}/>
    {OPTIONS.map((_, i) => <Node ref={slots[i]} x={slotX(i)} y={500} opacity={0}>
      <Node ref={icons[i]}><OptionIcon i={i}/></Node>
      <Txt y={78} text={SHORT[i]} fontFamily={brand.sans} fontSize={22} fill={brand.text} textAlign="center"/>
    </Node>)}
    <Node ref={lost} opacity={0}>
      <Line points={[[slotX(1) - 70, 610], [slotX(5) + 70, 610]]} stroke={NULLC} lineWidth={2}/>
      <Txt x={(slotX(1) + slotX(5)) / 2} y={642} text="¿un voto perdido?" fontFamily={brand.serif} fontStyle="italic" fontSize={34} fill={brand.soft}/>
    </Node>
  </Frame>);
  yield* pop(env(), 0.6);
  for (let i = 0; i < 6; i++) {
    yield* until(ctx, `o${i + 1}`);
    yield* all(paths[i]().end(1, 0.5, easeInOutCubic), appear(slots[i](), 0.5));
  }
  yield* until(ctx, 'perdido');
  yield* all(appear(lost()), ...icons.slice(1).map(n => n().opacity(0.3, 0.6)), ...paths.slice(1).map(p => p().stroke(rgba(NULLC, 0.4), 0.6)));
  yield* until(ctx, 'distinto');
  yield* all(lost().opacity(0, 0.5), ...icons.map(n => n().opacity(1, 0.6)), ...paths.map(p => p().stroke(rgba(VOTE, 0.5), 0.6)),
    sequence(0.12, ...icons.map(n => all(n().scale(1.18, 0.25), n().scale(1, 0.25)))));
  yield* until(ctx, 'cambia');
  yield* sequence(0.08, ...paths.map(p => all(p().lineWidth(4, 0.3), p().stroke(VOTE, 0.3))));
};

/** S1: the grid every option has to fill. */
export const preguntas: Visual = function* (view, ctx) {
  const rows = ROWS.map(() => createRef<Node>()), head = createRef<Node>();
  const colX = (i: number) => 400 + i * 145, rowY = (r: number) => 250 + r * 105;
  view.add(<Frame>
    <Node ref={head} opacity={0}>
      {OPTIONS.map((_, i) => <OptionIcon i={i} x={colX(i)} y={140} scale={0.8}/>)}
    </Node>
    {ROWS.map((r, k) => <Node ref={rows[k]} opacity={0}>
      <Rect x={60} y={rowY(k) - 42} offset={TL} width={1160} height={84} radius={10} fill={brand.panelDeep}/>
      <Node x={110} y={rowY(k)}>{rowIcon(k)}</Node>
      <Txt offset={[-1, 0]} x={160} y={rowY(k)} text={r} fontFamily={brand.sans} fontSize={22} fill={brand.text}/>
      {OPTIONS.map((_, i) => <Node x={colX(i)} y={rowY(k)}>{answerCell('', 30)}</Node>)}
    </Node>)}
  </Frame>);
  yield* appear(head(), 0.6);
  for (let k = 0; k < 4; k++) {
    yield* until(ctx, `q${k + 1}`);
    yield* appear(rows[k](), 0.45, 16);
  }
};

/** Small icon for each question row: seat, 3% line, coin, record. */
export function rowIcon(k: number) {
  if (k === 0) return <Circle size={26} fill={SEAT}/>;
  if (k === 1) return <Node><Line points={[[-22, 0], [22, 0]]} stroke={LINE3} lineWidth={3} lineDash={[7, 4]}/><Tag x={0} y={-10} anchor={[0, 1]} text="3%" fill={LINE3} size={13}/></Node>;
  if (k === 2) return <Coin size={34}/>;
  return <Node><Rect width={28} height={34} radius={3} stroke={brand.soft} lineWidth={2}/>
    {[-8, 0, 8].map(y => <Line points={[[-8, y], [8, y]]} stroke={brand.soft} lineWidth={2}/>)}</Node>;
}

// ── S2 ───────────────────────────────────────────────────────────────────────
/** Diputados por circunscripción, RD 806/2026 (anexo), in the decree's order. */
export const SEATS_2026: [string, number][] = [['Albacete', 4], ['Alicante', 12], ['Almería', 6], ['Álava', 4], ['Asturias', 7], ['Ávila', 3],
  ['Badajoz', 5], ['Baleares', 8], ['Barcelona', 32], ['Bizkaia', 8], ['Burgos', 4], ['Cáceres', 4], ['Cádiz', 8], ['Cantabria', 5],
  ['Castellón', 5], ['Ciudad Real', 5], ['Córdoba', 6], ['A Coruña', 8], ['Cuenca', 3], ['Gipuzkoa', 6], ['Girona', 6], ['Granada', 7],
  ['Guadalajara', 3], ['Huelva', 5], ['Huesca', 3], ['Jaén', 5], ['León', 4], ['Lleida', 4], ['Lugo', 4], ['Madrid', 38], ['Málaga', 11],
  ['Murcia', 10], ['Navarra', 5], ['Ourense', 4], ['Palencia', 3], ['Las Palmas', 8], ['Pontevedra', 7], ['La Rioja', 4], ['Salamanca', 4],
  ['S. C. de Tenerife', 7], ['Segovia', 3], ['Sevilla', 12], ['Soria', 2], ['Tarragona', 6], ['Teruel', 3], ['Toledo', 6], ['Valencia', 16],
  ['Valladolid', 5], ['Zamora', 3], ['Zaragoza', 7], ['Ceuta', 1], ['Melilla', 1]];
if (SEATS_2026.reduce((a, [, n]) => a + n, 0) !== 350) throw Error('SEATS_2026 must add up to 350');

/** S2: 350 seats are 52 separate contests. */
export const provincias: Visual = function* (view, ctx) {
  const hemi = createRef<Hemi>(), split = createSignal(0), focus = createSignal(-1), dimOthers = createSignal(0);
  const big = createRef<Node>(), fiftyTwo = createRef<Node>(), soria = createRef<Node>(), madrid = createRef<Node>();
  const prov: number[] = [];
  SEATS_2026.forEach(([, n], p) => { for (let k = 0; k < n; k++) prov.push(p); });
  const SORIA = SEATS_2026.findIndex(([n]) => n === 'Soria'), MADRID = SEATS_2026.findIndex(([n]) => n === 'Madrid');
  view.add(<Frame>
    <Hemi ref={hemi} seats={350} radius={360} inner={150} x={640} y={600}/>
    <Node ref={big} opacity={0}><Big x={640} y={540} anchor={[0, 1]} text="350" size={110}/><Tag x={640} y={560} anchor={[0, -1]} text="ESCAÑOS" /></Node>
    <Node ref={fiftyTwo} opacity={0}><Big x={640} y={540} anchor={[0, 1]} text="52" size={110} fill={VOTE}/><Tag x={640} y={560} anchor={[0, -1]} text="REPARTOS SEPARADOS" fill={VOTE}/></Node>
    <Node ref={soria} opacity={0}><Big x={70} y={90} text="Soria" size={44}/><Big x={70} y={140} text="2" size={96} fill={VOTE}/></Node>
    <Node ref={madrid} opacity={0}><Big x={1210} y={90} anchor={[1, -1]} text="Madrid" size={44}/><Big x={1210} y={140} anchor={[1, -1]} text="38" size={96} fill={VOTE}/></Node>
  </Frame>);
  hemi().lit(0);
  hemi().paint = i => {
    const p = prov[i];
    if (focus() >= 0 && (p === focus() || p === SORIA)) return VOTE;
    const base = split() > 0.5 ? (p % 2 ? '#8E98A8' : SEAT) : SEAT;
    return dimOthers() > 0.5 ? rgba(base, 0.25) : base;
  };
  yield* all(hemi().lit(1, 1.6, easeInOutCubic), appear(big()));
  yield* until(ctx, 'sitios');
  split(1);
  yield* all(big().opacity(0, 0.3), appear(fiftyTwo()), hemi().scale(1.03, 0.25).to(1, 0.25));
  yield* until(ctx, 'soria');
  dimOthers(1); focus(SORIA);
  yield* all(fiftyTwo().opacity(0, 0.3), appear(soria()));
  yield* until(ctx, 'madrid');
  focus(MADRID);
  yield* appear(madrid());
};

/** S2: a made-up province with five seats. D has 13% and wins nothing. */
export const cinco: Visual = function* (view, ctx) {
  const parties = [{name: 'A', votes: 70000}, {name: 'B', votes: 60000}, {name: 'C', votes: 34000}, {name: 'D', votes: 26000, tone: VOTE}, {name: 'E', votes: 6000}];
  const cols = makeColumns({x: 80, base: 560, width: 700, height: 400, max: 70000, parties, blank: 4000, showLine: false});
  const hemi = createRef<Hemi>(), owners: number[] = [], liston = createRef<Node>(), d13 = createRef<Node>(), three = createRef<Node>(), tag = createRef<Node>();
  const listonY = 560 - (30000 / 70000) * 400, threeY = 560 - (6000 / 70000) * 400;
  view.add(<Frame>
    <Node ref={tag} opacity={0}><Tag x={80} y={60} text="PROVINCIA INVENTADA · 5 ESCAÑOS" fill={brand.muted}/></Node>
    {cols.node}
    <Hemi ref={hemi} seats={5} radius={140} x={1070} y={300} dot={44}/>
    <Node ref={d13} opacity={0}><Big x={cols.x(3)} y={560 - (26000 / 70000) * 400 - 16} anchor={[0, 1]} text="13%" size={44} fill={VOTE}/></Node>
    <Node ref={liston} opacity={0}>
      <Line points={[[60, listonY], [800, listonY]]} stroke={SEAT} lineWidth={2} lineDash={[10, 6]}/>
      <Tag x={808} y={listonY} anchor={[-1, 0]} text="ÚLTIMO ESCAÑO" fill={SEAT}/>
    </Node>
    <Node ref={three} opacity={0}>
      <Line points={[[60, threeY], [800, threeY]]} stroke={LINE3} lineWidth={3} lineDash={[10, 6]}/>
      <Tag x={808} y={threeY} anchor={[-1, 0]} text="3%" fill={LINE3}/>
    </Node>
  </Frame>);
  hemi().paint = i => owners[i] === undefined ? null : cols.colour(owners[i]);
  yield* appear(tag());
  yield* dealSeats(view.children()[0] as Node, cols, hemi(), owners, dhondtOrder(parties.map(p => p.votes), 5), 0.6);
  yield* until(ctx, 'partidoD');
  yield* pop(d13());
  yield* until(ctx, 'mucho');
  yield* appear(liston(), 0.5, 0);
  yield* until(ctx, 'madrid');
  yield* appear(three(), 0.5, 0);
};
