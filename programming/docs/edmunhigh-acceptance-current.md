# Current acceptance matrix

Latest user overrides are authoritative: modern sans-serif; no merchandise
sections; preserve company portraits, remove generated nameplates/lanyards.

| Requirement | Current evidence | Assessment |
| --- | --- | --- |
| All reference page families/details | Live reference inventory 36; route crawl 36 counterparts, 50 internal destinations, 115 fragment targets | Implemented and route-verified |
| Company portraits and mixed uniforms | Direct original/edit reviews: six studio portraits, six distinct course representatives, two four-person composites | Visually reviewed; AI edits disclosed |
| Natural presentation/no repeated course person | Source comparisons plus current narrow screenshots of six programme artworks | No identified defect requiring regeneration |
| Latest typography/merchandise changes | Browser across 36 routes; current home snapshot and about/people content | Implemented |
| Navigation/gallery/FAQ/carousel | Dedicated browser audits; latest five-image wrap 5→1, modal open, Escape close and focus return verified | Tested interactions pass |
| Reveal effects and keyboard access | Browser lifecycle checks plus six tests of actual transpiled effect | Logic verified; OS reduced-motion rendering not directly tested |
| Responsive composition | 36-route geometry at 400/768/1707; individual template screenshots and recent form/CTA fixes | Coverage substantial, not every below-fold section visually verified |
| Contact form | Empty form prevented; first invalid field visible below navbar; FAQ open state | Client validation verified; no live lead created |
| Image delivery | 189 srcset variants GET/decoded successfully | Server variants verified; capture tool is inconsistent for cold mobile loads |

Latest gallery check used the current five-photo inventory, not the deleted
merchandise slide. Existing learning/admin routes remain outside this editorial
acceptance's mutation tests; do not claim their full end-to-end validation.

## Closing-section follow-up

The previous visual pass checked the home FAQ (including its final expanded
answer), photo CTA and closing journal at measured 400px. Text fit, the CTA
did not overlay the presenter's face, and journal content used one column.
Project Lab's representative and event sections were also inspected at 400px;
the representative grid measured one 364px column, and two 344px columns at
768px. The tablet capture supports portrait framing, not full-device pixel QA.

The subsequent footer check confirmed keyboard focus reaches newsletter consent
at 400px with document width 400px. The current accessibility tree contains the
newsletter, four navigation groups and back-to-top link. However, both screenshot
APIs returned a blank canvas, including after viewport reset and reload. Footer
and all ancestors report visible, opacity 1, with no transforms or console errors.
This is insufficient evidence for footer visual acceptance; do not label it passed.

Remaining: obtain a usable footer visual capture and reconcile below-fold
reference fidelity evidence. Browser reduced-motion CSS rendering and valid form
persistence remain explicit test limitations. No live lead or subscription was
created during these checks.

## Newsletter action regression

`node --test scripts/newsletter-actions.test.mjs`: six passing tests execute the
actual transpiled server actions and email helpers against an in-memory storage
adapter. Covered: invalid email, missing consent, honeypot, normalization and
duplicate requests, consent provenance, suppressed-address non-reactivation,
admin authorization, missing targets, storage failure and admin invalidation.
This verifies action logic, not a live MongoDB connection or outbound delivery.

The live reference homepage was revisited: its closing sequence remains FAQ,
photo invitation, three articles, newsletter, brand/navigation/program/contact
columns. The local page has corresponding blocks, plus learning-area links;
sample school contact details are intentionally not copied. Fresh local-tab
captures still returned blank canvases, so footer visual verification remains open.
