# Hành vi trang xếp hạng chi tiết

| Thành phần | Trigger | Trước | Sau | Chuyển động |
|---|---|---|---|---|
| Kỳ Tuần/Tháng | Click | chữ xám, nền trong | nền trắng, chữ đậm, shadow `0 1px 2px rgba(0,0,0,.05)` | 150ms, cubic-bezier(.4,0,.2,1) |
| Nền tảng | Click | chữ xám | nền trắng, chữ đậm, shadow nhẹ | 150ms |
| Tab xác thực | Click | border trong, chữ xám | border dưới `#FE5B11`, chữ cam | 150ms |
| Hàng bảng | Hover | nền trong | `rgba(249,250,251,.8)` | 150ms |
| Đổi bộ lọc | Click/change | dữ liệu hiện tại | thay dữ liệu và hạng; wrapper có transition opacity 200ms | 200ms |
| Sparkline | Đổi dữ liệu | đường chưa vẽ | đường xanh/đỏ được vẽ từ trái sang phải | bản local: 700ms |
| Xem thêm | Click | 20 dòng | thêm tối đa 10 dòng | các dòng mới fade/slide theo thứ tự |

## Dữ liệu trạng thái đã kiểm tra

- MCN Tuần/Tất cả: VCCorp, Viettel, Zeit Media.
- MCN Tháng/Tất cả: Metub Việt Nam, Phong Phú Sắc Việt (POPS), Vitamin Network.
- MCN Tháng/Facebook: Vitamin Network, VieNETWORK, Yeah1 eDigital.
- KOL Tuần/Tất cả: Son Tung M-TP, BEN EAGLE, Lê Dương Bảo.Lâm.
- KOL Đã xác thực/Tháng/TikTok: Solai, Son Tung M-TP, Ngô Đức Duy.

## Ghi chú dữ liệu local

API PostgreSQL hiện có dữ liệu xếp hạng chính xác cho `metric=total`, kỳ 7 và 28 ngày. Các chỉ số thành phần được trình bày dưới dạng ước tính có gắn nhãn vì dữ liệu crawl hiện tại không chứa snapshot riêng cho từng chỉ số.
