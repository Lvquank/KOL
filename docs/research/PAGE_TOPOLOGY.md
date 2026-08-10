# PAGE TOPOLOGY — kol.gov.vn

Source inspected: <https://kol.gov.vn/> on 2026-08-10. This is a local reference build for a Vietnamese government information portal. Source screenshots live in `docs/design-references/`.

## Global order

1. Ministry bar: three-line agency attribution, telephone and a “Phản ánh” action.
2. Sticky site header: logo, portal descriptor, desktop navigation/search, mobile search/menu controls.
3. Update ticker: orange label and horizontally clipped rotating ranking updates.
4. News board: three main news cards plus a three-item document rail.
5. Ranking disclaimer strip with a registration prompt.
6. Two-column ranking area: “KOL đang được chú ý” and “Top MCN tăng trưởng”.
7. Social influence panel: month selector, category tabs and Top 10 list.
8. Registration/report section: KOL/MCN selection panel and violation-report form.
9. Footer: logo/provenance, responsible official, technology partner, contact data, information links and license line.

## Responsive topology

- 1440 px: centered content around 1110 px. News is 3+1 columns. Rankings are two equal columns. Registration and report panels are side by side.
- 768 px: compact header with icon controls. News keeps three cards plus document rail. Ranking columns stack; featured cards remain three across.
- 390 px: 16 px gutters. Ministry actions use a two-cell row. Navigation becomes an expanding menu. News becomes a timed hero carousel followed by a vertical three-item document list. Ranking cards become a horizontally scrollable rail. All later panels stack.

## Safety adaptations

- A compact local-build/source provenance line is retained in the footer.
- All links are local no-op buttons or source-attribution anchors; no government endpoint is called.
- Search, registration and report controls are disabled and collect no data.
- Telephone/email are rendered as plain text in the local clone.
- No authentication, uploads, analytics, anti-forgery tokens or private API behavior are reproduced.
