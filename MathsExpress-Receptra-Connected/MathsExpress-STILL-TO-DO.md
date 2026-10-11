# MathsExpress — still to do after v11.5.24 (12 October 2026)

Supersedes `MathsExpress-v11.5.22-STILL-TO-DO.md` and `MathsExpress-REMAINING-WORK.md`.

## Done and verified (not yet live)
- All 25 missing RPCs built and tested against the live schema (v11.5.24 release note).
- v11.5.23 class-game scoring migration verified: server-issued questions, no answer key sent, one score per question, cooldown, forged keys rejected.
- Discussion board, student parent links (v11.5.21 migration) and daily attempt tracking (v11.5.23).
- Automated guard: the build fails if the app calls an RPC that does not exist.

## Needs your approval / action (blockers)
1. **Apply the three migrations to production and deploy v11.5.24** (order in the release note). Nothing is live until then.
2. **GitHub:** the `boseit711` account cannot push to `boseit-dev/mathsexpress` (403). Either add it as a collaborator with write access, or push the commits in this ZIP from an authorised account. Nothing on GitHub was overwritten.
3. **Workers Builds:** connect after (2): Worker `mathsexpress` → Settings → Build → repo `boseit-dev/mathsexpress`, branch `main`, root `MathsExpress-Receptra-Connected`, deploy command `npx wrangler deploy`.
4. **Email verification:** turn on "Confirm email" in Supabase Auth, then the `mathsexpress-signup` Edge Function must stop returning a session for unconfirmed users. The v11.5.23 client already handles both settings truthfully.
5. **Signed-in browser testing** needs real test accounts (student, teacher, parent, admin, owner). Only the logged-out screens can be checked without you signing in.
6. **Historical grading data (pre-v11.5.19):** decide discount, purge or keep-with-flag. An impact report needs a read-only count of affected `mathsexpress_diagnostic_responses` / Fix Mode rows; no records will be changed without approval.
7. **Canvas / Resend:** grade passback and parent emails only send once Canvas and Resend credentials are configured on the Worker; the queues work without them.

## Still to build (in your priority order)
| # | Area | What remains |
|---|---|---|
| 4 | Class games | Per-mode team state and visuals for the 13 modes, teacher start/pause/finish/restart controls, win conditions, two-account sync test. The scoring backend is done; the server already tracks position/lives/zone per mode in `mathsexpress_class_game_answer` |
| 3 | Auth | Edge Function change for verification (needs Supabase access to the function source), resend-verification flow test, password reset test |
| 5 | Assignments | Adaptive selection, more answer formats, partial credit, step marking review, Test/Fix Mode audit |
| 6 | Teacher | Announcements on `create_content`, worksheet creator, student detail page, live monitoring/spectate, branded print |
| 7 | Rewards/shop | Item art and previews, more items, Maths Duels, replay summaries, seasons |
| 8 | Learning | Skill map, prerequisites, placement test, spaced repetition, recommendations, Year 12 coverage, NSW outcome mapping (needs an authoritative source document) |
| 9 | Design | Full signed-in visual QA in light / dark / dark theme / high contrast, fullscreen overlay bleed-through, mobile layouts |
| 10 | QA | Multi-device, concurrency and interrupted-connection browser tests |

## Cannot be delivered as written
- Preventing screenshots, phone cameras or external AI: not possible in a browser. Integrity signals (tab blur, paste) are the achievable version.
- Viewing users' passwords: passwords are one-way hashed. Reset flows only.
