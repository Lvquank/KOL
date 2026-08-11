# InfluencerDetail

## Overview
- Target file: `src/components/influencer-detail.tsx`
- Screenshots: `docs/design-references/detail-pages/source-kol-3723-*.png`
- Interaction model: mixed (hover, external link, and client-side pagination)

## DOM structure
`main > shell > desktop grid > main-column cards + desktop sidebar`, followed by mobile-only statistics and contribution cards inside the main column.

## Exact computed styles
### Container
- Detail surface: `#f9fafb`, minimum viewport height, 32 px bottom padding.
- Shell: 1140 px maximum width; 24 px vertical padding and 16 px horizontal padding from 640 px.
- Desktop grid: `1fr 320px`, 20 px gap, enabled at 1024 px.
- Cards: white, 1 px `#e5e7eb` border, 4 px radius from 640 px, `0 2px 10px rgba(0,0,0,.04)` shadow.

### Typography and children
- Family: Be Vietnam Pro.
- Name: 20 px / 25 px, weight 800; nickname 15 px, weight 400, `#9ca3af`.
- Section heading: 16 px / 24 px, weight 800.
- Channel names and values: 12 px, weight 800; labels 11 px, `#9ca3af`.
- Profile banner: 120 px high; avatar 120 px desktop/tablet, 100 px mobile; circular with 4 px white border.

## States and behaviors
- Trigger: viewport below 1024 px.
- State A: exactly one latest YouTube post is visible per pagination page and statistics are sticky in the right sidebar.
- State B: the same one-post-per-page pagination remains touch friendly; statistics and prompt are in document flow.
- Previous/next and numbered controls change the visible YouTube link without a route reload.
- Transition: 200-300 ms for safe hover affordances; disabled in reduced-motion mode.
- Implementation mechanism: Tailwind responsive utilities plus a small client component holding the active page index.

## Content
All identity, channels, counts, growth statistics, avatar, and recent posts are read from `/api/v1/influencers/*`. No fabricated fallback entity or metric is allowed.

## Assets
- Banner: `https://cdn.netspace.vn/kol/assets/images/banner-kol-2-4x-1778057065044.webp`
- Avatar/post images: API/database values.

## Responsive behavior
- Desktop 1440 px: 768 px main column plus 320 px sidebar in the 1140 px shell.
- Tablet 768 px: single column with 16 px shell padding.
- Mobile 390 px: edge-to-edge cards, 24 px card content padding, 100 px avatar.
- Breakpoints: 640 px card radius/shell padding; 1024 px desktop grid/sidebar.

## Accessibility and safety adaptations
- Focus-visible outline is inherited from global styles.
- External links have descriptive text and safe target attributes.
- Reduced motion removes transforms/transitions.
- Contribution action is disabled with an explanatory title.
