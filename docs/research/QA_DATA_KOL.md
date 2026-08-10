# QA `/data/kol`

Ngày kiểm thử: 2026-08-10

## Desktop 1280 px

| Hạng mục | Nguồn | Local | Kết quả |
| --- | --- | --- | --- |
| Card | rộng 1108 px, padding 40 px | rộng 1108 px, padding 40 px | Đạt |
| H1 | 30/36 px, weight 700 | 30/36 px, weight 700 | Đạt |
| Bảng | rộng 1026.4 px | rộng 1026.4 px | Đạt |
| CTA tải | khoảng 174 × 46 px | khoảng 174 × 46 px | Đạt |
| Nền / viền / radius | `#f9fafb`, `#e5e7eb`, 4 px | tương ứng | Đạt |
| Tràn ngang toàn trang | Không | Không | Đạt |

## Dữ liệu và hành vi

- `/api/v1/stats` trả 911 KOL, 1.520 social channel và 26 MCN.
- `/api/v1/data/kol.csv` trả HTTP 200, `text/csv; charset=utf-8`, tên file `kol-dataset.csv`.
- File CSV có BOM UTF-8, 10 cột công khai và được sinh từ PostgreSQL local.
- Click tải CSV không rời trang `/data/kol`.
- Link quay lại trỏ local tới `/`.
- Trạng thái hover của hai CTA được triển khai theo thông số nguồn.

## Responsive

- Đã đối chiếu topology nguồn và local tại breakpoint 640/768 px ở mức DOM/CSS.
- Mobile: stats một cột, metadata một cột, CTA xếp dọc, card padding 24 px, H1 24/32 px.
- Tablet từ 640 px: stats ba cột, metadata hai cột, CTA nằm ngang.
- Bảng cuộn trong wrapper riêng, không làm tràn trang.

## Ảnh tham chiếu

- Nguồn: `docs/design-references/source-data-kol-1280.png`.
- Local: `docs/design-references/local-data-kol-1280.png`.

## Khác biệt có chủ đích

- Số liệu trên nguồn tại thời điểm khảo sát là 904 KOL, 4.782 kênh và 26 MCN.
- Bản local hiển thị số thực tế trong PostgreSQL: 911 KOL, 1.520 bản ghi `social_channels`, 26 MCN.
- Nút tải CSV trỏ backend local thay vì tải file từ website chính phủ.
