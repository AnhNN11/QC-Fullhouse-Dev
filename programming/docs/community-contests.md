# Public community and contests

## Routes
- `/roadmaps` and `/roadmaps/[slug]`: public layout, no dashboard sidebar. Reading is anonymous; saving progress requires an account.
- `/community`: public approved posts, category filters, pagination, own posts.
- `/community/[id]`: discussion, likes, reports, author editing/hiding. Plain text only (React escaping; no HTML uploads).
- `/contests` and `/contests/[id]`: schedules, enrollment, rules, problems, submission editor, own recent history, standings.
- `/admin/community`: approve/hide/restore posts and comments, resolve reports, restrict or restore user interaction.
- `/admin/contests`: create draft/publish, edit before start, cancel, review entrants/submissions, disqualify or restore entrants.

## Operations
1. Configure ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET. Missing configuration disables admin authentication; there are no fallback credentials.
2. Prepare problems and enable validated test sets in `/admin/judge`.
3. Create a contest using 1–10 enabled problem IDs; enter dates in Vietnam time (UTC+7). Publication is explicit, never automatically seeded.
4. Tests and statement fields are copied into the contest. Updates to the practice bank do not mutate this snapshot. Contests are locked against schedule/problem edits after starting.
5. Each accepted problem counts 100 points once. Ties: earliest last first-accepted submission, then stable user ID. Score uses server receipt time. DQ excludes scores without deleting submissions. The leaderboard shows the top 100 participants with accepted problems, refreshed on demand.
6. Post and comment submissions are pending until moderation. Hidden content is retained for review, not permanently deleted. Reports are deduplicated per user/target. Moderation actions have an `admin_audit` entry.

## Testing
`node scripts/hub-regression.mjs` uses a newly named `codex_hub_test_<random>` database and deletes only that database afterward. It tests authorization, moderation, ownership, deduplication, user restrictions, contest scheduling, snapshots, enrollment, actual QuickJS judging, throttling, retries, scoring, DQ and cancellation. It does not publish tests into the application database.

## Honest launch limits
- These are practice contests using existing practice-bank problems, not private exam questions or high-stakes ranked competitions. No plagiarism detection or proctoring is claimed.
- JavaScript synchronous solutions only. Existing WASM/worker heap, time and concurrency limits apply. For a public internet launch, move judging to isolated OS containers/worker infrastructure with a queue; do not rely on the Next process alone as a production judge boundary.
- No automatic rejudging, prize/payment flow, email notifications, media uploads, private messages or follow graph in this release.
- Standings and schedule status refresh on page refresh or the refresh button, not a live websocket. A worker crash can leave a `judging` row; the UI flags stale rows and permits a new submission after the lease expires. No score is granted to an unconfirmed row.
- Enrollment explicitly consents to public display name and score. No email, hidden tests or solution source is sent to public leaderboards.
- Community reports and account restrictions are administered by the shared env-configured admin account, not per-staff roles.
