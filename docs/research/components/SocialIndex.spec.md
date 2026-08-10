# SocialIndex

## Overview
- Target file: `src/components/social-index.tsx`
- Screenshot: `docs/design-references/source-1440.jpg`
- Interaction model: click

## DOM structure
Heading/month control → category tabs → poster-like Top 10 panel → ranked list.

## Exact computed styles
- Main heading: 22 px desktop, 20 px mobile, 700.
- Orange header band and cream content area; ranked rows use 36 px round images.
- Controls use compact 12–13 px pill buttons.

## States and behaviors
Category buttons update the label locally with a 200 ms color/background transition.

## Content
Top 10 influencer data captured for Tháng 05/2026 and Buzzmetrics BSI attribution.

## Assets
Local paths under `public/assets/social/`.

## Responsive behavior
- Desktop: large poster/list composition.
- Mobile: stacked, horizontally compact ranked rows.

## Accessibility and safety adaptations
- Category controls expose `aria-pressed`; no remote fetch.
