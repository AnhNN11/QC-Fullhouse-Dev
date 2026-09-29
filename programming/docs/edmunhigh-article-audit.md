# Article detail pass — 2026-09-25

Reference inspected: https://edmunhigh.framer.website/blog-detail/unveiling-our-new-state-of-the-art-stem-lab

Reference structure: overlapping navy title panel and full-width photo, article body with right-hand editorial sidebar, related image cards. Adapted to DolphinX learning content without inventing an author, publication date, or company achievement.

Changes:
- Retained title overlap and original supplied documentary photography.
- Fixed lead paragraph alignment: the global paragraph margin reset overrode the container margin when both were on the same element. A container wrapper now preserves the page gutter.
- Changed hero crop to top-aligned, responsive height so the title panel no longer masks the central person's face.
- Moved article navigation to a right-hand sidebar on desktop and added two working suggested-article links. Small-screen layout puts the navigation above the article; related cards remain below it.

Verified:
- Desktop screenshot at actual 1707 CSS px: paragraph gutter, visible central face, right-hand sidebar.
- TOC click navigated to #section-1 and exposed its heading below the navbar.
- Suggested article click opened /blog/dat-cau-hoi-ve-code with the correct title/content.
- ESLint passed; production build passed again after the final CSS photo-height adjustment (34 static pages generated).

Not yet verified:
- Mobile rendering: requested 390 viewport was not applied to the test tab (DOM still reported 1707). Override reset. Do not treat this run as a mobile pass.
- Remaining detail templates, article inventory/category pages and full-site reference fidelity remain open.

Related completed media work: six course representatives now use separate people and no badge/nameplate variants, with original versions retained. See public/brand/company/course-no-badge-manifest.md. This does not remove badges from every other company photograph.
