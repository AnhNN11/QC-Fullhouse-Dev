# Activity imagery consistency

Found three activity index cards still using dolphin mascot artwork, and all nine activity detail pages using the same fixed workshop/presentation image pair regardless of the selected activity.

Changes:
- Web design, Python workshop and data stories now use the existing distinct representative course images without badges/lanyards.
- Activity detail hero receives the slug and uses the same activity media mapping as the index, including accurate original/AI captions.
- The companion image changes for code-review so its hero does not duplicate the same workshop photo twice.
- Secondary hero image has a stable 3:2 frame instead of stretching with title height.

Verification:
- All nine detail routes returned HTTP 200 with the expected activity-specific image alt text in the secondary hero.
- Desktop browser screenshot of web-design showed the real workshop photo alongside the correct representative and HTML/CSS/JS/React/TypeScript graphic, with face and caption visible.
- Existing source images were reused; no new generative edits this turn.
- No mobile visual verification in this pass.
