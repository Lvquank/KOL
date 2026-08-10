# DataCatalog

## Overview

- Target file: `src/components/data-catalog.tsx`
- Screenshot: `docs/design-references/source-data-kol-1280.png`
- Interaction model: tải dữ liệu API, hover, click tải CSV, điều hướng local

## DOM structure

- `main.data-catalog-page`
  - card
    - header title/description
    - stats grid (3 cards)
    - metadata `dl`
    - fields table
    - CTA group

## Exact computed styles

### Container

- Max width ngoài: 1140 px; padding ngang 16 px.
- Card: nền trắng, viền `#e5e7eb`, radius 4 px, shadow nhẹ.
- Card padding desktop 40 px; mobile 24 px.
- Nền trang `#f9fafb`.

### Typography and children

- Font: Be Vietnam Pro.
- H1 desktop: 30/36 px, weight 700, `#111827`.
- Description: 15 px, `#4b5563`, line-height 1.625.
- Stats number: 24 px, weight 700, màu `#fe5c10`.
- H2: 18 px, weight 700.
- Table: 14/20 px; tên trường dùng monospace 12 px.

## States and behaviors

- Stats loading: fallback nguồn hiển thị ngay, sau đó cập nhật từ `/api/v1/stats`.
- API lỗi: giữ fallback và hiện ghi chú dữ liệu dự phòng.
- CSV: GET `/api/v1/data/kol.csv`, tải file, không thay đổi trang.
- CTA hover: theo `BEHAVIORS_DATA_KOL.md`.

## Content

- 10 trường: `name`, `nick_name`, `gender`, `identity_verified`, `channel_type`, `channel_name`, `channel_url`, `followers`, `views`, `likes`.
- Metadata nguồn được giữ nguyên từ trang công khai.

## Assets

- Dùng header/footer và logo local hiện có.
- Icon download từ `lucide-react`.

## Responsive behavior

- Desktop: stats 3 cột; metadata 2 cột; CTA ngang.
- Tablet: giữ 3/2/ngang từ 640 px.
- Mobile: stats, metadata, CTA chuyển một cột; bảng cuộn ngang.

## Accessibility and safety adaptations

- Bảng có caption ẩn và header scope.
- Trạng thái tải dùng `aria-live`.
- Link CSV tải từ backend local chỉ-đọc.
- Bản dựng giữ provenance ở footer.
