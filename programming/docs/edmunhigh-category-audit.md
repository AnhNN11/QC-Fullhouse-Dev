# Blog category pass — 2026-09-25

Reference: https://edmunhigh.framer.website/blog/achievements (inspected in browser; web text fetch was unavailable).

Added four static category pages under `/blog/category/`: cach-hoc, cong-dong, du-an, thuc-hanh. Data uses the four existing DolphinX editorial categories, not fabricated school achievements. Each page filters the real local journal entries by category and uses supplied company photography.

Added category navigation to the blog index and article sidebar. Category pages expose `aria-current="page"`, links back to all articles, metadata and a 404 for unknown categories. Existing article URLs preserved.

Reference has a centered navy panel over a photograph and a two-column article grid. The panel is moved toward the photo bottom to avoid masking the representative's face; mobile grid uses one column. Full mobile visual verification remains pending.

Checks: all four routes returned 200; unknown category returned 404. Browser interaction from Cách học to Dự án showed the correct heading and only the project article. Lint and build passed with 38 generated static pages before final photo/crop tweaks. These category pages are implemented; full-site fidelity and journal content inventory remain incomplete.
