# MathsExpress 2.0: summary of work done by Claude (for another AI assistant)

This file explains what was built in the MathsExpress 2.0 rebuild during this stretch of work,
how it fits together, and the rules the owner set. Read it before changing anything. The
project's permanent rules are in `CLAUDE.md` at the repository root; they win if anything here
disagrees.

## The project in one paragraph

MathsExpress 2.0 is a K–12 maths learning website for NSW students and teachers, rebuilt from
scratch. Repository: `boseit-dev/mathsexpress` (public). All work happens on the
`mathsexpress-v2` branch; `main` changes only by pull request. Stack: React 19, TypeScript
(strict), Vite 8, React Router 8 (data router: loaders, actions, fetchers), CSS Modules with
design tokens (`src/styles/tokens.css`), Vitest with Testing Library and axe, and Supabase
(Postgres with row-level security, all writes through `security definer` RPC functions).
Version label: `2.0.0-alpha.3`.

## Owner's standing rules (keep these)

- Work only on `mathsexpress-v2`. Never push to or merge into `main`, never force-push, never
  use `--no-verify`, never set `MATHSEXPRESS_ALLOW_PROTECTED_PUSH`.
- Never deploy by hand. Pushing to `mathsexpress-v2` runs GitHub Actions; when the app and
  database checks pass it deploys the separate V2 test Worker:
  https://mathsexpress-v2.aarush-sharma6.workers.dev
- The old live site (Cloudflare Worker `mathsexpress`) and the old Supabase project
  `dsjrxkxjcaurrbijihja` (paused) must never be touched.
- The V2 Supabase project is `czvmrksotfpzitjgopnj` (Sydney). Database changes are reviewed
  migrations in `supabase/migrations/`, tested locally first. Applying one to the hosted
  project needs the owner's OK each time.
- The repository is public: never commit passwords, API keys or tokens.
- Do not copy Mathspace (or any other product): no copied artwork, characters, layouts or
  colours. Use the brand palette `#3D52A0`, `#7091E6`, `#8697C4`, `#ADBBDA`, `#EDE8F5`.
- Never invent grades, scores, coin balances or student activity. Sample panels must carry a
  "Sample data" badge.
- Commit messages: a title of 72 characters or fewer, then a description, Architecture,
  Reason, Files and systems, Testing (with real numbers), Known limitations, a
  `Version: 2.0.0-alpha.3` line and a `Co-Authored-By` trailer. The pre-commit hook runs
  `npm run check:quick` (format, lint, types); the pre-push hook runs `npm run check` (plus all
  tests and the build).

## Commands

| Command                 | What it does                                                                 |
| ----------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`           | Local site (Vite)                                                            |
| `npm run check`         | Prettier, ESLint, TypeScript, all Vitest tests, production build             |
| `npm run test`          | App tests (Vitest, jsdom, with in-memory fake data)                          |
| `npm run test:db`       | Database tests against the local Supabase stack (`npx supabase start` first) |
| `supabase db reset`     | Rebuild the local database from every migration                              |
| `npm run mascot:export` | Export the mascot as SVG and PNG files                                       |

## What was built, in order

### 1. The official capybara mascot (`src/components/mascot`, `src/assets/mascot`)

- An original flat capybara drawn from the owner's design sheets: 8 views, poses, mouthless
  expressions (it never has a mouth) and 24 animations, with elbows, eyelids, follow-through,
  squash and stretch, and turn transitions.
- `useMascotController` plays animations from site events (correct, incorrect, hint, lesson
  complete, level up and others). Workshop page at `/mascot` (not linked).
- The rig geometry in `rig.ts` is the single source of the character's shape.

### 2. Teacher experience

- Teacher home dashboard; class workspaces with Overview, Students, Tasks and Progress tabs
  (`src/features/teacher-*`).
- Real tasks: a teacher sets a published lesson for a class or chosen students, with a due
  date; drafts, publishing, moving due dates, deleting. Students see their tasks.
- Saved, server-marked lesson progress: `start_lesson_attempt` and `record_answer` (the answer
  key lives only in the database).
- Reports built only from saved work (`class_progress`, `student_results`,
  `class_topic_progress`, `recent_completions`), filterable by class, period and student.
- Migrations: `20261030120000_tasks_and_progress.sql`, `20261030140000_reports.sql`.

### 3. Colour, motion and layout polish

- Stronger brand colours as tokens across tabs, tables, tiles, filters and focus rings.
- Fixed the sideways page jump at its root: page transitions animate only the page's child
  element (not `<main>`), and `scrollbar-gutter: stable` keeps the width constant.
- Decorative squiggles, dots and shapes near page edges (`src/components/decor`), different
  per area, calm on lesson pages, hidden from screen readers, still for reduced motion.
- A sliding indicator under the active nav item and tabs (`useSlidingIndicator`), a smooth
  account menu and gently floating empty-state icons.

### 4. The Student Shop (the most recent and largest piece)

Routes: `/student/more/shop` (Shop), `/student/more/shop/collection` (My collection) and
`/student/more/shop/history` (Coin history).

**Catalogue.** 130 original cosmetics in seven kinds, from free to 5,000 coins:

| Kind             | Count | Notes                                                                            |
| ---------------- | ----- | -------------------------------------------------------------------------------- |
| Avatars          | 25    | Capybara variants built from the mascot rig, animals, robots, fantasy characters |
| Accessories      | 28    | Placed by slot: hat, face, ears, neck, helmet, halo, held, shoulder              |
| Backgrounds      | 20    | Drawn 160 × 100, shown with "slice" so they fill any shape                       |
| Frames           | 16    | Rings round the round portrait                                                   |
| Effects          | 15    | Light particle layers; animated only with transform and opacity                  |
| Titles           | 14    | Text badges shown under the student's name                                       |
| Dashboard themes | 12    | Recolour the site's brand accents (tokens in `tokens.css`)                       |

- Five rarities with fixed price bands, enforced by a database check constraint: common 0–75,
  uncommon 100–250, rare 300–600, epic 750–2,500, legendary 3,000–5,000.
- Free starter items (price 0) are owned by everyone.
- The list lives in two places on purpose: prices and ownership in SQL, names and artwork keys
  in `src/domain/shopCatalogue.ts`. A database test fails if they differ; a unit test fails if
  any item has no artwork. To add an item: add it to `shopCatalogue.ts`, draw it in
  `src/components/cosmetics/*Art.tsx`, and add a migration that upserts the catalogue.
- All artwork is code-drawn SVG (no images, no emoji): `avatarArt.tsx`, `accessoryArt.tsx`,
  `backgroundArt.tsx`, `frameArt.tsx`, `effectArt.tsx`, plus theme swatches in `artwork.ts`.

**Coins (all paid on the server).**

- 100 welcome coins; 20 coins the first time each lesson question is solved.
- Finishing a lesson: 25 coins plus 5 per question right first time, for the first four
  lessons finished each day (Sydney time). Paid inside `record_answer` in the same transaction
  that completes the attempt; it returns `coinsAwarded`, which the lesson page shows.
- No real money, random rewards, loot boxes or gameplay advantages.

**Server rules** (`supabase/migrations/20261031090000_shop_collection.sql`).

- `shop_state`, `shop_buy`, `shop_equip(category, item_id)`, `shop_reset_look`,
  `class_member_looks(class_id)`. Tables have RLS on and no direct access.
- `shop_buy` locks the student's wallet row first, reads the price on the server, refuses
  already-owned items and insufficient balances, and writes the purchase and ledger entry once.
  Duplicate or racing purchases are charged once (tested).
- One equipped item per kind in `shop_equipped`. Teachers can see their class's avatar parts
  (avatar, accessory, background, frame, title), never themes or effects.
- `20261031100000_shop_more_items.sql` adds the last 32 items (upserts the whole catalogue).

**Front end** (`src/features/shop`, `src/components/cosmetics`).

- `ShopLayout` loads the wallet once and shares it with the three pages through outlet
  context (`useShop`), together with the try-on look, which is never saved. A request lock
  ignores a second click while a change is saving.
- `AvatarPortrait` draws any look in layers: effect glow, background, character, frame,
  accessory, effect particles. Gradient ids are unique per copy.
- `LookStage` is the large live preview. `ShopItemCard` shows rarity styling and Try on, Buy,
  Equip or Unequip. `TryOnDialog` is a native `<dialog>`: Try On is free and combinable; Buy
  asks to confirm (showing the balance afterwards), then a coin burst and "Equip now".
- Trying on a theme recolours the whole page (`data-shop-theme` on `<html>`) until the
  student cancels, chooses "Back to my look" or leaves the shop.
- Browsing: search, category tabs with counts and a sliding indicator, rarity, price band,
  "I own", "I can afford", and sorting. Filters live in component state and are mirrored to the
  address.
- `StudentAvatar` shows a student's look in the header account button, the home page "Shop"
  shortcut, the quick-tools shop panel and leaderboard row, and teachers' class lists.
  `StudentLookContext` (from `StudentLayout`) keeps it current.
- Mobile: two-column grid, sticky coin balance, scrollable tabs, no horizontal overflow (the
  shop grids use `minmax(0, 1fr)` columns).

## Tests (as of the last push)

- App: 436 Vitest tests in 49 files, including 21 shop UI tests (try-on combinations cost
  nothing, double-clicked purchases charge once, not enough coins, equip and unequip after
  reload, filters, failures and retries, theme preview, accessibility with axe).
- Database: 75 tests, including concurrent purchases, cross-account access, rarity
  constraint, teacher-only looks and lesson coins with the daily limit.
- Not tested: Safari and real phones; reduced motion was checked in code, not emulated.

## Current state and what is open

- Everything above is pushed to `mathsexpress-v2`, and CI deploys the preview.
- The hosted V2 database has both shop migrations, so the preview shows all 130 items.
- Hosted migration history uses versions assigned by the Supabase tool, not the file
  timestamps. Reconcile before any `supabase db push` (see `docs/hosted-launch.md`).
- Supabase's "leaked password protection" is switched off on the V2 project (an Auth setting
  for the owner).
- Not built yet: practice sets, worksheets and tests as task types, most textbook chapters,
  profile and settings pages, and a dark mode.

## Where to look first

- `CLAUDE.md`: permanent rules and status.
- `docs/architecture.md`: routes, data layer and the shop design.
- `docs/hosted-launch.md` and `docs/cloudflare-auto-deploy.md`: hosting.
- `CHANGELOG.md`: every change, newest first.
