# Learning space representative imagery

Replaced the remaining mascot in the independent-practice learning-space panel with the existing no-badge coding representative artwork. Kept the destination `/dashboard#practice` and explicit AI-edit caption.

Verification:
- Selected the third learning-space option in the browser and verified the selected button, loaded representative asset and practice link.
- Desktop screenshot confirms the representative, Python/JS graphics, caption and text panel.
- A 520 CSS-pixel screenshot of the activity index hero and first activity card rendered correctly in a single column.
- At 400 CSS pixels DOM confirmed no horizontal document overflow and the correct selected image, but screenshot output was blank. Fresh-tab recovery rendered at the default 1707px instead; it is not counted as mobile verification. Temporary viewport reset.
- Scoped source search of app/edu-*.tsx and lib/edu-*.ts found no remaining mascot references. This does not assert absence in dashboard assets or unrelated components.
