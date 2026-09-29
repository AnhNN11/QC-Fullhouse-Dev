# Image and tablet checks — 2026-09-25

## Remaining four programme banners at 400px

Native-tab screenshots now show frontend, Python, data structures and interview
artworks in a measured 400 CSS px content column. Each preserves headroom and
technology graphics, with the four distinct representatives matching the
source audit below. Interview initially displayed a placeholder in the
responsive capture; loading it at normal viewport then narrowing produced the
full image. This establishes framing, not cold-cache mobile behavior. The
capture canvas itself remains oversized, but the actual content column and
image are visible. Measured document width equals 400 and image fit is contain.
No asset/layout changes were justified; temporary tab closed/viewport reset.

## Native-tab narrow capture follow-up

Using the native tab accessibility/scroll/screenshot surface (rather than only
Playwright), SQL and algorithms programme banners were visibly rendered at
measured 520 CSS px. The returned canvas still contains excess blank area, but
the actual content column shows the entire representative, headroom and all
technology graphics. SQL banner geometry is 484 × 272.39; document width equals
520. Algorithms is also 520 with `object-fit: contain` and no horizontal
overflow. These captures verify narrow framing for the two artworks; they are
not full-device screenshots or proof of cold-cache behavior at 400px. No image
regeneration or layout change was needed. Viewport restored and test tab closed.

## Course representatives

Viewed all six current no-badge course PNGs, against the original portraits
viewed in the adjacent source-comparison audit. Each artwork has a different
representative: copper-haired/glasses for frontend, black-haired frontal
portrait for Python, seaside portrait for algorithms, lakeside portrait for
data structures, instrument-portrait source for SQL, street portrait for
interview. Their distinctive hair, glasses where present and facial expression
remain visually consistent with those sources. Poses and props are edited;
these are explicitly labeled illustrations, not actual instructor assignments.

All six retain visible headroom, technology graphics, uniform logos and no ID
lanyards/nameplates. Four use navy polos; two use white. No obvious duplicate
face or malformed hand required regeneration in this inspection. This is a
visual comparison, not biometric verification or a guarantee of identity.

## Tablet

At measured 768 CSS px, navigated all 36 editorial paths. All had one H1 and
document width 768. The only offscreen text detected was intentional horizontal
carousel content on home and people, not document overflow.

Programme-index screenshot: two-column artwork cards, faces/logos fully shown,
navy title panel and compact header. SQL detail artwork loaded at 712 × 400.71
CSS px with `object-fit: contain`; related artworks 343.5 × 193.31, also contain.
These tablet checks preceded the latest sans-serif change; subsequent 400px
checks cover all 36 routes with the new font.

## Mobile brand modal — prior screenshot gap closed

Fresh tab at measured 400 CSS px on `/about`, after the Geist change:

- Opened welcome-kit modal and obtained a nonblank screenshot showing the
  whole source board, title, zoom/close controls and original-image link.
- Zoom button produced a visibly enlarged image in its bounded viewport;
  title and close control remained visible. Pressed right-arrow in scroll region.
- Closed and opened uniform board: whole board rendered in a new nonblank
  screenshot; zoom reset to fit mode.
- Escape closed it: no accessible dialog remained.
- Restored normal browser viewport.

This supersedes earlier notes that mobile modal screenshots were unavailable.
Do not infer native pinch-zoom or a quantitative scroll-distance test from it.
