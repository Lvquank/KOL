# RankingsLive

## Overview
- Target file: `src/components/rankings.tsx`
- Source: <https://kol.gov.vn/>
- Interaction model: click, scroll, hover, network

## DOM structure
Disclaimer marquee → two-column ranking grid → KOL card and MCN card → fixed headers → internal scroll lists → footer buttons.

## Exact computed styles
### Ranking cards
- Desktop size observed at 1280 px viewport: 546 px wide × 800 px high.
- Background: `rgb(255,255,255)`.
- Border: 0.8 px `rgb(243,244,246)`.
- Radius: 4 px.
- KOL list: `overflow-y:auto`, about 435 px visible height.
- MCN list: `overflow-y:auto`, about 649 px visible height.

### Disclaimer marquee
- Outer row height: 40 px.
- Track: max-content flex row containing two identical messages.
- Message width observed: about 842 px plus 80 px right padding.
- Animation: `ticker-scroll 22s linear infinite`, translating right to left.
- CTA stays fixed at the right side of the clipped track.

## States and behaviors
- `Tuần`: requests `periodDays=7`.
- `Tháng`: requests `periodDays=28`.
- Active pill: white background, dark text, subtle shadow.
- Inactive pill: gray text; 200 ms transition.
- KOL and MCN period states are independent.
- Lists scroll inside their cards instead of increasing page height.

## Content and API
- KOL: `GET /api/v1/growth/rankings?entityType=influencer&periodDays=7|28&limit=100`.
- MCN: `GET /api/v1/growth/rankings?entityType=owner&periodDays=7|28&limit=100`.
- Captured local arrays remain an offline fallback only.

## Accessibility and safety adaptations
- Tabs use `aria-pressed` and loading state uses `aria-busy`.
- Scroll regions are keyboard focusable and labeled.
- `prefers-reduced-motion` disables the marquee animation.
- Registration CTA remains disabled because this is a local government-site reference build.
