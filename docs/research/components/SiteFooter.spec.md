# SiteFooter

## Overview
- Target file: `src/components/site-footer.tsx`
- Screenshot: `docs/design-references/source-390.jpg`
- Interaction model: static

## DOM structure
Logo/provenance → official/partner cards → contact → information → license/copyright.

## Exact computed styles
- Background `#f9fafb`, top border `#e5e7eb`.
- Desktop: three-column layout, roughly 331 px high.
- Mobile: stacked layout with 20 px gutters and generous 28–32 px gaps.

## Content
Public agency, responsible-person, partner, address, phone, email and license text.

## Assets
`public/assets/logo.svg`.

## Accessibility and safety adaptations
- Contact information is plain text; no `tel:` or `mailto:` mutation in the local reference.
