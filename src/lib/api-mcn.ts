import { API_BASE_URL } from "@/lib/api";

export interface ApiMcnFeaturedChannel {
  rank: number;
  name: string;
  platform: string;
  channel_url: string;
  avatar_url: string | null;
  interaction_value: number | string | null;
  growth_rate: number | string | null;
}

export interface ApiMcnFeaturedInfluencer {
  rank: number;
  influencer_source_id: string;
  name: string;
  subtitle: string | null;
  profile_url: string;
  avatar_url: string | null;
  interaction_value: number | string;
  growth_rate: number | string;
  observed_at: string;
}

export interface ApiMcnGrowthRanking {
  snapshotKey: string;
  periodDays: number;
  rank: number;
  metric: string;
  growthCurrent: number | string | null;
  growthPrevious: number | string | null;
  growthChange: number | string | null;
  growthRate: number | string | null;
  score: number | string | null;
  interactionGrowth?: number | string | null;
  followersGrowth?: number | string | null;
  viewsGrowth?: number | string | null;
  likesGrowth?: number | string | null;
  avatarUrl?: string | null;
  scrapedAt: string;
}

export interface ApiMcnDetailItem {
  source_id: string;
  name: string;
  subtitle: string | null;
  avatar_url: string | null;
  platforms: string[];
  channels_by_type: Record<string, number>;
  total_channels: number;
  total_kols: number;
  total_interactions: number | string | null;
  total_views: number | string | null;
  total_likes: number | string | null;
  scraped_at: string;
  featured_influencers?: ApiMcnFeaturedInfluencer[];
  featured_channels?: ApiMcnFeaturedChannel[];
  growth_rankings?: ApiMcnGrowthRanking[];
}

export async function fetchMcnDetail(sourceId: string): Promise<ApiMcnDetailItem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/mcns/${encodeURIComponent(sourceId)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as ApiMcnDetailItem;
  } catch (error) {
    console.warn(`Không thể tải dữ liệu MCN ${sourceId}:`, error);
    return null;
  }
}
