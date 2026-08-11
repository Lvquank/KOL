# Page topology: KOL and MCN detail

## Sources

- KOL: `https://kol.gov.vn/nguoi-noi-tieng/3723`
- MCN: `https://kol.gov.vn/mcn/21`
- MCN with weekly rankings and proposal flow: `https://kol.gov.vn/mcn/22`
- Inspected at 1440, 768, and 390 px on 2026-08-11.

## Shared frame

1. Orange agency bar.
2. Sticky white navigation header.
3. Light-gray detail surface.
4. Detail shell: 1140 px maximum width, 16 px side padding from 640 px upward.
5. Desktop (>= 1024 px): main column plus a 320 px sticky sidebar, 20 px gap.
6. Tablet/mobile (< 1024 px): one column; statistics and contribution card move below primary content.
7. Existing local provenance footer remains visible because this is a government-site reference build.

## KOL detail

1. Profile card: 120 px orange banner, circular overlapping avatar, name, nickname, type, verification badge.
2. Social channels card: database-backed channel rows with platform icon and available metrics.
3. Recent content card: horizontal snap carousel below 1024 px and three-column grid on desktop; only rendered when the API returns database posts.
4. Highlight statistics: two-by-two grid.
5. Contribution prompt: safe local-only proposal preview.

## MCN detail

1. Profile card: 120 px orange banner, square overlapping logo, name, subtitle, MCN descriptor.
2. Platform distribution card: proportional bar plus platform summary tiles.
3. Weekly featured KOL card: ranked ten-row list supplied by the MCN API.
4. Weekly featured channels card: ranked ten-row list supplied by the MCN API.
5. Highlight statistics: two-by-two grid.
6. Contribution prompt: three-step local proposal preview supplied by a client-side dialog.

## Reference captures

- `docs/design-references/detail-pages/source-kol-3723-{1440,768,390}.png`
- `docs/design-references/detail-pages/source-mcn-21-{1440,768,390}.png`
- `docs/design-references/detail-pages/source-mcn-22-{1440,768,390}.png`
- `docs/design-references/detail-pages/local-mcn-22-proposal-{1440,390}.png`
