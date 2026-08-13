"use client";

import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { API_BASE_URL } from "@/lib/api";

type ProposalDialogProps = {
  entity: "KOL" | "MCN";
  entityName: string;
  entityKey?: string;
};

const MCN_OPTION_GROUPS = [
  { label: "Kênh", options: ["Kênh thiếu", "Kênh trùng", "Kênh không thuộc MCN"] },
  { label: "Liên hệ", options: ["Email/Website", "Hotline", "Người phụ trách"] },
  {
    label: "Thông tin pháp lý",
    options: ["Giấy phép ĐKKD", "Mã số thuế (MST)", "Địa chỉ", "Người chịu trách nhiệm"],
  },
  { label: "Khác", options: ["Số KOL", "Lĩnh vực", "Logo", "Thông tin khác"] },
];

const KOL_OPTION_GROUPS = [
  {
    label: "Kênh",
    options: ["URL kênh bị lỗi hoặc không truy cập được", "Thêm kênh còn thiếu trên hệ thống"],
  },
  { label: "Thương mại", options: ["Rate card/Bảng giá dịch vụ"] },
  { label: "Thông tin", options: ["Ngành/Lĩnh vực hoạt động", "Mô tả/Bio kênh"] },
  { label: "Khác", options: ["Thông tin khác"] },
];

export function ProposalDialog({ entity, entityName, entityKey }: ProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [proposalId, setProposalId] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const optionGroups = entity === "MCN" ? MCN_OPTION_GROUPS : KOL_OPTION_GROUPS;

  function resetDialog() {
    setStep(1);
    setSelectedOption("");
    setDetails("");
    setEmail("");
    setAgreed(false);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
    setProposalId("");
  }

  function closeDialog() {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ) || [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function submitProposal() {
    if (!entityKey) {
      setSubmitError(`Không xác định được ${entity} cần bổ sung thông tin.`);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(`${API_BASE_URL}/information-proposals`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entityType: entity,
          entityKey,
          influencerKey: entity === "KOL" ? entityKey : undefined,
          mcnKey: entity === "MCN" ? entityKey : undefined,
          proposalType: selectedOption,
          details,
          submitterEmail: email,
          declarationConfirmed: agreed,
        }),
      });
      const payload = await response.json().catch(() => null) as {
        data?: { proposalId: string };
        message?: string;
      } | null;
      if (!response.ok || !payload?.data) {
        throw new Error(payload?.message ?? "Không thể gửi đề xuất lúc này.");
      }
      setProposalId(payload.data.proposalId);
      setSubmitted(true);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Không thể kết nối tới máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="proposal-button"
        onClick={() => {
          resetDialog();
          setOpen(true);
        }}
      >
        Gửi đề xuất
      </button>

      {open ? createPortal((
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="flex max-h-[calc(100vh-24px)] w-full max-w-[640px] flex-col overflow-hidden rounded-[6px] bg-white shadow-2xl outline-none"
            onKeyDown={trapFocus}
          >
            <header className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-6 sm:py-6">
              <div className="min-w-0">
                <h2 id={titleId} className="text-[18px] font-extrabold leading-tight text-gray-900 sm:text-[20px]">
                  Gửi đề xuất bổ sung thông tin
                </h2>
                <p id={descriptionId} className="mt-1 truncate text-[14px] text-gray-400 sm:text-[15px]">
                  {entityName} · kol.gov.vn
                </p>
                <div className="mt-4 flex items-center gap-2 sm:gap-3" aria-label={`Bước ${step} trên 3`}>
                  {["Thông tin", "Chi tiết", "Cam đoan"].map((label, index) => {
                    const number = index + 1;
                    const active = number <= step;
                    return (
                      <div key={label} className="flex items-center gap-2 sm:gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${
                            active ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {number}
                        </span>
                        <span className={`text-[13px] sm:text-[14px] ${number === step ? "font-semibold text-primary" : "text-gray-400"}`}>
                          {label}
                        </span>
                        {number < 3 ? <span className="h-px w-4 bg-gray-200 sm:w-8" aria-hidden="true" /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Đóng"
                className="ml-4 mt-0.5 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={closeDialog}
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  <h3 className="mt-3 text-[15px] font-extrabold text-gray-900">
                    Đã gửi đề xuất bổ sung thông tin
                  </h3>
                  <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-gray-500">
                    Cảm ơn bạn đã đóng góp. Bộ phận quản trị sẽ kiểm tra nội dung trước khi cập nhật hồ sơ {entity}.
                  </p>
                  {proposalId ? <code className="mt-3 rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-500">Mã: {proposalId}</code> : null}
                </div>
              ) : null}

              {!submitted && step === 1 ? (
                <div className="space-y-3.5">
                  <p className="text-[15px] font-semibold text-gray-800 sm:text-[16px]">
                    Bạn muốn đề xuất bổ sung thông tin gì? <span className="text-red-500">*</span>
                  </p>
                  {optionGroups.map((group) => (
                    <fieldset key={group.label}>
                      <legend className="mb-2 text-[13px] font-bold uppercase text-gray-400">{group.label}</legend>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const selected = selectedOption === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              className={`min-h-10 rounded-full border px-4 py-2 text-left text-[14px] font-medium leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-[15px] ${
                                selected
                                  ? "border-primary bg-orange-50 text-primary"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-800"
                              }`}
                              onClick={() => setSelectedOption(option)}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : null}

              {!submitted && step === 2 ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[12px] font-medium text-gray-700">Nội dung đề xuất cụ thể *</span>
                    <textarea
                      value={details}
                      minLength={10}
                      maxLength={500}
                      rows={5}
                      placeholder="Mô tả rõ thông tin bạn muốn đề xuất bổ sung. Ví dụ: link kênh, tên công ty, thông tin liên hệ..."
                      className="mt-2 w-full resize-none rounded-[4px] border border-gray-200 px-3 py-2.5 text-[13px] text-gray-800 outline-none transition-colors placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100"
                      onChange={(event) => setDetails(event.target.value)}
                    />
                    <span className="mt-1 block text-right text-[10px] text-gray-400">{details.length} / 500</span>
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-medium text-gray-700">Email của bạn (không bắt buộc)</span>
                    <input
                      type="email"
                      value={email}
                      maxLength={254}
                      placeholder="email@example.com"
                      className="mt-2 h-10 w-full rounded-[4px] border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <span className="mt-1 block text-[10px] text-gray-400">Dùng khi bộ phận quản trị cần xác minh thêm nội dung bạn cung cấp.</span>
                  </label>
                </div>
              ) : null}

              {!submitted && step === 3 ? (
                <div className="space-y-4">
                  <div className="rounded-[4px] border border-gray-200 bg-gray-50 p-4 text-[12px] leading-relaxed text-gray-600">
                    <p className="font-semibold text-gray-700">Tôi cam kết:</p>
                    <p className="mt-3">• Thông tin tôi cung cấp là trung thực và có cơ sở, không nhằm mục đích gây hại, cạnh tranh không lành mạnh hoặc bôi nhọ KOL/MCN.</p>
                    <p className="mt-3">• Tôi hiểu rằng đề xuất sẽ được bộ phận quản trị kiểm tra trước khi sử dụng để cập nhật dữ liệu.</p>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-[12px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={agreed}
                      className="mt-0.5 h-4 w-4 accent-orange-600"
                      onChange={(event) => setAgreed(event.target.checked)}
                    />
                    <span>Đồng ý với nội dung cam kết trên</span>
                  </label>
                  <div className="flex gap-2 rounded-[4px] border border-blue-100 bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-700">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p>Sau khi gửi, đề xuất sẽ xuất hiện trong hàng đợi xử lý riêng của quản trị viên.</p>
                  </div>
                  {submitError ? <p className="rounded-[4px] bg-red-50 px-3 py-2 text-[11px] text-red-600" role="alert">{submitError}</p> : null}
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-5 sm:px-6 sm:py-6">
              {submitted ? (
                <button
                  type="button"
                  className="ml-auto rounded-[4px] bg-primary px-5 py-2.5 text-[12px] font-bold text-white hover:bg-primary-dark"
                  onClick={closeDialog}
                >
                  Đóng
                </button>
              ) : (
                <>
                  {step === 1 ? (
                    <button type="button" className="text-[15px] text-gray-500 hover:text-gray-800" onClick={closeDialog}>
                      Hủy
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-[15px] text-gray-500 hover:text-gray-800"
                      onClick={() => setStep((step - 1) as 1 | 2)}
                    >
                      ← Quay lại
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={step === 1 ? !selectedOption : details.trim().length < 10}
                      className="min-w-[148px] rounded-[5px] bg-primary px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-[#ffb595]"
                      onClick={() => setStep((step + 1) as 2 | 3)}
                    >
                      Tiếp theo →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!agreed || submitting}
                      className="min-w-[148px] rounded-[5px] bg-primary px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-[#ffb595]"
                      onClick={submitProposal}
                    >
                      {submitting ? "Đang gửi..." : "Gửi đề xuất"}
                    </button>
                  )}
                </>
              )}
            </footer>
          </div>
        </div>
      ), document.body) : null}
    </>
  );
}
