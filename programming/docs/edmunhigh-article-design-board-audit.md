# Article design-board framing

Mobile browser comparison at 400 CSS px exposed the welcome-kit design board being cropped by the photo-style hero and overlapped by the title panel. Unlike a portrait, this image carries brand details across its full composition.

Added a design-board variant to ArticleHero for welcome-kit.png: title no longer overlaps, image uses natural aspect ratio within a 1200px maximum container, caption identifies it as the company's supplied design board. Existing photo article styling remains unchanged. This applies to all three articles using that asset.

Verified mobile screenshots of category/cach-hoc, hoc-lap-trinh-tu-dau and doc-tai-lieu-chu-dong. The corrected design image measured 364×242.85 at viewport width 400, titleOverlapsImage false. Screenshot visibly showed the complete board, including its logo and bottom product strip. No horizontal overflow observed on category page. Screenshots were scaled into a larger canvas by the browser tool, but content was visible. Successful sequence: create agent tab, navigate to article, set viewport, navigate to a different known route, then capture. Override reset afterward.

Lint and production build passed. Full-site/mobile visual verification remains broader than this sample.
