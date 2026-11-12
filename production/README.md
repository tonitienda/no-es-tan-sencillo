# Producción de vídeo

From a finished script and its visuals to a 4K video and its YouTube copy. Ported
from agent-world-lab's production pipeline (Motion Canvas, Vite, Playwright,
FFmpeg) without the gameplay cameras. The difference: here **the narration sets
the timing**. Each beat lasts as long as its measured audio, and animations sync
to specific spoken words using ElevenLabs character timestamps.

```sh
npm install && npx playwright install chromium   # once; also needs ffmpeg/ffprobe on PATH
npm run video -- 03-vivienda narration           # script → narration.json
npm run video -- 03-vivienda scaffold            # first time only: timeline.json, visuals.ts, …
npm run video -- 03-vivienda audio               # ElevenLabs (or --placeholder for an animatic)
npm run video -- 03-vivienda preview             # Motion Canvas editor with sound
npm run video -- 03-vivienda render              # 4K/60 → production/output/03-vivienda.mp4
npm run video -- 03-vivienda check               # format, frames, black frames, audible narration
npm run video -- 03-vivienda youtube             # episodes/03-vivienda/production/youtube.md
npm run video -- 03-vivienda all                 # narration → audio → sync → render → check → youtube
```

`render --draft` writes a 1080p/30 review copy (`<episode>.draft.mp4`), about 3×
faster. A full 4K/60 export of a 15-minute episode is ~54,000 frames: plan
for over an hour. Any placeholder narration makes the export an
`<episode>.animatic.mp4`, so it can't be mistaken for the final cut.

## Files

| Where | What | Who edits |
|---|---|---|
| `episodes/<ep>/production/episode.json` | Script and ledger paths, pronunciation, intro/outro copy, YouTube copy | you |
| `episodes/<ep>/production/narration.json` | Lines extracted from the script (`s4-02` = section 4, paragraph 2) | generated |
| `episodes/<ep>/production/timeline.json` | Beats: visual, lines, cues, source label | you |
| `episodes/<ep>/production/visuals.ts` | The episode's visuals, by name | you |
| `production/public/<ep>/audio/<line>.wav` + `.json` | Narration and its character timings | generated, committed |
| `production/public/<ep>/music/` | Optional licensed music bed | you |
| `episodes/<ep>/production/build/` | Resolved timeline (derived) | generated, ignored |
| `production/voices.json` | ElevenLabs model and narrator voice | you |
| `production/src/brand.ts` | Colours and fonts (provisional until the design is settled) | you |

## The script format

`narration` reads the guion named in `episode.json`. It reads only numbered
sections (`## 4. Primera frase: construir (2:05)`). Each blockquote paragraph
(`> …`) becomes one audio clip. `**PANTALLA:** …` starts a screen block, and
`*Fuentes: V8, V7.*` records the section's sources. Unnumbered sections (notes,
checklists) are skipped. Open alternatives such as
`[sigue en vigor / no se convalidó]` block `audio` until the script resolves
them. `--placeholder` still reads them, for the animatic.

Line IDs are positional. If you add a paragraph, rerun `narration`. `sync` then
reports exactly which line is unplaced or out of order. It never moves audio
silently. Audio is cached by its exact text and voice settings, so only edited
lines are regenerated (and charged).

`episode.json` → `pronunciation` is a list of `[written, spoken]` pairs applied
only to what the voice reads (e.g. `["IBI", "I-B-I"]`). Cue phrases match the
spoken text.

## timeline.json

```json
{
  "version": 1, "fps": 60, "resolution": {"width": 3840, "height": 2160},
  "defaults": {"gap": 0.35, "padBefore": 0.4, "padAfter": 0.6, "transition": 0.4},
  "music": {"file": "bed.mp3", "volume": 0.12, "attribution": {"title": "…", "artist": "…", "text": "exact licensor credit"}},
  "beats": [
    {"id": "intro", "visual": "intro", "duration": 5, "props": {"kicker": "Vivienda", "title": "…", "premise": "…", "facts": []}},
    {"id": "E03", "visual": "barras", "lines": ["s2-01"],
     "sourceLabel": "INE, censo de 2021", "sources": ["V9"],
     "cues": {"viviendas": "26,6 millones", "hogares": {"phrase": "18,5 millones", "edge": "start", "offset": -0.1}},
     "props": {"title": "…", "bars": [{"label": "Viviendas", "value": 26.6, "display": "26,6 M", "color": "viviendas", "cue": "viviendas"}]}},
    {"id": "E02", "visual": "cartela", "duration": 2.5, "props": {"text": "NO ES TAN SENCILLO"}},
    {"id": "outro", "visual": "outro", "minDuration": 20, "transition": 0, "props": {"title": "…", "question": "…", "prompt": "…"}}
  ]
}
```

- **Duration.** For a beat with `lines`, it is `padBefore` + the clips + `gap` between clips + `padAfter`, rounded up to whole frames. `minDuration` holds the visual longer. `pauseAfter: {"s3-04": 1.5}` adds silence after one line inside the beat. A silent beat needs `duration`. Every narration line is used exactly once, in script order.
- **Cues** are named moments, in seconds from the beat start. A cue can be a phrase (`occurrence`, `edge: "end"`, `offset`, optionally `line`) or `{"at": 3.2}`. Each line ID and `<id>:end` is also a cue, along with `start` and `end`. An unknown phrase fails at `sync`, before rendering.
- **sourceLabel** is the R3 line at the bottom of the screen: source, date and mark. `sync` warns when a beat narrates figures without one (`false` silences that on purpose). **sources** are ledger IDs; they must exist in the ledger and are listed in the YouTube description.
- **chapter**: chapters default to the script's sections, at the first beat that speaks each one. Set a string to rename, or `false` to skip. `youtube` enforces YouTube's rules: starts at 0:00, at least three, each at least 10 s.
- **transition** is a crossfade at the start of a beat; it never shifts narration.

Built-in visuals: `intro` (opening splash), `outro` (≥ 20 s end screen with
panels where YouTube's two videos and subscribe button go; see
`templates/end-screen-guides.svg`), `cartela` (full-screen title) and
`placeholder` (animatic: the screen description, current line and cue marks).
`production/src/visuals/barras.tsx` is a worked example of a data visual.

## Writing a visual

A visual is a Motion Canvas generator: build nodes into `view`, then animate on cues.

```tsx
import {Rect} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import type {Visual} from '../../../production/src/timeline';

export const deficit: Visual = function* (view, ctx) {
  const bar = createRef<Rect>();
  view.add(<Rect ref={bar} width={0} height={80} fill="#17191E"/>);
  yield* ctx.untilCue('setecientas');     // timeline: "cues": {"setecientas": "750.000"}
  yield* bar().width(1200, 0.8);
};
```

Register it in `episodes/<ep>/production/visuals.ts` and set `"visual": "deficit"`.
The scene ends the beat at its resolved duration whatever the generator does.
`ctx` also gives `cue(name)`, `elapsed()`, `remaining()`, `speaking()`, the beat
(`ctx.beat.props`, `ctx.beat.lines`) and the whole resolved timeline. Lay out on
the 1920×1080 logical canvas (origin at the centre); 4K renders the same layout
at twice the density. Wrap repeated JSX from `.map()` in a `<Node>`: fragments
returned from `map` are dropped.

## Voice

Set `narrator.voiceId` in `voices.json` (a Spanish ElevenLabs voice) and
`ELEVENLABS_API_KEY` in `.env.local`. `audio --dry-run` shows how many characters
would be sent. `continuity: true` passes neighbouring text for smoother prosody
across clips; it regenerates neighbours when a line changes. Clips are activated
only after every request succeeds; replaced WAVs are backed up in
`production/.cache/audio-backups/`.

## Preview and manual export

`preview` validates, retimes and mixes before opening the editor, so the preview
always matches the audio. Unmute the speaker control to hear narration.
Restart after editing JSON or audio. For a manual export, choose **No es tan
sencillo MP4** in Render Settings. Use 1920×1080 at 200% scale and 60 fps (the
timeline's output); drafts go through `render --draft`.
