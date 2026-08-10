# RegistrationSafety

## Overview
- Target file: `src/components/registration-safety.tsx`
- Screenshot: `docs/design-references/source-1440.jpg`
- Interaction model: static/disabled

## DOM structure
Registration information panel → disabled identity cards → benefit list → disabled continue button → disabled report form.

## Exact computed styles
- Desktop section uses a 2/3 + 1/3 white/gray split, 1 px border.
- Heading: 24 px desktop, 20 px mobile.
- Controls: 46–112 px heights, light gray borders, 6 px radius.

## States and behaviors
All inputs and submission controls remain disabled; no state is transmitted or persisted.

## Content
Public source copy retained verbatim, plus a local-reference safety explanation.

## Responsive behavior
- Desktop: registration and report side by side.
- Tablet/mobile: stack vertically.

## Accessibility and safety adaptations
- Disabled controls include clear explanatory text and `aria-disabled` semantics.
