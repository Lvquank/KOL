# Live API and interaction QA report

Date: 2026-08-10  
Source reference: <https://kol.gov.vn/>  
Local target: <http://localhost:3000/>  
Backend: <http://localhost:4000/api/v1>

## Source interaction findings

- Disclaimer marquee duplicates the same message twice and runs `22s linear infinite` from right to left.
- Desktop ranking cards are 800 px high.
- The KOL row list and MCN list use independent `overflow-y:auto` regions.
- Week/month pills use a 200 ms transition; the active state is white with dark text and a small shadow.

## Automated checks

- [x] ESLint passes.
- [x] TypeScript passes.
- [x] Next.js 16.3 production build passes.
- [x] Backend `/health` returns `status=ok`.
- [x] Frontend `/` returns HTTP 200.
- [x] Homepage receives live news, growth and BSI data without fallback labels.
- [x] KOL week/month buttons switch from 7-day to 28-day API data.
- [x] MCN week/month buttons switch from 7-day to 28-day API data.
- [x] KOL list scroll changed from `scrollTop=0` to `scrollTop=420`; maximum observed scroll was 5597 px.
- [x] MCN list scroll changed from `scrollTop=0` to `scrollTop=420`; maximum observed scroll was 1326 px.
- [x] BSI `Chiến dịch` tab returned OPPO X9 Ultra & Find X9S, Sting F1 and Ngày Hội Thôi Nôi.
- [x] BSI month selector returned six periods from 12/2025 through 05/2026.
- [x] Marquee X transform decreased from `-449.890px` to `-468.419px` after 500 ms, confirming right-to-left movement.
- [x] Browser console contained no warning or error entries.

## Responsive checks

| Viewport | Layout | Ranking card sizes | Horizontal overflow |
|---|---|---|---|
| 1440 × 1000 | Two columns | 545 × 800 px each | 0 px |
| 768 × 900 | One column | 720.8 × 800 px each | 0 px |
| 390 × 844 | One column | KOL 343.2 × 690 px; MCN 343.2 × 560 px | 0 px |

At 390 px, week/month controls remain visible and both ranking lists keep internal scrolling.

## Safety and resilience

- Registration and report submissions remain disabled.
- The frontend calls only the user's read-only local backend.
- Static captured data and local images remain available when the backend or remote media is unavailable.
- `prefers-reduced-motion` disables the new ranking marquee.
