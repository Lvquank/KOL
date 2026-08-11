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

export default function ProposalButtonPreview() {
  return (
    <section className="mx-auto grid max-w-md gap-3 p-6" aria-label="Các trạng thái của nút Gửi đề xuất">
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
  );
}
