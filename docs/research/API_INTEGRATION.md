# Homepage API integration

## Backend

- Default base URL: `http://localhost:4000/api/v1`
- Override: `NEXT_PUBLIC_API_URL`
- Authentication: none
- Requests: read-only `GET`

## Component mapping

| Component | Endpoint | Interaction |
|---|---|---|
| `NewsBoard` | `/news?limit=3` | Loads the latest three posts; carousel retains timed/manual controls. |
| `Rankings` KOL | `/growth/rankings?entityType=influencer&periodDays=7|28&limit=100` | Week/month buttons refetch the selected period. |
| `Rankings` MCN | `/growth/rankings?entityType=owner&periodDays=7|28&limit=100` | Week/month buttons refetch the selected period. |
| `SocialIndex` | `/bsi/periods` and `/bsi/rankings` | Category tabs and month select request the selected BSI snapshot. |

## Resilience

- Requests use `AbortSignal` so stale period/category requests cannot overwrite newer state.
- Captured local arrays remain as visual fallback when the backend is stopped.
- API responses are checked structurally before use.
- Remote media failures fall back to existing local assets.
