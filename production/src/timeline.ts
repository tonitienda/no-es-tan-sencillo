import type {Node} from '@motion-canvas/2d';
import {waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** Output of `video <episode> sync` (tools/timeline.mjs): every time is in seconds. */
export type ResolvedLine = {id: string; text: string; start: number; duration: number; audio: string; provider: string; alignmentSource: string};
export type ResolvedBeat = {
  id: string; visual: string; props: Record<string, any>; start: number; duration: number; transition: number;
  sourceLabel: string | null; sources: string[]; chapter: string | false | null;
  lines: ResolvedLine[];
  /** Seconds from the beat start: "start", "end", each line ID and "<id>:end", plus named cues. */
  cues: Record<string, number>;
};
export type Resolved = {
  version: 1; episode: string; title: string | null; fps: number; resolution: {width: number; height: number};
  duration: number; animatic: boolean; beats: ResolvedBeat[];
  schedule: {id: string; beat: string; start: number; duration: number; audio: string}[];
  chapters: {at: number; title: string; beat: string}[];
};

export type VisualContext = {
  beat: ResolvedBeat;
  resolved: Resolved;
  /** Logical canvas size. Output at 4K renders this same layout at 2x density. */
  width: number; height: number;
  /** Seconds from the beat start of a cue; throws for unknown cues so typos fail in preview. */
  cue(name: string): number;
  /** Wait until a cue. Returns immediately if it already passed. */
  untilCue(name: string): ThreadGenerator;
  /** Seconds since the beat started. */
  elapsed(): number;
  /** Seconds until the beat ends (the next beat starts its transition then). */
  remaining(): number;
  /** The narration line being spoken right now, if any. */
  speaking(): ResolvedLine | null;
};

/**
 * A visual draws into `view` and animates over the beat. The scene ends the beat
 * at its resolved duration whatever the generator does, so a visual can simply
 * build its nodes, animate in on cues and return.
 */
export type Visual = (view: Node, ctx: VisualContext) => ThreadGenerator | void;
export type VisualRegistry = Record<string, Visual>;

export function visualContext(beat: ResolvedBeat, resolved: Resolved, now: () => number, width = 1920, height = 1080): VisualContext {
  const cue = (name: string) => {
    const t = beat.cues[name];
    if (t === undefined) throw Error(`Beat ${beat.id} has no cue "${name}". Known: ${Object.keys(beat.cues).join(', ')}`);
    return t;
  };
  const elapsed = now;
  return {
    beat, resolved, width, height, cue, elapsed,
    untilCue: function* (name: string) { const wait = cue(name) - elapsed(); if (wait > 0) yield* waitFor(wait); },
    remaining: () => beat.duration - elapsed(),
    speaking: () => { const t = elapsed(); return beat.lines.find(l => t >= l.start && t < l.start + l.duration) ?? null; },
  };
}
