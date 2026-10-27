# MathsExpress 2.0 architecture

How the code is organised, how data reaches a page, and how to extend it. The rules themselves
live in [CLAUDE.md](../CLAUDE.md); this document explains the design behind them.

## Request flow

```text
URL ──▶ React Router (src/app/routes.tsx)
          │
          ├─ RootLayout: focus after navigation, scroll restoration (spans every area)
          │
          ├─ layout route loader ──▶ StudentRepository.getCurrentStudent()
          │     StudentLayout renders AppShell (header, navigation, notice, <main>)
          │     and passes the student to pages through the outlet context (useCurrentStudent)
          │
          └─ page route loader ───▶ StudentRepository.getStudentHome()
                StudentHomePage reads { home, now } with useStudentHomeData()
                and passes typed props to presentational components
```

- **Repositories** (`src/data/repositories.ts`) are interfaces. `createAppDependencies()` in
  `src/data/index.ts` chooses the implementations; Phase 1 uses the sample ones in
  `src/data/sample/`. Tests pass their own dependencies to `createRoutes()`.
- **Loaders** turn a route into data and receive the request's `AbortSignal`, so leaving a page
  cancels its request. A loader that throws shows `RouteErrorPage` inside the layout, whose
  "Try again" re-runs the loaders. The home page also reloads its data when the student returns
  to the tab and at midnight (`useRefreshWhenStale`), so dates never go stale on an open page.
- **Domain functions** (`src/domain/`) hold every business rule as a pure function: task status
  and due wording, which tasks the home page shows, leaderboard ranking, accuracy, coins needed.
  Components call them; they never re-implement them.
- **Components** render props only. Shared primitives are in `src/components/ui/`; feature
  components live with their feature in `src/features/<feature>/components/`.

## Routes

| Path                   | Page                          | Status in Phase 1                           |
| ---------------------- | ----------------------------- | ------------------------------------------- |
| `/`                    | Redirects to the student home | Built (redirect by role comes with sign-in) |
| `/student`             | Student home                  | Built                                       |
| `/student/learn`       | Learn                         | Planned page                                |
| `/student/textbook`    | Textbook                      | Planned page                                |
| `/student/class`       | Class                         | Planned page                                |
| `/student/class/tasks` | All of the student's tasks    | Planned page                                |
| `/student/more`        | More                          | Planned page                                |
| `/student/more/shop`   | Coin shop                     | Planned page                                |
| `/teacher`             | Teacher home                  | Planned page                                |
| `/teacher/classes`     | Classes                       | Planned page                                |
| `/teacher/tasks`       | Tasks                         | Planned page                                |
| `/teacher/reports`     | Reports                       | Planned page                                |
| `/teacher/more`        | More                          | Planned page                                |

Every planned page must be replaced by the real feature before release.

## Connecting a real backend

1. Implement `StudentRepository` and `TeacherRepository` against the API (for example
   `src/data/api/`), returning the same domain types. Map database rows to domain types inside
   the repository; components must never see raw database shapes.
2. Return them from `createAppDependencies()` and set `appConfig.usesSampleData` to `false`, which
   removes the development preview notice.
3. Keep the sample repositories for tests and local previews.

Year levels come from the class enrolment the teacher controls (`CurrentStudent.enrolment`); the
student interface never offers a year selector.

## Adding a feature

1. Add domain types and rules in `src/domain/` with unit tests.
2. Add repository methods and sample data (with consistency tests) in `src/data/`.
3. Create `src/features/<name>/` with a loader, a page and small components, each with its CSS
   Module, using only design tokens.
4. Register the route in `src/app/studentRoutes.tsx` or `teacherRoutes.tsx`, replacing its planned
   page, and add paths to `src/config/paths.ts`.
5. Write page tests with `renderApp()` (including an axe-core check), check the page in the
   browser at 1280px, 768px and 375px, then follow the commit workflow in CLAUDE.md.

## Visual design

- Tokens: `src/styles/tokens.css` (colours, type, spacing, radii, shadows, sizes, breakpoints).
  The logo has its own colour tokens, used for the logo only.
- The student home follows the structure of the project owner's reference dashboard: a
  full-width welcome banner, a row of task cards with "View all", recommended practice and
  progress on the left, and the class leaderboard, coin shop, daily challenges and rewards on the
  right. All artwork is original: the banner graph, task and topic card scenes, and the student
  backdrop. Never copy artwork, mascots or branding from other products.
- Hosting: `wrangler.jsonc` serves `dist/` from the `mathsexpress-v2` Worker with SPA fallback;
  `public/_headers` sets the Content-Security-Policy and caching. `npm run preview:worker` runs the
  production build locally in the Cloudflare runtime.
