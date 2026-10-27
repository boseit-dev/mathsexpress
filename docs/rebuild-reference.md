# Reference: the old MathsExpress (v11)

MathsExpress 2.0 is written from scratch. The old system is kept for reference only; don't copy its
code in wholesale.

## In this repository

- Tag `v11.5.35` and branch `legacy-v11`: the complete original project, exactly as it runs live.
  Browse with `git show v11.5.35:<path>` or check out `legacy-v11` in a separate worktree.

## Live systems (do not change; see "Production safety" in CLAUDE.md)

- Live site: https://mathsexpress.aarush-sharma6.workers.dev (Cloudflare Worker `mathsexpress`,
  deployed by hand with Wrangler; nothing deploys automatically from GitHub).
- Database: Supabase project "MathsExpress" (ref `dsjrxkxjcaurrbijihja`). Student, teacher and
  class data stays there until a planned, approved migration into 2.0.

## Local backup (on the project owner's Mac, not in git)

- `~/MathsExpress-Old-Backup/04-rebuild-notes/FEATURES.md`: inventory of the 178 v11 features,
  their status, curriculum content and known problems. Start here when planning a feature.
- `~/MathsExpress-Old-Backup/03-live-reference/LIVE-SYSTEMS.md`: Worker, deployments and database
  summary as of 2026-10-28.
- `~/MathsExpress-Old-Backup/01-github/`: full git history bundle and plain files of v11.5.35.
