# NewsArchive

## Overview
- Target file: `src/components/news-archive.tsx`
- Interaction model: click and browser history

## DOM structure
- Archive filters, result count, paginated article links, numeric pagination, and sidebar.

## States and behaviors
- Trigger: user selects a pagination button.
- State A: page 1 uses `/tin-tuc` and shows the first six articles.
- State B: page N uses `/tin-tuc?page=N` and shows the corresponding six-article slice.
- Transition: client-side Next.js navigation without automatic scroll reset, followed by the existing smooth scroll to the archive area.
- Implementation mechanism: the server page parses `searchParams.page`; `NewsArchive` synchronizes its client state from that prop and writes pagination changes into browser history.
- Browser Back/Forward: restores both the URL and the selected page, including after opening an article from page 2 or later.
- Category/search changes: reset to page 1 and remove the `page` query parameter from the current history entry.

## Content
- Pagination labels are the existing numeric buttons: `1`, `2`, `3`, etc.

## Responsive behavior
- Desktop 1440 px: pagination remains below the article list.
- Tablet 768 px: same history behavior and numeric controls.
- Mobile 390 px: same history behavior; no layout change introduced.

## Accessibility and safety adaptations
- Active page retains `aria-current="page"`.
- Buttons remain keyboard accessible.
