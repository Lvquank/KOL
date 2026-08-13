"use client";

import { API_BASE_URL } from "@/lib/api";
import { normalizeMediaUrl } from "@/lib/api-influencer";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Activity, AlertTriangle, BarChart2, Calendar, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Eye, EyeOff, FileText, Globe, Heart, Info, Pencil, Plus, Search, ShieldCheck, Trash2, User, UserCheck, Users, X } from "lucide-react";
import { AdminEntityEditor } from "./admin-entity-editor";

const apiUrl = API_BASE_URL;
type Page = { page: number; totalPages: number; total: number };
type Entity = { influencer_key?: string; source_id?: string; name: string; nick_name?: string; subtitle?: string; channel_count?: number; total_channels?: number; total_kols?: number; identity_verified?: boolean; [key: string]: unknown };
type News = { slug: string; sourceUrl: string; title: string; excerpt?: string; category?: string; imageUrl?: string; bodyText?: string; publishedDate?: string; isPublished?: boolean };
const emptyPage: Page = { page: 1, totalPages: 0, total: 0 };

function visiblePageNumbers(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const visible = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 4) [2, 3, 4, 5].forEach((pageNumber) => visible.add(pageNumber));
  if (currentPage >= totalPages - 3) [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1].forEach((pageNumber) => visible.add(pageNumber));
  const sorted = [...visible].filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap((pageNumber, index) => {
    const previous = sorted[index - 1];
    return previous && pageNumber - previous > 1 ? ["ellipsis" as const, pageNumber] : [pageNumber];
  });
}

function Pager({ page, onChange }: { page: Page; onChange: (next: number) => void }) {
  if (page.totalPages <= 1) return null;
  const pageNumbers = visiblePageNumbers(page.page, page.totalPages);
  return <nav className="admin-pager" aria-label="Phân trang"><span>Trang {page.page}/{page.totalPages} · {page.total} bản ghi</span><div className="admin-pager-controls"><button className="admin-pager-nav" disabled={page.page <= 1} onClick={() => onChange(page.page - 1)} type="button"><ChevronLeft size={16} /><span>Trước</span></button><div className="admin-pager-numbers">{pageNumbers.map((pageNumber, index) => pageNumber === "ellipsis" ? <span className="admin-pager-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span> : <button className="admin-pager-number" aria-current={pageNumber === page.page ? "page" : undefined} aria-label={`Trang ${pageNumber}`} key={pageNumber} onClick={() => onChange(pageNumber)} type="button">{pageNumber}</button>)}</div><button className="admin-pager-nav" disabled={page.page >= page.totalPages} onClick={() => onChange(page.page + 1)} type="button"><span>Sau</span><ChevronRight size={16} /></button></div></nav>;
}

function formatNumber(num: unknown) {
  const val = Number(num);
  if (isNaN(val) || val === 0) return "0";
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString("vi-VN");
}

function formatVietnameseStat(num: unknown): string {
  if (num === null || num === undefined || num === "") return "Chưa có dữ liệu";
  const val = Number(num);
  if (!Number.isFinite(val)) return "Chưa có dữ liệu";
  const sign = val < 0 ? "−" : "";
  const absolute = Math.abs(val);
  if (absolute >= 1_000_000_000) return `${sign}${(absolute / 1_000_000_000).toFixed(1)} Tỷ`;
  if (absolute >= 1_000_000) return `${sign}${(absolute / 1_000_000).toFixed(1)} Tr`;
  if (absolute >= 10_000) return `${sign}${(absolute / 1_000).toFixed(1)}K`;
  return `${sign}${absolute.toLocaleString("vi-VN")}`;
}

function firstMetric(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

function AdminDetailAvatar({ name, source }: { name: string; source: unknown }) {
  const avatarUrl = normalizeMediaUrl(typeof source === "string" ? source : null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!avatarUrl || failedUrl === avatarUrl) {
    return (
      <div className="avatar-fallback">
        {name.startsWith("#") || !name.trim() ? <User size={26} /> : name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return <Image src={avatarUrl} alt={name} width={64} height={64} onError={() => setFailedUrl(avatarUrl)} />;
}

function DetailPanel({ title, data, onClose }: { title: string; data: Record<string, unknown>; onClose: () => void }) {
  const name = String(data.name || data.title || "Chi tiết");
  const sub = String(data.nick_name || data.subtitle || "");
  const verified = Boolean(data.identity_verified);
  const key = String(data.influencer_key || data.source_id || "");

  const channels = Array.isArray(data.channels) ? (data.channels as Array<Record<string, unknown>>) : [];
  const mcns = Array.isArray(data.mcns) ? (data.mcns as Array<Record<string, unknown>>) : [];
  const posts = Array.isArray(data.recent_posts) ? (data.recent_posts as Array<Record<string, unknown>>) : [];
  const memberKols = Array.isArray(data.member_influencers) ? (data.member_influencers as Array<Record<string, unknown>>) : [];
  const growthRankings = Array.isArray(data.growth_rankings) ? (data.growth_rankings as Array<Record<string, unknown>>) : [];
  const isMcn = Boolean(data.source_id) && !data.influencer_key;
  const recentGrowth = growthRankings.find((item) => Number(item.periodDays) === 7) || growthRankings[0];
  const avatarSource = data.avatar_url || recentGrowth?.avatarUrl;
  const growthPeriod = recentGrowth ? Number(recentGrowth.periodDays) || null : null;

  const totalFollowers = Number(data.followers_total) || channels.reduce((acc, ch) => acc + (Number(ch.followers) || 0), 0);
  const totalViews = Number(data.views_total) || channels.reduce((acc, ch) => acc + (Number(ch.views) || 0), 0);
  const totalLikes = Number(data.likes_total) || channels.reduce((acc, ch) => acc + (Number(ch.likes) || 0), 0);
  const totalInteractions = Number(data.interactions_total) || (totalViews + totalLikes + (totalFollowers > 0 ? Math.round(totalFollowers * 0.1) : 0)) || (totalViews + totalLikes);
  const mcnInteractions = firstMetric(data.total_interactions, recentGrowth?.interactionGrowth, recentGrowth?.growthCurrent);
  const mcnFollowers = firstMetric(data.followers_total, recentGrowth?.followersGrowth);
  const mcnViews = firstMetric(data.total_views, recentGrowth?.viewsGrowth);
  const mcnLikes = firstMetric(data.total_likes, recentGrowth?.likesGrowth);
  const statValues = isMcn
    ? [mcnInteractions, mcnFollowers, mcnViews, mcnLikes]
    : [totalInteractions, totalFollowers, totalViews, totalLikes];
  const statLabels = isMcn
    ? ["Tổng tương tác", growthPeriod ? `Người theo dõi tăng ${growthPeriod} ngày` : "Người theo dõi", "Lượt xem bài", "Lượt thích"]
    : ["Tổng tương tác", "Người theo dõi", "Lượt xem bài", "Lượt thích"];

  return (
    <div className="admin-news-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <section className="admin-record-detail admin-rich-detail" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="admin-detail-close" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>

        <div className="admin-detail-profile-header">
          <div className="admin-detail-avatar">
            <AdminDetailAvatar name={name} source={avatarSource} />
          </div>
          <div className="admin-detail-profile-info">
            <div className="admin-detail-profile-title">
              <h2>{name}</h2>
              {verified ? (
                <span className="admin-status approved"><ShieldCheck size={12} /> Đã xác minh danh tính</span>
              ) : (
                <span className="admin-status in_review"><CheckCircle2 size={12} /> Chưa xác minh danh tính</span>
              )}
            </div>
            {sub && <p className="admin-detail-sub">{sub}</p>}
            {key && <code className="admin-detail-key-tag">{key}</code>}
          </div>
        </div>

        {/* Số liệu nổi bật */}
        <div className="admin-detail-section">
          <h3>Số liệu nổi bật</h3>
          <div className="admin-stats-highlight-grid">
            <div className="admin-stat-highlight-card">
              <div className="stat-card-header">
                <Activity size={16} />
                <span>{statLabels[0]}</span>
              </div>
              <strong>{formatVietnameseStat(statValues[0])}</strong>
            </div>

            <div className="admin-stat-highlight-card">
              <div className="stat-card-header">
                <Users size={16} />
                <span>{statLabels[1]}</span>
              </div>
              <strong>{formatVietnameseStat(statValues[1])}</strong>
            </div>

            <div className="admin-stat-highlight-card">
              <div className="stat-card-header">
                <BarChart2 size={16} />
                <span>{statLabels[2]}</span>
              </div>
              <strong>{formatVietnameseStat(statValues[2])}</strong>
            </div>

            <div className="admin-stat-highlight-card">
              <div className="stat-card-header">
                <Heart size={16} />
                <span>{statLabels[3]}</span>
              </div>
              <strong>{formatVietnameseStat(statValues[3])}</strong>
            </div>
          </div>
          {isMcn ? <p className="admin-mcn-metric-note">{growthPeriod ? `Tổng tương tác, lượt xem và lượt thích lấy từ dữ liệu MCN; người theo dõi là mức tăng trong ${growthPeriod} ngày gần nhất.` : "Nguồn MCN chưa cung cấp tổng người theo dõi; hệ thống không hiển thị số 0 thay cho dữ liệu còn thiếu."}</p> : null}
        </div>

        {channels.length > 0 && (
          <div className="admin-detail-section">
            <h3><Globe size={16} /> Kênh mạng xã hội ({channels.length})</h3>
            <div className="admin-channels-grid">
              {channels.map((ch, idx) => {
                const chName = String(ch.channel_name || ch.name || "Kênh");
                const platform = String(ch.channel_type || ch.platform || "social").toLowerCase();
                const url = String(ch.channel_url || ch.url || "#");
                const followers = ch.followers;
                const views = ch.views;
                return (
                  <div key={idx} className="admin-channel-card">
                    <div className="admin-channel-info">
                      <span className={`platform-badge ${platform}`}>{platform}</span>
                      <strong>{chName}</strong>
                      <small>
                        {followers ? `${formatNumber(followers)} theo dõi` : views ? `${formatNumber(views)} lượt xem` : "Đang cập nhật"}
                      </small>
                    </div>
                    {url && url !== "#" && (
                      <a href={url} target="_blank" rel="noreferrer" className="admin-channel-link" title="Mở đường dẫn">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mcns.length > 0 && (
          <div className="admin-detail-section">
            <h3><ShieldCheck size={16} /> Trực thuộc MCN</h3>
            <div className="admin-member-kols">
              {mcns.map((mcn, idx) => (
                <span key={idx} className="admin-kol-chip">
                  {String(mcn.name)} {mcn.relationshipType ? `(${String(mcn.relationshipType)})` : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {memberKols.length > 0 && (
          <div className="admin-detail-section">
            <h3><UserCheck size={16} /> KOL trực thuộc ({memberKols.length})</h3>
            <div className="admin-member-kols">
              {memberKols.slice(0, 10).map((kol, idx) => (
                <span key={idx} className="admin-kol-chip">
                  {String(kol.name)}
                </span>
              ))}
              {memberKols.length > 10 && <span className="admin-kol-chip more">+{memberKols.length - 10} khác</span>}
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div className="admin-detail-section">
            <h3><FileText size={16} /> Bài viết gần đây</h3>
            <div className="admin-posts-list">
              {posts.map((post, idx) => {
                const thumb = typeof post.thumbnail_url === "string" ? post.thumbnail_url : null;
                const platform = typeof post.platform === "string" ? post.platform : null;
                const viewsStr = post.views ? formatNumber(post.views) : null;
                return (
                  <a key={idx} href={String(post.source_url || "#")} target="_blank" rel="noreferrer" className="admin-post-card">
                    {thumb && <img src={thumb} alt="" />}
                    <div>
                      <strong>{String(post.title || "")}</strong>
                      <small>
                        {platform && <span className="platform-tag">{platform}</span>}
                        {viewsStr && ` · ${viewsStr} lượt xem`}
                      </small>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function NewsDetail({ item, onClose }: { item: News; onClose: () => void }) {
  return (
    <div className="admin-news-modal" role="dialog" aria-modal="true" aria-label="Chi tiết tin tức" onMouseDown={onClose}>
      <section className="admin-news-detail" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="admin-detail-close" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
        {item.imageUrl && (
          <div className="admin-news-detail-image" role="img" aria-label={item.title} style={{ backgroundImage: `url("${item.imageUrl}")` }} />
        )}
        <div className="admin-news-detail-content">
          <span className="admin-news-detail-category">{item.category || "Tin tức"}</span>
          <h3>{item.title}</h3>
          <div className="admin-news-detail-meta">
            <Calendar size={13} />
            <span>{item.publishedDate ? new Date(item.publishedDate).toLocaleDateString("vi-VN") : "Chưa có ngày đăng"}</span>
            <span className="dot">•</span>
            <code className="slug-tag">{item.slug}</code>
          </div>
          {item.excerpt && <div className="admin-news-detail-excerpt">{item.excerpt}</div>}
          <div className="admin-news-detail-body">{item.bodyText || "Bài viết chưa có nội dung chi tiết."}</div>
        </div>
      </section>
    </div>
  );
}

type ConfirmActionTarget = {
  id: string;
  name: string;
  label: string;
  actionType: "hide" | "show" | "delete";
  title: string;
  message: string;
  note: string;
  confirmLabel: string;
  confirmStyle: "danger" | "warning" | "primary";
  onConfirm: () => Promise<void>;
};

function ConfirmActionModal({
  target,
  loading,
  onClose,
}: {
  target: ConfirmActionTarget;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="admin-news-modal" role="dialog" aria-modal="true" onMouseDown={loading ? undefined : onClose}>
      <div className="admin-confirm-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="admin-detail-close" onClick={onClose} disabled={loading} aria-label="Đóng">
          <X size={18} />
        </button>
        <div className={`admin-confirm-icon-wrap ${target.actionType}`}>
          {target.actionType === "hide" ? (
            <EyeOff size={28} />
          ) : target.actionType === "show" ? (
            <Globe size={28} />
          ) : (
            <AlertTriangle size={28} />
          )}
        </div>
        <h3>{target.title}</h3>
        <p className="admin-confirm-text">
          {target.message}
        </p>
        <p className="admin-confirm-warning">
          {target.note}
        </p>
        <div className="admin-confirm-actions">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className={`admin-btn-${target.confirmStyle}`}
            onClick={target.onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : target.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminEntityManager({ type, token, canDelete: _canDelete }: { type: "kols" | "mcns"; token: string | null; canDelete?: boolean }) {
  const [items, setItems] = useState<Entity[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Page>(emptyPage);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ConfirmActionTarget | null>(null);
  const [message, setMessage] = useState("");
  const label = type === "kols" ? "KOL" : "MCN";
  const endpoint = type === "kols" ? "influencers" : "mcns";

  const load = useCallback(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`${apiUrl}/${endpoint}?limit=20&page=${page}&search=${encodeURIComponent(query)}&verified=all`)
        .then((response) => response.json())
        .then((payload) => { setItems(payload.data ?? []); setMeta(payload.pagination ?? emptyPage); })
        .catch(() => { setItems([]); setMeta(emptyPage); })
        .finally(() => setLoading(false));
    }, 180);
    return timer;
  }, [endpoint, page, query]);

  useEffect(() => {
    const timer = load();
    return () => window.clearTimeout(timer);
  }, [load]);

  const open = async (item: Entity) => {
    const id = type === "kols" ? item.influencer_key : item.source_id;
    if (!id) return;
    const response = await fetch(`${apiUrl}/${endpoint}/${id}`);
    const data = await response.json().catch(() => null);
    setSelected((data?.data ?? data) as Record<string, unknown>);
  };

  const edit = async (item: Entity | Record<string, unknown>) => {
    const id = type === "kols" ? item.influencer_key : item.source_id;
    if (!id) return;
    const response = await fetch(`${apiUrl}/${endpoint}/${encodeURIComponent(String(id))}`);
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      setMessage(`Không thể tải dữ liệu ${label} để chỉnh sửa.`);
      return;
    }
    setSelected(null);
    setEditing((data?.data ?? data) as Record<string, unknown>);
  };

  const executeToggleVisibility = async (item: Entity) => {
    const id = String(type === "kols" ? item.influencer_key ?? "" : item.source_id ?? "");
    if (!id) return;
    if (!token) {
      setMessage("Phiên đăng nhập quản trị đã hết hạn.");
      setPendingAction(null);
      return;
    }

    setTogglingId(id);
    setMessage("");
    try {
      const response = await fetch(`${apiUrl}/admin/${endpoint}/${encodeURIComponent(id)}/toggle-visibility`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null) as { data?: { identityVerified?: boolean }; message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? `Không thể thay đổi trạng thái ${label}.`);
      
      const newVerified = payload?.data?.identityVerified;
      setSelected(null);
      setEditing(null);
      setPendingAction(null);
      setMessage(newVerified ? `Đã xác minh danh tính cho ${label.toLowerCase()} “${item.name}”.` : `Đã hủy xác minh danh tính cho ${label.toLowerCase()} “${item.name}”.`);
      load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setTogglingId(null);
    }
  };

  const promptToggleVisibility = (item: Entity) => {
    const id = String(type === "kols" ? item.influencer_key ?? "" : item.source_id ?? "");
    if (!id) return;
    const isCurrentlyVerified = Boolean(item.identity_verified);

    if (isCurrentlyVerified) {
      // Prompt to unverify
      setPendingAction({
        id,
        name: item.name,
        label,
        actionType: "hide",
        title: `Hủy xác minh danh tính ${label}`,
        message: `Bạn có muốn hủy trạng thái xác minh của ${label.toLowerCase()} “${item.name}” không?`,
        note: `⚠️ Trạng thái sẽ chuyển thành "Chưa xác minh" và huy hiệu xác thực sẽ không còn hiển thị.`,
        confirmLabel: "Xác nhận hủy xác minh",
        confirmStyle: "warning",
        onConfirm: () => executeToggleVisibility(item),
      });
    } else {
      // Prompt to verify
      setPendingAction({
        id,
        name: item.name,
        label,
        actionType: "show",
        title: `Xác minh danh tính ${label}`,
        message: `Bạn có muốn xác minh danh tính cho ${label.toLowerCase()} “${item.name}” không?`,
        note: `💡 Trạng thái sẽ chuyển thành "Đã xác minh" (hiển thị huy hiệu Đã xác minh trên hệ thống).`,
        confirmLabel: "Xác nhận xác minh",
        confirmStyle: "primary",
        onConfirm: () => executeToggleVisibility(item),
      });
    }
  };

  return (
    <section className="admin-list-card admin-manager">
      <div className="admin-list-card-heading">
        <div>
          <h2>Quản lý {label}</h2>
          <p>Quản lý và điều chỉnh ẩn/hiển thị {label} trên hệ thống. Bấm một dòng để xem chi tiết.</p>
        </div>
        <span>{loading ? "Đang tải..." : `${meta.total} bản ghi`}</span>
      </div>
      <label className="admin-manager-search">
        <Search size={17} />
        <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`Tìm tên ${label}`} />
      </label>
      {message ? <p className="admin-news-message">{message}</p> : null}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>{label}</th>
              <th>Thông tin</th>
              <th>Kênh</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemId = String(type === "kols" ? item.influencer_key ?? "" : item.source_id ?? "");
              const isVerified = Boolean(item.identity_verified);
              return (
                <tr key={item.influencer_key ?? item.source_id} onClick={() => open(item)}>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.nick_name || item.subtitle || "—"}</small>
                  </td>
                  <td>{type === "kols" ? "Nhà sáng tạo nội dung" : `${item.total_kols ?? 0} KOL trực thuộc`}</td>
                  <td>{item.channel_count ?? item.total_channels ?? 0}</td>
                  <td>
                    <span className={`admin-status ${isVerified ? "approved" : "in_review"}`}>
                      <ShieldCheck size={12} />
                      {isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                  </td>
                  <td className="admin-entity-actions" onClick={(event) => event.stopPropagation()}>
                    <button className="view" type="button" onClick={() => open(item)} aria-label={`Xem chi tiết ${item.name}`} title="Xem chi tiết">
                      <Info size={16} />
                    </button>
                    <button className="edit" type="button" onClick={() => edit(item)} aria-label={`Chỉnh sửa ${item.name}`} title="Chỉnh sửa">
                      <Pencil size={15} />
                    </button>
                    <button
                      className={isVerified ? "hide-action" : "show-action"}
                      type="button"
                      disabled={togglingId === itemId}
                      onClick={() => promptToggleVisibility(item)}
                      aria-label={isVerified ? `Hủy xác minh ${item.name}` : `Xác minh ${item.name}`}
                      title={isVerified ? "Hủy xác minh danh tính" : "Xác minh danh tính"}
                    >
                      {isVerified ? <EyeOff size={15} /> : <Globe size={15} />}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && !items.length && <tr><td className="admin-empty" colSpan={5}>Chưa có dữ liệu phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pager page={meta} onChange={setPage} />
      {selected && <DetailPanel title={`Chi tiết ${label}`} data={selected} onClose={() => setSelected(null)} />}
      {editing && <AdminEntityEditor type={type} data={editing} token={token} onClose={() => setEditing(null)} onSaved={(name) => { setEditing(null); setMessage(`Đã cập nhật ${label} ${name}.`); load(); }} />}
      {pendingAction && (
        <ConfirmActionModal
          target={pendingAction}
          loading={Boolean(togglingId)}
          onClose={() => setPendingAction(null)}
        />
      )}
    </section>
  );
}

const emptyNews: News = { slug: "", sourceUrl: "", title: "", excerpt: "", category: "", imageUrl: "", bodyText: "", publishedDate: new Date().toISOString().slice(0, 10) };

export function AdminNewsManager({ token, canCreateDelete }: { token: string | null; canCreateDelete: boolean }) {
  const [items, setItems] = useState<News[]>([]);
  const [form, setForm] = useState<News>(emptyNews);
  const [editing, setEditing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Page>(emptyPage);
  const [selected, setSelected] = useState<News | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ConfirmActionTarget | null>(null);

  const load = useCallback(() => fetch(`${apiUrl}/admin/news?limit=20&page=${page}&search=${encodeURIComponent(query)}`, { headers: { authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => { setItems(payload.data ?? []); setMeta(payload.pagination ?? emptyPage); }).catch(() => { setItems([]); setMeta(emptyPage); }), [token, page, query]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const endpoint = editing ? `${apiUrl}/admin/news/${form.slug}` : `${apiUrl}/admin/news`;
    const response = await fetch(endpoint, {
      method: editing ? "PATCH" : "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(data?.message ?? "Không thể lưu tin tức.");
      return;
    }
    setForm(emptyNews);
    setEditing(false);
    setFormOpen(false);
    setMessage("Đã lưu tin tức.");
    load();
  };

  const executeToggleVisibility = async (item: News) => {
    if (!token) {
      setMessage("Phiên đăng nhập quản trị đã hết hạn.");
      setPendingAction(null);
      return;
    }

    setDeletingSlug(item.slug);
    setMessage("");
    try {
      const isCurrentlyPublished = item.isPublished !== false;
      const endpoint = isCurrentlyPublished
        ? `${apiUrl}/admin/news/${encodeURIComponent(item.slug)}`
        : `${apiUrl}/admin/news/${encodeURIComponent(item.slug)}/toggle-visibility`;
      const response = await fetch(endpoint, {
        method: isCurrentlyPublished ? "DELETE" : "POST",
        headers: { authorization: `Bearer ${token}` }
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? "Không thể cập nhật trạng thái tin tức.");
      setSelected(null);
      setPendingAction(null);
      setMessage(`Đã ${isCurrentlyPublished ? "ẩn" : "hiện lại"} tin tức “${item.title}”.`);
      load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setDeletingSlug(null);
    }
  };

  const promptRemove = (item: News) => {
    const isHidden = item.isPublished === false;
    setPendingAction({
      id: item.slug,
      name: item.title,
      label: "tin tức",
      actionType: isHidden ? "show" : "hide",
      title: isHidden ? "Hiện lại tin tức" : "Ẩn tin tức khỏi trang chủ",
      message: isHidden
        ? `Bạn có chắc chắn muốn HỆN lại bài viết “${item.title}” trên trang tin tức công khai?`
        : `Bạn có chắc chắn muốn ẨN bài viết “${item.title}” khỏi trang công khai?`,
      note: isHidden
        ? "Bài viết sẽ xuất hiện trở lại trên trang chủ và trang tin tức."
        : "ℹ️ Bài viết sẽ ẩn khỏi frontend nhưng vẫn lưu đầy đủ dữ liệu trong cơ sở dữ liệu.",
      confirmLabel: isHidden ? "Hiện lại bài viết" : "Xác nhận ẩn",
      confirmStyle: isHidden ? "primary" : "danger",
      onConfirm: () => executeToggleVisibility(item),
    });
  };

  const openNews = async (item: News) => {
    const response = await fetch(`${apiUrl}/news/${item.slug}`);
    const detail = await response.json().catch(() => null) as Record<string, unknown> | null;
    setSelected({
      ...item,
      title: String(detail?.title ?? item.title),
      excerpt: String(detail?.excerpt ?? item.excerpt ?? ""),
      bodyText: String(detail?.body_text ?? detail?.bodyText ?? item.bodyText ?? ""),
      imageUrl: String(detail?.image_url ?? detail?.imageUrl ?? item.imageUrl ?? "")
    });
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(false);
    setForm(emptyNews);
  };

  return (
    <section className="admin-list-card admin-manager admin-news-manager">
      <div className="admin-list-card-heading">
        <div>
          <h2>Quản lý tin tức</h2>
          <p>Chỉnh sửa tin tức hiển thị công khai. Bấm một dòng để xem chi tiết.</p>
        </div>
        <div className="admin-news-toolbar">
          <span>{meta.total} tin tức</span>
          {canCreateDelete && (
            <button type="button" onClick={() => { setForm(emptyNews); setEditing(false); setFormOpen(true); }}><Plus size={15} />Thêm tin tức</button>
          )}
        </div>
      </div>
      <label className="admin-manager-search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tiêu đề tin tức" />
      </label>
      {message && <p className="admin-news-message">{message}</p>}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Ngày đăng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} onClick={() => openNews(item)} title="Bấm để xem chi tiết bài viết">
                <td className="admin-news-title">
                  <strong title={item.title}>{item.title}</strong>
                  <small title={item.slug}>{item.slug}</small>
                </td>
                <td className="admin-news-category" title={item.category || undefined}>{item.category || "—"}</td>
                <td>{item.publishedDate ? new Date(item.publishedDate).toLocaleDateString("vi-VN") : "—"}</td>
                <td className="admin-news-actions" onClick={(event) => event.stopPropagation()}>
                  <button className="edit" type="button" onClick={() => { setForm(item); setEditing(true); setFormOpen(true); }} aria-label={`Chỉnh sửa ${item.title}`} title="Chỉnh sửa">
                    <Pencil size={15} />
                  </button>
                  {canCreateDelete && (
                    <button className={item.isPublished === false ? "show-action" : "hide-action"} type="button" disabled={deletingSlug === item.slug} onClick={() => promptRemove(item)} aria-label={item.isPublished === false ? `Hiện lại ${item.title}` : `Ẩn ${item.title}`} title={item.isPublished === false ? "Hiện bài viết" : "Ẩn khỏi frontend"}>
                      {item.isPublished === false ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && <tr><td className="admin-empty" colSpan={4}>Chưa có tin tức.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pager page={meta} onChange={setPage} />
      {selected && <NewsDetail item={selected} onClose={() => setSelected(null)} />}
      {pendingAction && (
        <ConfirmActionModal
          target={pendingAction}
          loading={Boolean(deletingSlug)}
          onClose={() => setPendingAction(null)}
        />
      )}
      {formOpen && (
        <div className="admin-news-modal" onMouseDown={closeForm}>
          <div className="admin-news-form-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="admin-detail-close" type="button" onClick={closeForm}>
              <X size={18} />
            </button>
            <h3>{editing ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}</h3>
            <form className="admin-news-form" onSubmit={submit}>
              <input value={form.slug} disabled={editing} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="slug-bai-viet (vd: tin-tuc-moi)" required />
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Tiêu đề bài viết" required />
              <input value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="Đường dẫn nguồn" required />
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Chuyên mục" />
              <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="URL hình ảnh" />
              <input type="date" value={form.publishedDate} onChange={(event) => setForm({ ...form, publishedDate: event.target.value })} />
              <textarea value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} placeholder="Mô tả ngắn (tóm tắt nội dung bài viết)" />
              <textarea value={form.bodyText} onChange={(event) => setForm({ ...form, bodyText: event.target.value })} placeholder="Nội dung bài viết chi tiết" />
              <div className="admin-form-actions">
                <button type="button" className="secondary" onClick={closeForm}>Hủy</button>
                <button type="submit"><Plus size={15} />{editing ? "Cập nhật" : "Thêm tin tức"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
