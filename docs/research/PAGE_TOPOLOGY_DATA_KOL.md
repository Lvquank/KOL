# Page topology: `/data/kol`

Nguồn tham chiếu: `https://kol.gov.vn/data/kol`

## Thứ tự trang

1. Thanh cơ quan màu cam.
2. Header dùng chung: logo, tên cổng, điều hướng, tìm kiếm.
3. Nền trang `#f9fafb`.
4. Card dữ liệu trắng, rộng tối đa 1140 px.
5. Tiêu đề và mô tả.
6. Ba thẻ thống kê: KOL, kênh mạng xã hội, MCN.
7. Khối metadata bộ dữ liệu.
8. Bảng 10 trường dữ liệu.
9. CTA tải CSV và quay lại trang chủ.
10. Footer dùng chung và thông báo nguồn của bản dựng local.

## Responsive quan sát từ DOM nguồn

- Mặc định/mobile: thống kê một cột, metadata một cột, CTA xếp dọc.
- Từ 640 px (`sm`): thống kê ba cột, metadata hai cột, CTA nằm ngang.
- Từ 768 px (`md`): card tăng padding từ 24 lên 40 px; tiêu đề từ 24 lên 30 px; khoảng đệm dọc ngoài card tăng từ 32 lên 48 px.
- Bảng dùng vùng cuộn ngang để không làm tràn toàn trang.

## An toàn

- Đây là bản tham chiếu local của một trang chính phủ.
- Không có form, đăng nhập, upload hoặc mutation được sao chép.
- CSV được sinh từ PostgreSQL local qua API chỉ-đọc.
- Footer giữ thông báo nguồn giao diện.
