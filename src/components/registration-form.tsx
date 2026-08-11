"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronDown, Upload, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "@/lib/api";

type ApplicantType = "individual" | "organization";
type UploadedChannel = { url: string; name: string; platform: string; duplicate: boolean };

const categories = [
  { key: "real_estate", label: "Bất động sản" },
  { key: "technology", label: "Công nghệ" },
  { key: "travel", label: "Du lịch" },
  { key: "gaming", label: "Game & Thể thao điện tử" },
  { key: "education", label: "Giáo dục" },
  { key: "entertainment", label: "Giải trí" },
  { key: "business_marketing", label: "Kinh doanh, Truyền thông & Marketing" },
  { key: "economy_finance_investment", label: "Kinh tế, Tài chính & Đầu tư" },
  { key: "beauty_fashion", label: "Làm đẹp & Thời trang" },
  { key: "film_animation", label: "Phim & Hoạt hình" },
  { key: "feng_shui", label: "Phong thủy" },
  { key: "health", label: "Sức khỏe" },
  { key: "sports", label: "Thể thao" },
  { key: "news_current_affairs", label: "Tin tức & Thời sự" },
  { key: "automotive", label: "Xe" },
  { key: "music", label: "Âm nhạc" },
  { key: "lifestyle_family", label: "Đời sống & Gia đình" },
  { key: "food_beverage", label: "Ẩm thực & Đồ uống" },
] as const;

export function RegistrationForm({ applicantType }: { applicantType: ApplicantType }) {
  const [step, setStep] = useState(1);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryKeys, setCategoryKeys] = useState<string[]>([]);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [avatarFileError, setAvatarFileError] = useState("");
  const [channelDetailFileName, setChannelDetailFileName] = useState("");
  const [channelDetailFileError, setChannelDetailFileError] = useState("");
  const [uploadedChannels, setUploadedChannels] = useState<UploadedChannel[]>([]);
  const [uploadedChannelChecking, setUploadedChannelChecking] = useState(false);
  const [whiteListRequestFileName, setWhiteListRequestFileName] = useState("");
  const [whiteListRequestFileError, setWhiteListRequestFileError] = useState("");
  const [result, setResult] = useState<{ loading: boolean; error?: string; id?: string }>({ loading: false });
  const [linkCheck, setLinkCheck] = useState<{ checking: boolean; duplicateUrls: string[]; error?: string }>({ checking: false, duplicateUrls: [] });
  const [form, setForm] = useState<Record<string, string | boolean>>({
    nationality: "Việt Nam", livestreamCertVerified: false, accuracyConfirmed: false, termsConfirmed: false,
    channelQuantity: "", channelManager: "", channelManagerPhone: "", channelLinks: "",
  });
  const isOrganization = applicantType === "organization";
  const change = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const validOne = Boolean(form.name && form.nationality && form.address && isValidEmail(String(form.email ?? "")) && isVietnamesePhone(String(form.zalo ?? "")) && (!form.phone || isVietnamesePhone(String(form.phone))) && (isOrganization || categoryKeys.length) && (!isOrganization || (form.businessLicenseNo && form.licenseIssuedAt && form.licenseIssuedBy && form.legalRepresentative)));
  const rawChannelLinks = String(form.channelLinks ?? "");
  const channelLinks = rawChannelLinks.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const normalizeUrl = (url: string) => url.toLowerCase().replace(/\/+$/, "");
  const validChannelLinks = channelLinks.filter((url) => isValidChannelUrl(url) && !linkCheck.duplicateUrls.includes(normalizeUrl(url)));
  const validTwo = isOrganization ? Boolean(form.channelQuantity && form.channelManager && isVietnamesePhone(String(form.channelManagerPhone ?? "")) && channelDetailFileName && !channelDetailFileError && uploadedChannels.some((channel) => !channel.duplicate)) && !uploadedChannelChecking : Boolean(form.channelQuantity && form.channelManager && isVietnamesePhone(String(form.channelManagerPhone ?? "")) && validChannelLinks.length) && !linkCheck.checking;
  const selectedCategories = categories.filter((item) => categoryKeys.includes(item.key)).map((item) => item.label).join(", ");
  const toggleCategory = (key: string) => setCategoryKeys((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  const selectAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setAvatarFileError("Chỉ chấp nhận file ảnh."); return; }
    if (file.size > 20 * 1024 * 1024) { setAvatarFileError("Dung lượng ảnh không được vượt quá 20MB."); return; }
    setAvatarFileError(""); setAvatarFileName(file.name); setAvatarPreviewUrl(URL.createObjectURL(file));
  };
  useEffect(() => () => { if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl); }, [avatarPreviewUrl]);
  const inspectChannelDetailFile = async (file?: File) => {
    if (!file) return;
    setChannelDetailFileName(file.name);
    if (file.size > 16 * 1024 * 1024) { setChannelDetailFileError("Dung lượng file không được vượt quá 16MB."); return; }
    if (!/\.(xlsx|xls)$/i.test(file.name)) { setChannelDetailFileError("Chỉ chấp nhận file Excel định dạng .xlsx hoặc .xls."); return; }
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const allRows = workbook.SheetNames.flatMap((name) => XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], { header: 1, blankrows: false }));
      const rows = allRows.slice(0, 10);
      const headerRow = rows.find((row) => row.some((cell) => String(cell ?? "").trim().toLowerCase() === "stt"));
      const hasSttHeader = Boolean(headerRow);
      const channelNameColumn = headerRow?.findIndex((cell) => /tên.*kênh|tên kênh|channel name/i.test(String(cell ?? ""))) ?? -1;
      const channelMap = new Map<string, UploadedChannel>();
      for (const row of allRows) for (const cell of row) { const url = String(cell ?? "").trim(); const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`; if (isValidChannelUrl(normalizedUrl)) { const nameFromColumn = channelNameColumn >= 0 ? String(row[channelNameColumn] ?? "").trim() : ""; const name = nameFromColumn || row.map((value) => String(value ?? "").trim()).find((value) => value && value !== url && !/^\d+$/.test(value) && !/stt|link|url|kênh/i.test(value)) || new URL(normalizedUrl).hostname.replace(/^www\./, ""); channelMap.set(normalizedUrl.toLowerCase().replace(/\/+$/, ""), { url: normalizedUrl, name, platform: getChannelPlatform(normalizedUrl), duplicate: false }); } }
      const foundChannels = [...channelMap.values()].slice(0, 100);
      if (!hasSttHeader) { setUploadedChannels([]); setChannelDetailFileError("Không tìm thấy dòng tiêu đề (STT) trong file"); return; }
      if (!foundChannels.length) { setUploadedChannels([]); setChannelDetailFileError("File phải có ít nhất 1 kênh hợp lệ (youtube, tiktok, instagram, facebook, twitter)"); return; }
      setChannelDetailFileError(""); setUploadedChannels(foundChannels); setUploadedChannelChecking(true);
      try { const response = await fetch(`${API_BASE_URL}/registration/channel-links/check`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ urls: foundChannels.map((channel) => channel.url) }) }); const data = await response.json() as { data?: { duplicateUrls?: string[] } }; const duplicates = new Set((data.data?.duplicateUrls ?? []).map((url) => url.toLowerCase().replace(/\/+$/, ""))); setUploadedChannels(foundChannels.map((channel) => ({ ...channel, duplicate: duplicates.has(channel.url.toLowerCase().replace(/\/+$/, "")) }))); } catch { setChannelDetailFileError("Không thể kiểm tra kênh trong file vào lúc này."); } finally { setUploadedChannelChecking(false); }
    } catch { setChannelDetailFileError("Không thể đọc file Excel. Vui lòng dùng đúng file mẫu."); }
  };
  useEffect(() => {
    const validUrls = rawChannelLinks.split(/\r?\n/).map((url) => url.trim()).filter(isValidChannelUrl);
    if (validUrls.length === 0) { setLinkCheck({ checking: false, duplicateUrls: [] }); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLinkCheck({ checking: true, duplicateUrls: [] });
      try {
        const response = await fetch(`${API_BASE_URL}/registration/channel-links/check`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ urls: validUrls }), signal: controller.signal });
        const data = await response.json() as { data?: { duplicateUrls?: string[] }; message?: string };
        if (!response.ok) throw new Error(data.message ?? "Không thể kiểm tra link.");
        setLinkCheck({ checking: false, duplicateUrls: data.data?.duplicateUrls ?? [] });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLinkCheck({ checking: false, duplicateUrls: [], error: "Không thể kiểm tra link vào lúc này." });
      }
    }, 550);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [rawChannelLinks]);
  const submit = async () => {
    setResult({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/registration/applications`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ applicantType, profile: { name: form.name, nationality: form.nationality, address: form.address, phone: form.phone, email: form.email, zalo: form.zalo, avatarFileName, activityCategories: categoryKeys, livestreamCertVerified: form.livestreamCertVerified, businessLicenseNo: form.businessLicenseNo, licenseIssuedAt: form.licenseIssuedAt, licenseIssuedBy: form.licenseIssuedBy, legalRepresentative: form.legalRepresentative, channelQuantity: form.channelQuantity, channelManager: form.channelManager, channelManagerPhone: form.channelManagerPhone, channelDetailFileName, whiteListRequestFileName }, channels: isOrganization ? [] : validChannelLinks.map((url) => ({ platform: "Kênh nội dung", name: form.channelManager, url })), declaration: { accuracyConfirmed: form.accuracyConfirmed, termsConfirmed: form.termsConfirmed } }),
      });
      const data = await response.json() as { data?: { applicationId: string }; message?: string };
      if (!response.ok) throw new Error(data.message ?? "Không thể gửi hồ sơ.");
      setResult({ loading: false, id: data.data?.applicationId });
    } catch (error) {
      setResult({ loading: false, error: error instanceof Error ? error.message : "Không thể gửi hồ sơ." });
    }
  };

  if (result.id) return <section className="application-shell application-success"><Check size={36} /><h1>Hồ sơ đã được tiếp nhận</h1><p>Mã hồ sơ: {result.id}. Chúng tôi sẽ liên hệ khi có kết quả.</p><Link href="/">Về trang chủ</Link></section>;

  return <section className="application-shell">
    <ol className="application-steps">{["Thông tin", "Thông tin kênh", "Cam đoan & Nộp"].map((label, index) => <li aria-current={step === index + 1} data-complete={step > index + 1 || undefined} key={label}><span>{step > index + 1 ? <Check size={17} /> : index + 1}</span><b>{label}</b></li>)}</ol>

    {step === 1 && <section className="application-card">
      <h1>Đăng ký thông tin</h1><p className="application-help">Điền đầy đủ thông tin bên dưới</p>
      <div className="avatar-upload"><div className={`avatar-placeholder ${avatarPreviewUrl ? "has-preview" : ""}`} style={avatarPreviewUrl ? { backgroundImage: `url("${avatarPreviewUrl}")` } : undefined}>{!avatarPreviewUrl && <UserRound size={30} />}</div><div className="avatar-copy"><strong>{isOrganization ? "Ảnh đại diện / Logo tổ chức" : "Ảnh đại diện"}</strong><span>Ảnh dung lượng tối đa 20MB</span></div><label className="upload-button"><Upload size={16} />Tải ảnh lên<input type="file" accept="image/*" onChange={(event) => selectAvatar(event.target.files?.[0])} /></label></div>{avatarFileError && <p className="avatar-upload-error">{avatarFileError}</p>}
      {isOrganization ? <><section className="application-contact application-identity"><h2>Thông tin định danh</h2><div className="application-fields"><Field label="Tên tổ chức / doanh nghiệp" required full value={String(form.name ?? "")} onChange={(value) => change("name", value)} placeholder="Tên đầy đủ của tổ chức" /><Field label="Số GCNĐKDN / GPHD / Quyết định thành lập" required full hint="Giấy chứng nhận ĐKDN hoặc Giấy phép kinh doanh hoặc Quyết định thành lập" value={String(form.businessLicenseNo ?? "")} onChange={(value) => change("businessLicenseNo", value)} placeholder="Nhập số giấy chứng nhận" /><Field label="Ngày cấp" required type="date" value={String(form.licenseIssuedAt ?? "")} onChange={(value) => change("licenseIssuedAt", value)} /><Field label="Cơ quan cấp" required value={String(form.licenseIssuedBy ?? "")} onChange={(value) => change("licenseIssuedBy", value)} placeholder="Tên cơ quan" /><Field label="Người chịu trách nhiệm trước pháp luật" required full value={String(form.legalRepresentative ?? "")} onChange={(value) => change("legalRepresentative", value)} placeholder="Họ và tên người đại diện" /></div></section><section className="application-contact application-contact-details"><h2>Thông tin liên hệ</h2><ContactFields form={form} change={change} /></section></> : <section className="application-contact"><h2>Thông tin liên hệ</h2><div className="application-fields"><Field label="Họ tên KOL/KOC" required full value={String(form.name ?? "")} onChange={(value) => change("name", value)} placeholder="Nhập họ và tên" /></div><ContactFields form={form} change={change} /></section>}
      {!isOrganization && <div className="application-registration-extras"><div className="application-multiselect"><span>Danh mục hoạt động</span><button type="button" onClick={() => setCategoryMenuOpen((open) => !open)}>{selectedCategories || "Chọn danh mục hoạt động"}<ChevronDown size={18} /></button>{categoryMenuOpen && <div className="category-options">{categories.map((category) => <label key={category.key}><input type="checkbox" checked={categoryKeys.includes(category.key)} onChange={() => toggleCategory(category.key)} />{category.label}</label>)}</div>}</div><label className="application-switch"><span>Đã học lớp bồi dưỡng nghiệp vụ</span><input type="checkbox" checked={Boolean(form.livestreamCertVerified)} onChange={(event) => change("livestreamCertVerified", event.target.checked)} /><i aria-hidden="true" /></label></div>}<Actions onBack={null} onNext={() => setStep(2)} disabled={!validOne} />
    </section>}

    {step === 2 && (isOrganization ? <section className="application-card channel-step mcn-channel-step"><h1>Thông tin kênh nội dung</h1><p className="application-help">Khai báo các kênh, tài khoản đang quản lý trên tất cả nền tảng</p><div className="channel-information"><h2>Thông tin kênh nội dung</h2><div className="application-fields"><Field label="Số lượng tài khoản / trang / kênh / nhóm" required full type="number" value={String(form.channelQuantity ?? "")} onChange={(value) => change("channelQuantity", value)} placeholder="Tổng tất cả nền tảng" /><Field label="Họ tên nhân sự quản lý nội dung" required value={String(form.channelManager ?? "")} onChange={(value) => change("channelManager", value)} placeholder="Người trực tiếp đăng bài" /><Field label="Số điện thoại nhân sự" required type="tel" value={String(form.channelManagerPhone ?? "")} onChange={(value) => change("channelManagerPhone", value)} placeholder="0xxx xxx xxx" /></div><div className="mcn-channel-upload"><div className="mcn-upload-heading"><span>File chi tiết kênh (Excel mẫu Cục) <em>*</em></span><a href="/templates/mau-file-chi-tiet-kenh-mcn.xlsx" download>Tải mẫu file Excel (Cục PTTH&TTĐT)</a></div>{channelDetailFileName ? <div className={`mcn-upload-file ${channelDetailFileError ? "invalid" : ""}`}><Check size={18} /><span>{channelDetailFileName}{uploadedChannels.length > 0 && ` (${uploadedChannels.length} kênh)`}</span><button type="button" onClick={() => { setChannelDetailFileName(""); setChannelDetailFileError(""); setUploadedChannels([]); }}>Xóa</button></div> : <label className="mcn-upload-dropzone"><Upload size={23} /><strong>Chọn hoặc kéo thả file Excel vào đây</strong><small>Định dạng: .xlsx / .xls · tối đa 16MB</small><input type="file" accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => inspectChannelDetailFile(event.target.files?.[0])} /></label>}{channelDetailFileError && <p className="mcn-upload-error">{channelDetailFileError}</p>}{uploadedChannelChecking && <p className="mcn-upload-checking">Đang kiểm tra các kênh trong file...</p>}{!uploadedChannelChecking && uploadedChannels.length > 0 && <div className="mcn-channel-results"><p><span>{uploadedChannels.filter((channel) => !channel.duplicate).length} kênh hợp lệ</span>{uploadedChannels.some((channel) => channel.duplicate) && <b>{uploadedChannels.filter((channel) => channel.duplicate).length} kênh đã có chủ</b>}</p>{uploadedChannels.map((channel) => <UploadedChannelResult key={channel.url} channel={channel} />)}</div>}</div></div><Actions onBack={() => setStep(1)} onNext={() => setStep(3)} disabled={!validTwo} /></section> : <section className="application-card channel-step">
      <h1>Thông tin kênh nội dung</h1><p className="application-help">Đăng ký các kênh, tài khoản đang quản lý trên tất cả nền tảng</p>
      <div className="channel-information"><h2>Thông tin kênh nội dung</h2><div className="application-fields">
        <Field label="Số lượng tài khoản / trang / kênh / nhóm" required full type="number" value={String(form.channelQuantity ?? "")} onChange={(value) => change("channelQuantity", value)} placeholder="Tổng tất cả nền tảng" />
        <Field label="Họ tên nhân sự quản lý nội dung" required value={String(form.channelManager ?? "")} onChange={(value) => change("channelManager", value)} placeholder="Người trực tiếp đăng bài" />
        <Field label="Số điện thoại nhân sự" required type="tel" value={String(form.channelManagerPhone ?? "")} onChange={(value) => change("channelManagerPhone", value)} placeholder="0xxx xxx xxx" error={form.channelManagerPhone && !isVietnamesePhone(String(form.channelManagerPhone)) ? "Số điện thoại phải có 10 số và bắt đầu bằng 0." : ""} />
        <label className="application-full channel-links"><span className="field-label">Danh sách link kênh <em>*</em></span><textarea value={String(form.channelLinks ?? "")} onChange={(event) => change("channelLinks", event.target.value)} placeholder={"Nhập mỗi link trên một dòng. Ví dụ:\nhttps://youtube.com/@tenkenh"} /><small>{linkCheck.checking ? "Đang kiểm tra..." : `${channelLinks.length} link đã nhập`}</small></label>
        {!linkCheck.checking && channelLinks.length > 0 && <div className="channel-check-results"><p><span>{validChannelLinks.length} kênh hợp lệ</span>{linkCheck.duplicateUrls.length > 0 && <b>{linkCheck.duplicateUrls.length} kênh đã có chủ (sẽ bỏ qua)</b>}</p>{channelLinks.filter(isValidChannelUrl).map((url) => <ChannelCheckResult key={url} url={url} duplicate={linkCheck.duplicateUrls.includes(normalizeUrl(url))} />)}{linkCheck.error && <small className="link-check-error">{linkCheck.error}</small>}</div>}
      </div></div><Actions onBack={() => setStep(1)} onNext={() => setStep(3)} disabled={!validTwo} />
    </section>)}

    {step === 3 && <section className="application-card declaration-step"><h1>Cam đoan & Nộp hồ sơ</h1><p className="application-help">Đọc kỹ nội dung cam kết trước khi xác nhận</p><div className="declaration-content"><h2>Nội dung cam kết</h2><div><p>Tôi cam kết:</p><ul><li>Chịu trách nhiệm trước pháp luật về các thông tin do mình cung cấp, quản lý, phối hợp với cơ quan có thẩm quyền để quản lý, sàng lọc, thông tin, bình luận được người sử dụng đăng tải trên tài khoản, kênh nội dung, trang cộng đồng, nhóm cộng đồng của mình.</li><li>Tuân thủ các quy định của pháp luật Việt Nam về quản lý, cung cấp, sử dụng dịch vụ Internet và thông tin trên mạng; quảng cáo; nghệ thuật biểu diễn; thuế; Bộ Quy tắc ứng xử văn hóa trên môi trường số của Bộ Văn hóa, Thể thao và Du lịch và các quy định pháp luật có liên quan.</li></ul></div></div><label className="declaration-agreement"><input type="checkbox" checked={Boolean(form.accuracyConfirmed)} onChange={(event) => { change("accuracyConfirmed", event.target.checked); change("termsConfirmed", event.target.checked); }} />Đồng ý với toàn bộ nội dung cam kết</label>{isOrganization && <section className="white-list-request"><h2>Đơn đề nghị tham gia White List</h2><div><div className="white-list-heading"><span>Bản scan có ký tên, đóng dấu <em>*</em><small>Chỉ chấp nhận .pdf, .doc, .docx · tối đa 20MB</small></span><a href="https://kol.gov.vn/mcn/khai-bao" target="_blank" rel="noreferrer">Tải mẫu Đơn đề nghị</a></div>{whiteListRequestFileName ? <div className={`mcn-upload-file ${whiteListRequestFileError ? "invalid" : ""}`}><Check size={18} /><span>{whiteListRequestFileName}</span><button type="button" onClick={() => { setWhiteListRequestFileName(""); setWhiteListRequestFileError(""); }}>Xóa</button></div> : <label className="white-list-dropzone"><Upload size={23} /><strong>Nhấn để chọn file PDF / DOC</strong><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; setWhiteListRequestFileName(file.name); setWhiteListRequestFileError(file.size > 20 * 1024 * 1024 ? "Dung lượng file không được vượt quá 20MB." : !/\.(pdf|doc|docx)$/i.test(file.name) ? "Chỉ chấp nhận file PDF, DOC hoặc DOCX." : ""); }} /></label>}{whiteListRequestFileError && <p className="mcn-upload-error">{whiteListRequestFileError}</p>}</div></section>}<p className="declaration-notice"><span className="notice-icon">i</span><span className="declaration-notice-copy">Sau khi gửi, Cục PTTH&TTĐT sẽ xem xét và xử lý qua email đã đăng ký.</span></p>{result.error && <p className="application-error">{result.error}</p>}<Actions onBack={() => setStep(2)} onNext={submit} disabled={!form.accuracyConfirmed || !form.termsConfirmed || (isOrganization && (!whiteListRequestFileName || Boolean(whiteListRequestFileError))) || result.loading} label={result.loading ? "Đang gửi..." : "Đăng ký thông tin"} /></section>}
  </section>;
}

function isVietnamesePhone(value: string) { return /^0\d{9}$/.test(value); }
function isValidEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value); }
function ContactFields({ form, change }: { form: Record<string, string | boolean>; change: (key: string, value: string | boolean) => void }) { const phone = String(form.phone ?? ""); const email = String(form.email ?? ""); const zalo = String(form.zalo ?? ""); return <div className="application-fields"><Field label="Quốc tịch / Quốc gia" required value={String(form.nationality ?? "")} onChange={(value) => change("nationality", value)} /><Field label="Địa chỉ liên hệ" required full value={String(form.address ?? "")} onChange={(value) => change("address", value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" /><Field label="Số điện thoại" type="tel" value={phone} onChange={(value) => change("phone", value)} placeholder="0xxx xxx xxx" error={phone && !isVietnamesePhone(phone) ? "Số điện thoại phải có 10 số và bắt đầu bằng 0." : ""} /><Field label="Hộp thư điện tử" required type="email" value={email} onChange={(value) => change("email", value)} placeholder="example@email.com" error={email && !isValidEmail(email) ? "Email không đúng định dạng." : ""} /><Field label="Số Zalo nhận cảnh báo vi phạm" required full type="tel" value={zalo} onChange={(value) => change("zalo", value)} placeholder="0xxx xxx xxx" error={zalo && !isVietnamesePhone(zalo) ? "Số Zalo phải có 10 số và bắt đầu bằng 0." : ""} /></div>; }
function Field({ label, required, full, hint, error, type = "text", value, onChange, placeholder }: { label: string; required?: boolean; full?: boolean; hint?: string; error?: string; type?: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className={`${full ? "application-full " : ""}${error ? "field-invalid" : ""}`}><span className="field-label">{label}{required && <em>*</em>}</span>{hint && <small className="field-hint">{hint}</small>}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label>; }
function Actions({ onBack, onNext, disabled, label = "Tiếp theo" }: { onBack: (() => void) | null; onNext: () => void; disabled: boolean; label?: string }) { return <div className="application-actions">{onBack ? <button type="button" className="secondary" onClick={onBack}><ArrowLeft size={16} />Quay lại</button> : <Link href="/">Huỷ</Link>}<button type="button" disabled={disabled} onClick={onNext}>{label}<ArrowRight size={16} /></button></div>; }
function isValidChannelUrl(value: string) { try { const url = new URL(value); const host = url.hostname.replace(/^www\./, "").toLowerCase(); const isSupported = ["youtube.com", "youtu.be", "tiktok.com", "instagram.com", "facebook.com", "fb.com", "twitter.com", "x.com"].some((domain) => host === domain || host.endsWith(`.${domain}`)); return ["http:", "https:"].includes(url.protocol) && isSupported && url.pathname.length > 1; } catch { return false; } }
function getChannelPlatform(url: string) { return /youtube\.com|youtu\.be/i.test(url) ? "YOUTUBE" : /tiktok\.com/i.test(url) ? "TIKTOK" : /instagram\.com/i.test(url) ? "INSTAGRAM" : /facebook\.com|fb\.com/i.test(url) ? "FACEBOOK" : /twitter\.com|x\.com/i.test(url) ? "TWITTER" : "KHÁC"; }
function UploadedChannelResult({ channel }: { channel: UploadedChannel }) { return <article className={`channel-check-result ${channel.duplicate ? "duplicate" : "valid"}`}><div className="channel-check-avatar"><UserRound size={20} /></div><span title={channel.url}>{channel.name}</span><b>{channel.platform}</b>{channel.duplicate ? <AlertTriangle size={18} /> : <Check size={18} />}{channel.duplicate && <p>Kênh này đã tồn tại trong hệ thống và thuộc về người dùng khác.</p>}</article>; }
function ChannelCheckResult({ url, duplicate }: { url: string; duplicate: boolean }) { return <UploadedChannelResult channel={{ url, name: url, platform: getChannelPlatform(url), duplicate }} />; }
