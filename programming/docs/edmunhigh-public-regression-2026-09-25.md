# Public-page regression, 2026-09-25

## Latest responsive-image verification

`node scripts/audit-public-routes.mjs --responsive-images` now collects every
same-origin `srcset` candidate found across the live 36 editorial pages. It GETs
and fully decodes each output with Sharp, using four workers. Latest run passed:
189 responsive image variants decoded, 20 fallback image HEAD checks, 50
internal destinations and 115 fragment targets. No failures. This supersedes
the older counts below after merchandise removal. Lint passed for the audit.

These results rule out HTTP/format/decode failures for the advertised local
image variants at test time. They do not prove browser candidate selection,
mobile capture behavior, visual cropping or facial likeness. The optional
image check uses Sharp already installed with Next.js; no package was added.

Scope: current Edmunhigh-inspired public implementation after FAQ, footer,
activity calendar, representative grid and course-artwork updates.

## Verified

- Production build completed successfully, including TypeScript and route generation.
- `node scripts/audit-public-routes.mjs`: 36 editorial pages, 51 internal
  destinations, 115 fragment targets and 22 image responses; no failures.
- Browser navigation across all 36 editorial paths at measured 1707 CSS px:
  each page has one H1, a route-specific title, the appropriate navigation
  section marked current and document width equal to viewport width.
- Browser navigation across the same 36 paths at measured 400 CSS px:
  each page has one H1 and document width equal to viewport width.
  No completed image had zero natural width at measurement time.
- SQL programme artwork on mobile measures 364 × 204.85 CSS px with
  `object-fit: contain`, preserving its source aspect ratio.

## Limits and next checks

- The mobile SQL screenshot captured an image placeholder while the image
  reported incomplete, not a verified final rendered photograph. After
  resetting the viewport and reloading, DOM inspection confirmed the SQL
  artwork loaded with nonzero natural width. This does not establish mobile
  screenshot fidelity; recheck after image completion before judging crops.
- Image-completion checks do not prove lazy images were all requested.
- Geometry and route checks do not establish pixel-level fidelity to all
  reference pages, likeness of AI-edited people or quality of all animations.
- No contact/newsletter submissions or database writes were performed.
- Dashboard, learning and admin mutation flows were outside this public-page
  regression; a successful build is not end-to-end coverage of those flows.

Reference coverage remains documented separately in
`edmunhigh-route-coverage.md`. The full visual objective remains open.
