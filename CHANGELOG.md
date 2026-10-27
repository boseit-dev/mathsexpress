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

### Removed

- The v11 code from the development branch. It is preserved in tag `v11.5.35` and branch
  `legacy-v11`.
