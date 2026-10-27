# Changelog

All notable changes to MathsExpress 2.0 are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/). See "Versioning" in CLAUDE.md.

## [2.0.0-alpha.1] - Unreleased

Phase 1: project foundation and student homepage.

### Added

- New project foundation replacing the v11 codebase on the development branch: React 19,
  TypeScript (strict), Vite, React Router, Vitest, ESLint and Prettier.
- Git hooks that check commit messages, block committed credentials, run all checks before a push
  and refuse pushes to `main`, branch deletions and history rewrites.
- GitHub Actions CI for the `mathsexpress-v2` branch and pull requests.
- Cloudflare Worker configuration for a separate `mathsexpress-v2` Worker with security headers.
- Design system: colour, type, spacing, radius, shadow and size tokens built on the official
  MathsExpress palette; global base styles; the Lexend font (self-hosted).
- Shared UI components: Button, ButtonLink, ArrowLink, Panel, ProgressBar, StatusBadge, IconTile,
  CoinAmount, CoinIcon, Avatar and VisuallyHidden.
- Student and teacher layouts with navigation at the top, never a side bar. Student: Home, Learn,
  Textbook, Class, More. Teacher: Home, Classes, Tasks, Reports, More. On phones and tablets the
  navigation becomes a row of tabs under the logo.
- Accessibility basics: skip link, landmarks, page titles, focus moved to the page after
  navigation, and the current page marked for screen readers.
- Not-found and error pages; "Try again" on the error page reloads the page's data.
- "Planned for a later phase" pages for sections that are not built yet, so every link works.
- A development preview notice on every page stating that all data is sample data, with a link
  to switch between the student and teacher layouts.
- Data access through repository interfaces, with sample implementations for Phase 1.
- The MathsExpress logo (plus, dot and smile symbol with the two-colour wordmark) in the header,
  loading screen and favicon.
- Student home page, laid out like the agreed reference: a full-width welcome banner with a
  personalised greeting, task summary, "pick up where you left off" progress and a prominent
  Continue learning button; assigned task cards (artwork, type, due date, progress, coin reward,
  not started / in progress / overdue / done states) with View all; recommended practice with a
  quick review of recent mistakes; learning progress (topics, questions, accuracy, streak); and a
  right-hand column with the class leaderboard, coin shop, daily challenges and rewards.
- Original illustrations: the welcome-banner graph, task and topic card artwork, and a
  scenery backdrop for student pages in the brand colours.
- Development sample data for the home page, generated relative to today's date, clearly labelled
  and kept consistent by tests.
- The home page reloads its data when you return to the tab and at midnight, so due dates,
  the greeting and daily challenges stay current on a page left open.

### Removed

- The v11 code from the development branch. It is preserved in tag `v11.5.35` and branch
  `legacy-v11`.
