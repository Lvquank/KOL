# BEHAVIORS

## Observed source states

- Header: `position: sticky; top: 0; z-index: 40`; it gains separation from content while scrolling.
- Mobile menu: hamburger reveals a vertical `Bản tin / Tài liệu / Giới thiệu` panel under the site header; close replaces hamburger. Local clone preserves this safe interaction.
- Update ticker: content moves horizontally and clips at the viewport edge. Local clone uses a reduced-motion-safe CSS marquee.
- News: desktop/tablet show three cards. Mobile shows one timed hero with previous/next controls and three pagination dots; source content rotates after several seconds. Local clone uses a 5-second interval and supports manual navigation.
- Ranking tabs: `Tuần` and `Tháng`; observed inactive class uses gray text and active state uses white background, dark text and a small shadow. Transition duration is 200 ms. Local clone changes the visible data label only; it never fetches remote data.
- News hover: title changes from `rgb(17, 24, 39)` to `rgb(254, 92, 16)` with a color transition.
- Keyboard: focused buttons receive a visible browser-style outline. Clone uses a 3 px translucent orange focus ring.
- Registration/report: source contains selectable identity types and a report form. Per the sensitive-target rule these controls are visibly disabled in the clone.
- Reduced motion: marquee and timed carousel stop under `prefers-reduced-motion: reduce`.

## Known source dynamics

Ranking values and names changed during the inspection session. The implementation uses the first stable captured state and labels it as a static snapshot.
