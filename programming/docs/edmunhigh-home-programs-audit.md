# Homepage programme alignment

## Change

The reference homepage offers six programme choices in one shared preview area. DolphinX previously maintained a separate four-item homepage catalogue whose “Explore programme” links skipped public programme detail pages.

The homepage now reads the six existing public programmes from `lib/edu-programs.ts` and their six separate artwork URLs from `lib/edu-program-media.ts`. Titles, introductions and outcome previews share the detail-page data. Exploration links open `/programs/[slug]`; registration remains available from those detail pages. Only one artwork is displayed at a time.

## Verification

- ESLint passed for the edited component.
- Browser interaction selected all six buttons in sequence. Each selection had exactly one pressed button, the matching heading, a distinct image URL and the matching public programme destination.
- Desktop screenshot confirmed the sixth programme renders in the existing two-column list/preview composition.
- This is not proof of face-identity fidelity or a complete reference-site visual audit.
