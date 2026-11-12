// New visuals for 03-vivienda-v2 (script v3): the agenda, the worked example of the
// four questions, the numbered section splashes and the two promises. They build
// from the series kit and the v1 helpers, so they read as the same video.
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, sequence, type ThreadGenerator} from '@motion-canvas/core';
import {Cond, Frame, Pill, R1Chip, R2Card, Serif, type Mark} from '../../../../production/src/kit';
import type {Visual, VisualContext} from '../../../../production/src/timeline';
import {brand, Label, Para, Plane, rgba, show, TL, until} from '../../../03-vivienda/production/visuals/ui';

const Kicker = ({text, x = 72, y = 96}: {text: string; x?: number; y?: number}) =>
  <Txt offset={TL} x={x} y={y} text={text.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={14} letterSpacing={2} fill={brand.muted}/>;

function* cued(ctx: VisualContext, items: [Node, string | undefined][], seconds = 0.5): ThreadGenerator {
  for (const [node, cue] of items) { yield* until(ctx, cue); yield* show(node, seconds); }
}

// ── splash: a short pause that opens a section ────────────────────────────────
/** props: n ("1"), of ("5"), title, sub (the sentence under test, optional). Lineless; give it a duration and "section". */
export const splash: Visual = function* (view, ctx) {
  const p = ctx.beat.props as {n: string; of?: string; title: string; sub?: string};
  const num = createRef<Txt>(), title = createRef<Cond>(), rule = createRef<Rect>(), sub = createRef<Txt>();
  view.add(<Frame>
    <Plane top={500} alpha={0.22}/>
    <Txt ref={num} x={640} y={232} text={`${p.n}${p.of ? ` / ${p.of}` : ''}`} fontFamily={brand.mono} fontWeight={500} fontSize={22} letterSpacing={4} fill={brand.muted} opacity={0}/>
    <Cond ref={title} x={640} y={322} text={p.title.toUpperCase()} fontSize={p.title.length > 14 ? 76 : 108} lineHeight="92%" fill={brand.ivory}
      shadowColor="rgba(242,237,228,0.16)" shadowBlur={36} opacity={0} scale={0.97}/>
    <Rect ref={rule} x={640} y={398} width={0} height={2} fill={brand.ivory}/>
    {p.sub && <Serif ref={sub} x={640} y={452} text={p.sub} fontSize={34} fill={brand.soft} opacity={0}/>}
  </Frame>);
  yield* sequence(0.15,
    num().opacity(1, 0.4),
    all(title().opacity(1, 0.45), title().scale(1, 0.6, easeOutCubic)),
    rule().width(220, 0.5, easeOutCubic),
    ...(p.sub ? [sub().opacity(1, 0.5)] : []),
  );
};

// ── agenda: what the video covers, and the chapters ───────────────────────────
type AgendaProps = {items: {n?: string; title: string; cue?: string}[]; chaptersCue?: string; chaptersText?: string};

export const agenda: Visual = function* (view, ctx) {
  const p = ctx.beat.props as AgendaProps;
  const rows = p.items.map(() => createRef<Node>()), segs = p.items.map(() => createRef<Rect>()), foot = createRef<Node>();
  const BAR_X = 118, BAR_W = 1044, gap = 6, segW = (BAR_W - gap * (p.items.length - 1)) / p.items.length;
  view.add(<Frame>
    <Kicker text="Hoy" x={118}/>
    {p.items.map((it, i) => <Node ref={rows[i]} opacity={0}>
      <Txt offset={TL} x={118} y={142 + i * 62} text={it.n ?? ''} fontFamily={brand.mono} fontSize={18} fill={brand.muted}/>
      <Cond offset={TL} x={170} y={134 + i * 62} text={it.title} fontSize={44} fontWeight={800} fill={brand.ivory}/>
    </Node>)}
    <Node ref={foot} opacity={0}>
      {/* A chapter bar like the player's: one segment per topic. */}
      {p.items.map((_, i) => <Rect ref={segs[i]} x={BAR_X + i * (segW + gap)} y={548} offset={[-1, 0]} width={segW} height={6} radius={3} fill={brand.edge}/>)}
      <Serif offset={TL} x={118} y={572} text={p.chaptersText ?? 'Usa los capítulos para ir a la que te interese.'} fontSize={30} fill={brand.text}/>
    </Node>
  </Frame>);
  yield* cued(ctx, p.items.map((it, i) => [rows[i](), it.cue]), 0.4);
  yield* until(ctx, p.chaptersCue);
  yield* show(foot());
  yield* sequence(0.12, ...segs.map(s => s().fill(brand.ivory, 0.3)));
};

// ── ejemplo: the four questions applied to one sentence ───────────────────────
type EjemploProps = {quote: string; who: string; mark?: Mark;
  rows: {ask?: string; cue?: string; answer: string; detail: string}[]; outro?: string; outroCue?: string};

export const ejemplo: Visual = function* (view, ctx) {
  const p = ctx.beat.props as EjemploProps;
  const card = createRef<Rect>(), outro = createRef<Txt>();
  const pend = p.rows.map(() => createRef<Node>()), done = p.rows.map(() => createRef<Node>()), body = p.rows.map(() => createRef<Node>());
  const Y = (i: number) => 120 + i * 108;
  view.add(<Frame>
    <Kicker text="Un ejemplo"/>
    <R2Card ref={card} quote={`«${p.quote}»`} who={p.who} x={72} y={130} width={360} fontSize={44} opacity={0}/>
    {p.mark && <Pill mark={p.mark} x={72} y={300} offset={TL}/>}
    {p.rows.map((r, i) => <Node>
      <Node ref={pend[i]} opacity={0.6}><R1Chip q={i} state="p" x={570} y={Y(i) + 30} width={150} height={44} fontSize={18}/></Node>
      <Node ref={done[i]} opacity={0}><R1Chip q={i} state="r" x={570} y={Y(i) + 30} width={150} height={44} fontSize={18}/></Node>
      <Node ref={body[i]} opacity={0}>
        <Cond offset={TL} x={672} y={Y(i) + 6} text={r.answer} fontSize={40} fontWeight={800} fill={brand.ivory}/>
        <Para x={672} y={Y(i) + 52} width={540} fontSize={17} text={r.detail}/>
      </Node>
    </Node>)}
    {p.outro && <Serif ref={outro} offset={TL} x={72} y={566} text={p.outro} fontSize={32} fill={brand.text} opacity={0}/>}
  </Frame>);
  yield* show(card());
  for (let i = 0; i < p.rows.length; i++) {
    const r = p.rows[i];
    yield* until(ctx, r.ask);
    yield* pend[i]().opacity(1, 0.3);
    yield* until(ctx, r.cue);
    yield* all(done[i]().opacity(1, 0.4), pend[i]().opacity(0, 0.4), show(body[i]()));
  }
  if (p.outro) { yield* until(ctx, p.outroCue); yield* all(show(outro()), ...body.map(b => b().opacity(0.5, 0.5))); }
};

// ── promesas: both big parties promise; what can be measured of each ──────────
type Figure = {value: string; label: string; cue?: string; mark?: Mark};
type PromesasProps = {
  left: {quote: string; who: string; cue?: string}; right: {quote: string; who: string; cue?: string};
  deliveredTitle: string; deliveredCue?: string; delivered: Figure[]; statement?: string; statementCue?: string;
  noRecord?: {title: string; body: string; cue?: string}; chain?: {text: string; cue?: string}[];
};

export const promesas: Visual = function* (view, ctx) {
  const p = ctx.beat.props as PromesasProps;
  const left = createRef<Rect>(), right = createRef<Rect>(), dTitle = createRef<Txt>(), stmt = createRef<Txt>(), none = createRef<Node>();
  const figs = p.delivered.map(() => createRef<Node>()), chain = (p.chain ?? []).map(() => createRef<Rect>());
  const leftSide = createRef<Node>();
  view.add(<Frame>
    <Kicker text="Las promesas"/>
    <Node ref={leftSide}>
      <R2Card ref={left} quote={p.left.quote} who={p.left.who} x={72} y={124} width={540} fontSize={32} opacity={0}/>
      <Txt ref={dTitle} offset={TL} x={72} y={280} text={p.deliveredTitle.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={13} letterSpacing={1.5} fill={brand.muted} opacity={0}/>
      {p.delivered.map((f, i) => <Node ref={figs[i]} opacity={0}>
        <Cond offset={TL} x={72 + i * 184} y={312} text={f.value} fontSize={40} fill={i === p.delivered.length - 1 ? brand.data.terminadas : brand.ivory}/>
        <Label x={74 + i * 184} y={360} text={f.label} fontSize={14} width={168} textWrap/>
        {f.mark && <Pill mark={f.mark} size={11} x={74 + i * 184} y={420} offset={TL}/>}
      </Node>)}
      {p.statement && <Serif ref={stmt} offset={TL} x={72} y={500} text={p.statement} fontSize={36} width={560} textWrap fill={brand.text} opacity={0}/>}
    </Node>
    <R2Card ref={right} quote={p.right.quote} who={p.right.who} x={668} y={124} width={540} fontSize={32} opacity={0}/>
    {p.noRecord && <Node ref={none} opacity={0}>
      <Txt offset={TL} x={668} y={280} text={p.noRecord.title.toUpperCase()} fontFamily={brand.mono} fontWeight={500} fontSize={13} letterSpacing={1.5} fill={brand.muted}/>
      <Para x={668} y={306} width={540} fontSize={20} fill={brand.text} text={p.noRecord.body}/>
    </Node>}
    {(p.chain ?? []).map((c, i) => <Rect ref={chain[i]} layout offset={TL} x={668 + i * 26} y={392 + i * 58} padding={[10, 18]} radius={8}
      stroke={brand.ivory} lineWidth={1.5} fill={rgba(brand.panel, 0.9)} opacity={0}>
      <Cond text={c.text} fontSize={28} fontWeight={800} fill={brand.ivory}/>
    </Rect>)}
  </Frame>);
  yield* until(ctx, p.left.cue); yield* show(left());
  yield* until(ctx, p.right.cue); yield* show(right());
  yield* until(ctx, p.deliveredCue); yield* show(dTitle());
  yield* cued(ctx, p.delivered.map((f, i) => [figs[i](), f.cue]));
  if (p.statement) { yield* until(ctx, p.statementCue); yield* show(stmt(), 0.6); }
  if (p.noRecord) { yield* until(ctx, p.noRecord.cue); yield* all(leftSide().opacity(0.4, 0.6), show(none())); }
  yield* cued(ctx, (p.chain ?? []).map((c, i) => [chain[i](), c.cue]), 0.4);
};
