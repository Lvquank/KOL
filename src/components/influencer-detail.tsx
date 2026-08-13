/* eslint-disable @next/next/no-img-element */

import {
  Activity,
  BarChart3,
  ExternalLink,
  Globe,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  ContributionCard,
  DETAIL_CARD,
  DetailStats,
  PlatformIcon,
  type DetailStat,
} from "@/components/detail-shared";
import { RecentPostsPagination } from "@/components/recent-posts-pagination";
import {
  formatCompactNumber,
  normalizeMediaUrl,
  numberValue,
  type ApiInfluencerChannel,
  type ApiInfluencerDetailItem,
} from "@/lib/api-influencer";

interface InfluencerDetailProps {
  influencer: ApiInfluencerDetailItem;
}

function channelHandle(channel: ApiInfluencerChannel): string {
  try {
    const path = new URL(channel.channel_url).pathname.replace(/\/$/, "");
    return decodeURIComponent(path.split("/").filter(Boolean).pop() || channel.channel_name).replace(/^@/, "");
  } catch {
    return channel.channel_name;
  }
}

function channelSecondaryMetric(channel: ApiInfluencerChannel) {
  if (channel.channel_type === "facebook" && channel.posts_count) {
    return { value: new Intl.NumberFormat("en-US").format(channel.posts_count), label: "Bài viết" };
  }
  if (channel.channel_type === "youtube" && channel.videos_count) {
    return { value: new Intl.NumberFormat("en-US").format(channel.videos_count), label: "Video" };
  }
  if (numberValue(channel.views) > 0) {
    return { value: formatCompactNumber(channel.views), label: "Lượt xem kênh" };
  }
  if (numberValue(channel.likes) > 0) {
    return { value: formatCompactNumber(channel.likes), label: "Lượt thích" };
  }
  return null;
}

export function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  const channels = influencer.channels || [];
  const posts = (influencer.recent_posts || []).filter(
    (post) => post.platform.toLowerCase() === "youtube" || /(?:youtube\.com|youtu\.be)/i.test(post.source_url || ""),
  );
  const latestGrowth =
    influencer.growth_rankings?.find((item) => Number(item.periodDays) === 7) ||
    influencer.growth_rankings?.[0];
  const followers = channels.reduce((sum, item) => sum + numberValue(item.followers), 0);
  const channelViews = channels.reduce((sum, item) => sum + numberValue(item.views), 0);
  const channelLikes = channels.reduce((sum, item) => sum + numberValue(item.likes), 0);
  const avatar =
    normalizeMediaUrl(influencer.avatar_url) ||
    normalizeMediaUrl(latestGrowth?.avatarUrl) ||
    "/assets/detail/ben-eagle.jpg";
  const stats: DetailStat[] = [
    {
      label: "Tổng tương tác",
      value: formatCompactNumber(latestGrowth?.interactionGrowth ?? latestGrowth?.growthCurrent),
      icon: Activity,
    },
    { label: "Người theo dõi", value: formatCompactNumber(followers), icon: Users },
    {
      label: "Lượt xem bài",
      value: formatCompactNumber(latestGrowth?.viewsGrowth ?? channelViews),
      icon: BarChart3,
    },
    {
      label: "Lượt thích",
      value: formatCompactNumber(latestGrowth?.likesGrowth ?? channelLikes),
      icon: Heart,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[1140px] mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-5 lg:items-start">
          <div className="flex flex-col gap-4 sm:gap-5">
            <section className={DETAIL_CARD}>
              <div className="relative h-[120px] overflow-hidden bg-gray-200">
                <img src="/assets/detail/banner.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="px-6 relative">
                <div className="relative -mt-[52px] sm:-mt-[60px] inline-block">
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                    <img alt={influencer.name} src={avatar} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              </div>
              <div className="px-6 pt-3 pb-6">
                <h1 className="font-extrabold text-gray-900 leading-tight text-[20px]">
                  {influencer.name}
                  {influencer.nick_name ? (
                    <span className="font-normal text-gray-400 text-[15px] ml-2">({influencer.nick_name})</span>
                  ) : null}
                </h1>
                <p className="text-gray-500 text-[14px] mt-1.5">KOL / Influencer</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold ${
                      influencer.identity_verified
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-blue-50 border-blue-100 text-blue-600"
                    }`}
                  >
                    {influencer.identity_verified ? (
                      <Globe className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    {influencer.identity_verified ? "Đang hiển thị" : "Đã xác minh"}
                  </span>
                </div>
              </div>
            </section>

            <section className={DETAIL_CARD}>
              <div className="px-6 py-5">
                <h2 className="font-extrabold text-gray-900 text-[16px] mb-4">Kênh social</h2>
                <div className="flex flex-col gap-3">
                  {channels.map((channel) => {
                    const secondary = channelSecondaryMetric(channel);
                    return (
                      <a
                        key={channel.channel_key}
                        href={channel.channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded-[4px] px-4 py-3.5 flex items-center gap-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                      >
                        <PlatformIcon platform={channel.channel_type} />
                        <span className="flex-1 min-w-0 self-center">
                          <strong className="block font-extrabold text-gray-900 leading-tight text-[12px] truncate">
                            {channel.channel_name}
                          </strong>
                          <span className="block text-gray-400 text-[12px] mt-0.5 truncate">@{channelHandle(channel)}</span>
                        </span>
                        <span className="ml-auto flex items-center gap-3 overflow-hidden">
                          <span className="flex flex-col items-end min-w-0 sm:hidden">
                            <strong className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                              {formatCompactNumber(channel.followers)}
                            </strong>
                            <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                              {channel.channel_type === "youtube" ? "Người đăng ký" : "Người theo dõi"}
                            </span>
                          </span>
                          <span className="hidden sm:flex items-center gap-4">
                            <span className="flex flex-col min-w-0">
                              <strong className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                {formatCompactNumber(channel.followers)}
                              </strong>
                              <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                                {channel.channel_type === "youtube" ? "Người đăng ký" : "Người theo dõi"}
                              </span>
                            </span>
                            {numberValue(channel.views) > 0 ? (
                              <span className="flex flex-col min-w-0">
                                <strong className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                  {formatCompactNumber(channel.views)}
                                </strong>
                                <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">Lượt xem kênh</span>
                              </span>
                            ) : null}
                            {secondary ? (
                              <span className="flex flex-col min-w-0">
                                <strong className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                  {secondary.value}
                                </strong>
                                <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">{secondary.label}</span>
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-gray-500" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>

            {posts.length > 0 ? (
              <section className={DETAIL_CARD}>
                <div className="px-4 pt-5 pb-4 flex items-center gap-2">
                  <h2 className="font-extrabold text-gray-900 text-[16px]">Nội dung đăng mới nhất</h2>
                  <span className="ml-auto text-[11px] text-gray-400">Dữ liệu gần nhất</span>
                </div>
                <div className="px-4 pt-0 pb-5">
                  <RecentPostsPagination posts={posts} />
                </div>
              </section>
            ) : null}

            <div className="lg:hidden bg-white border-y sm:border sm:rounded-[4px] border-gray-200 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-6">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-4">Số liệu nổi bật</h3>
              <DetailStats items={stats} />
            </div>
            <div className="lg:hidden mb-6 px-4 sm:px-0">
              <ContributionCard entity="KOL" entityName={influencer.name} entityKey={influencer.influencer_key} />
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-4 sticky top-16 self-start">
            <div className="bg-white rounded-[4px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-4">Số liệu nổi bật</h3>
              <DetailStats items={stats} />
            </div>
            <ContributionCard entity="KOL" entityName={influencer.name} entityKey={influencer.influencer_key} />
          </aside>
        </div>
      </div>
    </main>
  );
}
