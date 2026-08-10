# Rankings

## Overview
- Target file: `src/components/rankings.tsx`
- Screenshot: `docs/design-references/source-1440-top.jpg`, `source-768-top.jpg`
- Interaction model: click, hover

## DOM structure
Disclaimer strip → KOL ranking card → MCN ranking card.

## Exact computed styles
- Section headings: 18 px desktop, 20 px mobile, 700.
- Featured KOL cards: equal three-column visual rail, portrait images, black gradient overlay.
- Secondary rows: 40 px round avatars with rank, name, interaction and green delta.
- MCN rows: 48 px logo, rank medallion, muted metadata and green interaction figures.

## States and behaviors
- Week/month pill: inactive gray; active white with shadow; 200 ms transition.
- KOL links use subtle image scale/overlay hover only.

## Content
Static captured snapshot: BEN EAGLE, Son Tung M-TP, Lê Dương Bảo.Lâm and ranks 4–10; MCNs VCCorp through Vietnam Music Award.

## Assets
Local paths under `public/assets/kols/` and `public/assets/mcn/`.

## Responsive behavior
- Desktop: KOL/MCN panels side by side.
- Tablet/mobile: stack; featured KOL cards use an overflow-x rail without page overflow.

## Accessibility and safety adaptations
- Tabs are real buttons with `aria-pressed`.
- Rankings are labeled as a static source snapshot and do not call source APIs.
