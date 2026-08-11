export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
)
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .trim()
  .replace(/\/+$/, "");

export const API_BASE_URL = `${API_URL}/api/v1`;

export type ApiPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  data: T[];
  pagination: ApiPagination;
};

export type DatasetStats = {
  influencers: number;
  social_channels: number;
  channel_entities: number;
  ticker_channels: number;
  mcns: number;
  mcn_influencers: number;
  growth_rankings: number;
  bsi_rankings: number;
  news_posts: number;
};

export type GrowthEntity = {
  type: "influencer" | "owner";
  key?: string;
  sourceId?: string;
  name: string;
  nickName?: string | null;
  subtitle?: string | null;
  identityVerified?: boolean;
  totalChannels?: number;
  totalKols?: number;
  platforms?: string[];
  channelsByType?: Record<string, number>;
};

export type GrowthRanking = {
  snapshot_key: string;
  entity_type: "influencer" | "owner";
  metric: string;
  period_days: number;
  rank: number;
  name: string;
  subtitle: string | null;
  avatar_url: string | null;
  snap_end_now?: string | number | null;
  growth_current: string | number | null;
  growth_previous?: string | number | null;
  growth_change?: string | number | null;
  growth_rate: string | number | null;
  score?: string | number | null;
  scraped_at: string;
  growth_entity_key: string;
  influencer_key: string | null;
  mcn_source_id: string | null;
  entity: GrowthEntity | null;
};

export type BsiPeriod = {
  tab: BsiTab;
  year: number;
  month: number;
  ranking_count: number;
  latest_scraped_at: string;
};

export type BsiTab = "campaign" | "event" | "influencer" | "show";

export type BsiRanking = {
  snapshot_key: string;
  tab: BsiTab;
  year: number;
  month: number;
  rank: number;
  name: string;
  score: string | number;
  image_url: string | null;
  subject_key: string;
  subject_type: string;
  influencer_key: string | null;
};

export type NewsPost = {
  slug: string;
  source_url: string;
  category: string | null;
  title: string;
  excerpt: string | null;
  published_date: string | null;
  reading_minutes: number | null;
  image_url: string | null;
};

type ApiErrorBody = {
  message?: string;
};

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal
  });

  if (!response.ok) {
    let message = `API trả về HTTP ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.message) message = body.message;
    } catch {
      // Keep the status-based message when the server did not return JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function formatCompactMetric(value: string | number | null): string {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0";
  const sign = numeric > 0 ? "+" : numeric < 0 ? "−" : "";
  const absolute = Math.abs(numeric);
  if (absolute >= 1_000_000) {
    const millions = absolute / 1_000_000;
    return `${sign}${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: millions >= 100 ? 0 : 1
    }).format(millions)} Tr`;
  }
  return `${sign}${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(absolute)}`;
}

export function formatPercent(value: string | number | null): string {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0%";
  const sign = numeric > 0 ? "+" : numeric < 0 ? "−" : "";
  return `${sign}${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(Math.abs(numeric))}%`;
}

export function formatSnapshotDate(value: string | null | undefined): string {
  if (!value) return "đang cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "đang cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatNewsDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN").format(date);
}
