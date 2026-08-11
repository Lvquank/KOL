# McnProposalDialog

## Overview
- Target file: `src/components/proposal-dialog.tsx`
- Reference: source MCN 22 dialog inspected through all three steps on 2026-08-11.
- Screenshots: `docs/design-references/detail-pages/local-mcn-22-proposal-{1440,390}.png`
- Interaction model: click, keyboard, form validation

## DOM structure
`trigger button + fixed backdrop > dialog(header + three-step indicator + scrollable form body + footer actions)`.

## Exact computed styles
### Container
- Backdrop: fixed viewport, z-index 9999, black at 50% opacity, 16 px padding.
- Dialog: white, 6 px radius, 640 px maximum width, 92 vh maximum height, strong drop shadow.
- Header/body/footer use 24 px horizontal padding and 1 px gray dividers.

### Typography and children
- Title: 20 px, weight 800; entity caption: 15 px gray.
- Step circles: 24 px square, orange active/completed state, 12 px bold numeral.
- KOL option chips: fully rounded, 14-15 px, white/gray default and orange selected state; labels are uppercase gray.
- Body labels: 12 px; textarea and optional email field: 13 px.

## States and behaviors
- Trigger opens step 1 and places focus in the dialog.
- Step 1 requires one proposal category before “Tiếp theo”.
- Step 2 requires a non-empty description, limited to 500 characters.
- Step 3 requires the commitment checkbox.
- Escape and the close button dismiss the dialog; focus returns to the trigger.
- Final action is a local-only simulation and sends no request or personal data.

## Content
Step labels, category groups, commitment copy, and button labels follow the public MCN 22 dialog inspected on 2026-08-11.

## Assets
No raster assets. Icons use the existing Lucide set.

## Responsive behavior
- Desktop/tablet: centered 512 px dialog.
- Mobile 390 px: 16 px viewport inset, scrollable body, full-width safe controls.

## Accessibility and safety adaptations
- `role="dialog"`, `aria-modal`, labelled title, live status, keyboard dismissal, and focus restoration.
- Optional email input is visibly disabled in the local government-site reference build.
- Final submission is simulated in-browser; no network mutation occurs.
