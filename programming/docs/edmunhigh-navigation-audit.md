# Public navigation fidelity

2026-09-25: Opened the live reference menu. It uses a dark top overlay with three columns and a close control, not a permanently expanded desktop link row.

Rebuilt only `EduNavbar` as a native modal dialog with three grouped columns, navy/cyan styling, current-page indication and a persistent dashboard CTA in the closed header. Mobile uses a scrollable one-column layout. Native dialog provides modal focus containment, background inertness and Escape; explicit close returns focus to the trigger. Reduced-motion CSS disables entrance and arrow animation. No dashboard navigation changes.

Browser verification:
- Desktop three-column screenshot matched the intended structure; `/about` current link highlighted.
- Escape closed the dialog, `aria-expanded=false`, focus returned to “Mở menu”.
- Selecting “Chương trình học” navigated to `/programs` and closed the dialog.
- At actual 400 CSS pixels: document width 400, one 350px content column, dialog client height 867px and scroll height 936px; screenshot showed all three groups. Viewport override reset after closing.

Lint/build passed. OS reduced-motion runtime still needs explicit verification; this does not certify full-site completion.

## Keyboard follow-up

Native dialog initially allowed a transient focus step outside its contents after the last link. Added explicit Tab boundary wrapping for first/last focusable controls. Browser verified 17 consecutive Tab presses all remained inside the dialog; Shift+Tab on the first wordmark link moved to the final dashboard link. Escape still closes normally. Lint/build passed after the fix.

Homepage program anchor navigation was also verified to reach `#programs`, with the section visible. The section was already marked visible before navigation, so this is not evidence of a fresh reveal animation transition. Reduced-motion setting remained false; no OS preferences were modified.
