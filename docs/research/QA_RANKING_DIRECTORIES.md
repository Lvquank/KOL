# QA `/mcn` và `/top100`

Ngày kiểm thử: 2026-08-10

## Phạm vi

- Đối chiếu giao diện desktop với `https://kol.gov.vn/mcn` và `https://kol.gov.vn/top100`.
- Kiểm tra dữ liệu lấy từ API PostgreSQL cục bộ.
- Kiểm tra bộ lọc, nút tải thêm, trạng thái hover và animation.

## Kết quả

| Hạng mục | `/mcn` | `/top100` |
| --- | --- | --- |
| Tải dữ liệu API | Đạt | Đạt |
| Hiển thị ban đầu | 20 dòng | 20 dòng |
| Nút xem thêm | 20 → 26 dòng | 20 → 30 dòng |
| Tuần / Tháng | Đạt | Đạt |
| Lọc nền tảng | Đạt | Đạt |
| Lọc xác thực | Không áp dụng | Đạt |
| Đổi chỉ số | Đạt | Đạt |
| Animation dòng | Đạt | Đạt |
| Animation sparkline | Đạt | Đạt |
| Hover dòng | `rgba(249, 250, 251, 0.8)` | Đạt |
| Tràn ngang ở 1280 px | Không | Không |

## Ghi chú dữ liệu

- `Tổng tương tác` dùng trực tiếp snapshot `metric=total` từ PostgreSQL.
- CSDL crawl hiện chưa có snapshot riêng cho từng thành phần `followers`, `views`, `likes`, `comments`, `shares`; các lựa chọn này dùng phép phân bổ xác định từ tổng và được ghi chú rõ trong giao diện.
- Nền tảng và số kênh theo nền tảng được backend tổng hợp từ `social_channels` và `mcn_owners`.

## Ảnh đối chiếu

- Nguồn: `docs/design-references/source-mcn-1280.png`, `docs/design-references/source-top100-1280.png`.
- Bản cục bộ: `docs/design-references/local-mcn-1280.png`, `docs/design-references/local-top100-1280.png`.

## Giới hạn kiểm thử

Trình duyệt kiểm thử trong ứng dụng không hỗ trợ đổi viewport trong phiên hiện tại. Các breakpoint 1024 px và 768 px đã được kiểm tra ở mức CSS và bố cục có cơ chế ẩn cột tương ứng; chưa thực hiện so sánh ảnh chụp mobile trong phiên này.
