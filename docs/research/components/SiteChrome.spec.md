# SiteChrome

## Overview
- Target file: `src/components/site-chrome.tsx`
- Screenshot: `docs/design-references/source-1440-top.jpg`, `source-390-top.jpg`, `source-390-menu.jpg`
- Interaction model: click, scroll, time

## DOM structure
`LocalReferenceNotice` → `AgencyBar` → sticky `SiteHeader` → `UpdateTicker`.

## Exact computed styles
### Container
- Desktop max width about 1110 px; centered.
- Agency bar: orange gradient, white text, 86 px desktop; roughly 136 px mobile.
- Header: white, 57 px desktop; roughly 94 px mobile, 1 px bottom border.
- Ticker: pale peach, 52–60 px, clipped horizontally.

### Typography and children
- Agency copy: 12–13 px, 700, 1.35 line height.
- Portal descriptor: 13 px desktop and mobile, 700 title with 400 subtitle.
- Navigation: 13–14 px, medium.

## States and behaviors
- Mobile menu button toggles a vertical link panel; 200 ms height/opacity transition.
- Marquee loops continuously; disabled under reduced motion.

## Content
Verbatim agency, portal and navigation text from the public source.

## Assets
- Source: `https://kol.gov.vn/images/logo.svg?v=1.0.1`
- Local: `public/assets/logo.svg`

## Responsive behavior
- 1440 px: agency copy and actions share a row; full nav and search pill.
- 768 px: compact nav controls.
- 390 px: agency actions below copy, vertical portal descriptor, expanding menu.

## Accessibility and safety adaptations
- Toggle uses `aria-expanded`; focus ring is visible.
- Phone and report actions are disabled local buttons.
