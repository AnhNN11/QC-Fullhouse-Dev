# Scroll reveal lifecycle audit

Found that EduMotion cleanup marked every observed element `is-visible`. React development Strict Mode's setup/cleanup/setup cycle consequently bypassed the intended initial reveals, including offscreen sections.

Changed cleanup to remove enhancement class `reveal-ready` instead. Content remains progressively visible when enhancement stops, without marking unvisited sections as already revealed. Added focusin handling for reveal ancestors and a focus-within CSS override so keyboard navigation does not land inside transparent content.

Browser verification on `/programs`:
- Before repair, both programs and assessment had `is-visible` while below the viewport.
- After repair/reload, the offscreen assessment settled to opacity 0 without `is-visible`.
- Scrolling it into the viewport (top approximately 459px) added `is-visible`.
- Subsequent keyboard navigation retained opacity 1.
- Reduced-motion CSS remains in place; OS-level reduced-motion runtime was not changed/tested.

Read-only route crawl passed: 36 editorial pages, 51 internal destinations, 115 editorial fragment references, no failures. This checks HTTP/H1/fragments, not complete visual fidelity or authenticated workflows.

Lint and build passed after the lifecycle edit. Focus-within CSS was added afterward and verified through the dev browser; no new production build was run for that one CSS rule.
