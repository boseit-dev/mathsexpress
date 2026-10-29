# MathsExpress 2.0: side panels and motion handover

Written 29 October 2026 for whoever builds the rest of the "Animated Side Panels, Motion Graphics &
Bug Fixes" brief (a person or another AI assistant such as ChatGPT). Read `CLAUDE.md` first: its
rules still apply. Also read `docs/phase-2-handover.md` for the open Phase 2 items.

## Already done (part 1 of the brief: the infinite loading screen)

**Cause.** No request to Supabase had a time limit. When the server accepts the connection but
never answers, the first page's loader waits for ever. React Router shows the loading screen until
that loader finishes, so the page stayed on "Loading MathsExpress…". This happens with the local
Docker stack after the Mac sleeps, or while its containers restart. To reproduce it, pause the
auth container (`docker pause supabase_auth_mathsexpress-v2`). A `curl` to the auth server then
hangs until it is cut off. Remember to `docker unpause` it afterwards.

**Fix.**

- `src/data/supabase/client.ts`: every Supabase request goes through `fetchWithTimeout`, which
  gives up after 15 seconds (`REQUEST_TIMEOUT_MS`). The caller's own abort signal still works.
- `src/data/supabase/errors.ts`: a request that ran out of time becomes the `network` error, so
  the existing error page shows "Try again". Two forms are recognised:
  - a `TimeoutError`;
  - the database client's `"TimeoutError: …"` and `"TypeError: Failed to fetch"` messages, which
    it used to miss.
- The Google sign-in check uses the same time limit.
- `src/app/pages/LoadingScreen.tsx`: after 20 seconds it says the page is taking longer than usual
  and offers a Reload button. This is a safety net for any other cause.
- Tests: `client.test.ts`, `errors.test.ts` and `LoadingScreen.test.tsx`.

**Checked.** In the browser with the auth and database API containers paused, the start page
continued to sign-in instead of hanging. Google sign-in then showed "isn't available yet".

**Not checked.** The signed-in case with a stalled server. It should reach the error page with
"Try again" after about 15 seconds, so test it with a signed-in student and a signed-in teacher.

## Still to build (parts 2 to 9 of the brief)

### Ground rules

- Keep the Study Journal home page as it is. Don't copy anything from Mathspace: no layouts,
  illustrations, mascot, backgrounds, task cards or distinctive animations.
- The official capybara mascot now exists. Use `<Mascot />` from `src/components/mascot/`
  (see `src/assets/mascot/README.md`); never add a different or placeholder animal.
- Don't add fake features:
  - There is **no coins, shop, leaderboard score, challenge or achievement data in the
    database** yet. The only real data is accounts, classes and class members.
  - Panels that show sample data must carry the existing `SampleDataBadge`
    (`src/components/ui/SampleDataBadge.tsx`) and say plainly it is a preview.
  - Shop "Buy" buttons must be disabled with a "Coming soon" label. Never pretend a purchase
    worked.
- Don't change authentication, the database, existing accounts or deployment.

### What the project already has

- **Stack:** React 19, TypeScript (strict), Vite, React Router data router, CSS Modules,
  `lucide-react` icons, Vitest with Testing Library and `vitest-axe`. There is no animation
  library. Plain CSS transitions are enough, so don't add Framer Motion unless it is truly needed.
- **Design tokens** live in `src/styles/tokens.css`:
  - blue `--color-brand-primary` `#3d52a0` and `--color-brand-secondary` `#7091e6`;
  - lavender `--color-brand-pale` `#ede8f5` and `--color-brand-soft` `#adbbda`;
  - logo violet `--color-logo-violet`.
  - There is only one motion token, `--transition-fast`. Add more there, for example:
    `--motion-panel: 300ms cubic-bezier(0.22, 1, 0.36, 1)` and `--motion-stagger: 40ms`.
- **Reduced motion:** `src/styles/global.css` already shortens every animation to almost nothing.
  Still check that nothing depends on an animation finishing, e.g. use `transitionend` with a
  fallback timer.
- **Reusable UI** in `src/components/ui/`: `Panel`, `ProgressBar`, `ProgressRing`, `CoinAmount`,
  `CoinIcon`, `Avatar`, `StatusBadge`, `IconTile`, `Button`, `ButtonLink`, `VisuallyHidden`.
- **Student layout:** `src/layouts/student/StudentLayout.tsx`, with routes in
  `src/app/studentRoutes.tsx`. The current student comes from `useCurrentStudent()`. Their
  classes come from the layout loader.
- `/shop` and `/more` are "planned" placeholder pages. The panels can link to them.

### Suggested structure

```
src/features/side-panels/
  SidePanelToolbar.tsx        # the five buttons, right edge; "More" button on phones
  SidePanel.tsx               # the sliding dialog (shared shell)
  useSidePanel.ts             # which panel is open (only one), ?panel= in the URL is optional
  panels/LeaderboardPanel.tsx
  panels/ShopPanel.tsx
  panels/ChallengesPanel.tsx
  panels/AchievementsPanel.tsx
  panels/RewardsPanel.tsx
  previewData.ts              # all sample data in one place, clearly named as preview
  *.module.css, *.test.tsx
```

Render `SidePanelToolbar` once inside `StudentLayout`, so it appears only on student pages.

### The panel shell (the most important part)

- Use a native `<dialog>` opened with `showModal()`. That gives focus trapping, the Escape key,
  `inert` page content and a `::backdrop` for free.
- Give it `aria-labelledby` pointing at the panel heading.
- **Opening:**
  - the clicked button scales to 0.92 and back over about 150 ms (the "bounce");
  - the backdrop fades to about 35% dark navy;
  - the panel slides in from `translateX(100%)` over about 300 ms;
  - the heading, then each card, fade and rise 8 px, each starting 40 ms after the one before
    (set `--i` on each card and use `transition-delay: calc(var(--i) * var(--motion-stagger))`).
- **Closing** reverses the animation. Wait for `transitionend` (or 350 ms) before calling
  `dialog.close()`.
- **Closing controls:** the close button, the Escape key (handle the `cancel` event so the closing
  animation still plays) and a click on the backdrop (`event.target === dialog`).
- **Focus:** on opening, move it to the heading or the close button. On closing, return it to the
  toolbar button that opened the panel.
- **Only one panel at a time:** opening another replaces the content, so the panel doesn't slide
  out and back in.
- **Width:** `min(420px, 100vw)`, full height, with its own scroll. On phones, use the full width.

### Toolbar

- **Desktop and tablet:** a compact vertical pill on the right edge, vertically centred, with five
  icon buttons:

  | Panel            | Icon            |
  | ---------------- | --------------- |
  | Leaderboard      | `Trophy`        |
  | Shop             | `ShoppingBag`   |
  | Daily challenges | `CalendarCheck` |
  | Achievements     | `Award`         |
  | Rewards          | `Gift`          |
  - Each button has an `aria-label` and a tooltip shown on hover and focus. Don't rely on `title`.
  - Hover: lift 2 px and tint lavender. Pressed: `scale(0.94)`. The open panel's button has
    `aria-expanded="true"` and stays highlighted.

- **Phones (under 768 px):** one round "More" button at the bottom right, above the safe area
  (`env(safe-area-inset-bottom)`). It opens a small menu of the five options. It must not cover
  the header navigation or the guided lesson's Check and Next buttons. Hide it on
  `/learn/:lessonId`, or move it above the lesson footer.
- Avoid horizontal scrolling at 320 px wide.

### Panel contents

| Panel            | Real data available now                             | Preview (badge it)                                                                                         |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Leaderboard      | Class name and classmates' names (class repository) | Scores and positions. Highlight the current student's row.                                                 |
| Shop             | —                                                   | Items, prices and previews. Coin balance. Buy is disabled ("Coming soon").                                 |
| Daily challenges | —                                                   | Three challenges with a `ProgressBar` and a completed state.                                               |
| Achievements     | —                                                   | Unlocked and locked badges, each saying how to earn it. Reveal unlocked ones with a gentle scale and fade. |
| Rewards          | —                                                   | Coin total, history list (empty state if none) and the next milestone with a `ProgressRing`.               |

Every panel needs loading, empty and error states. If the student isn't in a class, the
leaderboard says so and links to the Class page.

### Motion around the site (part 5)

Keep it calm: nothing loops, nothing flashes, and no particles except one small celebration.

- **Page transitions:** a 200 ms fade and 4 px rise on `<main>` when the path changes.
  `document.startViewTransition` with a fallback is fine.
- **Buttons:** add `:active { transform: scale(0.97) }` to the shared button styles
  (`src/components/ui/buttonStyles.ts` and `Button.module.css`).
- **Cards:** lift 2 px with a slightly stronger shadow on hover, only under
  `@media (hover: hover)`.
- **Progress:** animate `ProgressBar` and `ProgressRing` widths over 400 ms.
- **Notifications:** `FormMessage` successes slide down 6 px and fade in.
- **Guided lesson** (`src/features/learning/GuidedLessonPage.tsx`):
  - correct answer: a short green pulse on the answer;
  - wrong answer: a gentle shake (no red flashing), and the message stays kind;
  - lesson complete: one celebration, e.g. a burst of 12 small geometric shapes (triangles,
    circles, plus signs) in brand colours that fades within 1 second.
- **Decoration:** optional faint geometric maths shapes (grid dots, protractor arcs) in
  `StudentBackdrop`. Keep them static, not animated.

### Tests to add

- The toolbar renders five buttons with names. Each opens its panel, and the heading is announced.
- Escape, the close button and a backdrop click close the panel, and focus returns to the right
  button.
- Opening a second panel replaces the first; only one dialog is ever open.
- Shop buy buttons are disabled; preview panels show `SampleDataBadge`.
- On phones, the "More" button opens the menu, and it is hidden on lesson pages.
- Run `vitest-axe` on each open panel.
- jsdom has no `HTMLDialogElement.showModal`. Add a small stub in `src/test/setup.ts` if it is
  missing.

## How to check and ship

1. `npm run check` must pass: Prettier, ESLint, TypeScript, tests and the build. One home page
   test (`src/features/student-home/StudentHomePage.test.tsx`) failed once under load, then passed
   when re-run. If it fails again, find what it waits on and remove that timing dependence.
2. Try it in the browser with the local stack (`supabase start`, `npm run dev`):
   - as a student and as a teacher;
   - desktop, 768 px and 375 px wide;
   - with "reduce motion" switched on in the operating system;
   - in Chrome and Safari;
   - and look for console errors.
3. Commit on `mathsexpress-v2` with the detailed message format in `CLAUDE.md`. The `Version:`
   line must match `package.json` (currently `2.0.0-alpha.3`). Then push. The pre-push hook runs
   the checks.
4. Never merge into `main`, force-push, use `--no-verify`, deploy, or touch the old production
   Supabase project.
