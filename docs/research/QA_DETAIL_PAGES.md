# QA report: KOL and MCN detail pages

## Result

- Production build: pass (Next.js 16.3.0).
- Site typecheck: pass.
- Site lint: pass with zero errors/warnings.
- Backend typecheck/build: pass.
- Backend smoke suite: pass, including `/influencers/source/3723`, resolved KOL detail, `/mcns/21`, and MCN 22 ranking/data assertions.
- Browser console errors/warnings on both detail routes: none.

## Visual comparison

| Page | Source height 1440 | Local height 1440 | Source height 768 | Local height 768 | Source height 390 | Local height 390 |
|---|---:|---:|---:|---:|---:|---:|
| KOL 3723 | 1506 | 1505 | 2107 | 2082 | 2347 | 2336 |
| MCN 21 | 1821 | 1842 | 2414 | 2439 | 2683 | 2710 |

The shared 1140 px shell, 768/320 desktop columns, card geometry, 120 px banner, overlapping avatars, responsive sidebar move, horizontal KOL post carousel, MCN distribution, and ranked rows match the source topology.

## Checklist

- [x] Production build and TypeScript checks pass.
- [x] Desktop comparison captured at 1440 px.
- [x] Mobile comparison captured at 390 px.
- [x] Tablet layout checked at 768 px.
- [x] Header, section order, and page height match within normal data/text variation.
- [x] Typography, colors, spacing, borders, media, and breakpoints match extracted values.
- [x] Hover/focus affordances and safe external links retained.
- [x] No document overflow at 320, 375, 390, 414, or 768 px on either page.
- [x] Reduced-motion mode remains usable.
- [x] MCN contribution action completes all three preview steps without a network mutation.
- [x] Research specifications reflect implementation.

## Data verification

- KOL route resolves source ID 3723 through the API, then fetches its canonical influencer key.
- KOL response contains 2 database social channels, 3 database recent posts, and 2 growth snapshots.
- MCN response contains database profile/distribution data, 10 featured channels, and 2 growth snapshots.
- MCN 22 response contains exactly 10 weekly featured KOL and 10 weekly featured channels.
- MCN 22 totals are 783 channels, 150 million interactions, 9.7 billion views, and 146.7 million likes; all patched totals and seven-day growth values are nonnegative.
- Components contain no fabricated entity fallback or hard-coded display metric.

## MCN 22 regression verification

- Responsive browser checks pass at 320, 375, 390, 414, 768, and 1440 px.
- No horizontal overflow or broken ranking images were found.
- Both weekly Top 10 sections render from `/api/v1/mcns/22`.
- Proposal dialog step validation, 500-character counter, commitment gate, keyboard dismissal, focus restoration, and local success state pass.
- Production build, frontend lint/typecheck, backend build/typecheck, and backend smoke suite pass after the database patch.

## Known differences

- Highlight metrics and verification state intentionally reflect the local PostgreSQL snapshot, so they can differ from the live source page captured on 2026-08-11.
- The animated portal word in the shared header may show a different word at screenshot time.
- Full-page captures can repeat the sticky header while the browser stitches long pages; this is a capture artifact, not duplicated page markup.
