# Homepage people carousel

Replaced the homepage's two static portraits with the shared six-portrait carousel used on the people page. This advances the reference's horizontally browsable people presentation while retaining supplied representatives and alternating navy/white studio uniforms. Added a homepage-only directory link and explicit AI-edit disclosure styling.

Verified on localhost in the desktop browser:
- All six portrait assets loaded successfully.
- Next control moved the 1200px-wide track from zero to about 333px (2000px scroll width).
- ArrowLeft returned the track to zero; previous control became disabled.
- Screenshot showed circular portrait framing, alternating uniforms, serif headings and a partially visible next card.
- Directory link navigated to `/people`.
- `npm run lint` and `npm run build` passed.

This check does not prove all public-page fidelity or mobile visual coverage. No new images were generated or identities altered in this change.
