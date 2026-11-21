// S7 Escaños en Blanco · S8 no ir · S9 la tabla · S10 cierre.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {Frame} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {Grid} from '../../../03-vivienda/production/visuals/ui';
import {CITY, TileMap} from '../../../03-vivienda/production/world';
import {answerCell, appear, Big, BLANKC, brand, Coin, Envelope, fmt, Hemi, LINE3, NULLC, OPTIONS, pop, rgba, ROWS, SEAT, Tag, TL,
  TONES, until, VOTE, type Answer} from './lib';
import {OptionIcon, rowIcon} from './s1';

/** A ballot of the party, with its name, in an envelope. */
function PartyBallot(props: Record<string, unknown>) {
  return <Node {...props}>
    <Rect y={-40} width={150} height={96} radius={4} fill={brand.ivory}>
      <Txt y={-10} text={'ESCAÑOS\nEN BLANCO'} textAlign="center" fontFamily={brand.display} fontWeight={800} fontSize={20} fill={brand.night}/>
    </Rect>
    <Rect width={170} height={110} radius={6} fill={brand.panel} stroke={brand.edge} lineWidth={2}/>
    <Line points={[[-80, -50], [0, 10], [80, -50]]} stroke={brand.edge} lineWidth={2}/>
  </Node>;
}

/** Approximate map positions (map space of the vivienda tile map). */
const EB_2026: [string, [number, number]][] = [['Pontevedra', [75, 185]], ['León', [290, 160]], ['Palencia', [380, 200]], ['Valladolid', [360, 268]],
  ['Álava', [545, 110]], ['Gipuzkoa', [592, 84]], ['La Rioja', [575, 150]], ['Soria', [575, 215]], ['Córdoba', [370, 592]],
  ['Murcia', [650, 610]], ['Almería', [560, 700]]];

/** S7: a party, not the blank vote. Where it stands in 2026. */
export const escanosEnBlanco: Visual = function* (view, ctx) {
  const left = createRef<Node>(), right = createRef<Node>(), neq = createRef<Node>(), act1 = createRef<Node>(), act2 = createRef<Node>();
  const col = createRef<Node>(), map = createRef<TileMap>(), act3 = createRef<Node>(), marks = createRef<Node>(), no = createRef<Node>();
  view.add(<Frame>
    <Node ref={act1}>
      <Node ref={left} opacity={0} x={360} y={300}><Envelope kind="blank" scale={1.9}/><Big y={110} anchor={[0, -1]} text="voto en blanco" size={36}/></Node>
      <Node ref={neq} opacity={0}><Big x={640} y={290} anchor={[0, 0]} text="≠" size={120} fill={VOTE}/></Node>
      <Node ref={right} opacity={0} x={920} y={300}><PartyBallot/><Big y={110} anchor={[0, -1]} text="un partido" size={36}/></Node>
    </Node>
    <Node ref={act2} opacity={0}>
      <Rect x={160} y={600} width={980} height={2} offset={[-1, 0]} fill={brand.rule}/>
      {[300, 250, 140, 110].map((h, i) => <Rect x={240 + i * 150} y={600} offset={[0, 1]} width={80} height={h} radius={[4, 4, 0, 0]} fill={TONES[i]}/>)}
      <Line points={[[180, 420], [1100, 420]]} stroke={SEAT} lineWidth={2} lineDash={[10, 6]}/>
      <Node ref={col}>
        <Rect x={900} y={600} offset={[0, 1]} width={80} height={14} radius={[4, 4, 0, 0]} fill={brand.tile}/>
        <Big x={900} y={630} anchor={[0, -1]} text="EB" size={28} fill={brand.muted}/>
      </Node>
      <OptionIcon i={1} x={1110} y={170} scale={1.3}/>
      <Tag x={1110} y={230} anchor={[0, -1]} text="= OPCIÓN 2" fill={brand.soft}/>
      <Big x={160} y={110} text="8.448 votos" size={60} fill={brand.soft}/>
      <Tag x={164} y={180} text="ESCAÑOS EN BLANCO · GENERALES 2023 · 0 ESCAÑOS"/>
    </Node>
    <Node ref={act3} opacity={0}>
      <TileMap ref={map} cx={520} cy={400} sx={640} sy={380} zoom={0.68} tilt={30} turn={-3} persp={1600} vx={640} vy={80} lit={0.2} hollows={0}/>
    </Node>
  </Frame>);
  const frame = view.children()[0] as Node;
  const ps = EB_2026.map(([, uv]) => map().project(...uv)), m = map().project(...CITY.madrid), b = map().project(...CITY.barcelona);
  frame.add(<Node ref={marks} opacity={0}>
    {ps.map(p => <Circle x={p.x} y={p.y} size={22} fill={VOTE} shadowColor={VOTE} shadowBlur={12}/>)}
    <Node x={120} y={600}><Circle size={22} fill={VOTE}/><Tag x={20} anchor={[-1, 0]} text="+ LAS PALMAS" fill={VOTE}/></Node>
    <Big x={1180} y={90} anchor={[1, -1]} text="12 provincias" size={56} fill={VOTE}/>
    <Tag x={1180} y={156} anchor={[1, -1]} text="CONGRESO · 29 DE NOVIEMBRE DE 2026"/>
  </Node>);
  frame.add(<Node ref={no} opacity={0}>
    {[m, b].map(p => <Node x={p.x} y={p.y}><Circle size={40} stroke={NULLC} lineWidth={3}/><Line points={[[-12, -12], [12, 12]]} stroke={NULLC} lineWidth={3}/>
      <Line points={[[-12, 12], [12, -12]]} stroke={NULLC} lineWidth={3}/></Node>)}
    <Big x={m.x} y={m.y + 32} anchor={[0, -1]} text="Madrid" size={28} fill={brand.soft}/>
    <Big x={b.x} y={b.y + 32} anchor={[0, -1]} text="Barcelona" size={28} fill={brand.soft}/>
  </Node>);
  yield* appear(right(), 0.6);
  yield* until(ctx, 'noes');
  yield* all(appear(left(), 0.5), pop(neq()));
  yield* until(ctx, 'segunda');
  yield* all(act1().opacity(0, 0.5), appear(act2(), 0.6));
  yield* until(ctx, 'todas');
  yield* all(act2().opacity(0, 0.5), act3().opacity(1, 0.8));
  yield* until(ctx, 'doce');
  yield* appear(marks(), 0.6, 0);
  yield* until(ctx, 'madrid');
  yield* pop(no());
};

/** Party blocks for a generic 350-seat chamber (illustrative, no real parties). */
const BLOCKS = [138, 118, 42, 30, 22];
const blockOf = (i: number) => { let k = 0; for (let p = 0; p < BLOCKS.length; p++) { k += BLOCKS[p]; if (i < k) return p; } return BLOCKS.length - 1; };

/** S7: it takes a seat from someone, then nobody sits in it. */
export const sillaVacia: Visual = function* (view, ctx) {
  const hemi = createRef<Hemi>(), empty = createSignal(0), plenos = [0, 1, 2].map(() => createRef<Circle>()), pl = createRef<Node>(), note = createRef<Node>();
  const nobody = createRef<Node>(), EB = 300;
  view.add(<Frame>
    <Hemi ref={hemi} seats={350} radius={380} inner={210} x={640} y={630}/>
    <Node ref={pl} opacity={0}>
      <Tag x={640} y={540} anchor={[0, 0]} text="PLENOS" />
      {plenos.map((r, i) => <Circle ref={r} x={580 + i * 60} y={590} size={34} stroke={brand.soft} lineWidth={2}/>)}
    </Node>
    <Node ref={note} opacity={0}><Big x={640} y={110} anchor={[0, 0]} text="sin derechos de diputado" size={40} fill={brand.soft}/></Node>
    <Node ref={nobody} opacity={0}><Big x={640} y={170} anchor={[0, 0]} text="y el escaño no pasa a nadie" size={40}/></Node>
  </Frame>);
  hemi().paint = i => (i === EB && empty() > 0.5 ? 'empty' : TONES[blockOf(i)]);
  const p = hemi().pos[EB];
  const ring = <Circle x={640 + p.x} y={630 + p.y} size={60} stroke={VOTE} lineWidth={3} opacity={0}/> as Circle;
  (view.children()[0] as Node).add(ring);
  yield* until(ctx, 'quita');
  yield* all(ring.opacity(1, 0.4), ring.size(34, 0.6, easeOutCubic));
  empty(1);
  yield* until(ctx, 'novade');
  yield* appear(pl(), 0.5);
  yield* until(ctx, 'plenos');
  yield* sequence(0.5, ...plenos.map(r => r().fill(brand.soft, 0.3)));
  yield* appear(note(), 0.5);
  yield* until(ctx, 'nadie');
  yield* appear(nobody(), 0.5);
};

/** S7: the 1986 precedent. Seats nobody takes up lower the absolute majority. */
export const mayoria: Visual = function* (view, ctx) {
  const hemi = createRef<Hemi>(), members = createSignal(350), gone = createSignal(0), labels = createRef<Node>(), arg = createRef<Node>();
  const year = createRef<Node>(), easier = createRef<Node>();
  view.add(<Frame>
    <Hemi ref={hemi} seats={350} radius={380} inner={220} x={640} y={630}/>
    <Node ref={labels}>
      <Big x={640} y={585} anchor={[0, 1]} text={() => fmt(Math.round(members()))} size={88}/>
      <Tag x={640} y={596} anchor={[0, -1]} text="DE PLENO DERECHO" size={12}/>
      <Big x={640} y={230} anchor={[0, 1]} text={() => `mayoría absoluta: ${Math.floor(Math.round(members()) / 2) + 1}`} size={56} fill={VOTE}/>
    </Node>
    <Node ref={year} opacity={0}><Big x={70} y={70} text="1986" size={72} fill={brand.soft}/><Tag x={74} y={146} text="5 ELECTOS NO JURARON NI PROMETIERON"/></Node>
    <Node ref={easier} opacity={0}><Big x={1210} y={70} anchor={[1, -1]} text="1 escaño vacío: 175" size={48} fill={VOTE}/><Tag x={1210} y={130} anchor={[1, -1]} text="SI SE HICIERA IGUAL · CUENTA NUESTRA"/></Node>
    <Node ref={arg} opacity={0}>
      <Rect x={70} y={70} offset={TL} width={540} height={130} radius={12} fill={brand.panelDeep} stroke={brand.edge}/>
      <Tag x={96} y={92} text="SU MEJOR ARGUMENTO" fill={VOTE}/>
      <Txt offset={TL} x={96} y={122} width={490} textWrap text="hace visible el descontento, dentro de las reglas" fontFamily={brand.sans} fontSize={24} fill={brand.text}/>
      <Rect x={670} y={70} offset={TL} width={540} height={130} radius={12} fill={brand.panelDeep} stroke={brand.edge}/>
      <Tag x={696} y={92} text="SU LÍMITE" fill={NULLC}/>
      <Txt offset={TL} x={696} y={122} width={490} textWrap text="para dejar un escaño vacío, primero hay que ganarlo" fontFamily={brand.sans} fontSize={24} fill={brand.text}/>
    </Node>
  </Frame>);
  hemi().paint = i => (i >= 120 && i < 120 + 5 && gone() > 0.5 ? 'empty' : TONES[blockOf(i)]);
  yield* until(ctx, 'y1986');
  yield* appear(year(), 0.5);
  gone(1);
  yield* until(ctx, 'solo');
  yield* members(345, 1.2, easeInOutCubic);
  yield* until(ctx, 'facil');
  yield* all(year().opacity(0, 0.4), appear(easier(), 0.5));
  yield* until(ctx, 'argumento');
  yield* all(easier().opacity(0, 0.4), labels().opacity(0.15, 0.5), hemi().opacity(0.3, 0.5), appear(arg(), 0.5));
};

/** S8: not going. The seats are dealt the same; only turnout records it. */
export const abstencion: Visual = function* (view, ctx) {
  const people = createRef<Grid>(), lit = createSignal(0), hemi = createRef<Hemi>(), act2 = createRef<Node>(), why = createRef<Node>(), fine = createRef<Node>();
  // 100 people: 67 voted (66,59%), 33 did not.
  view.add(<Frame>
    <Grid ref={people} x={110} y={90} count={100} cols={10} step={42} tile={30} radius={15} fill={brand.tile} paint={i => (i < 67 && lit() > 0.5 ? VOTE : null)}/>
    <Hemi ref={hemi} seats={5} radius={150} x={960} y={420} dot={44}/>
    <Node ref={act2} opacity={0}><Big x={760} y={500} text="66,59%" size={96} fill={VOTE}/><Big x={760} y={600} text="12.517.011 no fueron" size={40} fill={brand.soft}/>
      <Tag x={764} y={650} text="GENERALES 2023 · CENSO CON CERA"/></Node>
    <Node ref={why} opacity={0}>
      {['¿protesta?', '¿enfermedad?', '¿vive fuera?', '¿le da igual?'].map((t, i) => <Big x={110 + (i % 2) * 230} y={530 + Math.floor(i / 2) * 44} text={t} size={30} fill={brand.soft}/>)}
    </Node>
    <Node ref={fine} opacity={0} x={960} y={160}><Coin size={70} crossed/><Big x={56} anchor={[-1, 0]} text="sin multa" size={40} fill={brand.soft}/></Node>
  </Frame>);
  hemi().lit(0);
  hemi().paint = i => [SEAT, TONES[1], SEAT, TONES[1], TONES[2]][i];
  lit(1);
  yield* until(ctx, 'reparten');
  yield* hemi().lit(1, 1);
  yield* until(ctx, 'participacion');
  yield* all(hemi().opacity(0, 0.4), appear(act2(), 0.5));
  yield* until(ctx, 'distingue');
  yield* appear(why(), 0.5);
  yield* until(ctx, 'obligatorio');
  yield* pop(fine());
};

/** Answers: rows = escaños, 3%, dinero, qué queda; columns = the six options. */
export const ANSWERS: Answer[][] = [
  ['y', 'n', 'n', 'h', 'h', 'n'],
  ['y', 'y', 'n', 'y', 'y', 'n'],
  ['y', 'n', 'n', 'n', 'n', 'n'],
  ['y', 'y', 'h', 'y', 'y', 'h'],
];

/** S9: the table, filled. */
export const tabla: Visual = function* (view, ctx) {
  const cols = OPTIONS.map(() => createRef<Node>()), colX = (i: number) => 400 + i * 145, rowY = (r: number) => 250 + r * 105;
  const pair1 = createRef<Node>(), pair2 = createRef<Node>(), legend = createRef<Node>();
  view.add(<Frame>
    {OPTIONS.map((_, i) => <OptionIcon i={i} x={colX(i)} y={140} scale={0.8}/>)}
    {ROWS.map((r, k) => <Node>
      <Rect x={60} y={rowY(k) - 42} offset={TL} width={1160} height={84} radius={10} fill={brand.panelDeep}/>
      <Node x={110} y={rowY(k)}>{rowIcon(k)}</Node>
      <Txt offset={[-1, 0]} x={160} y={rowY(k)} text={r} fontFamily={brand.sans} fontSize={22} fill={brand.text}/>
    </Node>)}
    {OPTIONS.map((_, i) => <Node ref={cols[i]} opacity={0}>{ROWS.map((_, k) => <Node x={colX(i)} y={rowY(k)}>{answerCell(ANSWERS[k][i], 30)}</Node>)}</Node>)}
    <Node ref={pair1} opacity={0}>{[2, 5].map(i => <Rect x={colX(i)} y={355} width={120} height={470} radius={14} stroke={VOTE} lineWidth={3}/>)}</Node>
    <Node ref={pair2} opacity={0}>{[3, 4].map(i => <Rect x={colX(i)} y={355} width={120} height={470} radius={14} stroke={VOTE} lineWidth={3}/>)}</Node>
    <Node ref={legend} opacity={0}>
      <Node x={420} y={680}>{answerCell('y', 20)}</Node><Tag x={440} y={680} anchor={[-1, 0]} text="SÍ" size={12}/>
      <Node x={520} y={680}>{answerCell('h', 20)}</Node><Tag x={540} y={680} anchor={[-1, 0]} text="SOLO A VECES" size={12}/>
      <Node x={700} y={680}>{answerCell('n', 20)}</Node><Tag x={720} y={680} anchor={[-1, 0]} text="NO" size={12}/>
    </Node>
  </Frame>);
  yield* all(appear(legend(), 0.4), sequence(0.25, ...cols.map(c => appear(c(), 0.4, 8))));
  yield* until(ctx, 'nuloyabs');
  yield* appear(pair1(), 0.4, 0);
  yield* until(ctx, 'blancoyeb');
  yield* all(pair1().opacity(0, 0.3), appear(pair2(), 0.4, 0));
  yield* until(ctx, 'dondevives');
  yield* pair2().opacity(0, 0.4);
};

/** S10: the questions to ask, and the province. */
export const cierre: Visual = function* (view, ctx) {
  const icons = [0, 1, 2, 3].map(() => createRef<Node>()), q = createRef<Node>(), map = createRef<Node>(), mapT = createRef<TileMap>();
  const order = [0, 2, 1, 3]; // spoken order: escaños, dinero, el 3%, lo que queda
  view.add(<Frame>
    <Node ref={q} opacity={0}><Txt x={640} y={150} text="¿Para qué?" fontFamily={brand.serif} fontStyle="italic" fontSize={84} fill={brand.text}/></Node>
    {[0, 1, 2, 3].map(k => <Node ref={icons[k]} x={250 + k * 260} y={330} opacity={0}><Node scale={3}>{rowIcon(k)}</Node></Node>)}
    <Node ref={map} opacity={0}>
      <TileMap ref={mapT} cx={520} cy={420} sx={640} sy={560} zoom={0.38} tilt={50} turn={-4} persp={1400} vx={640} vy={420} lit={0.6} hollows={0}/>
      <Txt x={640} y={520} text="¿Y en qué provincia?" fontFamily={brand.serif} fontStyle="italic" fontSize={48} fill={VOTE}/>
    </Node>
  </Frame>);
  yield* until(ctx, 'paraque');
  yield* appear(q(), 0.5);
  const cues = ['c0', 'c1', 'c2', 'c3'];
  for (let k = 0; k < 4; k++) { yield* until(ctx, cues[k]); yield* pop(icons[order[k]]()); }
  yield* until(ctx, 'provincia');
  yield* appear(map(), 0.6, 0);
};
