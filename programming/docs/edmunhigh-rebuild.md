# DolphinX Edu — full reference rebuild

Status: in progress. This is not a completion report.

Article mobile follow-up: the edge-case testing article's TOC link reaches
`#try-it` at y=84.78 on a 400px viewport. Screenshot confirms readable practice
copy/CTA and the next related-story image below; no document overflow. Shared
journal image descriptions now cover both article heroes and list thumbnails;
removed unused welcome-kit rendering branches from those components. Browser
confirmed the descriptive workshop alt on the hero; targeted ESLint passed.

Latest regression: production build passed; read-only route audit passed for
36 editorial routes, 50 internal destinations, 115 fragments and 20 image URLs
after merchandise removal. SQL image optimizer returned HTTP 200 (750px output)
and the normal browser loaded the image successfully. Responsive capture gave
inconsistent loading state/scaling, so its cold-load mobile visual remains
unproven. Programme banner `priority` (deprecated in installed Next.js docs)
was replaced with eager loading/high fetch priority; not claimed to solve the
capture issue. Do not regenerate a valid portrait to work around this tooling
observation.

Contact mobile follow-up: at 400 CSS px, submitting an empty form triggers
native validation on all four required fields and consent, without submitting
a lead. Found the first invalid field hidden behind the sticky header; added
130px scroll margin to contact inputs/textarea. Re-tested: name input is focused
at y=130.25, below the 68.67px header, and the screenshot shows its full label,
input and validation bubble. FAQ second question opens with its full answer;
other questions remain closed. No live database write or valid submission was
performed. Form and FAQ screenshots show no horizontal clipping.

Motion follow-up: `node --test scripts/edu-motion.test.mjs` passes six tests
against the transpiled actual EduMotion effect: initial reduced motion,
IntersectionObserver absence, one-shot viewport entry, nested keyboard focus,
preference changes and Strict Mode cleanup/re-setup. The harness mocks DOM and
media APIs; it verifies component logic, not browser CSS animation rendering or
OS preference integration. No production behavior change was needed.

Activity mobile follow-up: visually inspected Project Lab instructions and
participation panel at 400 CSS px. Fixed adjacent primary/contact CTAs by making
both separate full-width flex rows with 44px minimum touch height. Browser
geometry checks on all nine activity detail routes confirmed two separated
buttons (20px gap), minimum 44px heights and no horizontal document overflow.
Project Lab after-change screenshot confirms the intended layout. Other
below-fold visual blocks are not covered by this CTA-specific check.

Mobile follow-up: visually inspected about-page study option cards and the
people carousel heading at 400 CSS px. Text/buttons fit, document width is 400;
carousel next moves the track and enables previous. Also inspected the people
footer columns at that width. Removed remaining uniform-color promotional copy
from the shared people carousel and home gallery; preserved provenance notes.
Targeted ESLint passed for both edited components. The presentation section
scroll attempt landed at the footer, so it is not claimed as visually verified.

Latest follow-up: the previously missing admin stylesheet now exists in the
workspace; production build completed successfully without an admin repair in
this pass. About/people portrait copy no longer advertises navy/white editions
or uniform colors. Portrait assets and honest AI-edit captions remain. Targeted
ESLint passed for both pages, and the updated about section was visually checked
in the browser. This does not establish the remaining full-site visual gates.

Latest content instruction: remove uniform/product merchandising sections as
unrelated to education. Removed about-page brand gallery, people-page kit
section and homepage kit slide. Replaced kit illustrations in three articles
and the resources learning-space option with supplied learning/presentation
photos. Retain team portraits wearing uniforms and original files on disk;
do not restore merchandise sections to satisfy older goal text. Browser audit
of all 36 public pages found no kit/uniform-board images or merchandise sections.

Typography preference superseded by the user's latest instruction: use modern
sans-serif, not Times-like serif. Public headings, FAQ and roadmap emphasis now
use Geist, matching the dashboard. Merriweather loading was removed. Do not
restore serif typography merely to match the reference. Browser checks on all
36 public routes at 400 CSS px found no overflow and no serif H1/H2/H3/summary;
desktop hero was visually inspected. ESLint and production build passed before
the final one-rule roadmap emphasis cleanup.

## Current evidence and remaining work (supersedes historical pass notes)

The sections below retain implementation history; their old statements about
missing pages, fictional hero people, badge-bearing group images or four-only
articles are no longer the current state.

- Current inventory: 36 public editorial routes, including six programme,
  nine activity, ten article and four category details. See route coverage and
  public regression reports for exact scopes.
- Current navigation, footer, FAQ, programme selector, galleries and carousel
  have interaction evidence in the corresponding audit reports.
- Production build passed after programme subject typography refinement.
  Subsequent brand-caption change passed targeted ESLint and mobile DOM checks.
- Six individual studio portraits now have a direct source-comparison review;
  retain these versions rather than generating again without a specific defect.
- Welcome kit is the exact supplied asset; badges are removed from the edited
  course/group photographs, not destructively removed from source design boards.

Mobile gallery screenshots and course-artwork source comparison are now verified
in `edmunhigh-image-tablet-acceptance.md`, alongside a 36-route tablet geometry
check. Remaining acceptance work is visual/template fidelity below the fold at
narrow and tablet sizes beyond the screens already recorded. Runtime
reduced-motion and live database-writing form tests are not established by the
existing audits. Do not repeat route-count or build checks as substitutes for
these missing kinds of evidence.

## Latest verification (2026-09-25)

Newer detailed passes are recorded in `edmunhigh-article-audit.md`, `edmunhigh-category-audit.md`, `edmunhigh-people-carousel-audit.md`, and `edmunhigh-mobile-audit.md`. These supersede older notes only within their stated scope. Article/sidebar repairs, four blog categories, and the six-person carousel are implemented. Actual 400px mobile checks now pass for their tested states. Six course artworks use distinct supplied representatives with badges removed (see company/course-no-badge-manifest.md). The full-site checklist below remains open; it is not made complete by these narrower checks.

## Verified progress, first implementation pass

Created `/about` and reusable editorial shell, overlapping photo/title hero, progressive reveal motion with reduced-motion fallback, four linked starting steps, values, two edited representative portraits, welcome-kit/uniform gallery, study options. Navbar now links to `/about`. Desktop and 390px mobile visually checked, no horizontal overflow on mobile. Lint/build passed before final portrait insertion; rerun at next verification gate. Two generated portrait assets saved under `public/brand/company`, with exact prompts in `generation-manifest.md`. Neither generation job is still running.

Still incomplete: home hero still uses prior fictional people and must be replaced; remaining supplied representatives have not been edited; remaining reference pages/detail templates and animations require implementation and visual verification. Do not mark the goal complete.

## Requested outcome

Review every public page of https://edmunhigh.framer.website/ and implement the corresponding DolphinX education website, including detailed pages, interactions, animation and responsive layouts. Preserve learning, enrollments and admin behavior. Use the supplied company representatives rather than invented AI faces; use both navy and white uniforms and the supplied welcome-kit identity.

## Reference inventory

Fourth implementation pass: `/blog` and four full editorial articles implemented in `lib/edu-journal.ts`, with featured story, article grid, table of contents, three substantive sections, practice prompt and related links. No invented company news/author credentials. Navbar includes Blog. Lint/build pass; five routes 200, invalid slug 404. Desktop index and mobile article visually inspected; featured link navigates correctly, table-of-contents link reaches target at ~85px below top; mobile document/scroll widths both 390px. Blog reference index read; detail visual comparison and richer imagery remain part of overall fidelity audit.

Third implementation pass: `/extracurriculars` plus nine detail routes now exist; individual activity descriptions, three steps, outcome, participation sidebar and related links. Existing community/contest/practice workflows preserved. No invented dates or awards. Reference debate-club detail read (hero, description, sidebar, members, events); current implementation still needs richer photo/card fidelity and member/event sections where truthful content exists. Desktop index and mobile detail visually checked, click navigation verified, 390px detail has no horizontal overflow. All ten routes return 200, unknown slug returns 404; lint/build pass. No image generation was run in this pass.

Second implementation pass: `/programs` and six `/programs/[slug]` pages implemented with individual audiences, prerequisites, four outcomes and six subjects each. Links point to existing course IDs, preserving enrollment. Navbar links to index. Lint and production build pass after changes. Visual desktop/mobile audit still required for these pages. Read reference STEM detail template: title/intro/apply, outcomes, large image, six subjects, related programs. No copied school fees or fabricated credentials.

- `/`: large editorial hero, three benefits, program selector, events, activity/gallery, alumni portraits, FAQ, image CTA, articles, newsletter/footer.
- `/about`: editorial hero and history, welcome portrait, four admission steps, values, achievements and pricing.
- `/programs`: hero and six linked programs; individual detail templates need visual inspection.
- `/extracurriculars`: hero, nine linked activities, facilities selector; individual detail templates need visual inspection.
- `/community`: hero, staff gallery and teacher grid.
- `/blog`: article grid, featured story, latest stories; individual article templates need visual inspection.
- `/contact`: hero, contact form, contact info/map, FAQ and newsletter.

Do not copy fabricated school statistics, awards, tuition, addresses or staff identities into DolphinX. Adapt structure with verifiable app content and truthful service descriptions.

## Implementation checklist

- [ ] Inspect visual layouts of all reference templates, discover all detail routes.
- [ ] Shared public navigation/footer and animated, reduced-motion-safe page system.
- [ ] Home rebuilt with complete editorial section rhythm.
- [ ] About with company representatives and brand kit.
- [ ] Programs index and detailed program routes connected to existing courses.
- [ ] Activities index and detail routes connected to community/contests.
- [ ] Team/community presentation without deleting existing social features.
- [ ] Blog index and full article routes.
- [ ] Contact page with working persistence and clear feedback.
- [ ] Faithful portrait edits for supplied representatives, mixed uniforms; natural documentary images.
- [ ] Inspect generated identities against originals; label edited scenes appropriately.
- [ ] Desktop/mobile, navigation, keyboard and reduced-motion verification across every template.
- [ ] Lint/build and route/link checks.

## Current image work

### Activity index photographic fidelity pass

- Replaced three-column symbol cards with two-column large-image cards, overlaid category labels, larger titles, explicit discover links, hover/focus states and reduced-motion fallback. Mobile CSS collapses to one column. Media mapping covers all nine activities using supplied originals, uniform composites and existing topic mascots, with provenance captions.
- Uses latest studio group v2 images (plain studio, lanyards/clipped badges), replacing rejected v1 style in the homepage gallery. Exact prompts and assets in company/group-v2-generation-manifest.md. Originals and older variants retained.
- Browser verified desktop activity cards and learning-spaces selector changing to independent practice, including its repaired image and destination. All nine detail routes return 200; invalid slug returns 404; all mapped media files exist. Lint/build pass.
- This pass does not prove all-site completion. Mobile visual audit, remaining reference/detail comparisons, and full interaction audit remain open.

### Studio portrait and competition-scene update

- Four casual portraits replaced on `/people` with navy/white uniform studio edits. Presentation block uses a blue technology-competition composite, explicitly labeled fictional illustration rather than a real event record. Originals retained.
- All five outputs visually inspected and recorded in `public/brand/company/studio-generation-manifest.md`. Desktop gallery and presentation block verified in browser; lint/build passed. Mobile screenshot capture had a viewport-rendering problem, so this pass does not claim mobile visual verification.
- Activity detail template now has a two-photo editorial hero, preparation sidebar and representative-portrait connections section. Activity index includes an interactive four-option learning-spaces selector. Corrected its missing Python image reference to existing coding mascot. Lint/build pass; interaction and final visual verification remain pending.
- Reference activity index visually inspected: two-column photographic cards with overlaid category labels. Local symbolic three-column cards still differ and need a dedicated fidelity pass. Full goal remains in progress.

### Program detail visual comparison pass

- Visually inspected EdmunHigh STEM detail at 1280px, including heading, full-width pale outcomes band, banner and two-column subjects. Compared with local frontend detail; found broken block-stacked checkmark list and missing visual separation.
- Updated shared six-program detail template: full-width pale outcome band with aligned icon/text rows, vertical opening section, two-column numbered subject rows and two illustrated related-program cards instead of text-only links. Preserved existing course registration destinations and subject content.
- Verified desktop opening, subjects and related cards in browser, plus mobile opening at 390px without overflow. Six detail URLs and six matching course URLs return 200; invalid program returns 404. Lint/build pass.
- This completes this template repair, not the full-site fidelity audit. Reference activity/blog detail comparisons and remaining index/interaction checks still pending.

### Home gallery, events and motion pass

- Added homepage event block reading up to three published, non-ended contests from MongoDB. Shows truthful empty state when no contests and distinct unavailable state on database failure. No fabricated dates or events, no DB writes. Browser currently shows no upcoming published contests.
- Added 4-image gallery of provided documentary images, edited navy portrait and company kit; previous/next, direct thumbnail selection, contextual detail links and native modal zoom. Captions disclose edits. No autoplay.
- Browser tested next slide updates image/text/destination, zoom opens modal, ArrowRight changes slide, Escape closes and restores trigger focus. Desktop and 390px mobile modal screenshots inspected; document width stays 390px.
- Connected homepage sections to the existing progressive-enhancement reveal system and added motion CSS import. Reduced-motion rule exists; OS reduced-motion runtime has not been toggled/tested.
- Lint and build passed after changes. Remaining visual fidelity audit still includes all detail templates, program index, activity illustrations, staff carousel and reference type/spacing comparison. Newsletter delivery remains explicitly unconfigured.

### Shared footer and newsletter pass

- Replaced separate home/editorial footers with `EduFooter`, grouped exploration/learning/community navigation and responsive newsletter section.
- Newsletter form saves normalized-email requests through a server action with explicit consent, honeypot, deterministic primary key and insert-only duplicate handling; suppressed addresses cannot be reactivated publicly. No outbound email configured, disclosed publicly and in admin.
- Added protected `/admin/newsletter`, 30-row pagination and suppression action; linked from admin shell. No real subscription/test lead created and no real admin session used during this pass. End-to-end persistence/admin mutation remains unverified.
- Lint/build passed. Two repeatable normalization/rejection tests pass via `node --experimental-strip-types --test scripts/newsletter-validation.test.mjs`.
- Browser verified empty-email rejection and desktop/mobile newsletter layout. 390px document has no horizontal overflow. Read-only scan found 35 internal destinations from 7 public root pages, all returned 200; unauthenticated newsletter admin returned 307 to `/admin`.
- Production newsletter sending/ownership confirmation and abuse-rate limiting are not implemented; do not describe this as a working email delivery system. Overall design/fidelity checklist remains open.

### People and home imagery pass

- Inspected reference `/community` text and desktop hero/staff layout. Added `/people` public editorial presentation, preserving existing `/community` social functionality. Linked from main navigation and homepage.
- People page includes arched navy/white portraits, four supplied unedited everyday photographs, original presentation, welcome-kit imagery and working contact/activity/community links. No guessed names or roles.
- Replaced homepage fictional AI hero with original workshop and fictional mentor image with identity-preserving white-polo presentation edit. Added homepage people and three linked journal cards. Captions disclose image edits.
- Built-in imagegen prompt and saved asset recorded in company generation manifest. Edited presenter visually compared with original; original remains intact.
- Verified people desktop/mobile portraits and 390px document width, homepage rendered source images/captions/navigation. Lint/build passed. Full-page fidelity, carousel interaction, remaining portrait edits, home activity/gallery rhythm, shared footer/newsletter and all-template audit remain open.

### Contact implementation pass

- Added `/contact` with supplied original workshop photo, editorial heading, consultation form, three-step follow-up explanation and native FAQ disclosures.
- Form reuses `requestConsultation` and `AcademyForm`: existing MongoDB consultations collection and admin academy management, consent, honeypot, duplicate window, pending/success/error feedback. No fabricated address, phone, map or response-time guarantee.
- Added public navbar link. Lint and production build passed (33 static pages); browser verified required-field rejection and desktop/mobile form rendering. Mobile document width equals viewport width at 390px. No test lead submitted to live database; persistence path inspected, not end-to-end tested.
- Remaining overall checklist is still active, especially home imagery, team presentation and reference fidelity.

Built-in imagegen: two identity-preserving shirt edits started from supplied studio portraits (black-haired portrait to navy polo; copper-haired portrait with glasses to white polo). Preserve original face, pose, skin texture and background. No guessed names or job titles.

Welcome-kit reference inspected: navy presentation box, thermos, lanyard/badge, notebook, pen, charging cable, desk nameplate and stickers. Uniform reference inspected: navy and white polos with cyan/white or blue/cyan piping.
