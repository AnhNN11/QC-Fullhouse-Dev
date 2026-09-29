# Photo CTA and public-route verification

Verified 2026-09-25 against the local application.

- Homepage final CTA uses the existing white-uniform presenter edit, with an explicit AI-uniform caption. Desktop text sits beside the presenter; at the mobile breakpoint the photograph precedes the navy text panel.
- Browser inspection at an actual 400 CSS-pixel viewport confirmed a 400px document width, a 400 × 330px image frame, visible presenter face and readable heading below the photograph. The photograph is not covered by the heading. Viewport override reset after testing.
- Clicking “Bắt đầu cùng DolphinX Edu” navigated to `/dashboard`. This checks the destination only, not authenticated dashboard behavior.
- `node scripts/audit-public-routes.mjs` passed: 36 editorial pages, 51 internal destinations, 151 editorial fragment references, no reported failures. The script checks status and one H1 on crawled editorial pages and fragment existence; it does not verify every image, visual fidelity, authentication, form persistence, or external links.
- Production build passed, including TypeScript and generation of 44 static pages.

This is a scoped verification, not proof of whole-site completion. Remaining work includes full-page reference fidelity, runtime reduced-motion behavior, and authorized end-to-end form/admin testing. Course badge removal does not imply removal from other group photographs or company merchandise.
