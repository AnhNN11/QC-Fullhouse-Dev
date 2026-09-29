# Editorial typography alignment

2026-09-25. Live reference `/about` computed styles show Merriweather 400 for section headings and Inter for body text. Local pages previously used bold sans headings throughout.

- Added a shared next/font Merriweather definition, Latin and Vietnamese subsets, normal/italic 400/700, self-hosted by Next. Applied only through homepage and public editorial wrappers, not root layout/dashboard/admin.
- Editorial H1–H3 now use regular serif, balanced wrapping, relaxed tracking and line height. Menu, body text and code fonts remain unchanged. Mobile hero sizing adjusted for Vietnamese titles.
- Desktop `/about` screenshot and computed styles verify Merriweather 400 and no horizontal overflow. Homepage at actual 400 CSS pixels likewise has 400px document width and the expected font; title, buttons and hero photo were visible, though browser screenshot canvas scaling is inconsistent.
- Inspection revealed the shared editorial hero cropped the standing person's head. Increased responsive image height, moved crop upward and reduced title overlap from 105px to 35px (20px mobile). Desktop `/about` now preserves the standing person's full head. Other people near image edges still require per-image crop review; no claim that all subjects are visible on every route.
- Lint/build passed after font changes; final hero-framing CSS was checked in dev browser. Overall multi-page fidelity verification remains open.
