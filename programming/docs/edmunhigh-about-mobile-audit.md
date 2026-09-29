# About mobile verification — 2026-09-25

- Browser: local app, `/about`, measured CSS viewport 400 × 867. Document scroll width is 400: no horizontal overflow.
- Settled hero screenshot: workshop photograph, navy title panel, complete heading and beginning of story display in a single column. This verifies the hero only, not every below-fold section.
- Opened the Welcome kit preview through its actual button. Native dialog measures 384 × 412.74 at x=8, y=226.96, within the viewport. All ancestors have opacity 1 and no transform after reveal.
- Mobile modal screenshot returned a blank canvas through both screenshot adapters. Do not treat DOM geometry as visual approval; mobile modal appearance still needs a reliable capture.
- Escape closes the preview, restores focus to its triggering button, and restores document overflow to visible.
- Reset viewport override. At ordinary desktop size, the same dialog visibly displays the original company design board and close control correctly. The board is scrollable rather than cropped destructively.
- Original company merchandise artwork remains unchanged; removing badges from generated representative photos does not alter the supplied merchandise reference board.

No contact, newsletter, enrollment or admin mutations performed. This audit is not a claim that all public pages match the reference completely.
