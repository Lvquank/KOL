# NewsBoard

## Overview
- Target file: `src/components/news-board.tsx`
- Screenshot: `docs/design-references/source-1440-top.jpg`, `source-390-top.jpg`
- Interaction model: hover, click, time

## DOM structure
Section heading → three primary article cards → document rail.

## Exact computed styles
- Desktop cards: 235 × 218 px in the inspected 1440 viewport; image about 235 × 118 px.
- Card title: 13 px, 600, 17.875 px line height; hover orange.
- Mobile hero: 338 × 192 px approximate with dark gradient overlay and 20 px white heading.
- Document rail thumbnails: 64 × 52 px desktop, 140 × 80 px approximate mobile list.

## States and behaviors
- Desktop/tablet: static grid.
- Mobile: 5-second carousel, manual arrows, pagination dots; 200 ms opacity transition.

## Content
Three public news headlines and three public document titles captured on 2026-08-10.

## Assets
Local paths under `public/assets/news/`.

## Responsive behavior
- Desktop: 3-column news + 1-column document list.
- Tablet: same topology at smaller widths.
- Mobile: one carousel item + vertical document list.

## Accessibility and safety adaptations
- Buttons have labels; auto-rotation pauses for reduced motion.
- Article/document actions point to the source in a new tab and carry explicit source attribution.
