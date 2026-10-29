# The MathsExpress capybara

The official MathsExpress mascot: a simple, flat, friendly capybara, drawn from the owner's two
mascot design sheets. It is MathsExpress's own character. Never copy another product's mascot,
layout or animation style into it.

See and test everything at **`/mascot`** (the mascot workshop page, not linked from the site):
every view, expression, pose and animation, a reduced-motion switch, and a controller demo that
fires real website events.

## Character rules

- **Capybara**: rounded, slightly elongated head and body, a large rounded brown snout with
  small nostrils, small round ears, a two-strand tuft, simple black oval eyes, short legs, small
  paws, a cream belly and a subtle tail.
- **No mouth, ever.** Emotion comes from the eyes, eyebrows, head tilt, arms and body.
- **Flat colours only**, from `palette.ts`: body `#E8B274`, dark body `#C98B52`, snout and
  feet `#8B5E3C`, belly `#F6D7AB`, eyes `#2B2B2B`, eyebrows `#4A4A4A`. One soft, darker side
  shade is the only shading.
- **The same proportions everywhere.** This is enforced by construction, not by hand:
  - The body parts are drawn once, in `rig.ts`, for five base views. The three left-facing
    views are exact mirror images of the right-facing ones.
  - Poses never redraw the body. They only turn joints (shoulders, hips, neck, the whole body)
    and choose a face and props.
  - Tests check that every pose uses only palette colours for the character and has no mouth.

## Files

| Path                                                              | What it is                                                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/assets/mascot/palette.ts`                                    | Character and prop colours.                                                               |
| `src/assets/mascot/rig.ts`                                        | **Editable source artwork**: every body part's shape and joint position per view.         |
| `src/assets/mascot/svg/`                                          | Transparent SVG exports: `views/`, `poses/`, `expressions/` (head close-ups).             |
| `src/assets/mascot/png/`                                          | Transparent PNG exports: views at 512 and 1024 px tall, poses at 512, expressions at 256. |
| `src/components/mascot/Mascot.tsx`                                | The component the site uses.                                                              |
| `src/components/mascot/MascotFigure.tsx`                          | Draws one pose as layered SVG.                                                            |
| `src/components/mascot/PropArt.tsx`                               | Props and effects: book, calculator, pointer, whiteboard, medal, confetti and more.       |
| `src/components/mascot/poses.ts`                                  | Pose definitions (joint angles, face, props).                                             |
| `src/components/mascot/expressions.ts`                            | Faces (eyes and eyebrows).                                                                |
| `src/components/mascot/animations.ts`                             | Animation definitions: starting pose, cycle length, loop or one-shot.                     |
| `src/components/mascot/Mascot.module.css`                         | The keyframes for every animation, and reduced motion.                                    |
| `src/components/mascot/useMascotController.ts`                    | The animation controller (resting state plus event reactions).                            |
| `src/components/mascot/exportArt.tsx`, `scripts/export-mascot.ts` | The export pipeline (`npm run mascot:export`).                                            |
| `src/features/mascot/MascotPreviewPage.tsx`                       | The `/mascot` workshop page.                                                              |

## Using it

```tsx
<Mascot pose="thinking" size="medium" />          // a still pose
<Mascot animation="wave" />                         // loops
<Mascot animation="reading" cycles={2} />           // plays twice, then holds still
<Mascot pose="pointing" view="front-left" />        // faces the other way
<Mascot animation="wave" label="The MathsExpress capybara waving hello" />
```

- `size`: `small` (72 px), `medium` (132), `large` (200), `hero` (260) or a number of pixels.
  It sets the height; a page can override it with CSS (`block-size`) for responsive sizes.
- `label`: only when the mascot carries meaning that no nearby text gives. Without it the
  mascot is decorative and hidden from screen readers, which is the usual case.
- `motion="reduce"`: forces the still pose (used by the workshop's reduced-motion switch).

### Reacting to website events

```tsx
const mascot = useMascotController('idle');
// on a real event:
mascot.play('correct'); // plays once, then eases back to rest
mascot.setRest('thinking', { cycles: 2 }); // what it does between reactions
<Mascot {...mascot.bind} />;
```

The controller keeps one resting animation and plays short reactions on top. A new event
replaces the current reaction, so the mascot never lags behind the page. Poses ease into each
other (each joint has a pose layer with a transition and a separate keyframe layer), so changing
state is smooth rather than a jump cut.

## Views

`front`, `front-right`, `right`, `back-right`, `back`, `back-left`, `left`, `front-left`.
"Right" means facing the right of the screen. The left-facing views mirror the right-facing
ones, so they can never drift apart.

## Expressions

`neutral`, `happy`, `excited`, `surprised`, `thinking`, `confused`, `determined`, `worried`,
`proud`, `calm`, `sleepy`, `sleeping`, `curious`, `focused`, `reading`, `encouraging`. All
change only the eyes and eyebrows.

## Poses

| Name          | Pose                     | View        | Face        |
| ------------- | ------------------------ | ----------- | ----------- |
| `standing`    | Standing                 | front-right | neutral     |
| `waving`      | Waving                   | front-right | happy       |
| `walking`     | Walking                  | right       | neutral     |
| `running`     | Running                  | right       | determined  |
| `jumping`     | Jumping                  | front-right | excited     |
| `sitting`     | Sitting                  | front-right | happy       |
| `lyingDown`   | Lying down               | right       | calm        |
| `sleeping`    | Sleeping                 | right       | sleeping    |
| `reading`     | Reading a book           | front-right | reading     |
| `calculator`  | Holding a calculator     | front-right | focused     |
| `pointing`    | Pointing with a pointer  | front-right | happy       |
| `teaching`    | Teaching at a whiteboard | front-right | happy       |
| `thinking`    | Thinking                 | front-right | thinking    |
| `confused`    | Confused                 | front-right | confused    |
| `idea`        | Lightbulb idea           | front-right | excited     |
| `celebrating` | Celebrating              | front       | excited     |
| `clapping`    | Clapping                 | front-right | happy       |
| `thumbsUp`    | Thumbs-up                | front-right | happy       |
| `supportive`  | Supportive               | front-right | encouraging |
| `medal`       | Holding a medal          | front-right | proud       |
| `certificate` | Holding a certificate    | front-right | proud       |
| `writing`     | Writing maths            | front-right | focused     |
| `laptop`      | Using a laptop           | front-right | focused     |
| `peeking`     | Peeking around a wall    | front-left  | curious     |
| `cheering`    | Cheering                 | front-right | happy       |
| `waking`      | Waking up                | front-right | neutral     |
| `danceStep`   | Victory dance            | front       | happy       |
| `graduate`    | Lesson complete          | front       | excited     |
| `levelUp`     | Level up                 | front       | proud       |

## Animations

| Name             | Animation          | Group    | Starts from  | Type     | Cycle | What happens                                                          |
| ---------------- | ------------------ | -------- | ------------ | -------- | ----- | --------------------------------------------------------------------- |
| `idle`           | Idle breathing     | movement | `standing`   | Loop     | 3.6 s | Breathes slowly and blinks now and then. The default resting state.   |
| `blink`          | Blinking           | movement | `standing`   | Loop     | 2.6 s | A natural double blink, then a pause.                                 |
| `wave`           | Waving             | movement | `waving`     | One-shot | 1.8 s | Three waves with a small head tilt.                                   |
| `walk`           | Walking            | movement | `walking`    | Loop     | 0.9 s | A walk cycle on the spot: legs, arms and a soft bob.                  |
| `run`            | Running            | movement | `running`    | Loop     | 0.5 s | A faster cycle, leaning forward, with speed lines.                    |
| `jump`           | Jumping            | movement | `jumping`    | One-shot | 1.1 s | Crouches, springs up and lands with a soft squash.                    |
| `peek`           | Peeking            | movement | `peeking`    | Loop     | 3.6 s | Peeks out from behind a wall, ducks back and peeks out again.         |
| `sleep`          | Sleeping           | movement | `sleeping`   | Loop     | 3.6 s | Lies down and breathes slowly while z’s float up.                     |
| `wakeUp`         | Waking up          | movement | `waking`     | One-shot | 2.8 s | Opens its eyes, stretches both arms up and settles.                   |
| `thinking`       | Thinking           | learning | `thinking`   | Loop     | 2.4 s | Paw on chin and eyes up while thought bubbles appear in turn.         |
| `confused`       | Confused           | learning | `confused`   | Loop     | 2.0 s | Scratches its head and tilts side to side under a question mark.      |
| `idea`           | Lightbulb idea     | learning | `idea`       | One-shot | 2.4 s | A lightbulb pops on above its head and glows.                         |
| `reading`        | Reading            | learning | `reading`    | Loop     | 3.6 s | Sits with a book, eyes moving along the lines, turning a page.        |
| `writing`        | Writing maths      | learning | `writing`    | Loop     | 1.8 s | Writes at a desk; the working appears line by line.                   |
| `teaching`       | Teaching           | learning | `teaching`   | Loop     | 2.4 s | Taps the whiteboard with a pointer as the sum appears.                |
| `calculator`     | Using a calculator | learning | `calculator` | Loop     | 1.4 s | Taps calculator keys while the screen updates.                        |
| `encouraging`    | Encouraging        | learning | `thumbsUp`   | One-shot | 1.6 s | A bouncy thumbs-up with sparkles.                                     |
| `correct`        | Correct answer     | feedback | `cheering`   | One-shot | 1.3 s | A small happy hop with arms up and a few stars.                       |
| `incorrect`      | Incorrect answer   | feedback | `supportive` | One-shot | 2.2 s | A kind, reassuring nod and an open paw. Never mocking.                |
| `clap`           | Clapping           | feedback | `clapping`   | Loop     | 0.7 s | Claps in front of its chest with little sparkles.                     |
| `dance`          | Victory dance      | feedback | `danceStep`  | Loop     | 1.2 s | Sways, steps and swaps arms to the beat.                              |
| `medal`          | Medal presentation | feedback | `medal`      | One-shot | 2.4 s | Lifts a medal that swings and shines.                                 |
| `lessonComplete` | Lesson completed   | feedback | `graduate`   | One-shot | 2.4 s | A full celebration: mortarboard, jump and a confetti burst.           |
| `levelUp`        | Level up           | feedback | `levelUp`    | One-shot | 2.6 s | Rises in a golden glow with twinkling stars. Used for perfect scores. |

"One-shot" reactions are played once by the controller; on the workshop page they loop so they
are easy to review. Looping animations used on pages are given a small `cycles` count so the
mascot settles instead of moving all the time.

## Where it appears

| Page                      | Real event                        | Mascot                                               |
| ------------------------- | --------------------------------- | ---------------------------------------------------- |
| Student home              | Student arrives (once per tab)    | `wave` twice, then idle breathing and blinking       |
| Learn                     | Browsing lessons                  | Each lesson card: `reading` pose                     |
| Learn                     | Lesson card hovered or focused    | `pointing` at the topic (CSS crossfade, no script)   |
| Learn                     | No class yet / no lessons yet     | `peek` / `reading`, twice then still                 |
| Guided lesson             | Wrong answer                      | `incorrect` (kind, supportive)                       |
| Guided lesson             | Hint requested                    | `idea`, then `thinking` twice while the hint is read |
| Guided lesson             | Right answer                      | `correct`, then idle                                 |
| Guided lesson             | Lesson finished                   | `lessonComplete`, or `levelUp` for a perfect run     |
| First page load           | Waiting for data                  | `walk` on the spot                                   |
| Home: assigned tasks      | No tasks                          | `reading`, once                                      |
| Class (student)           | Not in a class                    | `peek`, twice                                        |
| Quick tools: achievements | Panel opened                      | `medal`, once                                        |
| Quick tools: challenges   | A (sample) challenge is completed | `clap`, three times                                  |
| Teacher home              | Visit                             | `teaching` at the whiteboard, twice                  |
| Teacher classes           | No classes yet                    | `certificate` pose                                   |

Daily challenges, coins and achievements are still sample data, so the challenge and medal
reactions run on the labelled preview panels. They are ready for real data.

## Accessibility and reduced motion

- Decorative by default (`aria-hidden`); text on the page always says what happened.
- `prefers-reduced-motion: reduce` turns off every keyframe and transition: the mascot shows the
  still key pose of each animation, with its props and effects visible. Reactions still change
  the pose, held long enough (at least 1.4 s) to be noticed.
- Nothing flashes, and reactions never loop on lesson pages.

## Exporting artwork

```bash
npm run mascot:export
```

This renders the SVGs straight from the React components (so the exports always match the site)
and makes transparent PNGs with headless Chrome (`CHROME_PATH` if Chrome is elsewhere,
`--svg-only` to skip PNGs). The SVGs keep named groups (`data-part="arm-right"`, `head`,
`torso`…), so they open as editable layers in Figma or Illustrator. Commit the regenerated files.

## Rive

No Rive file is included. Genuine, editable `.riv` files need the Rive editor, which is not
available to the tools that built this mascot, and shipping something that only claims to be a
Rive file would be misleading. The SVG and CSS system needs no extra library. If Rive is wanted
later, import the layered SVGs from `svg/` into the Rive editor: the parts are already separate
and named, with joints at the shoulders, hips and neck.

## Adding a pose or an animation

1. **A pose**: add it to `poses.ts`: a view, a body (`stand`, `sit` or `lie`), a face, two arm
   angles and any props. Never add new body shapes for a pose.
2. **An animation**: add it to `animations.ts` with its starting pose and cycle length, then add
   rules and keyframes in `Mascot.module.css` keyed on `[data-animation='name']` and the joints'
   `data-p` names. Keep keyframes as small offsets from the pose, and make a loop's last frame
   a natural resting frame.
3. Check it on `/mascot` (including the reduced-motion switch), run `npm run mascot:export` and
   `npm run check`.
