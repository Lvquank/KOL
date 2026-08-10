# VISUAL QA REPORT

Date: 2026-08-10  
Source: <https://kol.gov.vn/>  
Local target: `http://127.0.0.1:3000/`

## Results

- [x] `npm.cmd run check` passes: ESLint, TypeScript and optimized Next.js build.
- [x] Source and local top-state screenshots captured at 1440, 768 and 390 px.
- [x] Desktop lower-section and mobile form/footer states captured.
- [x] Header, ticker, news, ranking, social, registration/report and footer order matches the inspected source.
- [x] Desktop news hover changes title from `rgb(17, 24, 39)` to `rgb(254, 92, 16)`.
- [x] Week/month control updates `aria-pressed` and the snapshot label.
- [x] Mobile menu exposes all three navigation links and reports `aria-expanded=true`.
- [x] Mobile carousel changes article through its next control and supports timed rotation.
- [x] No page-level horizontal overflow at 320, 375, 390, 414 or 768 px.
- [x] Reduced-motion CSS disables marquee and transitions; carousel timer checks the media preference.
- [x] No broken raster assets or console warnings/errors were observed.
- [x] All `input`, `textarea` and `select` elements are disabled.
- [x] Report, contact and registration submission actions are disabled and send no data.
- [x] Visible footer provenance links back to the official source.

## Screenshot inventory

- Source: `source-1440-top.jpg`, `source-768-top.jpg`, `source-390-top.jpg`, `source-390-menu.jpg`.
- Local: `local-1440-top.jpg`, `local-1440-mid.jpg`, `local-1440-bottom.jpg`, `local-768-top.jpg`, `local-390-top.jpg`, `local-390-menu.jpg`, `local-390-forms.jpg`.

## Known limitations

- Source rankings and ticker content are live and changed during inspection. The local build intentionally uses one labeled static snapshot.
- Remote article pages, search, registration and violation reporting are not cloned. Public attribution links may open the official source; no mutations are performed.
- The local-build provenance is kept discreetly in the footer so the main viewport matches the official source more closely.
