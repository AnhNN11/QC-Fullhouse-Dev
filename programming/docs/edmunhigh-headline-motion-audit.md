# Public headline motion — 2026-09-25

Added server-rendered word-stagger entrance to shared editorial hero titles and article titles, following the reference's staged text entrance without splitting Vietnamese combining characters. Long headings cap per-word delay at 448ms. No client JS is required for rendering or animation.

- Original full title is the H1 accessible name; decorative word spans are aria-hidden.
- Reduced-motion and print styles disable the effect.
- Verified article heading accessible name and exact visible text in browser. All nine words settle at opacity 1, with 28ms delay increments. Desktop screenshot shows correct wrapping and white text.
- Verified Contact at 400px: exact Vietnamese title, nine word spans, document width 400px. Viewport reset.
- Lint and production build passed.

Reduced-motion behavior is implemented in CSS but OS preference was not changed for runtime testing. Does not claim identical timing to Framer or coverage of headings outside the two shared hero components.
