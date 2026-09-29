# People carousel — 2026-09-25

Reference `/community` inspected in browser: staff strip with circular photos, partially visible next card and previous/next controls; separate teacher grid below. Local equivalent stays at `/people` so the existing `/community` social feature is preserved.

Replaced the two oversized representative portraits with a six-person horizontal strip using existing edited supplied portraits, alternating navy/white. Captions remain descriptive rather than invented names/job titles. The separate studio portrait section remains intact.

Interactions: native overflow/swipe, scroll snap, previous/next buttons with disabled boundary states, focusable region supporting arrow keys. No autoplay. Reduced-motion preference selects instant scrolling; no-JS users can still scroll the native overflow area.

Browser verified desktop: next button changed scrollLeft from 0 to about 299px and enabled previous; Right key on focused track moved to about 613px. Screenshot shows circular crop preserving the four visible faces and next-card peek. Lint/build passed. Mobile touch and runtime reduced-motion remain unverified; full objective is not complete.
