# Topology trang xếp hạng chi tiết

Nguồn công khai được khảo sát ngày 10/08/2026:

- `https://kol.gov.vn/mcn`
- `https://kol.gov.vn/top100`

## Cấu trúc chung

1. Thanh cơ quan màu cam.
2. Header logo, mô tả cổng thông tin, điều hướng và tìm kiếm.
3. Breadcrumb.
4. Tiêu đề trang.
5. `/top100`: tab `Tất cả` và `Đã xác thực`.
6. Thanh bộ lọc:
   - Chỉ số: Tổng tương tác, Theo dõi, Lượt xem, Lượt thích, Bình luận, Chia sẻ.
   - Kỳ: Tuần, Tháng.
   - Nền tảng: Tất cả, Facebook, YouTube, TikTok, Insta.
7. Bảng xếp hạng 20 dòng ban đầu.
8. Nút `Xem thêm 10 MCN` hoặc `Xem thêm 10 KOLs`.
9. Footer và thông báo nguồn local.

## Khác biệt

- `/mcn`: cột thông tin hiển thị tên MCN, tổng kênh, tổng KOL và số kênh theo nền tảng.
- `/top100`: cột thông tin hiển thị nickname, tên thật và trạng thái xác thực.

## Responsive nguồn

- `>= 1024px`: đủ 6 cột.
- `768px–1023px`: ẩn cột nền tảng và biểu đồ.
- `< 768px`: chỉ giữ Hạng và Thông tin; chỉ số/tăng trưởng nằm trong nội dung hàng.
- Breakpoint nguồn: 640px, 768px, 1024px.

## An toàn

Đây là bản tham chiếu local của trang cơ quan nhà nước. Không sao chép luồng gửi phản ánh, đăng ký, xác minh danh tính hoặc hành động ghi dữ liệu lên website chính thức.
