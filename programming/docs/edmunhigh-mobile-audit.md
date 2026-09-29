# Mobile follow-up — 2026-09-25

Viewport workaround: applying an override before creating a fresh IAB tab worked. Requested 300 physical browser units yielded **400 CSS px** in this environment. All results below use the measured 400px, not a claimed 390px. Override reset afterward.

Visually inspected screenshots:
- `/people`: circular portraits retain visible faces, one card plus next-card peek. Next button scrolls and enables Previous.
- `/blog/category/cach-hoc`: original presenter visible above navy title panel; categories wrap; article grid is one 364px column.
- `/blog/hoc-lap-trinh-tu-dau`: title, documentary image and lead paragraph fit; no central face occlusion. Sidebar becomes static; article layout is one 364px column.

Fixed a discovered regression: article category links inherited the suggestion block's mobile hiding rule. They now use their own class and wrapping layout. Browser confirms the category navigation is visible after the change.

Read-only DOM checks for `/`, `/about`, `/programs`, `/programs/frontend`, `/extracurriculars`, `/extracurriculars/project-lab`, `/blog`, `/contact`: correct H1, document scrollWidth=innerWidth=400, zero completed images with naturalWidth=0. This is NOT a full-page visual or lazy-image-loading audit.

Shared mobile menu tested on `/contact`: open exposes all eight navigation links; Escape collapses it and returns/keeps focus on the menu toggle. No form submitted. Lint and production build passed after category-link repair.

Still open: full-page visual comparison of remaining templates, small/narrow and tablet sizes, native touch gesture testing, runtime reduced-motion preference, expanded journal inventory, remaining image/spacing fidelity. Earlier mobile failures in article/category/carousel notes are superseded only for the checks explicitly listed here.
