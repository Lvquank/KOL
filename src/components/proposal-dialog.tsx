"use client";

import { Check, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { API_BASE_URL } from "@/lib/api";

type ProposalDialogProps = {
  entity: "KOL" | "MCN";
  entityName: string;
  entityKey: string;
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
  const resolvedEntityKey = typeof entityKey === "string" ? entityKey.trim() : "";

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
    if (!resolvedEntityKey) {
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
          entityKey: resolvedEntityKey,
          influencerKey: entity === "KOL" ? resolvedEntityKey : undefined,
          mcnKey: entity === "MCN" ? resolvedEntityKey : undefined,
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
          className="proposal-dialog-backdrop"
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
            className="proposal-dialog-panel"
            onKeyDown={trapFocus}
          >
            <header className="proposal-dialog-header">
              <div className="proposal-dialog-heading">
                <h2 id={titleId} className="proposal-dialog-title">
                  Gửi đề xuất bổ sung thông tin
                </h2>
                <p id={descriptionId} className="proposal-dialog-entity">
                  {entityName} · kol.gov.vn
                </p>
                <div className="proposal-dialog-steps" aria-label={`Bước ${step} trên 3`}>
                  {["Thông tin", "Chi tiết", "Cam đoan"].map((label, index) => {
                    const number = index + 1;
                    const active = number <= step;
                    return (
                      <div
                        key={label}
                        className="proposal-dialog-step"
                        data-active={active || undefined}
                        data-current={number === step || undefined}
                      >
                        <span
                          className="proposal-dialog-step-number"
                        >
                          {number}
                        </span>
                        <span className="proposal-dialog-step-label">
                          {label}
                        </span>
                        {number < 3 ? <span className="proposal-dialog-step-divider" aria-hidden="true" /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Đóng"
                className="proposal-dialog-close"
                onClick={closeDialog}
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="proposal-dialog-body">
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
                <div className="proposal-dialog-options">
                  <p className="proposal-dialog-question">
                    Bạn muốn đề xuất bổ sung thông tin gì? <span className="text-red-500">*</span>
                  </p>
                  {optionGroups.map((group) => (
                    <fieldset key={group.label} className="proposal-dialog-option-group">
                      <legend className="proposal-dialog-option-label">{group.label}</legend>
                      <div className="proposal-dialog-option-list">
                        {group.options.map((option) => {
                          const selected = selectedOption === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              className="proposal-dialog-choice"
                              data-state={selected ? "selected" : "default"}
                              onClick={() => setSelectedOption(option)}
                            >
                              {selected ? <Check className="proposal-dialog-choice-check" aria-hidden="true" /> : null}
                              <span>{option}</span>
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

            <footer className="proposal-dialog-footer">
              {submitted ? (
                <button
                  type="button"
                  className="proposal-dialog-action proposal-dialog-action-primary ml-auto"
                  data-state="success"
                  onClick={closeDialog}
                >
                  Đóng
                </button>
              ) : (
                <>
                  {step === 1 ? (
                    <button type="button" className="proposal-dialog-action proposal-dialog-action-secondary" onClick={closeDialog}>
                      Hủy
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="proposal-dialog-action proposal-dialog-action-secondary"
                      onClick={() => setStep((step - 1) as 1 | 2)}
                    >
                      ← Quay lại
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={step === 1 ? !selectedOption : details.trim().length < 10}
                      className="proposal-dialog-action proposal-dialog-action-primary"
                      data-state={step === 1 ? (!selectedOption ? "disabled" : "default") : (details.trim().length < 10 ? "disabled" : "default")}
                      onClick={() => setStep((step + 1) as 2 | 3)}
                    >
                      Tiếp theo →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!agreed || submitting}
                      className="proposal-dialog-action proposal-dialog-action-primary"
                      data-state={submitting ? "loading" : submitError ? "error" : (!agreed ? "disabled" : "default")}
                      aria-busy={submitting}
                      onClick={submitProposal}
                    >
                      {submitting ? "Đang gửi…" : "Gửi đề xuất"}
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
