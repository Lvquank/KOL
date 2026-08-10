import { ArrowRight, Check, MailWarning } from "lucide-react";

export function RegistrationSafety() {
  return <section className="registration-section" aria-label="Biểu mẫu bị vô hiệu hóa">
    <div className="registration-panel">
      <h2>Đăng ký thông tin KOL/MCN</h2><p>Xác thực danh tính, nhận dấu xác minh chính thức từ Cục PTTH&amp;TTĐT — nâng cao uy tín với nhãn hàng và cộng đồng.</p>
      <div className="identity-options"><button type="button" disabled><strong>Cá nhân / KOL</strong><span>Người sáng tạo nội dung, KOL hoạt động cá nhân</span><i /></button><button type="button" disabled><strong>Tổ chức / MCN</strong><span>Doanh nghiệp, MCN quản lý nhiều kênh và KOL</span><i /></button></div>
      <ul><li><Check size={14} />Nhận dấu xác minh chính thức trên hồ sơ</li><li><Check size={14} />Tăng độ tin cậy với nhãn hàng và khách hàng</li><li><Check size={14} />Được hỗ trợ pháp lý khi có tranh chấp</li></ul>
      <button type="button" className="continue-button" disabled>Chọn loại đăng ký để tiếp tục <ArrowRight size={17} /></button>
    </div>
    <div className="report-panel"><h3><MailWarning />Phản ánh nội dung vi phạm<br />của KOL/Kênh nhanh chóng</h3><div className="disabled-form" aria-disabled="true"><input disabled placeholder="Họ và tên (*)" /><input disabled placeholder="Số điện thoại (*)" /><input disabled placeholder="Email" /><button type="button" disabled>Nhóm phản ánh (*)</button><textarea disabled placeholder="Nhập nội dung phản ánh (*)" /><small>0/2000</small><button type="button" disabled>Gửi phản ánh</button></div><p className="form-safety">Bản local không thu thập hoặc gửi dữ liệu.</p></div>
  </section>;
}
