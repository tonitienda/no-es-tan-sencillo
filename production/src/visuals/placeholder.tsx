import {Node, Circle, Rect, Txt} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {brand} from '../brand';
import type {Visual} from '../timeline';

const X = (x: number) => x - 960, Y = (y: number) => y - 540;

/**
 * Animatic stand-in for a visual that is not designed yet: shows the beat ID,
 * what the script says is on screen, the line being spoken, and the cue marks on
 * a progress bar so the sync can be judged before the real visual exists.
 */
export const placeholder: Visual = function* (view, ctx) {
  const {beat} = ctx;
  const head = createRef<Rect>();
  const span = 1696, x0 = X(112);
  const cueNames = Object.keys(beat.cues).filter(n => n !== 'start' && n !== 'end' && !n.endsWith(':end') && !beat.lines.some(l => l.id === n));
  view.add(<>
    <Rect width={1920} height={1080} fill={brand.paper}/>
    <Txt text={`${beat.id} · ${beat.visual.toUpperCase()}`} x={X(112)} y={Y(96)} offset={[-1, -1]} fontFamily={brand.mono}
      fontSize={22} fontWeight={600} letterSpacing={2} fill={brand.muted}/>
    <Txt text={String(beat.props.screen ?? beat.props.title ?? 'Visual pendiente')} x={X(112)} y={Y(160)} offset={[-1, -1]}
      width={1696} textWrap fontFamily={brand.sans} fontWeight={700} fontSize={46} lineHeight={58} fill={brand.ink}/>
    <Rect x={X(112) + 848} y={Y(640)} width={1696} height={2} fill={brand.rule}/>
    <Txt text={() => ctx.speaking()?.text ?? ''} x={X(112)} y={Y(680)} offset={[-1, -1]} width={1696} textWrap
      fontFamily={brand.sans} fontSize={34} lineHeight={46} fill={brand.muted}/>
    <Rect x={x0 + span / 2} y={Y(930)} width={span} height={6} radius={3} fill={brand.rule}/>
    {beat.lines.map(l => <Rect x={x0 + span * (l.start + l.duration / 2) / beat.duration} y={Y(930)}
      width={Math.max(2, span * l.duration / beat.duration)} height={6} radius={3} fill={brand.muted}/>)}
    {cueNames.map(n => <Node>
      <Circle x={x0 + span * beat.cues[n] / beat.duration} y={Y(930)} size={16} fill={brand.accent}/>
      <Txt text={n} x={x0 + span * beat.cues[n] / beat.duration} y={Y(900)} fontFamily={brand.mono} fontSize={16} fill={brand.ink}/>
    </Node>)}
    <Rect ref={head} x={() => x0 + span * Math.min(1, ctx.elapsed() / beat.duration)} y={Y(930)} width={4} height={34} fill={brand.ink}/>
    <Txt text={() => `${ctx.elapsed().toFixed(1)} / ${beat.duration.toFixed(1)} s`} x={X(1808)} y={Y(960)} offset={[1, -1]}
      fontFamily={brand.mono} fontSize={18} fill={brand.muted}/>
  </>);
};
