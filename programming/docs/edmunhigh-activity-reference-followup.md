# Activity detail reference follow-up

Reference inspected: https://edmunhigh.framer.website/extracurricular-detail/debate-club

The current reference has hero photos, description, achievements, an activities/
contact sidebar, four member portraits and upcoming events. It does not have a
related-activity card gallery. Keep DolphinX's compact extra navigation; adding
another image gallery would not improve fidelity.

Truthful adaptations remain intentional: preparation steps/outcomes replace
unsupported achievements; company portraits are disclosed as representatives,
not invented club members; events use actual published contests and an empty
state rather than copied historical dates.

Viewed the reference member heading/first portrait at a narrow breakpoint and
the local four-portrait section at 1707 CSS px. Local images loaded, retained
2:3 proportions with `object-fit: contain`, and were not face-cropped. The
desktop screenshot confirms a centered heading and four aligned photographs.

The subsequent local mobile geometry check measured 400px viewport/document
width, but its screenshot was incorrectly scaled by the browser capture. This
is not accepted as mobile visual evidence. No layout change was warranted by
the verified desktop comparison. Other mobile CTA checks are recorded in the
main rebuild log.
