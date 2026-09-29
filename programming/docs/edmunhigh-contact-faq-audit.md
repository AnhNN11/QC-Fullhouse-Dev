# Contact FAQ reference alignment — 2026-09-25

Reference inspected live: https://edmunhigh.framer.website/contact, including desktop 1700px. The FAQ has a heading above pale-blue accordion rows on the left and a large portrait on the right. The previous local section had a heading and questions in separate columns with no portrait.

Updated `/contact` to that composition using the existing supplied-face, white-uniform studio edit. AI-edit disclosure is visible below the portrait. Original contact form, consultation action, consent, honeypot and fields are unchanged. No invented physical address/map or staff identity was added.

Verification:

- Desktop screenshot confirms the left FAQ panel and right portrait, with face and uniform visible.
- Opening the second question closes the first using the native details group. DOM confirms only the second answer is open.
- Computed question size is 22px desktop / 18px at measured 400px viewport.
- At 400px, the grid is one 364px column and document width remains 400px; no horizontal overflow.
- Mobile screenshot capture was unreliable (mostly blank canvas), so mobile visual approval is still pending. Viewport override reset.
- Lint and production build passed after the component/layout change. Final typography-only adjustment was verified in the dev browser.

This is one section alignment, not a full application completion claim. No form submitted and no production records created.
