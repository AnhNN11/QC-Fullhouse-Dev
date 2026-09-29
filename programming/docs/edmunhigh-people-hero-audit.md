# People hero framing

2026-09-25: Replaced repeated workshop hero on `/people` with the existing `team-studio-no-badge-v3.png` studio composition. No new image generation in this pass. Added explicit AI-composite credit and alt text; documentary workshop source retained elsewhere.

`EditorialHero` now accepts optional group-portrait framing and credit. Group framing uses top-aligned taller desktop image and original 3:2 ratio on mobile with no title overlap. Other hero consumers preserve their default behavior.

Browser screenshots verified all four faces visible on desktop (1707px) and mobile (actual 400px). Mobile image measured 400 × 266.67px, document width 400px, caption visible below title. Browser screenshot canvas remains oddly scaled but rendered content was legible. Viewport reset.

Lint and production build passed. Program hero and other editorial photo crops still need their own visual review; this does not establish full-site completion.
