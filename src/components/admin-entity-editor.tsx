"use client";

import { API_BASE_URL } from "@/lib/api";
import { normalizeMediaUrl } from "@/lib/api-influencer";
import { Save, Upload, UserRound, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type EntityType = "kols" | "mcns";
type EntityData = Record<string, unknown>;
type EditorForm = {
  name: string;
  nickName: string;
  gender: string;
  identityVerified: boolean;
  avatarUrl: string;
  sourceUrl: string;
  subtitle: string;
  platforms: string;
  totalChannels: string;
  totalKols: string;
};

function initialForm(type: EntityType, data: EntityData): EditorForm {
  const platforms = Array.isArray(data.platforms) ? data.platforms.map(String).join(", ") : "";
  return {
    name: String(data.name ?? ""),
    nickName: String(data.nick_name ?? ""),
    gender: String(data.gender ?? ""),
    identityVerified: Boolean(data.identity_verified),
    avatarUrl: String(data.avatar_url ?? ""),
    sourceUrl: String(data.source_url ?? ""),
    subtitle: String(data.subtitle ?? ""),
    platforms,
    totalChannels: String(data.total_channels ?? 0),
    totalKols: String(data.total_kols ?? 0),
  };
}

export function AdminEntityEditor({ type, data, token, onClose, onSaved }: {
  type: EntityType;
  data: EntityData;
  token: string | null;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const [form, setForm] = useState(() => initialForm(type, data));
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(() => normalizeMediaUrl(form.avatarUrl) ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const label = type === "kols" ? "KOL" : "MCN";
  const id = String(type === "kols" ? data.influencer_key : data.source_id);

  const update = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => () => {
    if (avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  const uploadAvatar = async (file?: File) => {
    if (!file) return;
    if (!["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF hoặc AVIF.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setAvatarError("Dung lượng ảnh không được vượt quá 20MB.");
      return;
    }
    if (!token) {
      setAvatarError("Phiên đăng nhập quản trị đã hết hạn.");
      return;
    }

    const previousAvatarPreviewUrl = avatarPreviewUrl;
    setAvatarError("");
    setAvatarUploading(true);
    setAvatarFileName(file.name);
    setAvatarPreviewUrl(URL.createObjectURL(file));

    try {
      const uploadBody = new FormData();
      uploadBody.append("avatar", file, file.name);
      const response = await fetch(`${API_BASE_URL}/admin/avatar`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: uploadBody,
      });
      const payload = await response.json().catch(() => null) as { data?: { secureUrl?: string }; message?: string } | null;
      if (!response.ok || !payload?.data?.secureUrl) throw new Error(payload?.message ?? "Không thể tải ảnh lên.");
      update("avatarUrl", payload.data.secureUrl);
      setAvatarChanged(true);
      setAvatarPreviewUrl(payload.data.secureUrl);
    } catch (cause) {
      setAvatarFileName("");
      setAvatarPreviewUrl(previousAvatarPreviewUrl);
      setAvatarError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const body = type === "kols"
      ? {
          name: form.name,
          nickName: form.nickName,
          gender: form.gender,
          identityVerified: form.identityVerified,
          ...(avatarChanged ? { avatarUrl: form.avatarUrl } : {}),
          sourceUrl: form.sourceUrl,
        }
      : {
          name: form.name,
          subtitle: form.subtitle,
          identityVerified: form.identityVerified,
          ...(avatarChanged ? { avatarUrl: form.avatarUrl } : {}),
          platforms: form.platforms.split(",").map((item) => item.trim()).filter(Boolean),
          totalChannels: Number(form.totalChannels),
          totalKols: Number(form.totalKols),
        };

    try {
      const endpoint = type === "kols" ? "influencers" : "mcns";
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message ?? `Không thể cập nhật ${label}.`);
      onSaved(form.name.trim());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-news-modal" role="dialog" aria-modal="true" aria-label={`Chỉnh sửa ${label}`} onMouseDown={onClose}>
      <section className="admin-news-form-modal admin-entity-edit-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="admin-detail-close" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        <h3>Chỉnh sửa {label}</h3>
        <p className="admin-entity-edit-key">Mã dữ liệu: <code>{id}</code></p>
        <form className="admin-news-form admin-entity-edit-form" onSubmit={submit}>
          <label><span>Tên hiển thị *</span><input value={form.name} minLength={2} maxLength={200} onChange={(event) => update("name", event.target.value)} required /></label>

          <section className="admin-avatar-field admin-entity-edit-wide" aria-label="Ảnh đại diện">
            <div className={`admin-avatar-preview ${avatarPreviewUrl ? "has-image" : ""}`} style={avatarPreviewUrl ? { backgroundImage: `url(${JSON.stringify(avatarPreviewUrl)})` } : undefined}>
              {!avatarPreviewUrl ? <UserRound size={30} /> : null}
            </div>
            <div className="admin-avatar-copy">
              <strong>Ảnh đại diện</strong>
              <span>{avatarUploading ? "Đang tải lên Cloudinary..." : avatarFileName || "JPG, PNG, WebP, GIF hoặc AVIF · tối đa 20MB"}</span>
              <small>Ảnh mới được tải trực tiếp lên Cloudinary; không hỗ trợ nhập link ảnh.</small>
              {avatarError ? <em role="alert">{avatarError}</em> : null}
            </div>
            <label className="admin-avatar-button" aria-disabled={avatarUploading}>
              <Upload size={15} />{avatarUploading ? "Đang tải..." : "Chọn ảnh"}
              <input type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" disabled={avatarUploading} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; void uploadAvatar(file); }} />
            </label>
          </section>

          {type === "kols" ? (
            <>
              <label><span>Biệt danh</span><input value={form.nickName} maxLength={200} onChange={(event) => update("nickName", event.target.value)} /></label>
              <label><span>Giới tính</span><input value={form.gender} maxLength={50} onChange={(event) => update("gender", event.target.value)} placeholder="Nam, Nữ hoặc giá trị khác" /></label>
              <label className="admin-entity-edit-wide"><span>Đường dẫn nguồn *</span><input type="url" value={form.sourceUrl} onChange={(event) => update("sourceUrl", event.target.value)} required /></label>
              <label className="admin-entity-edit-check admin-entity-edit-wide">
                <input type="checkbox" checked={form.identityVerified} onChange={(event) => update("identityVerified", event.target.checked)} />
                <span><strong>Đang hiển thị công khai</strong> — Tích chọn khi KOL đã xác minh và được phép xuất hiện trên frontend. Bỏ chọn để giữ trạng thái “Đã xác minh” nhưng chưa hiển thị.</span>
              </label>
            </>
          ) : (
            <>
              <label className="admin-entity-edit-wide"><span>Mô tả ngắn</span><input value={form.subtitle} maxLength={300} onChange={(event) => update("subtitle", event.target.value)} /></label>
              <label className="admin-entity-edit-wide"><span>Nền tảng</span><input value={form.platforms} onChange={(event) => update("platforms", event.target.value)} placeholder="YouTube, TikTok, Facebook" /><small>Phân cách bằng dấu phẩy.</small></label>
              <label><span>Tổng số kênh</span><input type="number" min="0" max="1000000" value={form.totalChannels} onChange={(event) => update("totalChannels", event.target.value)} required /></label>
              <label><span>Tổng số KOL</span><input type="number" min="0" max="1000000" value={form.totalKols} onChange={(event) => update("totalKols", event.target.value)} required /></label>
              <label className="admin-entity-edit-check admin-entity-edit-wide">
                <input type="checkbox" checked={form.identityVerified} onChange={(event) => update("identityVerified", event.target.checked)} />
                <span><strong>Đang hiển thị công khai</strong> — Tích chọn khi MCN đã xác minh và được phép xuất hiện trên frontend. Bỏ chọn để giữ trạng thái “Đã xác minh” nhưng chưa hiển thị.</span>
              </label>
            </>
          )}

          {error ? <p className="admin-error admin-entity-edit-error admin-entity-edit-wide" role="alert">{error}</p> : null}
          <div className="admin-form-actions admin-entity-edit-wide"><button type="button" className="secondary" onClick={onClose}>Hủy</button><button type="submit" disabled={submitting || avatarUploading}><Save size={15} />{submitting ? "Đang lưu..." : avatarUploading ? "Đang tải ảnh..." : "Lưu thay đổi"}</button></div>
        </form>
      </section>
    </div>
  );
}
