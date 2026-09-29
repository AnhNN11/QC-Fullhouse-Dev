# Homepage closing sequence

Reference inspected live: https://edmunhigh.framer.website/ . Its closing sequence is alumni → FAQ → photographic invitation → latest articles → newsletter/footer.

Moved DolphinX's journal section out of `EduHomeEditorial` into the named `EduHomeJournal` component, rendered after the photographic CTA. Kept all three existing article cards and destination links unchanged. The local sequence is now representatives → FAQ → photographic invitation → journal → newsletter/footer.

Verification:
- Desktop accessibility tree confirms this order and preserves article links.
- Mobile DOM at an actual 400 CSS-pixel viewport confirms the final four main headings in this order, document width 400, portrait track width 364.
- Mobile next-portrait control moved the track to scrollLeft 306.
- Mobile screenshots returned a blank canvas despite populated DOM and opacity 1, so mobile visual fidelity is not considered verified by this run. Viewport override reset.
- Lint and production build passed (session 26030).

Remaining full-site visual/effect audit is not covered by this scoped change.
