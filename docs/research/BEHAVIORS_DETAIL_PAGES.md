# Detail page behaviors

- Header remains sticky while scrolling.
- Desktop sidebar uses sticky positioning; the source uses `top: 64px` for KOL and `top: 16px` for MCN.
- Social rows and featured-channel rows gain a light background/border or shadow on hover.
- Recent-post cards scale their thumbnail slightly on hover.
- Recent YouTube posts use client-side pagination with exactly one link/card visible per page at every viewport size.
- Desktop-only sidebar is replaced by in-flow statistics and contribution cards below 1024 px.
- External social/channel links open a new tab and use `noopener noreferrer`.
- MCN contribution buttons open a three-step dialog: category, description, then commitment.
- Step validation, the 500-character limit, Escape dismissal, focus trap/restoration, and body scroll lock match the inspected source behavior.
- The optional email control is disabled and final submission is a local preview; no request or personal data is transmitted.
- Reduced-motion mode removes decorative transitions and image scaling.
