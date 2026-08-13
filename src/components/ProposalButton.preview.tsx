const previewStates = [
  { label: "Mặc định", className: "", text: "Gửi đề xuất" },
  { label: "Hover", className: "is-hover", text: "Gửi đề xuất" },
  { label: "Focus", className: "is-focus", text: "Gửi đề xuất" },
  { label: "Active", className: "is-active", text: "Gửi đề xuất" },
  { label: "Disabled", className: "is-disabled", text: "Gửi đề xuất", disabled: true },
  { label: "Loading", className: "", text: "Đang gửi…", state: "loading" },
  { label: "Error", className: "", text: "Thử gửi lại", state: "error" },
  { label: "Success", className: "", text: "Đã gửi", state: "success" },
] as const;

const dialogActionStates = [
  { label: "Mặc định", className: "", text: "Gửi đề xuất", state: "default" },
  { label: "Hover", className: "is-hover", text: "Gửi đề xuất", state: "default" },
  { label: "Focus", className: "is-focus", text: "Gửi đề xuất", state: "default" },
  { label: "Active", className: "is-active", text: "Gửi đề xuất", state: "default" },
  { label: "Disabled", className: "is-disabled", text: "Gửi đề xuất", state: "disabled", disabled: true },
  { label: "Loading", className: "", text: "Đang gửi…", state: "loading" },
  { label: "Error", className: "", text: "Thử gửi lại", state: "error" },
  { label: "Success", className: "", text: "Đã gửi", state: "success" },
] as const;

export default function ProposalButtonPreview() {
  return (
    <div className="mx-auto grid max-w-md gap-8 p-6">
      <section className="grid gap-3" aria-label="Các trạng thái của nút mở hộp thoại đề xuất">
        <h2 className="text-sm font-bold text-gray-900">Nút mở hộp thoại</h2>
        {previewStates.map((item) => (
          <div key={item.label} className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3">
            <span className="text-xs text-gray-500">{item.label}</span>
            <button
              type="button"
              className={`proposal-button ${item.className}`.trim()}
              disabled={"disabled" in item && item.disabled}
              data-state={"state" in item ? item.state : undefined}
            >
              {item.text}
            </button>
          </div>
        ))}
      </section>

      <section className="grid gap-3" aria-label="Các trạng thái của nút gửi đề xuất trong hộp thoại">
        <h2 className="text-sm font-bold text-gray-900">Nút trong hộp thoại</h2>
        {dialogActionStates.map((item) => (
          <div key={item.label} className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3">
            <span className="text-xs text-gray-500">{item.label}</span>
            <button
              type="button"
              className={`proposal-dialog-action proposal-dialog-action-primary ${item.className}`.trim()}
              disabled={"disabled" in item && item.disabled}
              data-state={item.state}
            >
              {item.text}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
