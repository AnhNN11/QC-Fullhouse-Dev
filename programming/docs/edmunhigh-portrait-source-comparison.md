# Individual portrait source comparison — 2026-09-25

Directly viewed each source and edited raster, not just filenames or generation
prompts. This is a visual quality review, not biometric identification.

| Source → studio artwork | Visual observations | Decision |
| --- | --- | --- |
| representative-blackhair-original → representative-navy-v1 | Frontal gaze, tousled hair, crossed arms and neutral expression retained; polo replaced with navy/cyan uniform. Skin detail remains visible. | Keep |
| representative-copperhair-original → representative-white-v1 | Copper hair, transparent glasses, three-quarter stance, crossed arms and watch retained; white uniform replaces black polo and nameplate. | Keep |
| seaside-original → seaside-studio-v1 | Tilted head, wavy fringe, seated pose, phone and bracelets retained. New blue studio light is brighter than the outdoor source; no smooth plastic-looking face. | Keep |
| lakeside-original → lakeside-studio-v1 | Sideward gaze, raised hand, earrings, bracelets and shoulder-bag strap retained. White polo and studio background replace the layered outfit and lake. | Keep |
| street-original → street-studio-v1 | Sideward gaze, bag-holding pose, tote, crossbody bag and bracelet retained; navy polo replaces cream shirt. Visible skin texture and fabric folds. | Keep |
| music-original → music-studio-v1 | Round glasses, forward-facing expression, instrument and hand positions retained; white polo replaces red shirt. Instrument head remains close to the right image edge as in the source. | Keep; display whole image, no extra cover crop |

All six studio portraits have neither employee ID lanyards nor nameplates.
Crossbody bag straps in two images are intentional source accessories, not
employee lanyards. Three navy and three white uniforms are represented.

These images are edited illustrations, not unaltered photographs. They retain
recognizable visual characteristics, but lighting and framing differ; do not
claim exact pixel preservation or guaranteed facial identity. Current captions
disclose AI clothing/background edits. No regeneration was warranted by this
review; regenerating without a specific defect risks more drift.

## Separate checks

- Company welcome-kit asset is byte-identical to the user attachment:
  SHA-256 `293c1cffa7cc06dd01369e9c9cf9eb7d69fc211ad40521725908929ddbfbc68d`.
- Group images were reviewed separately in `edmunhigh-group-source-review.md`.
- Course-artwork likeness is not established by this individual-portrait review.
- In-browser client navigation from frontend to Python programme reattached
  `reveal-ready` to all three below-fold reveal containers, without prematurely
  marking them visible. No route-lifecycle motion patch was needed.
