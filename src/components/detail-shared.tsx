import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import { ProposalDialog } from "@/components/proposal-dialog";

export const DETAIL_CARD =
  "bg-white sm:rounded-[4px] border-y sm:border border-gray-200 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]";

type PlatformIconProps = {
  platform: string;
  circular?: boolean;
  size?: "tiny" | "small" | "medium";
};

export function PlatformIcon({ platform, circular = false, size = "medium" }: PlatformIconProps) {
  const normalized = platform.toLowerCase();
  const background =
    normalized === "facebook"
      ? "#1877F2"
      : normalized === "youtube"
        ? "#FF0000"
        : normalized === "instagram"
          ? "#E4405F"
          : "#010101";
  const outer = size === "tiny" ? "w-5 h-5" : size === "small" ? "w-9 h-9" : "w-11 h-11";
  const inner = size === "tiny" ? "w-3 h-3" : size === "small" ? "w-4 h-4" : "w-5 h-5";

  return (
    <span
      className={`${outer} ${circular ? "rounded-full" : "rounded-[4px]"} flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: background }}
      aria-hidden="true"
    >
      {normalized === "facebook" && (
        <svg viewBox="0 0 24 24" className={`${inner} fill-white`}>
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      )}
      {normalized === "youtube" && (
        <svg viewBox="0 0 24 24" className={`${inner} fill-white`}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )}
      {normalized === "tiktok" && (
        <svg viewBox="0 0 24 24" className={`${inner} fill-white`}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
        </svg>
      )}
      {normalized === "instagram" && (
        <svg viewBox="0 0 24 24" className={`${inner} fill-white`}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98z" />
        </svg>
      )}
    </span>
  );
}

export type DetailStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function DetailStats({ items }: { items: DetailStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-gray-50 rounded-[4px] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[11px]">{label}</span>
          </div>
          <p className="font-extrabold text-gray-900 text-[18px] leading-tight">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function ContributionCard({ entity, entityName }: { entity: "KOL" | "MCN"; entityName: string }) {
  return (
    <div className="bg-white rounded-[4px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 flex flex-col text-center gap-3">
      <Info className="w-7 h-7 text-primary self-start" />
      <h3 className="font-extrabold text-gray-900 text-[14px] text-left">
        Bạn cần bổ sung thông tin của {entity} này?
      </h3>
      <p className="text-[12px] text-gray-500 leading-relaxed text-left">
        Nếu bạn có thông tin hữu ích về {entity} này còn thiếu trên hệ thống, hãy gửi đề xuất để cộng đồng cùng đóng góp xây dựng cơ sở dữ liệu quốc gia.
      </p>
      <ProposalDialog entity={entity} entityName={entityName} />
    </div>
  );
}
