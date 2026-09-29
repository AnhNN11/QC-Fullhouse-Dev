# Landing gallery interaction audit

Reproduced a keyboard issue in the existing photo dialog: Tab from the last button focused BODY, and document overflow remained visible while the dialog was open.

Added explicit Tab/Shift+Tab edge wrapping and a dialog-open document scroll lock. Browser verification after reload:
- Forward Tab from next-image button returns to close.
- Reverse Tab from close reaches next-image button.
- Next image switches the photo/title/thumbnail to the studio group.
- Escape closes the dialog, returns focus to the expand trigger and restores document scrolling.

Expanded read-only public-route auditor to validate local initial img src responses using HEAD and image Content-Type. Latest crawl: 36 editorial pages, 52 internal destinations, 115 fragment references, 22 distinct image response URLs, no failures. This does not cover every responsive srcset candidate, client-selected lazy slide, visual crop, or identity fidelity.

Lint and production build passed after this change.
