# MathsExpress — still to do after v11.5.28 (12 October 2026)

This tracks `CHECKLIST.md` (79 items) and `MathsExpress.pdf`. **Done** means done in the source and tested. None of it is live until it is deployed.

## Needs you
1. **Go live.** Approve applying the 5 migrations in order (20261011_01, 20261011_02, 20261012_01, 20261013_01, 20261014_01) and deploying v11.5.26. Each one was tested on the live database inside a transaction that was cancelled afterwards.
2. **GitHub.** The Mac's saved GitHub login was removed. Run `cd ~/Claude/mathsexpress-src/gh-push && git push origin main` and sign in as **boseit-dev** (username, then a token as the password). Then delete the token that was pasted in chat.
3. **Taking payments.** Create a Stripe account, then add the Worker secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`, plus a Stripe webhook for `checkout.session.completed`. Until then, "Choose Plan" says online payment isn't set up, and plans can only be given in the owner console.
3b. **Test accounts.** Run `~/Claude/mathsexpress-src/create-test-accounts.sql` in the Supabase SQL Editor after the migrations.
4. **Verification email from MathsExpress.** In Supabase Auth, turn on "Confirm email" and set custom SMTP (for example Resend) with a MathsExpress sender address. This needs your Resend account and DNS access.
5. **Security code at login.** Supabase supports authenticator-app codes (TOTP MFA). Say which you want: optional for everyone, or required for staff. Emailed codes need the SMTP setup above.
6. **Signed-in test accounts** (student, teacher, parent, admin, owner) for testing the logged-in screens in a browser.
7. **Old marking data from before v11.5.19.** Choose: discount it, delete it, or keep it with a flag.
8. **"Bot that auto-completes assignments."** I haven't built it. It would submit work as a student, which affects grades and teacher reports. A safe version is an owner/bug-tester tool that only runs on test classes or test accounts and labels every result as automated. Confirm that is what you want.

## Done (v11.5.21–v11.5.25)
- Check-ins now reject random typing.
- Tour button, duplicate class codes, extra curricula, spacing gap, Task Library button: all fixed.
- Integration, Skills Focus, engagement and compass errors fixed.
- Report tabs work.
- Wrong class code is now refused.
- Class code required at signup.
- Password entered twice.
- A/B/C/D keyboard keys for multiple choice.
- Dark mode and high-contrast text readable.
- Accessibility button opens the accessibility settings.
- Textbook numbers are now labelled.
- Driving-game leftovers removed, and car skins taken off sale.
- "Create task" removed from the menu.
- Loading and maintenance screens.
- Real friend challenge codes.
- Sign out in the header.
- Startup fail-safe fixed.
- Sitemap and robots.txt updated to the new domain.
- All missing server functions built.
- Class games:
  - duration, topic, year and assignment choices;
  - questions in 4 topics for K–12;
  - correct answer no longer always the smallest;
  - students only see their own results;
  - server-side scoring with no duplicate points.
- Fullscreen:
  - the overlay fully hides the question;
  - leaving fullscreen swaps in a new question;
  - right-click and copy are blocked in tasks.
- Searchable tools.
- Bigger calculator.
- Clove naming.
- Admin and teacher home pages show class tasks.
- New completion screen with a server-checked finishing reward.
- Seasons with ranks, class standings (accuracy and completion) and season titles.
- Shop:
  - previews for every item type;
  - pictures instead of emojis;
  - 8 new titles;
  - **the server bug that broke every purchase is fixed**.
- Live class view: doing well, struggling or inactive, then a student's wrong answers, time on task and tab-leaving.
- K–6 and 7–12 login portals.
- Home page plans and school-visits slideshow.
- Teacher announcements: these already existed. Teachers post, and students see them in their class page.

## Still to build (each is a large piece of work)
| Area | Remaining |
|---|---|
| Broken things | Click every "More tools" button and remove or fix any that freeze; textbook previews with drawing; AI check that working-out relates to the question; page speed (the main bundle is 1 MB in one file and needs splitting or lazy loading) |
| Teacher | Simpler dashboard navigation; printing with MathsExpress branding; worksheet creator; owner console roles (bug tester) with working buttons; owner creates accounts (needs a server function using the service key in the Worker); owner activity view and password-reset emails (passwords can't be viewed, by design) |
| Learning | Different question types per skill level with real adaptivity; number-line and graph answers in more skills; NSW syllabus mapping (needs the official outcome list); harder Year 12 content; covering every topic; simpler Learn tab; skill map with "what unlocks next"; progress bar per topic moved by a 10-question check-in; review of wrong answers days later; placement test; confidence score; personal recommendations; Clove coaching from a student's progress; expandable textbook panel in tasks |
| Design | Level/XP/coins strip; Clove throughout the app with animations; full signed-in check of every screen in each theme |
| Can't be done as written | Blocking all AI use, screenshots or phone cameras isn't possible in a browser. The possible version is done: fullscreen, question swapping, copy and right-click blocking, and focus tracking. A literal view of a student's screen isn't possible either; the live class view is the closest version. |

## Update after v11.5.28
Done since v11.5.26 (see V11.5.27-SELF-DIRECTED-AND-PDF-ITEMS.md):
- self-directed accounts;
- Sign out button removed from the header;
- round number badges;
- simpler Learn tab with topic progress bars and 10-question check-ins;
- skill map;
- confidence score;
- wrong answers brought back after 2 days with explanations;
- placement test;
- Clove coaching from progress;
- real adaptivity;
- HSC-level Year 12;
- AI marking checks the working relates to the question;
- optional login security code;
- owner account creation;
- branded printing;
- drawing on textbook previews;
- expandable task textbook;
- animated Clove;
- new stats strip;
- teacher "Start here" bar and tool search;
- the dead school and year dropdowns fixed.

Still open:
- **Cambridge textbook PDF (urgent, needs you).** `public/assets/cambridge-maths-nsw-stage5-year9.pdf` (23 MB) is in the PUBLIC GitHub repo and is served to anyone. Unless you have a licence to redistribute it, it should be removed from the repo, the site and the git history. Students would then upload their own licensed copy, which the app already supports and stores only in their browser.
- **Page speed.** This needs profiling while signed in. Likely causes: a 1 MB JS bundle and pages waiting for several server calls with 3–5 s timeouts.
- **Buttons that freeze.** No buttons are missing handlers any more, but finding ones that freeze needs signed-in clicking through every tool.
- **NSW outcome codes.** These need the official NSW syllabus outcome list to map against.
- **Emails from MathsExpress.** Verification emails need SMTP set up in Supabase.
- **Your decisions:** the auto-complete bot, and what to do with the old marking data.

## Update after v11.5.28
- Done:
  - Cambridge PDF and catalogue removed, and the built-in MathsExpress textbook is the only textbook;
  - old misgraded check-ins purged (the server had none);
  - owner-only auto-complete bot;
  - NSW outcome codes from the latest syllabuses on every skill.
- **You need to:**
  - force-push `gh-push` (command in V11.5.28-TEXTBOOK-OUTCOMES-BOT.md);
  - optionally ask GitHub Support to purge old pull request refs and caches;
  - approve 6 migrations for production (20261011_01, 20261011_02, 20261012_01, 20261013_01, 20261014_01, 20261015_01).
