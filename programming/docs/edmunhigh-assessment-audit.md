# Program index assessment section

2026-09-25: Compared the live reference `/programs` with the local page. The reference includes a grading table below six program cards; the local page lacked an equivalent section.

Added `EduAssessment` below the local six-card grid. Navy column headers, pale separated rows and a centered editorial heading reflect the reference structure. Content is adapted to the actual coding platform rather than inventing school grades, GPA or credentials.

Content checked against `app/api/submissions/route.ts`, `lib/grading.ts` and `scripts/judge-worker.mjs`: authentication required, JavaScript only, enabled admin test configuration required, run uses sample tests, submit uses all tests and saves submissions, accepted means all tests passed.

Desktop screenshot verified readable four-column table and the final inline-arrow link. At an actual 520 CSS-pixel viewport, DOM inspection confirmed no document overflow, a 484px table, four grid-layout cards and mobile labels. Mobile screenshot rendering was incomplete in the browser tool, so this is not a mobile visual pass. Viewport override reset.

Lint and production build passed before the final CSS-only inline-arrow adjustment. No grading behavior, database records or dashboard functionality changed. Full-site visual fidelity and final mobile screenshot remain open.
