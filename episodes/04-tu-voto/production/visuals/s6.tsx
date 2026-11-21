// S6 voto en blanco: the 3% line, the made-up big province, Madrid 1993.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInCubic, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {Frame} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {appear, Big, BLANKC, brand, Coin, dhondtOrder, Envelope, fmt, Hemi, LINE3, makeColumns, NULLC, pop, rgba, SEAT, Tag, TL, TONES,
  until, VOTE} from './lib';

/** S6: an empty envelope. No seat stays empty because of it; but it is valid. */
export const blanco: Visual = function* (view, ctx) {
  const env = createRef<Node>(), hemi = createRef<Hemi>(), full = createRef<Node>(), coin = createRef<Node>(), box = createRef<Rect>(), valid = createRef<Node>();
  view.add(<Frame>
    <Envelope ref={env} kind="blank" x={640} y={250} scale={1.8} opacity={0}/>
    <Hemi ref={hemi} seats={5} radius={150} x={300} y={560} dot={44}/>
    <Node ref={full} opacity={0}><Tag x={300} y={600} anchor={[0, -1]} text="5 DE 5 ESCAÑOS REPARTIDOS" fill={SEAT}/></Node>
    <Node ref={coin} opacity={0} x={640} y={560}><Coin size={60} crossed/></Node>
    <Rect ref={box} x={980} y={540} width={300} height={170} radius={14} fill={rgba(VOTE, 0.08)} stroke={VOTE} lineWidth={2} opacity={0}>
      <Tag y={-108} anchor={[0, 0]} text="VOTOS VÁLIDOS" fill={VOTE} size={13}/>
    </Rect>
    <Node ref={valid} opacity={0}><Line points={[[850, 590], [1110, 590]]} stroke={LINE3} lineWidth={3} lineDash={[10, 6]}/><Tag x={1120} y={590} anchor={[-1, 0]} text="3%" fill={LINE3}/></Node>
  </Frame>);
  hemi().lit(0);
  hemi().paint = i => [SEAT, TONES[1], SEAT, TONES[1], TONES[2]][i];
  yield* pop(env(), 0.6);
  yield* until(ctx, 'escanos');
  yield* all(hemi().lit(1, 0.8), appear(full()));
  yield* until(ctx, 'dinero');
  yield* pop(coin());
  yield* until(ctx, 'valido');
  yield* appear(box(), 0.4, 0);
  yield* all(env().position([980, 520], 0.8, easeInOutCubic), env().scale(0.9, 0.8));
  yield* until(ctx, 'cuenta');
  yield* appear(valid(), 0.4, 0);
  yield* valid().y(-24, 0.6, easeOutCubic);
};

/** S6: blank votes raise the 3% line, which only matters where it is the real bar. */
export const liston: Visual = function* (view, ctx) {
  const parties = [{name: 'A', votes: 70000}, {name: 'B', votes: 60000}, {name: 'C', votes: 34000}, {name: 'D', votes: 26000}, {name: 'E', votes: 6000}];
  const cols = makeColumns({x: 100, base: 580, width: 600, height: 420, max: 72000, parties, blank: 4000});
  const blankH = (n: number) => (n / 72000) * 420, b = cols.blank, real = createRef<Node>(), x10 = createRef<Node>(), tag = createRef<Node>();
  const realY = 580 - (30000 / 72000) * 420;
  view.add(<Frame>
    {cols.node}
    <Rect x={860} y={580} offset={[0, 1]} width={90} height={() => blankH(b())} radius={[4, 4, 0, 0]} stroke={BLANKC} lineWidth={2} fill={rgba(BLANKC, 0.06)}/>
    <Big x={860} y={610} anchor={[0, 0]} text="blanco" size={26}/>
    <Node ref={tag} opacity={0}><Big x={1010} y={() => cols.lineY()} anchor={[-1, 1]} text={() => fmt(0.03 * cols.valid())} size={34} fill={LINE3}/></Node>
    <Node ref={real} opacity={0}>
      <Line points={[[80, realY], [960, realY]]} stroke={SEAT} lineWidth={2} lineDash={[10, 6]}/>
      <Tag x={970} y={realY} anchor={[-1, 0]} text="LISTÓN REAL · 5 ESCAÑOS" fill={SEAT}/>
    </Node>
    <Node ref={x10} opacity={0}><Big x={860} y={140} anchor={[0, 0]} text="× 10" size={60} fill={BLANKC}/></Node>
  </Frame>);
  yield* until(ctx, 'necesita');
  yield* appear(tag(), 0.4, 0);
  yield* until(ctx, 'mas');
  yield* b(16000, 1.6, easeInOutCubic);
  yield* b(4000, 0.8, easeInOutCubic);
  yield* until(ctx, 'importa');
  yield* appear(real(), 0.5, 0);
  yield* until(ctx, 'diez');
  yield* all(pop(x10()), b(40000, 1.6, easeInOutCubic));
};

/** S6: a big made-up province. 35.000 more blank votes push F under the line; its seat moves to D. */
export const grande: Visual = function* (view, ctx) {
  const parties = [{name: 'A', votes: 1150000}, {name: 'B', votes: 950000}, {name: 'C', votes: 520000}, {name: 'D', votes: 480000},
    {name: 'F', votes: 106000, tone: VOTE}, {name: 'G', votes: 60000}];
  const cols = makeColumns({x: 60, base: 600, width: 600, height: 440, max: 1150000, parties, blank: 234000, barWidth: 56});
  const hemi = createRef<Hemi>(), lens = createRef<Node>(), lost = createRef<Node>(), arrow = createRef<Node>(), tag = createRef<Node>(), nul = createRef<Node>();
  // Seats in party blocks: A14 B11 C6 D5 F1; after, A14 B11 C6 D6.
  const before = [14, 11, 6, 5, 1], fOwner = createSignal(4);
  const owner = (i: number) => { let k = 0; for (let p = 0; p < before.length; p++) { k += before[p]; if (i < k) return p === 4 ? fOwner() : p; } return -1; };
  // The lens: the top of F and the 3% line, around 106.000 (one px = 5 votes).
  const ly = (v: number) => 300 - (v - 105600) * 0.2;
  const blankS = cols.blank;
  view.add(<Frame>
    <Node ref={tag}><Tag x={80} y={60} text="PROVINCIA INVENTADA · 37 ESCAÑOS" fill={brand.muted}/></Node>
    {cols.node}
    <Hemi ref={hemi} seats={37} radius={190} x={1010} y={640}/>
    <Node ref={lens} opacity={0}>
      <Rect x={1010} y={300} width={380} height={260} radius={14} fill={brand.panelDeep} stroke={brand.edge} lineWidth={1.5} clip>
        <Rect x={-60} y={130} offset={[0, 1]} width={90} height={130 - (ly(106000) - 300)} fill={() => (cols.out[4]() > 0.5 ? brand.tile : VOTE)}/>
        <Line points={() => [[-190, ly(0.03 * cols.valid()) - 300], [190, ly(0.03 * cols.valid()) - 300]]} stroke={LINE3} lineWidth={3} lineDash={[10, 6]}/>
      </Rect>
      <Tag x={830} y={160} text="ZOOM" size={12}/>
      <Big x={1060} y={() => ly(0.03 * cols.valid()) - 14} anchor={[-1, 1]} text={() => fmt(0.03 * cols.valid())} size={30} fill={LINE3}/>
      <Big x={1060} y={ly(106000) + 14} anchor={[-1, -1]} text="F 106.000" size={30} fill={VOTE}/>
    </Node>
    <Node ref={lost} opacity={0}><Big x={1010} y={130} anchor={[0, 0]} text="−50 votos" size={40} fill={VOTE}/></Node>
    <Node ref={arrow} opacity={0}><Big x={cols.x(3)} y={110} anchor={[0, 0]} text="+1 escaño" size={34} fill={SEAT}/></Node>
    <Node ref={nul} opacity={0}><Big x={760} y={110} anchor={[-1, 0]} text="35.000 nulos o abstención" size={30} fill={NULLC}/></Node>
  </Frame>);
  hemi().paint = i => cols.colour(owner(i));
  const blankBar = <Rect x={780} y={600} offset={[0, 1]} width={40} height={() => (blankS() / 1150000) * 440} stroke={BLANKC} lineWidth={2} fill={rgba(BLANKC, 0.06)}/>;
  (view.children()[0] as Node).add(blankBar);
  yield* until(ctx, 'justo');
  yield* all(appear(lens(), 0.5, 0), tag().opacity(0.4, 0.5));
  yield* until(ctx, 'anadimos');
  yield* blankS(269000, 1.6, easeInOutCubic);
  yield* all(cols.out[4](1, 0.5), pop(lost()));
  yield* until(ctx, 'adonde');
  fOwner(3);
  yield* all(pop(arrow()), hemi().scale(1.04, 0.2).to(1, 0.3));
  yield* until(ctx, 'nulo');
  yield* all(lost().opacity(0, 0.3), arrow().opacity(0, 0.3), appear(nul()), blankS(234000, 1.2, easeInOutCubic));
  fOwner(4);
  yield* cols.out[4](0, 0.5);
};

/** S6: Madrid 1993. The CDS 438 votes under the line; the blank votes that made the difference. */
export const madrid1993: Visual = function* (view, ctx) {
  // Axis 92.000 → 95.000, 0,12 px per vote.
  const zy = (v: number) => 600 - (v - 92000) * 0.14;
  const valid = createSignal(3126150), lineV = () => 0.03 * valid(), cds = createRef<Rect>(), gap = createRef<Node>();
  const blanks = createRef<Node>(), moved = createSignal(0), seat = createRef<Node>(), only = createRef<Node>(), act2 = createRef<Node>(), act1 = createRef<Node>();
  const tiles = Array.from({length: 61}, (_, i) => i); // 61 tiles × ~500 = 30.554 blank votes
  view.add(<Frame>
    <Node ref={act1}>
      <Tag x={80} y={60} text="MADRID · ELECCIONES GENERALES DE 1993" fill={brand.muted}/>
      <Line points={[[80, 600], [720, 600]]} stroke={brand.rule} lineWidth={2}/>
      <Tag x={72} y={600} anchor={[1, 0]} text="92.000" size={12} fill={brand.faint}/>
      <Rect ref={cds} x={300} y={600} offset={[0, 1]} width={170} height={600 - zy(93347)} radius={[4, 4, 0, 0]} fill={TONES[2]}/>
      <Big x={300} y={630} anchor={[0, -1]} text="CDS · 93.347" size={32}/>
      <Line points={() => [[80, zy(lineV())], [720, zy(lineV())]]} stroke={LINE3} lineWidth={3} lineDash={[10, 6]}/>
      <Big x={730} y={() => zy(lineV())} anchor={[-1, 0]} text={() => `3% · ${fmt(Math.ceil(lineV()))}`} size={32} fill={LINE3}/>
      <Node ref={gap} opacity={0}>
        <Line points={[[400, zy(93347)], [400, zy(93785)]]} stroke={VOTE} lineWidth={3}/>
        <Big x={420} y={(zy(93347) + zy(93785)) / 2} anchor={[-1, 0]} text="438 votos" size={44} fill={VOTE}/>
      </Node>
      <Node ref={blanks} opacity={0}>
        <Tag x={860} y={150} text="30.554 VOTOS EN BLANCO" fill={BLANKC}/>
        {tiles.map(i => <Rect x={() => 870 + (i % 8) * 34 + (i < 29 ? moved() * 0 : 0)} y={() => 200 + Math.floor(i / 8) * 34 + (i < 29 ? moved() * 320 : 0)}
          offset={TL} width={26} height={26} radius={3} stroke={BLANKC} lineWidth={1.5} opacity={() => (i < 29 ? 1 - moved() * 0.6 : 1)}/>)}
        <Node opacity={moved}><Tag x={860} y={490} text="≈14.600 → NULO O ABSTENCIÓN" fill={NULLC}/></Node>
      </Node>
      <Node ref={seat} opacity={0}>
        <Circle x={300} y={zy(93347) - 50} size={40} fill={TONES[2]} shadowColor={SEAT} shadowBlur={12}/>
        <Big x={330} y={zy(93347) - 50} anchor={[-1, 0]} text="1 escaño" size={34}/>
      </Node>
      <Node ref={only} opacity={0}><Tag x={80} y={110} text="ESE ESCAÑO FUE AL PSOE, EL SEGUNDO PARTIDO · ÚNICO CASO ENCONTRADO EN UNAS GENERALES" fill={brand.soft} size={13}/></Node>
    </Node>
    <Node ref={act2} opacity={0}>
      <Envelope kind="blank" x={640} y={250} scale={1.6}/>
      <Big x={640} y={380} anchor={[0, -1]} text="200.673" size={110}/>
      <Tag x={640} y={510} anchor={[0, -1]} text="VOTOS EN BLANCO · 2023 · CONTADOS APARTE"/>
    </Node>
  </Frame>);
  yield* until(ctx, 'tres');
  yield* pop(gap());
  yield* until(ctx, 'blancos');
  yield* appear(blanks(), 0.6);
  yield* until(ctx, 'personas');
  yield* all(moved(1, 1.2, easeInOutCubic), valid(3126150 - 14584, 1.6, easeInOutCubic));
  yield* all(gap().opacity(0, 0.3), pop(seat()));
  yield* until(ctx, 'segundo');
  yield* appear(only(), 0.5);
};

/** S5: the blank vote is counted and published under its own name. */
export const blancos2023: Visual = function* (view) {
  const n = createRef<Node>();
  view.add(<Frame><Node ref={n} opacity={0}>
    <Envelope kind="blank" x={640} y={250} scale={1.6}/>
    <Big x={640} y={380} anchor={[0, -1]} text="200.673" size={110}/>
    <Tag x={640} y={510} anchor={[0, -1]} text="VOTOS EN BLANCO · 2023 · CONTADOS APARTE"/>
  </Node></Frame>);
  yield* appear(n(), 0.6);
};

/** S1: what the 3% is, and what counts as a valid vote. */
export const umbral: Visual = function* (view, ctx) {
  const parties = [{name: 'A', votes: 70000}, {name: 'B', votes: 52000}, {name: 'C', votes: 30000}, {name: 'D', votes: 4000, tone: VOTE}];
  const cols = makeColumns({x: 90, base: 520, width: 520, height: 360, max: 72000, parties, blank: 0});
  cols.blank(40000);
  const sum = createRef<Node>(), parts = [0, 1, 2, 3].map(() => createRef<Node>());
  view.add(<Frame>
    {cols.node}
    <Node ref={sum} x={920} y={330}>
      <Node ref={parts[0]} opacity={0} y={-150}><Rect width={300} height={70} radius={10} fill={rgba(VOTE, 0.12)} stroke={VOTE} lineWidth={2}/><Big anchor={[0, 0]} text="votos a partidos" size={30}/></Node>
      <Node ref={parts[1]} opacity={0} y={-60}><Big x={-120} anchor={[0, 0]} text="+" size={44}/><Envelope kind="blank" x={-50} scale={0.6}/><Big x={10} anchor={[-1, 0]} text="votos en blanco" size={30} fill={BLANKC}/></Node>
      <Node ref={parts[2]} opacity={0} y={40}><Rect width={300} height={4} fill={brand.soft}/><Big y={44} anchor={[0, 0]} text="votos válidos" size={40} fill={LINE3}/></Node>
      <Node ref={parts[3]} opacity={0} y={180}><Envelope kind="null" scale={0.7} x={-80}/><Big x={10} anchor={[-1, 0]} text="nulo: fuera" size={30} fill={NULLC}/></Node>
    </Node>
  </Frame>);
  yield* until(ctx, 'necesita');
  yield* all(cols.out[3](1, 0.6));
  yield* until(ctx, 'importa');
  yield* appear(parts[0](), 0.4);
  yield* until(ctx, 'partidos');
  yield* appear(parts[1](), 0.4);
  yield* appear(parts[2](), 0.4);
  yield* until(ctx, 'nulos');
  yield* pop(parts[3]());
};
