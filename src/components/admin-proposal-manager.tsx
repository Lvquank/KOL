"use client";

import { API_BASE_URL } from "@/lib/api";
import { Ban, CheckCircle2, ChevronLeft, ChevronRight, FilePenLine, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ProposalStatus = "submitted" | "in_review" | "resolved" | "rejected";
type Proposal = {
  proposal_id: string;
  entity_key?: string;
  entity_type?: "KOL" | "MCN";
  entity_name?: string;
  influencer_key?: string;
  influencer_name?: string;
  proposal_type: string;
  details: string;
  submitter_email: string | null;
  status: ProposalStatus;
  assigned_to: string | null;
  assigned_at: string | null;
  created_at: string;
  updated_at?: string;
  reviews?: Array<{
    reviewId: string;
    previousStatus: ProposalStatus;
    nextStatus: ProposalStatus;
    note: string | null;
    createdAt: string;
  }>;
};
type Page = { page: number; limit: number; total: number; totalPages: number };

const proposalTypes = [
  "URL kênh bị lỗi hoặc không truy cập được",
  "Thêm kênh còn thiếu trên hệ thống",
  "Rate card/Bảng giá dịch vụ",
  "Ngành/Lĩnh vực hoạt động",
  "Mô tả/Bio kênh",
  "Kênh thiếu",
  "Kênh trùng",
  "Kênh không thuộc MCN",
  "Email/Website",
  "Hotline",
  "Giấy phép ĐKKD",
  "Thông tin khác",
];

const statusLabels: Record<ProposalStatus, string> = {
  submitted: "Mới gửi",
  in_review: "Đang xử lý",
  resolved: "Đã hoàn tất",
  rejected: "Không tiếp nhận",
};

export function AdminProposalManager({ token, onPendingCountChange }: { token: string | null; onPendingCountChange?: (count: number) => void }) {
  const [items, setItems] = useState<Proposal[]>([]);
  const [page, setPage] = useState<Page>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(pageNumber), limit: "20" });
    if (query.trim()) params.set("q", query.trim());
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (entityType) params.set("entityType", entityType);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/information-proposals?${params}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null) as { data?: Proposal[]; pagination?: Page; message?: string } | null;
      if (!response.ok || !payload?.data || !payload.pagination) throw new Error(payload?.message ?? "Không thể tải đề xuất.");
      setItems(payload.data);
      setPage(payload.pagination);
      if (!status || status === "submitted") {
        const submittedCount = status === "submitted"
          ? payload.pagination.total
          : payload.data.filter((item) => item.status === "submitted").length;
        onPendingCountChange?.(submittedCount);
      }
      setError("");
    } catch (cause) {
      setItems([]);
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [entityType, onPendingCountChange, pageNumber, query, status, token, type]);

  useEffect(() => {
    const timer = window.setTimeout(load, 180);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => setPageNumber(1), [entityType, query, status, type]);

  const openProposal = async (proposalId: string) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/information-proposals/${proposalId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null) as { data?: Proposal; message?: string } | null;
      if (!response.ok || !payload?.data) throw new Error(payload?.message ?? "Không thể mở đề xuất.");
      setSelected(payload.data);
      setNote("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    }
  };

  const updateStatus = async (nextStatus: ProposalStatus) => {
    if (!selected) return;
    setUpdating(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/information-proposals/${selected.proposal_id}/status`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus, note }),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? "Không thể cập nhật đề xuất.");
      await load();
      await openProposal(selected.proposal_id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="admin-list-card admin-proposal-manager">
      <div className="admin-list-card-heading">
        <div><h2>Đề xuất bổ sung thông tin</h2><p>Tiếp nhận đóng góp bổ sung thông tin KOL & MCN từ công chúng.</p></div>
        <span>{loading ? "Đang tải..." : `${page.total} đề xuất`}</span>
      </div>

      <div className="admin-filters">
        <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm KOL, MCN, email hoặc nội dung" /></label>
        <select value={entityType} onChange={(event) => setEntityType(event.target.value)} aria-label="Lọc dạng đối tượng">
          <option value="">Tất cả đối tượng (KOL & MCN)</option>
          <option value="KOL">KOL</option>
          <option value="MCN">MCN</option>
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Lọc nhóm thông tin">
          <option value="">Tất cả nhóm thông tin</option>
          {proposalTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Lọc trạng thái">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {error && !selected ? <p className="admin-error admin-proposal-error">{error}</p> : null}
      <div className="admin-table-wrap">
        <table>
          <thead><tr><th>Đối tượng</th><th>Nhóm đề xuất</th><th>Nội dung</th><th>Người gửi</th><th>Trạng thái</th><th>Ngày gửi</th></tr></thead>
          <tbody>
            {items.map((item) => {
              const displayName = item.entity_name || item.influencer_name || "—";
              const displayKey = item.entity_key || item.influencer_key || "";
              const displayType = item.entity_type || "KOL";
              return (
                <tr key={item.proposal_id} onClick={() => openProposal(item.proposal_id)}>
                  <td>
                    <strong>{displayName}</strong>
                    <small>[{displayType}] {displayKey}</small>
                  </td>
                  <td><span className="admin-proposal-type">{item.proposal_type}</span></td>
                  <td className="admin-proposal-summary">{item.details}</td>
                  <td>{item.submitter_email || "Ẩn danh"}</td>
                  <td><span className={`admin-status ${item.status}`}>{statusLabels[item.status]}</span></td>
                  <td>{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                </tr>
              );
            })}
            {!loading && items.length === 0 ? <tr><td className="admin-empty" colSpan={6}><FilePenLine size={20} />Chưa có đề xuất phù hợp.</td></tr> : null}
          </tbody>
        </table>
      </div>

      {page.totalPages > 1 ? (
        <div className="admin-pager"><span>Hiển thị trang {page.page}/{page.totalPages} · {page.total} bản ghi</span><div><button disabled={page.page <= 1} onClick={() => setPageNumber(page.page - 1)} type="button"><ChevronLeft size={16} />Trước</button><button disabled={page.page >= page.totalPages} onClick={() => setPageNumber(page.page + 1)} type="button">Sau<ChevronRight size={16} /></button></div></div>
      ) : null}

      {selected ? (
        <div className="admin-news-modal" role="dialog" aria-modal="true" aria-label="Chi tiết đề xuất bổ sung thông tin" onMouseDown={() => setSelected(null)}>
          <section className="admin-detail admin-proposal-detail" onMouseDown={(event) => event.stopPropagation()}>
            <button className="admin-detail-close" type="button" onClick={() => setSelected(null)} aria-label="Đóng"><X size={18} /></button>
            <div className="admin-detail-heading"><div><span className={`admin-status ${selected.status}`}>{statusLabels[selected.status]}</span><h2>{selected.entity_name || selected.influencer_name}</h2><p>[{selected.entity_type || "KOL"}] {selected.proposal_type} · {new Date(selected.created_at).toLocaleString("vi-VN")}</p></div></div>
            <div className="admin-proposal-content"><small>NỘI DUNG ĐỀ XUẤT</small><p>{selected.details}</p></div>
            <div className="admin-detail-grid">
              <div><strong>Người gửi</strong><span>{selected.submitter_email || "Không cung cấp email"}</span></div>
              <div><strong>Đối tượng</strong><span>[{selected.entity_type || "KOL"}] {selected.entity_key || selected.influencer_key}</span></div>
              <div><strong>Mã đề xuất</strong><span>{selected.proposal_id}</span></div>
            </div>
            <label className="admin-review-note">Ghi chú xử lý<textarea value={note} maxLength={1000} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú nội bộ hoặc lý do không tiếp nhận" /></label>
            {error ? <p className="admin-error admin-update-error">{error}</p> : null}
            <div className="admin-status-actions">
              <button disabled={updating || selected.status === "in_review"} onClick={() => updateStatus("in_review")}>Nhận xử lý</button>
              <button disabled={updating || selected.status === "resolved"} onClick={() => updateStatus("resolved")}><CheckCircle2 size={15} />Hoàn tất</button>
              <button disabled={updating || selected.status === "rejected"} className="reject" onClick={() => updateStatus("rejected")}><Ban size={15} />Không tiếp nhận</button>
            </div>
            <h3>Lịch sử xử lý</h3>
            {selected.reviews?.length ? selected.reviews.map((review) => <p className="admin-review-history" key={review.reviewId}>{statusLabels[review.nextStatus]} · {new Date(review.createdAt).toLocaleString("vi-VN")}{review.note ? ` — ${review.note}` : ""}</p>) : <p className="admin-review-history">Chưa có thao tác xử lý.</p>}
          </section>
        </div>
      ) : null}
    </section>
  );
}
