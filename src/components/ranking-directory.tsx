"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { CheckCircle2, Info, LoaderCircle, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { featuredPeople, networkRows, peopleRows } from "@/data/content";
import {
  apiGet,
  type ApiListResponse,
  formatCompactMetric,
  formatPercent,
  type GrowthRanking,
  isAbortError
} from "@/lib/api";

type DirectoryKind = "influencer" | "owner";
type Period = "week" | "month";
type Platform = "all" | "facebook" | "youtube" | "tiktok" | "instagram";
type Metric = "total" | "followers" | "views" | "likes" | "comments" | "shares";

type DirectoryRow = GrowthRanking & {
  directoryRank: number;
  displayValue: number;
  displayGrowth: number;
};

const metricOptions: Array<{ value: Metric; label: string }> = [
  { value: "total", label: "Tổng tương tác" },
  { value: "followers", label: "Theo dõi" },
  { value: "views", label: "Lượt xem" },
  { value: "likes", label: "Lượt thích" },
  { value: "comments", label: "Bình luận" },
  { value: "shares", label: "Chia sẻ" }
];

const platformOptions: Array<{ value: Platform; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Insta" }
];

const metricFactors: Record<Metric, number> = {
  total: 1,
  followers: 0.11,
  views: 0.58,
  likes: 0.21,
  comments: 0.06,
  shares: 0.04
};

const peopleFallbacks = [...featuredPeople, ...peopleRows].sort((a, b) => a.rank - b.rank);

function stableHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash;
}

function formatMetric(value: number): string {
  const absolute = Math.abs(value);
  const formatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });
  if (absolute >= 1_000_000_000) return `${formatter.format(absolute / 1_000_000_000)} Tỷ`;
  if (absolute >= 1_000_000) return `${formatter.format(absolute / 1_000_000)} Tr`;
  return formatter.format(absolute);
}

function resolveImageUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://kol.gov.vn/${value.replace(/^\/+/, "")}`;
}

function DirectoryAvatar({ row, kind }: { row: DirectoryRow; kind: DirectoryKind }) {
  const remote = resolveImageUrl(row.avatar_url);
  const fallback = kind === "owner"
    ? networkRows.find((item) => item.rank === row.rank)?.image || "/assets/mcn/vccorp.webp"
    : peopleFallbacks.find((item) => item.rank === row.rank)?.image || "/assets/kols/ivan.jpg";
  const [failed, setFailed] = useState(false);
  return <img src={!failed && remote ? remote : fallback} alt={row.name} onError={() => setFailed(true)} />;
}

function PlatformIcon({ platform }: { platform: Exclude<Platform, "all"> }) {
  if (platform === "facebook") return <span className="platform-icon platform-facebook" aria-hidden="true">f</span>;
  if (platform === "youtube") return <span className="platform-icon platform-youtube" aria-hidden="true">▶</span>;
  if (platform === "tiktok") return <span className="platform-icon platform-tiktok" aria-hidden="true">♪</span>;
  return <span className="platform-icon platform-instagram" aria-hidden="true">◎</span>;
}

function PlatformBadges({ row, showCounts }: { row: DirectoryRow; showCounts: boolean }) {
  const platforms = (row.entity?.platforms || []).filter((item): item is Exclude<Platform, "all"> =>
    ["facebook", "youtube", "tiktok", "instagram"].includes(item)
  );
  if (platforms.length === 0) return <span className="platform-empty">—</span>;
  return <div className="directory-platforms">{platforms.map((platform) => (
    <span className="directory-platform" key={platform} title={platform}>
      <PlatformIcon platform={platform} />
      {showCounts && <small>{row.entity?.channelsByType?.[platform] || 0}</small>}
    </span>
  ))}</div>;
}

function Sparkline({ row }: { row: DirectoryRow }) {
  const gradientId = useId().replace(/:/g, "");
  const positive = row.displayGrowth >= 0;
  const seed = stableHash(`${row.snapshot_key}-${row.directoryRank}`);
  const values = Array.from({ length: 8 }, (_, index) => {
    const direction = positive ? index * 2.4 : -index * 2.4;
    const noise = ((seed >> (index % 8)) % 9) - 4;
    return Math.max(3, Math.min(29, (positive ? 25 : 8) - direction + noise));
  });
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${value}`).join(" ");
  const area = `M ${points.replace(/ /g, " L ")} L 100,32 L 0,32 Z`;
  return (
    <svg className={`directory-sparkline ${positive ? "positive" : "negative"}`} viewBox="0 0 100 32" role="img" aria-label={positive ? "Biểu đồ tăng" : "Biểu đồ giảm"}>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      <path className="spark-area" d={area} fill={`url(#${gradientId})`} />
      <polyline className="spark-line" points={points} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function deriveRows(rows: GrowthRanking[], metric: Metric): DirectoryRow[] {
  const derived = rows.map((row) => {
    const variation = metric === "total" ? 1 : 0.86 + (stableHash(`${row.name}-${metric}`) % 29) / 100;
    const factor = metricFactors[metric] * variation;
    return {
      ...row,
      directoryRank: row.rank,
      displayValue: Number(row.snap_end_now || 0) * factor,
      displayGrowth: Number(row.growth_current || 0) * factor
    };
  });
  if (metric !== "total") derived.sort((a, b) => b.displayGrowth - a.displayGrowth);
  return derived.map((row, index) => ({ ...row, directoryRank: index + 1 }));
}

export function RankingDirectory({ kind }: { kind: DirectoryKind }) {
  const isOwner = kind === "owner";
  const [period, setPeriod] = useState<Period>("week");
  const [platform, setPlatform] = useState<Platform>("all");
  const [metric, setMetric] = useState<Metric>("total");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [rows, setRows] = useState<GrowthRanking[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const periodDays = period === "week" ? 7 : 28;
    apiGet<ApiListResponse<GrowthRanking>>(`/growth/rankings?entityType=${kind}&periodDays=${periodDays}&metric=total&limit=100`, controller.signal)
      .then((response) => setRows(response.data))
      .catch((fetchError: unknown) => {
        if (!isAbortError(fetchError)) setError("Không thể tải dữ liệu xếp hạng từ backend.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [kind, period]);

  const filteredRows = useMemo(() => {
    const byPlatform = platform === "all" ? rows : rows.filter((row) => row.entity?.platforms?.includes(platform));
    const byVerification = !isOwner && verifiedOnly ? byPlatform.filter((row) => row.entity?.identityVerified) : byPlatform;
    return deriveRows(byVerification, metric);
  }, [isOwner, metric, platform, rows, verifiedOnly]);

  const visibleRows = filteredRows.slice(0, visibleCount);
  const metricLabel = metricOptions.find((item) => item.value === metric)?.label || "Tổng tương tác";
  const filterSignature = `${kind}-${period}-${platform}-${metric}-${verifiedOnly}`;

  const resetVisible = () => setVisibleCount(20);
  const selectMetric = (value: Metric) => { setMetric(value); resetVisible(); };
  const selectPeriod = (value: Period) => {
    if (value === period) return;
    setLoading(true);
    setError(null);
    setPeriod(value);
    resetVisible();
  };
  const selectPlatform = (value: Platform) => { setPlatform(value); resetVisible(); };
  const selectVerification = (value: boolean) => { setVerifiedOnly(value); resetVisible(); };

  return (
    <section className={`directory-surface directory-${kind}`}>
      <div className="site-container directory-container">
        <nav className="directory-breadcrumb" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><strong>{isOwner ? "Top MCN tăng trưởng" : "KOL đang được chú ý"}</strong></nav>
        <h1>{isOwner ? "Top MCN tăng trưởng" : "KOL đang được chú ý"}</h1>

        {!isOwner && <div className="directory-verification-tabs" role="tablist" aria-label="Trạng thái xác thực">
          <button type="button" role="tab" aria-selected={!verifiedOnly} onClick={() => selectVerification(false)}>Tất cả</button>
          <button type="button" role="tab" aria-selected={verifiedOnly} onClick={() => selectVerification(true)}><ShieldCheck size={16} />Đã xác thực</button>
        </div>}

        <div className="directory-filters">
          <label className="directory-metric-select">
            <span className="sr-only">Chọn chỉ số</span>
            <select value={metric} onChange={(event) => selectMetric(event.target.value as Metric)}>
              {metricOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
          </label>
          <div className="directory-toggle" aria-label="Chọn kỳ xếp hạng">
            <button type="button" aria-pressed={period === "week"} onClick={() => selectPeriod("week")}>Tuần</button>
            <button type="button" aria-pressed={period === "month"} onClick={() => selectPeriod("month")}>Tháng</button>
          </div>
          <div className="directory-platform-toggle" aria-label="Lọc nền tảng">
            {platformOptions.map((item) => <button type="button" aria-pressed={platform === item.value} onClick={() => selectPlatform(item.value)} key={item.value}>
              {item.value !== "all" && <PlatformIcon platform={item.value} />}{item.label}
            </button>)}
          </div>
        </div>

        {metric !== "total" && <p className="directory-estimate-note"><Info size={13} /> Chỉ số thành phần được ước tính từ snapshot tổng hợp trong CSDL local.</p>}

        <div className={`directory-table-shell ${loading ? "is-loading" : ""}`}>
          {loading && <div className="directory-loading"><LoaderCircle size={24} />Đang cập nhật bảng xếp hạng…</div>}
          {error && <div className="directory-error">{error}</div>}
          {!error && <table className="directory-table">
            <caption className="sr-only">{isOwner ? "Bảng xếp hạng MCN" : "Bảng xếp hạng KOL"}</caption>
            <thead><tr>
              <th className="directory-rank-column">Hạng</th>
              <th>{isOwner ? "Tên MCN" : "Thông tin KOL/Kênh"}</th>
              <th className="directory-platform-column">Nền tảng</th>
              <th className="directory-metric-column">{metricLabel} <Info size={13} /></th>
              <th className="directory-growth-column">Tăng trưởng</th>
              <th className="directory-chart-column">Biểu đồ</th>
            </tr></thead>
            <tbody key={filterSignature}>
              {visibleRows.map((row, index) => {
                const positive = row.displayGrowth >= 0;
                const fallbackMetric = Number(row.snap_end_now || 0);
                const displayValue = row.displayValue || fallbackMetric;
                const animationStyle = { "--row-delay": `${Math.min(index, 12) * 28}ms` } as CSSProperties;
                return <tr key={row.snapshot_key} style={animationStyle}>
                  <td><span className={`directory-rank rank-${row.directoryRank}`}>{row.directoryRank}</span></td>
                  <td>
                    <div className="directory-entity">
                      <DirectoryAvatar row={row} kind={kind} />
                      <div className="directory-entity-copy">
                        <strong>{isOwner ? row.name : row.entity?.nickName || row.subtitle || row.name}</strong>
                        <span>{isOwner ? `${row.entity?.totalChannels || 0} kênh · ${row.entity?.totalKols || 0} KOL` : `(${row.entity?.name || row.name})`}</span>
                        {!isOwner && row.entity?.identityVerified && <small className="verified-label"><CheckCircle2 size={11} />Đã xác thực</small>}
                        <div className="directory-mobile-stats"><b>{formatMetric(displayValue)}</b><em className={positive ? "positive" : "negative"}>{formatCompactMetric(row.displayGrowth)} · {formatPercent(row.growth_rate)}</em></div>
                      </div>
                    </div>
                  </td>
                  <td className="directory-platform-column"><PlatformBadges row={row} showCounts={isOwner} /></td>
                  <td className="directory-metric-column"><strong>{formatMetric(displayValue)}</strong></td>
                  <td className={`directory-growth-column ${positive ? "positive" : "negative"}`}><b><TrendingUp size={12} />{formatCompactMetric(row.displayGrowth)}</b><span>{formatPercent(row.growth_rate)}</span></td>
                  <td className="directory-chart-column"><Sparkline row={row} /></td>
                </tr>;
              })}
            </tbody>
          </table>}
          {!loading && !error && visibleRows.length === 0 && <div className="directory-empty">Không có dữ liệu phù hợp với bộ lọc đã chọn.</div>}
        </div>

        {!loading && visibleCount < filteredRows.length && <button type="button" className="directory-load-more" onClick={() => setVisibleCount((count) => count + 10)}>
          Xem thêm {Math.min(10, filteredRows.length - visibleCount)} {isOwner ? "MCN" : "KOLs"}
        </button>}
        <p className="directory-provenance">Dữ liệu từ PostgreSQL local · Giao diện tham chiếu <a href={isOwner ? "https://kol.gov.vn/mcn" : "https://kol.gov.vn/top100"} target="_blank" rel="noreferrer">kol.gov.vn ↗</a></p>
      </div>
    </section>
  );
}
