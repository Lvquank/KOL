/* eslint-disable @next/next/no-img-element */

import { Activity, BarChart3, Heart, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import {
  ContributionCard,
  DETAIL_CARD,
  DetailStats,
  PlatformIcon,
  type DetailStat,
} from "@/components/detail-shared";
import { formatCompactNumber, normalizeMediaUrl } from "@/lib/api-influencer";
import type {
  ApiMcnDetailItem,
  ApiMcnFeaturedChannel,
  ApiMcnFeaturedInfluencer,
} from "@/lib/api-mcn";

interface McnDetailProps {
  mcn: ApiMcnDetailItem;
}

const PLATFORM_META: Record<string, { label: string; color: string }> = {
  facebook: { label: "Facebook", color: "#1877F2" },
  youtube: { label: "YouTube", color: "#FF0000" },
  tiktok: { label: "TikTok", color: "#010101" },
  instagram: { label: "Instagram", color: "#E4405F" },
};

function PlatformLabel({ platform }: { platform: string }) {
  const normalized = platform.toLowerCase();
  const meta = PLATFORM_META[normalized] || { label: platform, color: "#111827" };
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium truncate" style={{ color: meta.color }}>
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function rankClass(rank: number): string {
  if (rank === 1) return "bg-[#FFB800] text-white";
  if (rank === 2) return "bg-[#A8A8A8] text-white";
  if (rank === 3) return "bg-[#B87333] text-white";
  return "bg-gray-100 text-gray-500";
}

function FeaturedChannelRow({ channel }: { channel: ApiMcnFeaturedChannel }) {
  const growth = Math.abs(Number(channel.growth_rate ?? 0));
  return (
    <li>
      <a
        href={channel.channel_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors px-1"
      >
        <span className="flex-shrink-0 w-8 flex items-center justify-center">
          <span className={`font-semibold text-[12px] w-7 h-7 flex items-center justify-center rounded-full ${rankClass(channel.rank)}`}>
            {channel.rank}
          </span>
        </span>
        {normalizeMediaUrl(channel.avatar_url) ? (
          <img
            alt={channel.name}
            src={normalizeMediaUrl(channel.avatar_url) || ""}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
          />
        ) : (
          <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-500">
            {channel.name.slice(0, 1)}
          </span>
        )}
        <span className="flex flex-col min-w-0 flex-1">
          <strong className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
            {channel.name}
          </strong>
          <PlatformLabel platform={channel.platform} />
        </span>
        <span className="flex-shrink-0 text-right">
          <span className="block text-[10px] text-gray-400">Tương tác</span>
          <span className="flex items-center gap-1.5">
            <strong className="font-bold text-gray-900 text-[12px]">{formatCompactNumber(channel.interaction_value)}</strong>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
              <TrendingUp className="w-3 h-3" />
              {growth.toFixed(1)}%
            </span>
          </span>
        </span>
      </a>
    </li>
  );
}

function FeaturedInfluencerRow({ influencer }: { influencer: ApiMcnFeaturedInfluencer }) {
  const growth = Math.abs(Number(influencer.growth_rate ?? 0));
  const avatar = normalizeMediaUrl(influencer.avatar_url);
  return (
    <li>
      <Link
        href={influencer.profile_url}
        className="group flex items-center gap-2.5 border-b border-gray-50 px-1 py-2.5 transition-colors last:border-0 hover:bg-gray-50/80"
      >
        <span className="flex w-8 flex-shrink-0 items-center justify-center">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold ${rankClass(influencer.rank)}`}>
            {influencer.rank}
          </span>
        </span>
        {avatar ? (
          <img
            alt={influencer.name}
            src={avatar}
            className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-100 object-cover shadow-sm"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-gray-500">
            {influencer.name.slice(0, 1)}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <strong className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary">
            {influencer.name}
          </strong>
          <span className="truncate text-[11px] text-gray-400">{influencer.subtitle || influencer.name}</span>
        </span>
        <span className="flex-shrink-0 text-right">
          <span className="block text-[10px] text-gray-400">Tương tác</span>
          <span className="flex items-center gap-1.5">
            <strong className="text-[12px] font-bold text-gray-900">{formatCompactNumber(influencer.interaction_value)}</strong>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              {growth.toFixed(1)}%
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

function nonNegative(value: number | string | null | undefined): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? Math.abs(numeric) : 0;
}

export function McnDetail({ mcn }: McnDetailProps) {
  const totalChannels = nonNegative(mcn.total_channels);
  const preferredPlatforms = ["facebook", "youtube", "tiktok", "instagram"];
  const platformEntries = Object.entries(mcn.channels_by_type || {})
    .filter(([, count]) => Number(count) > 0)
    .sort(([a], [b]) => preferredPlatforms.indexOf(a) - preferredPlatforms.indexOf(b));
  const latestGrowth =
    mcn.growth_rankings?.find((item) => Number(item.periodDays) === 7) || mcn.growth_rankings?.[0];
  const avatar = normalizeMediaUrl(mcn.avatar_url) || normalizeMediaUrl(latestGrowth?.avatarUrl) || "/assets/detail/vccorp.webp";
  const stats: DetailStat[] = [
    { label: "Số kênh quản lý", value: `${totalChannels} Kênh`, icon: Users },
    {
      label: "Tổng tương tác",
      value: formatCompactNumber(nonNegative(mcn.total_interactions ?? latestGrowth?.interactionGrowth ?? latestGrowth?.growthCurrent)),
      icon: Activity,
    },
    { label: "Lượt xem", value: formatCompactNumber(nonNegative(mcn.total_views ?? latestGrowth?.viewsGrowth)), icon: BarChart3 },
    { label: "Lượt thích", value: formatCompactNumber(nonNegative(mcn.total_likes ?? latestGrowth?.likesGrowth)), icon: Heart },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[1140px] mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-5 lg:items-start">
          <div className="flex flex-col gap-4 sm:gap-5">
            <section className={DETAIL_CARD}>
              <div className="relative h-[120px] overflow-hidden bg-gray-200">
                <img src="/assets/detail/banner.webp" alt="" className="w-full h-[120px] object-cover" />
              </div>
              <div className="px-6 relative">
                <div className="relative -mt-[52px] sm:-mt-[60px] inline-block">
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-[4px] border-4 border-white overflow-hidden shadow-md bg-white">
                    <img alt={mcn.name} src={avatar} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="px-6 pt-3 pb-6">
                <h1 className="font-extrabold text-gray-900 leading-tight text-[20px]">
                  {mcn.name}
                  {mcn.subtitle ? <span className="font-normal text-gray-400 ml-1.5 text-[15px]">({mcn.subtitle})</span> : null}
                </h1>
                <p className="text-gray-500 text-[14px] mt-1.5">Mạng lưới sáng tạo nội dung (MCN)</p>
              </div>
            </section>

            <section className={DETAIL_CARD}>
              <div className="px-6 py-5">
                <h2 className="font-extrabold text-gray-900 text-[16px] mb-4">Kênh theo nền tảng</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex rounded-full overflow-hidden h-2 gap-[2px]" aria-label="Phân bổ kênh theo nền tảng">
                    {platformEntries.map(([platform, count]) => (
                      <span
                        key={platform}
                        className="h-full rounded-full"
                        style={{
                          width: `${totalChannels > 0 ? (Number(count) / totalChannels) * 100 : 0}%`,
                          backgroundColor: PLATFORM_META[platform]?.color || "#9ca3af",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {platformEntries.map(([platform, count]) => {
                      const meta = PLATFORM_META[platform] || { label: platform, color: "#9ca3af" };
                      const percent = totalChannels > 0 ? Math.round((Number(count) / totalChannels) * 100) : 0;
                      return (
                        <div
                          key={platform}
                          className="flex-1 min-w-0 border border-gray-100 rounded-[4px] p-3 flex flex-col items-center gap-2 hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                          <PlatformIcon platform={platform} circular size="small" />
                          <p className="font-extrabold text-gray-900 text-[20px] leading-none tabular-nums">{count}</p>
                          <p className="text-gray-400 text-[11px] leading-none whitespace-nowrap">Kênh {meta.label}</p>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                          >
                            {percent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {(mcn.featured_influencers || []).length > 0 ? (
              <section className={DETAIL_CARD}>
                <div className="px-4 py-5">
                  <h2 className="text-[16px] font-extrabold text-gray-900">Top 10 KOL nổi bật theo tuần</h2>
                  <p className="mb-4 text-[12px] text-gray-400">KOL tiêu biểu đang hợp tác với {mcn.name}</p>
                  <ol className="flex flex-col">
                    {(mcn.featured_influencers || []).map((influencer) => (
                      <FeaturedInfluencerRow
                        key={`${influencer.rank}-${influencer.influencer_source_id}`}
                        influencer={influencer}
                      />
                    ))}
                  </ol>
                </div>
              </section>
            ) : null}

            <section className={DETAIL_CARD}>
              <div className="px-4 py-5">
                <h2 className="font-extrabold text-gray-900 text-[16px]">Top 10 Kênh nổi bật tuần</h2>
                <p className="text-[12px] text-gray-400 mb-4">Các kênh có lượt tương tác tăng trưởng mạnh nhất trong 7 ngày qua</p>
                <ol className="flex flex-col">
                  {(mcn.featured_channels || []).map((channel) => (
                    <FeaturedChannelRow key={`${channel.rank}-${channel.channel_url}`} channel={channel} />
                  ))}
                </ol>
              </div>
            </section>

            <div className="lg:hidden bg-white border-y sm:border sm:rounded-[4px] border-gray-200 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-6">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-4">Số liệu nổi bật</h3>
              <DetailStats items={stats} />
            </div>
            <div className="lg:hidden mb-6 px-4 sm:px-0">
              <ContributionCard entity="MCN" entityName={mcn.name} entityKey={mcn.source_id} />
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-4 self-start lg:sticky lg:top-4">
            <div className="bg-white rounded-[4px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-4">Số liệu nổi bật</h3>
              <DetailStats items={stats} />
            </div>
            <ContributionCard entity="MCN" entityName={mcn.name} entityKey={mcn.source_id} />
          </aside>
        </div>
      </div>
    </main>
  );
}
