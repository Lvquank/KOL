# Behaviors: `/data/kol`

## Nút tải CSV

- URL nguồn: `/data/kol.csv`.
- Có thuộc tính `download`; click không điều hướng khỏi trang.
- Mặc định: nền `rgb(254, 92, 16)`, chữ trắng.
- Hover: nền `rgba(254, 92, 16, 0.9)`.
- Kích thước tại desktop: khoảng 174 × 46 px; padding 12 × 24 px; bo tròn 9999 px.
- Transition màu: 150 ms, `cubic-bezier(0.4, 0, 0.2, 1)`.

## Nút quay lại

- Mặc định: nền trong suốt, viền `#e5e7eb`, chữ `#374151`.
- Hover: nền `#f9fafb`.
- Kích thước tại desktop: khoảng 177 × 46 px; padding 12 × 24 px; bo tròn 9999 px.
- Điều hướng local tới `/`.

## Bảng

- Không có sắp xếp, tìm kiếm hoặc phân trang.
- Trên màn hình hẹp, wrapper cuộn ngang; bảng giữ cấu trúc hai cột.

## Reduced motion

- Tắt transition của CTA khi người dùng yêu cầu giảm chuyển động.
