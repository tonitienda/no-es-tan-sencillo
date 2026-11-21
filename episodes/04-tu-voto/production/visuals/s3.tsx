// S3 partido con escaño · S4 partido sin escaño · S5 nulo.
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInCubic, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {Frame} from '../../../../production/src/kit';
import type {Visual} from '../../../../production/src/timeline';
import {Grid} from '../../../03-vivienda/production/visuals/ui';
import {CITY, TileMap} from '../../../03-vivienda/production/world';
import {appear, Big, brand, Coin, Envelope, fmt, Hemi, LINE3, makeColumns, MONEY, NULLC, pop, rgba, SEAT, Tag, TL, TONES, until, VOTE} from './lib';

/** S3: your envelope lands on a party that wins a seat; the money; Madrid 2023. */
export const conEscano: Visual = function* (view, ctx) {
  const frame = createRef<Node>(), env = createRef<Node>(), hemi = createRef<Hemi>(), seatLit = createSignal(0);
  const coinSeat = createRef<Node>(), coinVote = createRef<Node>(), act1 = createRef<Node>();
  const act2 = createRef<Node>(), gap = createRef<Node>(), act3 = createRef<Node>(), field = createRef<Grid>();
  const parties = [{name: 'A', votes: 70000, tone: SEAT}, {name: 'B', votes: 60000}, {name: 'C', votes: 34000}];
  const cols = makeColumns({x: 100, base: 560, width: 480, height: 380, max: 72000, parties, showLine: false});
  // Madrid 2023, the 37th seat: two quotients on a zoomed axis (90.000 → 92.000).
  const zy = (v: number) => 560 - ((v - 90000) / 2000) * 380;
  view.add(<Frame ref={frame}>
    <Node ref={act1}>
      {cols.node}
      <Hemi ref={hemi} seats={5} radius={150} x={960} y={440} dot={44}/>
      <Envelope ref={env} kind="vote" x={cols.x(0)} y={60} scale={1.1} opacity={0}/>
      <Node ref={coinSeat} opacity={0} x={960} y={540}><Coin size={64}/><Big x={46} y={0} anchor={[-1, 0]} text="21.167 € por escaño" size={34} fill={MONEY}/></Node>
      <Node ref={coinVote} opacity={0} x={960} y={620}><Coin size={40} label="¢"/><Big x={46} y={0} anchor={[-1, 0]} text="0,81 € por voto" size={34} fill={MONEY}/></Node>
    </Node>
    <Node ref={act2} opacity={0}>
      <Tag x={100} y={80} text="MADRID 2023 · EL ÚLTIMO ESCAÑO (37.º)" fill={brand.muted}/>
      <Line points={[[100, 560], [760, 560]]} stroke={brand.rule} lineWidth={2}/>
      <Tag x={92} y={560} anchor={[1, 0]} text="90.000" size={12} fill={brand.faint}/>
      <Rect x={280} y={560} offset={[0, 1]} width={150} height={560 - zy(91449)} radius={[4, 4, 0, 0]} fill={SEAT}/>
      <Rect x={560} y={560} offset={[0, 1]} width={150} height={560 - zy(91327)} radius={[4, 4, 0, 0]} fill={TONES[2]}/>
      <Big x={280} y={572} anchor={[0, -1]} text="PP" size={30}/><Tag x={280} y={608} anchor={[0, -1]} text="16.º ESCAÑO" size={12}/>
      <Big x={560} y={572} anchor={[0, -1]} text="PSOE" size={30}/><Tag x={560} y={608} anchor={[0, -1]} text="11.º ESCAÑO" size={12}/>
      <Big x={280} y={zy(91449) - 12} anchor={[0, 1]} text="91.449" size={36}/>
      <Big x={560} y={zy(91327) - 12} anchor={[0, 1]} text="91.327" size={36} fill={TONES[1]}/>
      <Node ref={gap} opacity={0}>
        <Line points={[[640, zy(91327)], [800, zy(91327)]]} stroke={VOTE} lineWidth={2} lineDash={[5, 4]}/>
        <Line points={[[360, zy(91449)], [800, zy(91449)]]} stroke={VOTE} lineWidth={2} lineDash={[5, 4]}/>
        <Big x={820} y={(zy(91449) + zy(91327)) / 2} anchor={[-1, 0]} text="1.340 votos" size={64} fill={VOTE}/>
        <Tag x={824} y={(zy(91449) + zy(91327)) / 2 + 44} text="LE FALTARON AL PSOE · CUENTA NUESTRA" size={12}/>
      </Node>
    </Node>
    <Node ref={act3} opacity={0}>
      <Grid ref={field} x={110} y={150} count={3609} cols={90} step={11.5} tile={8.5} radius={1} fill={brand.tile}
        paint={i => (i === 1804 ? VOTE : null)}/>
      <Big x={110} y={70} text="3.608.673 votos válidos" size={40}/>
      <Tag x={110} y={120} text="CADA CUADRO: 1.000 VOTOS" size={12}/>
      <Circle x={110 + (1804 % 90) * 11.5 + 4} y={150 + Math.floor(1804 / 90) * 11.5 + 4} size={42} stroke={VOTE} lineWidth={3}/>
      <Big x={1170} y={660} anchor={[1, 1]} text="1.340" size={64} fill={VOTE}/>
    </Node>
  </Frame>);
  hemi().paint = i => (i < 4 ? [SEAT, TONES[1], SEAT, TONES[1]][i] : seatLit() > 0.5 ? VOTE : null);
  cols.votes[0](64000);
  yield* pop(env());
  yield* env().y(560 - (64000 / 72000) * 380 - 30, 0.7, easeInCubic);
  yield* all(env().opacity(0, 0.2), cols.votes[0](70000, 0.5, easeOutCubic));
  const [tx, ty] = cols.top(0), p = hemi().pos[4];
  const dot = <Circle x={tx} y={ty} size={30} fill={VOTE} shadowColor={VOTE} shadowBlur={16}/> as Circle;
  frame().add(dot);
  yield* dot.position([960 + p.x, 440 + p.y], 0.8, easeInOutCubic);
  dot.remove(); seatLit(1);
  yield* until(ctx, 'dinero');
  yield* hemi().y(360, 0.5);
  yield* pop(coinSeat());
  yield* until(ctx, 'centimos');
  yield* pop(coinVote());
  yield* until(ctx, 'decide');
  yield* all(act1().opacity(0, 0.5), appear(act2(), 0.6));
  yield* until(ctx, 'faltaron');
  yield* pop(gap());
  yield* until(ctx, 'unvoto');
  field().shown(0);
  yield* all(act2().opacity(0, 0.5), act3().opacity(1, 0.5), field().shown(1, 1.2, easeInOutCubic));
};

/** S4: your envelope lands on a party that wins nothing. */
export const sinEscano: Visual = function* (view, ctx) {
  const env = createRef<Node>(), hemi = createRef<Hemi>(), act1 = createRef<Node>(), noCoin = createRef<Node>(), counter = createRef<Node>();
  const act2 = createRef<Node>(), act3 = createRef<Node>(), share = createRef<Grid>();
  const parties = [{name: 'A', votes: 70000}, {name: 'B', votes: 60000}, {name: 'C', votes: 34000}, {name: 'D', votes: 26000}, {name: 'E', votes: 6000, tone: VOTE}];
  const cols = makeColumns({x: 100, base: 560, width: 640, height: 380, max: 72000, parties, showLine: false});
  const listonY = 560 - (30000 / 72000) * 380, ev = createSignal(5000);
  view.add(<Frame>
    <Node ref={act1}>
      {cols.node}
      <Line points={[[80, listonY], [760, listonY]]} stroke={SEAT} lineWidth={2} lineDash={[10, 6]}/>
      <Tag x={768} y={listonY} anchor={[-1, 0]} text="ÚLTIMO ESCAÑO" fill={SEAT}/>
      <Hemi ref={hemi} seats={5} radius={130} x={1060} y={300} dot={40}/>
      <Envelope ref={env} kind="vote" x={cols.x(4)} y={60} scale={1.1} opacity={0}/>
      <Node ref={noCoin} opacity={0} x={1000} y={420}><Coin size={56} crossed/><Big x={46} anchor={[-1, 0]} text="0 €" size={40} fill={MONEY}/></Node>
      <Node ref={counter} opacity={0}>
        <Rect x={1060} y={560} width={300} height={90} radius={10} fill={brand.panelDeep} stroke={brand.edge}/>
        <Tag x={930} y={530} text="E · VOTOS PUBLICADOS" size={12}/>
        <Big x={930} y={552} text={() => fmt(ev())} size={44} fill={VOTE}/>
      </Node>
    </Node>
    <Node ref={act2} opacity={0}>
      {[['5.000 votos', 0.08], ['500.000 votos', 1]].map(([label, h], k) => <Node x={330 + k * 520}>
        <Rect y={560} offset={[0, 1]} width={120} height={20 + 300 * (h as number)} radius={[4, 4, 0, 0]} fill={TONES[3]}/>
        <Big y={600} anchor={[0, -1]} text={label as string} size={30}/>
        <Node y={180}>
          <Rect width={180} height={120} radius={12} stroke={brand.soft} lineWidth={3}/>
          <Line points={[[-30, 72], [30, 72]]} stroke={brand.soft} lineWidth={3}/>
          <Big text="10 min" size={46}/>
        </Node>
      </Node>)}
      <Tag x={640} y={60} anchor={[0, -1]} text="SIN ESCAÑO: TV PÚBLICA EN LA PRÓXIMA CAMPAÑA" fill={brand.muted}/>
    </Node>
    <Node ref={act3} opacity={0}>
      <Grid ref={share} x={150} y={150} count={100} cols={10} step={42} tile={36} radius={4} fill={brand.tile} paint={i => (i >= 92 ? VOTE : null)}/>
      <Big x={640} y={210} text="7,8%" size={140} fill={VOTE}/>
      <Big x={640} y={370} text="1.930.424 votos" size={48}/>
      <Txt offset={TL} x={644} y={436} width={520} textWrap text="fueron a listas sin escaño en su provincia · 2023" fontFamily={brand.sans} fontSize={22} fill={brand.soft}/>
    </Node>
  </Frame>);
  hemi().paint = i => [SEAT, TONES[1], SEAT, TONES[1], TONES[2]][i];
  yield* pop(env());
  yield* env().y(560 - (6000 / 72000) * 380 - 30, 0.7, easeInCubic);
  yield* all(env().opacity(0, 0.2), cols.votes[4](8000, 0.5, easeOutCubic));
  yield* until(ctx, 'publica');
  yield* all(appear(counter()), ev(6000, 0.8));
  yield* until(ctx, 'dinero');
  yield* pop(noCoin());
  yield* until(ctx, 'proxima');
  yield* all(act1().opacity(0, 0.5), appear(act2(), 0.6));
  yield* until(ctx, 'cifra');
  yield* all(act2().opacity(0.25, 0.5));
  yield* until(ctx, 'poca');
  share().shown(0);
  yield* all(act2().opacity(0, 0.4), act3().opacity(1, 0.4), share().shown(1, 1, easeInOutCubic));
};

/** S4: the same thing, province by province (2023). */
export const mapaSinEscano: Visual = function* (view, ctx) {
  const map = createRef<TileMap>(), dots = [
    {name: 'Madrid', pct: 1.3, at: CITY.madrid as [number, number], cue: 'madrid', side: -1},
    {name: 'Soria', pct: 32.8, at: [575, 215] as [number, number], cue: 'soria', side: -1},
    {name: 'Teruel', pct: 35.2, at: [655, 335] as [number, number], cue: 'soria', side: 1},
    {name: 'Lleida', pct: 32.8, at: [805, 205] as [number, number], cue: 'soria', side: 1},
  ].map(d => ({...d, ref: createRef<Node>()}));
  view.add(<Frame>
    <TileMap ref={map} cx={520} cy={410} sx={640} sy={370} zoom={0.66} tilt={18} turn={-3} persp={2000} vx={640} vy={80} lit={0.35} hollows={0}/>
  </Frame>);
  const frame = view.children()[0] as Node;
  for (const d of dots) {
    const p = map().project(...d.at), r = 6 + Math.sqrt(d.pct) * 6;
    frame.add(<Node ref={d.ref} opacity={0}>
      <Circle x={p.x} y={p.y} size={r * 2} fill={rgba(VOTE, 0.3)} stroke={VOTE} lineWidth={2}/>
      <Big x={p.x + d.side * (r + 10)} y={p.y} anchor={[-d.side, 0]} text={`${d.name} · ${String(d.pct).replace('.', ',')}%`} size={30}/>
    </Node>);
  }
  frame.add(<Tag x={60} y={60} text="VOTOS A LISTAS SIN ESCAÑO EN SU PROVINCIA · 2023" fill={brand.muted}/>);
  yield* until(ctx, 'madrid');
  yield* pop(dots[0].ref());
  yield* until(ctx, 'soria');
  yield* sequence(0.35, ...dots.slice(1).map(d => pop(d.ref())));
};

/** S5: the null vote counts as turnout, and as nothing else. */
export const nulo: Visual = function* (view, ctx) {
  const frame = createRef<Node>(), examples = [0, 1, 2].map(() => createRef<Node>()), env = createRef<Node>();
  const turnout = createSignal(0), turnBox = createRef<Node>(), tray = createRef<Node>(), split = createRef<Node>(), same = createRef<Node>();
  const box = createRef<Rect>(), stamp = createRef<Node>();
  view.add(<Frame ref={frame}>
    {/* three ways to make a vote null */}
    <Node ref={examples[0]} opacity={0} x={240} y={170}><Envelope kind="null"/><Txt y={70} text="dos partidos" fontFamily={brand.sans} fontSize={22} fill={brand.text}/></Node>
    <Node ref={examples[1]} opacity={0} x={640} y={170}>
      <Rect width={70} height={90} radius={4} fill={brand.panel} stroke={brand.edge}/>
      {[-24, -8, 8, 24].map(y => <Line points={[[-22, y], [22, y]]} stroke={brand.soft} lineWidth={3}/>)}
      <Line points={[[-28, -8], [28, -8]]} stroke={NULLC} lineWidth={5}/>
      <Txt y={80} text="tachada o escrita" fontFamily={brand.sans} fontSize={22} fill={brand.text}/>
    </Node>
    <Node ref={examples[2]} opacity={0} x={1040} y={170}>
      <Rect width={70} height={90} radius={4} fill={brand.panel} stroke={NULLC} lineDash={[5, 4]} lineWidth={2}/>
      <Txt y={80} text="no oficial" fontFamily={brand.sans} fontSize={22} fill={brand.text}/>
    </Node>
    {/* the counting table: valid votes on the left, nulls on the right */}
    <Rect ref={box} x={380} y={500} width={460} height={200} radius={14} fill={rgba(VOTE, 0.08)} stroke={VOTE} lineWidth={2}>
      <Tag y={-120} text="VOTOS VÁLIDOS · ESCAÑOS · 3% · DINERO" fill={VOTE} anchor={[0, 0]} size={13}/>
    </Rect>
    <Node ref={tray} x={940} y={500} opacity={0}>
      <Rect width={260} height={120} radius={12} fill={brand.panelDeep} stroke={NULLC} lineWidth={2}/>
      <Tag y={-82} text="NULOS" fill={NULLC} anchor={[0, 0]}/>
      <Big y={0} anchor={[0, 0]} text="264.360" size={48} fill={NULLC}/>
    </Node>
    <Node ref={turnBox} opacity={0} x={940} y={330}>
      <Tag text="PARTICIPACIÓN" anchor={[0, 0]} y={-34}/>
      <Big anchor={[0, 0]} text={() => (turnout() > 0.5 ? '+1' : '·')} size={48} fill={brand.text}/>
    </Node>
    <Envelope ref={env} kind="null" x={640} y={300} opacity={0}/>
    <Node ref={stamp} opacity={0} x={380} y={500}><Big anchor={[0, 0]} text="✕" size={120} fill={NULLC}/></Node>
    <Node ref={split} opacity={0}>
      <Line points={[[940, 440], [940, 560]]} stroke={brand.edge} lineWidth={2}/>
      <Big x={875} y={576} anchor={[0, -1]} text="¿protesta?" size={28} fill={brand.soft}/>
      <Big x={1005} y={576} anchor={[0, -1]} text="¿error?" size={28} fill={brand.soft}/>
    </Node>
    <Node ref={same} opacity={0} x={520} y={250}>
      <Envelope kind="double"/>
      <Big x={80} anchor={[-1, 0]} text="= 1 voto válido" size={40} fill={VOTE}/>
    </Node>
  </Frame>);
  yield* until(ctx, 'distintos');
  yield* appear(examples[0]());
  yield* until(ctx, 'tachados');
  yield* appear(examples[1]());
  yield* until(ctx, 'oficial');
  yield* appear(examples[2]());
  yield* until(ctx, 'participacion');
  yield* all(...examples.map(e => e().opacity(0.25, 0.4)), pop(env()), appear(turnBox()));
  turnout(1);
  yield* until(ctx, 'novalido');
  yield* env().position([380, 440], 0.6, easeInCubic);
  yield* all(pop(stamp(), 0.3), box().stroke(NULLC, 0.2).to(VOTE, 0.4));
  yield* all(env().position([940, 500], 0.7, easeInOutCubic), stamp().opacity(0, 0.4), env().scale(0.7, 0.7));
  yield* until(ctx, 'mesa');
  yield* all(env().opacity(0, 0.3), appear(tray()));
  yield* until(ctx, 'proposito');
  yield* appear(split(), 0.5, 0);
  yield* until(ctx, 'detalle');
  yield* all(...examples.map(e => e().opacity(0, 0.4)), turnBox().opacity(0, 0.4), pop(same()));
};
