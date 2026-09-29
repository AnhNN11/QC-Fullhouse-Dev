# Desktop navigation alignment — 2026-09-25

Reference desktop header inspected on the Contact page at 1700px in the preceding pass: visible primary links, Programs disclosure, current-route underline. Local header previously exposed only the dashboard CTA and an all-site menu at every width.

Implemented visible primary links at >=1450px, with six program destinations in a native details disclosure. Preserved the all-site dialog and dashboard CTA; narrow screens retain the compact header. Added current-route styling, focus outlines and reduced-motion treatment.

Verified in browser:
- Desktop `/programs/frontend`: primary links visible, program dropdown opens and Frontend is marked current.
- Escape from the Python link closes disclosure and focuses summary.
- Clicking Python navigates to `/programs/python` and its matching heading/content; disclosure is closed after navigation.
- At measured 400px, inline nav is display:none, menu trigger is visible, document width remains 400px.
- Mobile menu opens and exposes all existing grouped links; Escape closes it. Viewport reset.

Lint and production build passed. This changes only public navigation, not learning/admin navigation. Other full-site fidelity checks remain separate.
