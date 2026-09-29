# Reference route coverage — 2026-09-25

Source: live `https://edmunhigh.framer.website/sitemap.xml`, retrieved successfully with HTTP GET. The reference lists **36 URLs**, not just its seven top-level pages.

## Template coverage

| Reference family | Count | DolphinX counterpart | Adaptation |
| --- | ---: | --- | --- |
| Home | 1 | `/` | Editorial landing plus existing learning/roadmap entry points |
| About | 1 | `/about` | Company story, representatives and study options; merchandise removed per latest user request |
| Programmes index | 1 | `/programs` | Six programming learning paths |
| `/program-detail/*` | 6 | `/programs/{frontend,python,algorithms,data-structures,sql,interview}` | Real app curricula instead of school subjects |
| Activities index | 1 | `/extracurriculars` | Nine learning activities |
| `/extracurricular-detail/*` | 9 | `/extracurriculars/{code-together,project-lab,code-review,algorithm-arena,web-design,python-workshop,data-stories,learning-circle,demo-story}` | Learning/community activities instead of fictional school clubs |
| Community presentation | 1 | `/people` | Keeps `/community` available for the existing social product |
| Blog index | 1 | `/blog` | Educational articles rather than invented company news |
| Blog categories | 4 | `/blog/category/{cach-hoc,cong-dong,du-an,thuc-hanh}` | Four truthful editorial categories |
| `/blog-detail/*` | 10 | Ten `/blog/[slug]` articles | Original learning content, not fabricated school achievements |
| Contact | 1 | `/contact` | Consultation form and FAQ; no invented address/map |
| **Total** | **36** | **36 public editorial pages** | Existing learning/admin routes are additional |

## What this establishes

All reference route families and detail-page counts have counterparts. The local read-only route audit traverses actual links rather than relying on source-file counts; it checks HTTP responses, headings, local image responses and editorial fragment targets. See `scripts/audit-public-routes.mjs` for its exact scope.

## What remains separate

- Equal route counts do not establish visual or motion fidelity.
- The public route is intentionally `/people`, not a replacement of the existing social `/community`.
- Image edits and source manifests establish provenance, not guaranteed facial likeness.
- Live form persistence and admin writes have not been exercised against the user's database during the editorial audit.
- Mobile dialog visual capture and full below-fold reference comparison still require verification.

Do not interpret this inventory as completion of the full rebuild objective.
