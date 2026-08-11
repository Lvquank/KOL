import { API_BASE_URL } from "@/lib/api";

export interface ApiInfluencerChannel {
  channel_key: string;
  channel_name: string;
  channel_type: "facebook" | "youtube" | "tiktok" | "instagram" | string;
  channel_url: string;
  followers: number | string | null;
  views: number | string | null;
  likes: number | string | null;
  posts_count?: number | null;
  videos_count?: number | null;
}

export interface ApiInfluencerPost {
  post_key: string;
  platform: string;
  title: string;
  thumbnail_url: string | null;
  source_url: string | null;
  views: number | string | null;
  likes: number | string | null;
  published_date: string | null;
  display_order: number;
}

export interface ApiInfluencerMcn {
  sourceId?: string;
  name?: string;
  relationshipType?: string;
}

export interface ApiInfluencerGrowthRanking {
  rank: number;
  score: number | string;
  metric: string;
  growthRate: number | string;
  periodDays: number;
  growthCurrent: number | string;
  interactionGrowth?: number | string | null;
  followersGrowth?: number | string | null;
  viewsGrowth?: number | string | null;
  likesGrowth?: number | string | null;
  avatarUrl?: string | null;
  scrapedAt?: string;
  snapshotKey?: string;
}

export interface ApiInfluencerSourceId {
  source_id: string;
  confidence: number;
  detail_url: string;
  source_system: string;
  influencer_key: string;
  match_method?: string;
}

export interface ApiInfluencerDetailItem {
  influencer_key: string;
  name: string;
  nick_name: string | null;
  gender: string | null;
  identity_verified: boolean;
  source_url: string;
  scraped_at: string;
  avatar_url: string | null;
  source_ids?: ApiInfluencerSourceId[];
  channels?: ApiInfluencerChannel[];
  recent_posts?: ApiInfluencerPost[];
  mcns?: ApiInfluencerMcn[];
  growth_rankings?: ApiInfluencerGrowthRanking[];
  bsi_rankings?: unknown[];
}

type InfluencerSourceResponse = {
  influencer?: { influencer_key?: string };
  influencer_key?: string;
};

export function numberValue(value: number | string | null | undefined): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatCompactNumber(value: number | string | null | undefined): string {
  const numeric = numberValue(value);
  const absolute = Math.abs(numeric);
  const sign = numeric < 0 ? "−" : "";
  if (absolute >= 1_000_000_000) {
    return `${sign}${formatDecimal(absolute / 1_000_000_000)} Tỷ`;
  }
  if (absolute >= 1_000_000) {
    return `${sign}${formatDecimal(absolute / 1_000_000)} Tr`;
  }
  return new Intl.NumberFormat("en-US").format(numeric);
}

function formatDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export function formatDetailDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function normalizeMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  return `https://cdn.netspace.vn/${value.replace(/^\/+/, "")}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`Không thể tải dữ liệu API ${path}:`, error);
    return null;
  }
}

async function fetchInfluencerByKey(key: string): Promise<ApiInfluencerDetailItem | null> {
  return fetchJson<ApiInfluencerDetailItem>(`/influencers/${encodeURIComponent(key)}`);
}

export async function fetchInfluencerDetail(idOrKey: string): Promise<ApiInfluencerDetailItem | null> {
  if (idOrKey.startsWith("kol_")) return fetchInfluencerByKey(idOrKey);

  const source = await fetchJson<InfluencerSourceResponse>(
    `/influencers/source/${encodeURIComponent(idOrKey)}`,
  );
  const key = source?.influencer?.influencer_key || source?.influencer_key;
  return key ? fetchInfluencerByKey(key) : null;
}
