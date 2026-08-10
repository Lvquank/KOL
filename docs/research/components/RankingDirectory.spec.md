# RankingDirectory

## Overview
- Target file: `src/components/ranking-directory.tsx`
- Screenshots: `docs/design-references/source-mcn-1280.png`, `docs/design-references/source-top100-1280.png`
- Interaction model: click, change, hover, incremental load, animation

## DOM structure

`section.directory-page > breadcrumb + header + optional verification tabs + filters + table + load-more`

## Exact computed styles

### Container
- max-width nguồn: 1140px; local dùng token container hiện tại 1110px để khớp chrome đã dựng.
- page padding top: 16px.
- bảng: width 100%, table-layout fixed, border `#e5e7eb`.

### Typography and children
- Font: Be Vietnam Pro.
- H1: 24px, bold, line-height 36px.
- Header bảng: 12px, medium, `#6b7280`.
- Hàng: cao xấp xỉ 78px; avatar 44–48px.

## States and behaviors
- Filter active: nền trắng, shadow nhẹ, 150ms.
- Verification active: chữ/cạnh dưới cam, 150ms.
- Loading: opacity giảm và skeleton spinner.
- Table re-entry: fade + translateY theo từng dòng.
- Sparkline: stroke dash offset 700ms.
- Hover row: nền xám nhạt 150ms.
- Load more: tăng `visibleCount` thêm 10.

## Content

Dữ liệu được gọi từ `/api/v1/growth/rankings`, PostgreSQL local. Hai kỳ dùng `periodDays=7|28`. Mỗi lần lấy tối đa 100 bản ghi.

## Assets

- Logo/header/footer dùng asset local hiện có.
- Ảnh KOL/MCN dùng URL public trong database và fallback local.
- Icon nền tảng được dựng SVG nội bộ, không tải SDK ngoài.

## Responsive behavior
- Desktop: 6 cột.
- Tablet: ẩn nền tảng và sparkline.
- Mobile: 2 cột; metric + growth chuyển vào khối thông tin.

## Accessibility and safety adaptations
- Mọi filter dùng button/select có label và `aria-pressed`.
- Bảng có caption ẩn.
- Reduced motion tắt row/sparkline animation.
- Link chi tiết và các hành động nhạy cảm của nguồn không được tái tạo.
