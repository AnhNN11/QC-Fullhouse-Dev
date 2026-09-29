# Journal hero alignment — 2026-09-25

Reference `/blog` inspected live: photographic masthead with centered navy title panel, followed by six articles, a featured article, and three further articles. Local article sequence already matched; its masthead was plain text without an image.

Added the existing no-badge collaboration composite, with mixed navy/white uniforms and explicit AI-composite disclosure. Kept all ten articles and category links. Moved image priority from the below-fold featured image to the actual hero.

The initial shorter crop clipped/covered the third person's lower face in a desktop screenshot. Corrected to a stable 2:1 desktop image ratio and only 20px title overlap. Final screenshot shows all four faces unobstructed. Mobile uses full 3:2 image and no title overlap.

Mobile 400px visual screenshot verifies all four people, title, disclosure and wrapping category navigation. DOM confirms one H1 and scroll width 400. Viewport reset. Lint/build passed for the page change; final crop CSS was checked in the live browser.

This verifies the index hero, not every article's full visual fidelity. No image regeneration or backend change in this pass.
