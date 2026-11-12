import './fonts';
import {makeScene2D, Node, Rect} from '@motion-canvas/2d';
import {all, any, createRef, useThread, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {brand} from './brand';
import {cartela, intro, outro} from './cards';
import {Frame, R1Hud, R3, type Mark} from './kit';
import {visualContext, type Resolved, type VisualRegistry} from './timeline';
import {placeholder} from './visuals/placeholder';

export const builtInVisuals: VisualRegistry = {intro, outro, cartela, placeholder};

/**
 * One scene for the whole episode. Each beat gets its own layer that crossfades in
 * over `transition` seconds; the beat lasts exactly its resolved duration (set by
 * the measured narration), regardless of how long its visual's animation runs.
 *
 * HUD (never part of the world planes): R1 top right from `props.r1` ("rhpx", one
 * letter per question) with `props.focus` as the question being asked; R3 bottom
 * left from `sourceLabel` with `props.mark` (nuestra | segun | estimacion).
 */
export function createEpisodeScene(resolved: Resolved, visuals: VisualRegistry) {
  const registry = {...builtInVisuals, ...visuals};
  for (const b of resolved.beats) if (!registry[b.visual])
    throw Error(`Beat ${b.id} uses visual "${b.visual}", which is not exported from the episode's visuals.ts`);
  return makeScene2D(function* (view) {
    view.fill(brand.night);
    const thread = useThread();
    let previous: Node | undefined;
    for (const beat of resolved.beats) {
      const started = thread.time();
      const layer = createRef<Rect>(), content = createRef<Node>();
      const p = beat.props as {r1?: string; focus?: number; mark?: Mark; r1Steps?: {cue: string; r1: string; focus?: number}[]};
      const hud = createRef<Node>();
      view.add(<Rect ref={layer} width={1920} height={1080} clip fill={brand.night} opacity={beat.transition ? 0 : 1}>
        <Node ref={content}/>
        <Frame>
          <Node ref={hud}>{p.r1 && <R1Hud code={p.r1} focus={p.focus}/>}</Node>
          {beat.sourceLabel && <R3 text={beat.sourceLabel} mark={p.mark}/>}
        </Frame>
      </Rect>);
      const ctx = visualContext(beat, resolved, () => thread.time() - started);
      const prev = previous;
      function* enter(): ThreadGenerator {
        if (beat.transition) yield* layer().opacity(1, beat.transition);
        if (prev) { prev.remove(); prev.dispose(); }
      }
      // props.r1Steps: the HUD answers questions mid-beat, on cue (0.5 s crossfade).
      function* r1Steps(): ThreadGenerator {
        for (const step of p.r1Steps ?? []) {
          if (!(step.cue in beat.cues)) continue;
          yield* ctx.untilCue(step.cue);
          const old = hud().children()[0], next = (<R1Hud code={step.r1} focus={step.focus} opacity={0}/>) as unknown as Node;
          hud().add(next);
          yield* all(next.opacity(1, 0.5), old ? old.opacity(0, 0.5) : waitFor(0));
          old?.remove();
        }
      }
      const animation = registry[beat.visual](content(), ctx) ?? waitFor(0);
      yield* any(all(enter(), animation, r1Steps()), waitFor(beat.duration));
      const left = beat.duration - (thread.time() - started);
      if (left > 1e-6) yield* waitFor(left);
      previous = layer();
    }
  });
}
