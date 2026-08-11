# McnDetail

## Overview
- Target file: `src/components/mcn-detail.tsx`
- Screenshots: `docs/design-references/detail-pages/source-mcn-22-*.png`
- Interaction model: hover, modal trigger

## DOM structure
`main > shell > desktop grid > main-column(profile, platform distribution, ranked KOLs, ranked channels, mobile cards) + desktop sidebar`.

## Exact computed styles
### Container
- Uses the same surface, shell, grid, and card tokens as InfluencerDetail.
- Profile banner: 120 px high; overlapping logo is 120 px square at >=640 px and 100 px square below.
- Platform progress bar: 8 px high, 2 px gaps, fully rounded segments.
- Featured KOL/channel row: 10 px vertical padding, subtle bottom divider, 40 px circular avatar.

### Typography and children
- Name: 20 px / 25 px, weight 800; subtitle 15 px, weight 400.
- Section heading: 16 px / 24 px, weight 800.
- Platform count: 20 px, weight 800; platform label 11 px.
- Featured-channel name: 14 px, weight 600; metric value 12 px, weight 700.

## States and behaviors
- Platform cards gain a subtle border/shadow on hover.
- Ranked channel rows gain a light-gray background; channel name uses the primary color.
- Sidebar moves below main content at 1024 px.
- Reduced-motion mode disables transitions.

## Content
MCN identity, distribution, positive total statistics, ranked KOLs, and ranked channels come from `/api/v1/mcns/:sourceId`, backed by PostgreSQL tables. MCN 22 has exactly ten rows in each ranking.

## Assets
- Shared banner: same as KOL detail.
- MCN logo and ranked KOL/channel avatars: API/database values; public source assets are stored locally and their paths come through the API.

## Responsive behavior
- Desktop 1440 px: main column plus 320 px sticky sidebar.
- Tablet 768 px: single column, all three platform cards remain in one row.
- Mobile 390 px: edge-to-edge cards and compact row metrics.
- Breakpoints: 640 px and 1024 px.

## Accessibility and safety adaptations
- External links are keyboard reachable and use safe target attributes.
- Ranked list has an ordered-list semantic structure.
- Contribution action opens a three-step local-only dialog; final submission is simulated and transmits no data.
