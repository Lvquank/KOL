"use client";

import { API_BASE_URL } from "@/lib/api";
import { ArrowRight, Check, MailWarning } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type RegistrationType = "kol" | "mcn";
const apiUrl = API_BASE_URL;
const reportGroups = ["Nội dung vi phạm pháp luật", "Thông tin sai sự thật", "Quảng cáo vi phạm", "Giả mạo tài khoản/kênh", "Nội dung không phù hợp", "Khác"];

export function RegistrationSafety() {
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);
  const [report, setReport] = useState({ name: "", phone: "", email: "", group: "", content: "" });
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const selectedLabel = selectedType === "kol" ? "Cá nhân / KOL" : "Tổ chức / MCN";

  const submitReport = async (event: FormEvent) => {
    event.preventDefault();
    setReportError("");
    setReportSuccess("");
    if (!report.name.trim() || !/^0\d{9}$/.test(report.phone.trim()) || !report.group || !report.content.trim()) {
      setReportError("Vui lòng điền đủ các trường bắt buộc. Số điện thoại gồm 10 số và bắt đầu bằng 0.");
      return;
    }
    if (report.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.email.trim())) {
      setReportError("Email không đúng định dạng.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(`${apiUrl}/reports`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(report) });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? "Không thể gửi phản ánh.");
      setReportSuccess("Phản ánh đã được tiếp nhận. Chúng tôi sẽ kiểm tra và xử lý sớm nhất.");
      setReport({ name: "", phone: "", email: "", group: "", content: "" });
    } catch (cause) {
      setReportError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setSending(false);
    }
  };

  return <section className="registration-section" aria-label="Đăng ký thông tin KOL hoặc MCN">
    <div className="registration-panel">
      <h2>Đăng ký thông tin KOL/MCN</h2><p>Xác thực danh tính, nhận dấu xác minh chính thức từ Cục PTTH&amp;TTĐT — nâng cao uy tín với nhãn hàng và cộng đồng.</p>
      <div className="identity-options" role="radiogroup" aria-label="Chọn loại đăng ký">
        <button type="button" role="radio" aria-checked={selectedType === "kol"} onClick={() => setSelectedType("kol")}><strong>Cá nhân / KOL</strong><span>Người sáng tạo nội dung, KOL hoạt động cá nhân</span><i /></button>
        <button type="button" role="radio" aria-checked={selectedType === "mcn"} onClick={() => setSelectedType("mcn")}><strong>Tổ chức / MCN</strong><span>Doanh nghiệp, MCN quản lý nhiều kênh và KOL</span><i /></button>
      </div>
      <ul><li><Check size={14} />Nhận dấu xác minh chính thức trên hồ sơ</li><li><Check size={14} />Tăng độ tin cậy với nhãn hàng và khách hàng</li><li><Check size={14} />Được hỗ trợ pháp lý khi có tranh chấp</li></ul>
      <button type="button" className="continue-button" disabled={!selectedType} onClick={() => selectedType && router.push(selectedType === "kol" ? "/nguoi-noi-tieng/khai-bao" : "/mcn/khai-bao")}>{selectedType ? `Tiếp tục với ${selectedLabel}` : "Chọn loại đăng ký để tiếp tục"} <ArrowRight size={17} /></button>
    </div>
    <div className="report-panel"><h3><MailWarning />Phản ánh nội dung vi phạm<br />của KOL/Kênh nhanh chóng</h3><form className="report-form" onSubmit={submitReport}><input value={report.name} onChange={(event) => setReport({ ...report, name: event.target.value })} placeholder="Họ và tên (*)" /><input value={report.phone} inputMode="numeric" maxLength={10} onChange={(event) => setReport({ ...report, phone: event.target.value.replace(/\D/g, "") })} placeholder="Số điện thoại (*)" /><input value={report.email} type="email" onChange={(event) => setReport({ ...report, email: event.target.value })} placeholder="Email" /><select value={report.group} onChange={(event) => setReport({ ...report, group: event.target.value })}><option value="">Nhóm phản ánh (*)</option>{reportGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select><textarea value={report.content} maxLength={2000} onChange={(event) => setReport({ ...report, content: event.target.value })} placeholder="Nhập nội dung phản ánh (*)" /><small>{report.content.length}/2000</small>{reportError && <p className="report-error">{reportError}</p>}{reportSuccess && <p className="report-success">{reportSuccess}</p>}<button type="submit" disabled={sending}>{sending ? "Đang gửi..." : "Gửi phản ánh"}</button></form><p className="form-safety">Thông tin phản ánh được chuyển tới bộ phận tiếp nhận để xử lý.</p></div>
  </section>;
}
