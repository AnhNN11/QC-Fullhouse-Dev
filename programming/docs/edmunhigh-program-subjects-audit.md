# Program subject visual treatment

Inspected https://edmunhigh.framer.website/program-detail/stem-program via live text and screenshots. Reference uses topic-specific thin-line icons in pale circular outlines, two subject columns on desktop, following the outcomes and large program image.

Replaced numeric subject circles on all six DolphinX program detail pages with topic-specific Lucide icons (36 mappings). Kept existing outcomes, program artwork, content, enrollment destinations and related cards. Decorative icons are aria-hidden; headings remain accessible.

Verification:
- Browser screenshot on `/programs/frontend` showed all six icons, two-column layout and intact topic descriptions.
- Detected a global SVG rule shrinking icons to 20px; added scoped sizing and verified computed width 34px. Mobile rule is 29px inside 60px circles (not visually tested this turn).
- HTTP checks for all six detail routes returned 200 and exactly six subject icon wrappers each.
- Build passed; unused-import lint warning was removed and final lint passed cleanly. Final icon sizing CSS was verified in dev after the build.

This change addresses subject icon fidelity, not full-site completion.
