"use client";

import {
  Activity,
  BarChart3,
  Clock,
  ExternalLink,
  Heart,
  Info,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  formatCompactNumber,
  type ApiInfluencerDetailItem,
  type ApiInfluencerChannel,
} from "@/lib/api-influencer";

interface InfluencerDetailProps {
  influencer: ApiInfluencerDetailItem;
}

function ChannelIcon({ type }: { type: string }) {
  if (type === "tiktok") {
    return (
      <div
        className="w-11 h-11 rounded-[4px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#010101" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
        </svg>
      </div>
    );
  }
  if (type === "facebook") {
    return (
      <div
        className="w-11 h-11 rounded-[4px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#1877F2" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      </div>
    );
  }
  if (type === "youtube") {
    return (
      <div
        className="w-11 h-11 rounded-[4px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#FF0000" }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-11 h-11 rounded-[4px] flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: "#E4405F" }}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    </div>
  );
}

export function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  const channels: ApiInfluencerChannel[] = influencer.channels || [];
  const avatar =
    influencer.avatar_url ||
    "https://cdn.netspace.vn/kols/kols/youtube/uclya28-01x4z60ewq2kinba.jpg";

  // Calculate aggregated stats across channels
  const totalFollowers = channels.reduce(
    (acc, c) => acc + (c.followers || 0),
    0
  );
  const totalViews = channels.reduce((acc, c) => acc + (c.views || 0), 0);
  const totalLikes = channels.reduce((acc, c) => acc + (c.likes || 0), 0);

  const displayFollowers =
    totalFollowers > 0
      ? formatCompactNumber(totalFollowers)
      : formatCompactNumber(influencer.followers_total || "32.9 Tr");

  const displayViews =
    totalViews > 0
      ? formatCompactNumber(totalViews)
      : formatCompactNumber(influencer.views_total || "951.3 Tr");

  const displayLikes =
    totalLikes > 0
      ? formatCompactNumber(totalLikes)
      : formatCompactNumber(influencer.likes_total || "45.3 Tr");

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[1140px] mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-5 lg:items-start">
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Header Profile Card */}
            <div className="bg-white sm:rounded-[4px] border-y sm:border border-gray-200 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <div className="relative h-[120px] sm:h-[120px] overflow-hidden bg-gray-200">
                <img
                  src="https://cdn.netspace.vn/kol/assets/images/banner-kol-2-4x-1778057065044.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="px-6 relative">
                <div className="relative -mt-[52px] sm:-mt-[60px] inline-block">
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border-4 border-white overflow-hidden shadow-md bg-white flex-shrink-0">
                    <img
                      alt={influencer.name}
                      src={avatar}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 pt-3 pb-6">
                <h1 className="font-extrabold text-gray-900 leading-tight text-[20px]">
                  {influencer.name}
                  {influencer.nick_name && (
                    <span className="font-normal text-gray-400 text-[15px] ml-2">
                      ({influencer.nick_name})
                    </span>
                  )}
                </h1>
                <p className="text-gray-500 text-[14px] mt-1.5">
                  KOL / Influencer
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {influencer.identity_verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold bg-emerald-50 border-emerald-100 text-emerald-600">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      Đã xác minh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold bg-amber-50 border-amber-100 text-amber-600">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      Đang chờ xác minh
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="bg-white sm:rounded-[4px] border-y sm:border border-gray-200 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
              <div className="px-6 py-5">
                <h2 className="font-extrabold text-gray-900 text-[16px] mb-4">
                  Kênh social
                </h2>
                <div className="flex flex-col gap-3">
                  {channels.map((chn) => {
                    const handle = chn.channel_url
                      .split("/")
                      .pop()
                      ?.replace(/^@/, "");

                    let postCountLabel = "";
                    let postCountVal = "";
                    if (chn.channel_type === "tiktok") {
                      postCountLabel = "Video";
                      postCountVal = "134";
                    } else if (chn.channel_type === "facebook") {
                      postCountLabel = "Bài viết";
                      postCountVal = "276";
                    } else if (chn.channel_type === "youtube") {
                      postCountLabel = "Video";
                      postCountVal = "222";
                    }

                    return (
                      <a
                        key={chn.channel_key || chn.channel_url}
                        href={chn.channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="border border-gray-200 rounded-[4px] px-4 py-3.5 flex items-center gap-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                          <ChannelIcon type={chn.channel_type} />
                          <div className="flex-1 min-w-0 self-center">
                            <p className="font-extrabold text-gray-900 leading-tight text-[12px] truncate">
                              {chn.channel_name}
                            </p>
                            <p className="text-gray-400 text-[12px] mt-0.5 truncate">
                              @{handle || chn.channel_name}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-3 overflow-hidden">
                            <div className="hidden sm:flex items-center gap-4">
                              <div className="flex flex-col min-w-0">
                                <span className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                  {formatCompactNumber(chn.followers)}
                                </span>
                                <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                                  {chn.channel_type === "youtube"
                                    ? "Người đăng ký"
                                    : "Người theo dõi"}
                                </span>
                              </div>

                              {chn.likes > 0 && (
                                <div className="flex flex-col min-w-0">
                                  <span className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                    {formatCompactNumber(chn.likes)}
                                  </span>
                                  <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                                    Lượt thích
                                  </span>
                                </div>
                              )}

                              {chn.views > 0 && (
                                <div className="flex flex-col min-w-0">
                                  <span className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                    {formatCompactNumber(chn.views)}
                                  </span>
                                  <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                                    Lượt xem kênh
                                  </span>
                                </div>
                              )}

                              {postCountVal && (
                                <div className="flex flex-col min-w-0">
                                  <span className="font-extrabold text-gray-900 leading-tight whitespace-nowrap text-[12px]">
                                    {postCountVal}
                                  </span>
                                  <span className="text-gray-400 text-[11px] mt-0.5 whitespace-nowrap">
                                    {postCountLabel}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-16 self-start">
            <div className="bg-white rounded-[4px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-4">
                Số liệu nổi bật
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-[4px] p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Tổng tương tác</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-[18px] leading-tight">
                    46.9 Tr
                  </p>
                </div>
                <div className="bg-gray-50 rounded-[4px] p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Người theo dõi</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-[18px] leading-tight">
                    {displayFollowers}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-[4px] p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Lượt xem bài</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-[18px] leading-tight">
                    {displayViews}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-[4px] p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Lượt thích</span>
                  </div>
                  <p className="font-extrabold text-gray-900 text-[18px] leading-tight">
                    {displayLikes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[4px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 flex flex-col text-center gap-3">
              <Info className="w-7 h-7 text-primary self-start" />
              <h3 className="font-extrabold text-gray-900 text-[14px] text-left">
                Bạn cần bổ sung thông tin của KOL này?
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed text-left">
                Nếu bạn có thông tin hữu ích về KOL này còn thiếu trên hệ thống,
                hãy gửi đề xuất để cộng đồng cùng đóng góp xây dựng cơ sở dữ liệu
                quốc gia.
              </p>
              <button
                type="button"
                className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-[4px] transition-colors"
              >
                Gửi đề xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
