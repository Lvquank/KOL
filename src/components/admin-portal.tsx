"use client";

import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import { CheckCircle2, ClipboardList, Clock3, FilePenLine, FileText, LockKeyhole, LogOut, MailWarning, Search, ShieldCheck, UserCheck, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminEntityManager, AdminNewsManager } from "./admin-managers";
import { AdminProposalManager } from "./admin-proposal-manager";

type AdminUser = { id: string; email: string; name: string; role: "super_admin" | "reviewer" };
type Application = { application_id: string; applicant_type: "individual" | "organization"; status: string; display_name: string; email: string; phone: string | null; submitted_at: string | null; created_at: string; channelCount: number; avatar_file_name?: string | null; avatar_url?: string | null };
type DetailApplication = Application & {
  categories?: Array<{ name: string }>;
  channels?: Array<{ platform: string; name: string; url: string }>;
  organization?: Record<string, string>;
  reviews?: Array<{ createdAt: string; note?: string; nextStatus: string }>;
};
type ViolationReport = { report_id: string; reporter_name: string; reporter_phone: string; reporter_email: string | null; report_group: string; content: string; status: string; created_at: string };

const apiUrl = API_BASE_URL;

export function AdminPortal() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationTotal, setApplicationTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [queryFilter, setQueryFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<DetailApplication | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [reports, setReports] = useState<ViolationReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [updatingReportId, setUpdatingReportId] = useState("");
  const [proposalPendingCount, setProposalPendingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"applications" | "reports" | "proposals" | "kols" | "mcns" | "news">("applications");

  useEffect(() => {
    const token = window.localStorage.getItem("kol_admin_token");
    if (!token) { setLoading(false); return; }
    fetch(`${apiUrl}/auth/me`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { data: AdminUser }) => setUser(payload.data))
      .catch(() => window.localStorage.removeItem("kol_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = window.localStorage.getItem("kol_admin_token");
    const params = new URLSearchParams({ limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (queryFilter.trim()) params.set("q", queryFilter.trim());
    setApplicationsLoading(true);
    fetch(`${apiUrl}/admin/applications?${params}`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (response) => response.ok ? response.json() : Promise.reject(await response.json()))
      .then((payload: { data: Application[]; pagination: { total: number } }) => {
        setApplications(payload.data);
        setApplicationTotal(payload.pagination.total);
      })
      .catch(() => setApplications([]))
      .finally(() => setApplicationsLoading(false));
  }, [user, statusFilter, typeFilter, queryFilter]);

  useEffect(() => {
    if (!user) return;
    const token = window.localStorage.getItem("kol_admin_token");
    setReportsLoading(true);
    fetch(`${apiUrl}/admin/reports?limit=20`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { data: ViolationReport[] }) => setReports(payload.data))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const token = window.localStorage.getItem("kol_admin_token");
    fetch(`${apiUrl}/admin/information-proposals?status=submitted&limit=1`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { pagination: { total: number } }) => setProposalPendingCount(payload.pagination.total))
      .catch(() => setProposalPendingCount(0));
  }, [user]);

  const stats = useMemo(() => ({
    submitted: applications.filter((item) => item.status === "submitted").length,
    inReview: applications.filter((item) => item.status === "in_review").length,
    approved: applications.filter((item) => item.status === "approved").length,
  }), [applications]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
      const payload = await response.json() as { data?: { token: string; user: AdminUser }; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? "Không thể đăng nhập.");
      window.localStorage.setItem("kol_admin_token", payload.data.token);
      setUser(payload.data.user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đăng nhập.");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("kol_admin_token");
    setUser(null);
    setPassword("");
  };

  const openApplication = async (applicationId: string) => {
    const token = window.localStorage.getItem("kol_admin_token");
    const response = await fetch(`${apiUrl}/admin/applications/${applicationId}`, { headers: { authorization: `Bearer ${token}` } });
    if (!response.ok) return;
    const payload = await response.json() as { data: DetailApplication };
    setSelectedApplication(payload.data);
    setReviewNote("");
  };

  const updateStatus = async (status: string) => {
    if (!selectedApplication) return;
    const token = window.localStorage.getItem("kol_admin_token");
    setUpdatingStatus(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/admin/applications/${selectedApplication.application_id}/status`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ status, note: reviewNote }),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? "Không thể cập nhật trạng thái hồ sơ.");
      setSelectedApplication({ ...selectedApplication, status });
      setApplications((items) => items.map((item) => item.application_id === selectedApplication.application_id ? { ...item, status } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ để cập nhật hồ sơ.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const takeReport = async (reportId: string) => {
    const token = window.localStorage.getItem("kol_admin_token");
    setUpdatingReportId(reportId);
    try {
      const response = await fetch(`${apiUrl}/admin/reports/${reportId}/status`, { method: "PATCH", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ status: "in_review", note: "Đã tiếp nhận xử lý." }) });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? "Không thể nhận xử lý phản ánh.");
      setReports((items) => items.map((item) => item.report_id === reportId ? { ...item, status: "in_review" } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setUpdatingReportId("");
    }
  };

  if (loading) return <main className="admin-page"><div className="admin-loading">Đang kiểm tra phiên quản trị...</div></main>;

  if (!user) return (
    <main className="admin-page">
      <section className="admin-login-card">
        <Image src="/assets/logo.svg" alt="kol.gov.vn" width={205} height={34} priority />
        <div className="admin-login-title"><span><LockKeyhole size={18} /></span><div><h1>Quản trị hệ thống</h1><p>Đăng nhập bằng tài khoản được cấp quyền.</p></div></div>
        <form onSubmit={login}>
          <label>Email quản trị<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@..." required /></label>
          <label>Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" required /></label>
          {error && <p className="admin-error">{error}</p>}
          <button disabled={submitting} type="submit">{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
        </form>
        <small>Chỉ dành cho cán bộ được phân quyền.</small>
      </section>
    </main>
  );

  return (
    <main className="admin-page admin-workspace">
      <section className="admin-dashboard admin-applications" data-active-tab={activeTab}>
        <header className="admin-topbar">
          <Image src="/assets/logo.svg" alt="kol.gov.vn" width={185} height={30} priority />
          <div className="admin-header-account">
            <span>{user.name}</span>
            {user.name !== (user.role === "super_admin" ? "Quản trị hệ thống" : "Chuyên viên xét duyệt") && (
              <small>{user.role === "super_admin" ? "Quản trị hệ thống" : "Chuyên viên xét duyệt"}</small>
            )}
            <button type="button" onClick={logout}><LogOut size={16} />Đăng xuất</button>
          </div>
        </header>

        <nav className="admin-module-nav" aria-label="Điều hướng quản trị">
          <button className={activeTab === "applications" ? "active" : ""} type="button" onClick={() => setActiveTab("applications")}><ClipboardList size={18} />Hồ sơ đăng ký <span>{applicationTotal}</span></button>
          <button className={activeTab === "reports" ? "active" : ""} type="button" onClick={() => { setActiveTab("reports"); setSelectedApplication(null); }}><MailWarning size={18} />Phản ánh <span>{reports.filter((report) => report.status === "submitted").length}</span></button>
          <button className={activeTab === "proposals" ? "active" : ""} type="button" onClick={() => { setActiveTab("proposals"); setSelectedApplication(null); }}><FilePenLine size={18} />Đề xuất bổ sung <span>{proposalPendingCount}</span></button>
          <button className={activeTab === "kols" ? "active" : ""} type="button" onClick={() => { setActiveTab("kols"); setSelectedApplication(null); }}><UserCheck size={18} />Quản lý KOL</button>
          <button className={activeTab === "mcns" ? "active" : ""} type="button" onClick={() => { setActiveTab("mcns"); setSelectedApplication(null); }}><ShieldCheck size={18} />Quản lý MCN</button>
          <button className={activeTab === "news" ? "active" : ""} type="button" onClick={() => { setActiveTab("news"); setSelectedApplication(null); }}><FileText size={18} />Quản lý tin tức</button>
        </nav>

        <div className="admin-page-heading">
          <div>
            <p>{activeTab === "reports" ? "TIẾP NHẬN PHẢN ÁNH" : activeTab === "proposals" ? "ĐÓNG GÓP DỮ LIỆU CỘNG ĐỒNG" : activeTab === "kols" ? "QUẢN LÝ DỮ LIỆU" : activeTab === "mcns" ? "QUẢN LÝ DỮ LIỆU" : activeTab === "news" ? "QUẢN LÝ NỘI DUNG" : "QUẢN LÝ HỒ SƠ"}</p>
            <h1>{activeTab === "reports" ? "Phản ánh & Khiếu nại" : activeTab === "proposals" ? "Đề xuất bổ sung thông tin KOL" : activeTab === "kols" ? "Danh sách KOL" : activeTab === "mcns" ? "Danh sách MCN" : activeTab === "news" ? "Quản lý tin tức" : "Hồ sơ đăng ký"}</h1>
            <small>{activeTab === "reports" ? "Quản lý các phản ánh gửi từ biểu mẫu công khai." : activeTab === "proposals" ? "Tiếp nhận, kiểm tra và xử lý đề xuất do người dùng gửi từ trang KOL." : activeTab === "kols" ? "Tra cứu dữ liệu KOL đang hiển thị trên hệ thống." : activeTab === "mcns" ? "Tra cứu dữ liệu tổ chức MCN trực thuộc." : activeTab === "news" ? "Tạo và quản lý các bài viết tin tức truyền thông." : "Theo dõi, kiểm tra và xử lý các hồ sơ KOL, MCN."}</small>
          </div>
          <div className="admin-user-badge"><ShieldCheck size={19} /><span>{user.role === "super_admin" ? "Toàn quyền quản trị" : "Quyền xét duyệt"}</span></div>
        </div>

        <section className="admin-stat-grid" aria-label="Thống kê hồ sơ">
          <article><span className="admin-stat-icon total"><FileText size={19} /></span><div><small>Tổng hồ sơ</small><strong>{applicationTotal}</strong></div></article>
          <article><span className="admin-stat-icon submitted"><Clock3 size={19} /></span><div><small>Mới nộp</small><strong>{stats.submitted}</strong></div></article>
          <article><span className="admin-stat-icon review"><Search size={19} /></span><div><small>Đang xét duyệt</small><strong>{stats.inReview}</strong></div></article>
          <article><span className="admin-stat-icon approved"><CheckCircle2 size={19} /></span><div><small>Đã duyệt</small><strong>{stats.approved}</strong></div></article>
        </section>

        <section className="admin-list-card admin-applications-tab">
          <div className="admin-list-card-heading"><div><h2>Danh sách đăng ký</h2><p>Chọn một hồ sơ để xem chi tiết và xét duyệt.</p></div><span>{applicationsLoading ? "Đang tải..." : `${applicationTotal} hồ sơ`}</span></div>
          <div className="admin-filters">
            <label><Search size={17} /><input value={queryFilter} onChange={(event) => setQueryFilter(event.target.value)} placeholder="Tìm theo tên hoặc email" /></label>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="">Tất cả loại hồ sơ</option><option value="individual">KOL / Cá nhân</option><option value="organization">MCN / Tổ chức</option></select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">Tất cả trạng thái</option><option value="submitted">Mới nộp</option><option value="in_review">Đang xét duyệt</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select>
          </div>
          <div className="admin-table-wrap"><table><thead><tr><th>Hồ sơ</th><th>Loại</th><th>Kênh</th><th>Trạng thái</th><th>Ngày nộp</th></tr></thead><tbody>
            {applications.map((item) => <tr key={item.application_id} onClick={() => openApplication(item.application_id)}><td><strong>{item.display_name}</strong><small>{item.email}</small></td><td><span className="admin-type">{item.applicant_type === "organization" ? "MCN" : "KOL"}</span></td><td>{item.channelCount}</td><td><span className={`admin-status ${item.status}`}>{statusLabel(item.status)}</span></td><td>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(item.submitted_at ?? item.created_at))}</td></tr>)}
            {!applicationsLoading && applications.length === 0 && <tr><td className="admin-empty" colSpan={5}><FileText size={20} />Chưa có hồ sơ phù hợp.</td></tr>}
          </tbody></table></div>
        </section>

        <section className="admin-list-card admin-report-queue"><div className="admin-list-card-heading"><div><h2>Phản ánh cần tiếp nhận</h2><p>Phản ánh gửi từ biểu mẫu công khai trên trang chủ.</p></div><span>{reportsLoading ? "Đang tải..." : `${reports.length} phản ánh`}</span></div><div className="admin-table-wrap"><table><thead><tr><th>Người gửi</th><th>Nhóm phản ánh</th><th>Nội dung</th><th>Trạng thái</th><th></th></tr></thead><tbody>{reports.map((report) => <tr key={report.report_id}><td><strong>{report.reporter_name}</strong><small>{report.reporter_phone}{report.reporter_email ? ` · ${report.reporter_email}` : ""}</small></td><td>{report.report_group}</td><td className="admin-report-content">{report.content}</td><td><span className={`admin-status ${report.status}`}>{reportStatusLabel(report.status)}</span></td><td>{report.status === "submitted" ? <button className="admin-take-report" disabled={updatingReportId === report.report_id} type="button" onClick={() => takeReport(report.report_id)}>{updatingReportId === report.report_id ? "Đang nhận..." : "Nhận xử lý"}</button> : <span className="admin-report-assigned">Đã tiếp nhận</span>}</td></tr>)}{!reportsLoading && reports.length === 0 && <tr><td className="admin-empty" colSpan={5}><FileText size={20} />Chưa có phản ánh mới.</td></tr>}</tbody></table></div></section>

        {selectedApplication && <div className="admin-news-modal" onMouseDown={() => setSelectedApplication(null)}><section className="admin-detail" onMouseDown={(event) => event.stopPropagation()}><button className="admin-detail-close" type="button" onClick={() => setSelectedApplication(null)}><X size={18} /></button><div className="admin-detail-heading"><div><span className={`admin-status ${selectedApplication.status}`}>{statusLabel(selectedApplication.status)}</span><h2>{selectedApplication.display_name}</h2><p>{selectedApplication.email} · {selectedApplication.phone || "Chưa có số điện thoại"}</p></div></div><div className="admin-detail-grid"><div><strong>Danh mục</strong><span>{selectedApplication.categories?.map((item) => item.name).join(", ") || "—"}</span></div><div><strong>Kênh đăng ký</strong>{selectedApplication.channels?.length ? selectedApplication.channels.map((channel) => <a key={channel.url} href={channel.url} target="_blank" rel="noreferrer">{channel.platform}: {channel.name}</a>) : <span>Hồ sơ MCN dùng file Excel.</span>}</div><div><strong>File đính kèm</strong>{selectedApplication.avatar_url ? <a className="admin-application-avatar" href={selectedApplication.avatar_url} target="_blank" rel="noreferrer"><Image src={selectedApplication.avatar_url} alt={`Ảnh đại diện ${selectedApplication.display_name}`} width={42} height={42} /><span>{String(selectedApplication.avatar_file_name ?? "Ảnh đại diện")}</span></a> : <span>Ảnh: —</span>}{selectedApplication.organization && <><span>Excel: {String(selectedApplication.organization.white_list_request_file_name ?? "—")}</span></>}</div></div><label className="admin-review-note">Ghi chú xét duyệt<textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder="Nhập ghi chú nội bộ hoặc lý do từ chối" /></label>{error && <p className="admin-error admin-update-error">{error}</p>}<div className="admin-status-actions"><button disabled={updatingStatus} onClick={() => updateStatus("in_review")}>Nhận xử lý</button><button disabled={updatingStatus} onClick={() => updateStatus("approved")}>Duyệt</button><button disabled={updatingStatus} className="reject" onClick={() => updateStatus("rejected")}>Từ chối</button></div><h3>Lịch sử xét duyệt</h3>{selectedApplication.reviews?.map((review, index) => <p className="admin-review-history" key={index}>{statusLabel(review.nextStatus)} · {new Date(review.createdAt).toLocaleString("vi-VN")}{review.note ? ` — ${review.note}` : ""}</p>)}</section></div>}
        {activeTab === "proposals" && <AdminProposalManager token={typeof window === "undefined" ? null : window.localStorage.getItem("kol_admin_token")} onPendingCountChange={setProposalPendingCount} />}
        {activeTab === "kols" && <AdminEntityManager type="kols" token={typeof window === "undefined" ? null : window.localStorage.getItem("kol_admin_token")} canDelete={user.role === "super_admin"} />}
        {activeTab === "mcns" && <AdminEntityManager type="mcns" token={typeof window === "undefined" ? null : window.localStorage.getItem("kol_admin_token")} canDelete={user.role === "super_admin"} />}
        {activeTab === "news" && <AdminNewsManager token={typeof window === "undefined" ? null : window.localStorage.getItem("kol_admin_token")} canCreateDelete={user.role === "super_admin"} />}
      </section>
    </main>
  );
}

function statusLabel(status: string) {
  return ({ submitted: "Mới nộp", in_review: "Đang xét duyệt", approved: "Đã duyệt", rejected: "Từ chối", withdrawn: "Đã rút" } as Record<string, string>)[status] ?? status;
}

function reportStatusLabel(status: string) {
  return ({ submitted: "Mới gửi", in_review: "Đang xử lý", resolved: "Đã xử lý", rejected: "Không tiếp nhận" } as Record<string, string>)[status] ?? status;
}
