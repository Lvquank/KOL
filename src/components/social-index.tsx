"use client";

/* eslint-disable @next/next/no-img-element */

import { CalendarDays, Megaphone, TvMinimal, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { socialItems } from "@/data/content";
import {
  apiGet,
  type ApiListResponse,
  type BsiPeriod,
  type BsiRanking,
  type BsiTab,
  isAbortError
} from "@/lib/api";

const categories: Array<{ label: string; tab: BsiTab; poster: string; icon: LucideIcon }> = [
  { label: "Chiến dịch", tab: "campaign", poster: "CHIẾN DỊCH", icon: Megaphone },
  { label: "Sự kiện", tab: "event", poster: "SỰ KIỆN", icon: CalendarDays },
  { label: "Người ảnh hưởng", tab: "influencer", poster: "NGƯỜI ẢNH HƯỞNG", icon: Users },
  { label: "Chương trình", tab: "show", poster: "CHƯƠNG TRÌNH", icon: TvMinimal }
];

function periodValue(year: number, month: number): string {
  return `${year}-${month}`;
}

function periodLabel(value: string): string {
  if (value === "latest") return "Mới nhất";
  const [year, month] = value.split("-");
  return `Tháng ${month.padStart(2, "0")}/${year}`;
}

function scoreLabel(value: string | number): string {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(numeric)
    : String(value);
}

function SocialAvatar({ src, fallback, name }: { src: string | null; fallback: string; name: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const currentSource = src && failedSource !== src ? src : fallback;
  return <img src={currentSource} alt={name} width={38} height={38} onError={() => src && setFailedSource(src)} />;
}

export function SocialIndex() {
  const [tab, setTab] = useState<BsiTab>("campaign");
  const [selectedPeriod, setSelectedPeriod] = useState("latest");
  const [periods, setPeriods] = useState<BsiPeriod[]>([]);
  const [rankings, setRankings] = useState<BsiRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const activeCategory = categories.find((item) => item.tab === tab) || categories[2];

  useEffect(() => {
    const controller = new AbortController();
    apiGet<{ data: BsiPeriod[] }>(`/bsi/periods?tab=${tab}`, controller.signal)
      .then((response) => {
        setPeriods(response.data);
        const latest = response.data[0];
        if (latest) {
          setLoading(true);
          setSelectedPeriod(periodValue(latest.year, latest.month));
        }
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setPeriods([]);
      });
    return () => controller.abort();
  }, [tab]);

  useEffect(() => {
    const controller = new AbortController();
    const [year, month] = selectedPeriod === "latest" ? [] : selectedPeriod.split("-");
    const periodQuery = year && month ? `&year=${year}&month=${month}` : "";
    apiGet<ApiListResponse<BsiRanking>>(`/bsi/rankings?tab=${tab}${periodQuery}&limit=10`, controller.signal)
      .then((response) => {
        setRankings(response.data);
        setUsingFallback(false);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setUsingFallback(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedPeriod, tab]);

  const displayItems = useMemo(() => {
    if (rankings.length > 0) {
      return rankings.slice(0, 10).map((item) => ({
        rank: item.rank,
        name: item.name,
        score: scoreLabel(item.score),
        scoreValue: Number(item.score) || 0,
        image: item.image_url,
        influencerKey: item.influencer_key,
        fallback: socialItems.find((fallbackItem) => fallbackItem.rank === item.rank)?.image || "/assets/social/son-tung.jpg"
      }));
    }
    return socialItems.slice(0, 10).map((item) => ({
      ...item,
      scoreValue: Number(String(item.score).replace(/\./g, "")) || 0,
      image: item.image,
      influencerKey: item.key || null,
      fallback: item.image
    }));
  }, [rankings]);

  const maxScore = Math.max(...displayItems.map((item) => item.scoreValue), 1);

  const changeCategory = (nextTab: BsiTab) => {
    setLoading(true);
    setTab(nextTab);
    setSelectedPeriod("latest");
  };

  const changePeriod = (value: string) => {
    setLoading(true);
    setSelectedPeriod(value);
  };

  return (
    <section className="social-section" aria-busy={loading}>
      <div className="social-heading">
        <div><h2>Top10 <span>Chỉ số ảnh hưởng</span> trên Social Media</h2>{usingFallback && <small className="api-fallback-label">Đang hiển thị dữ liệu dự phòng</small>}</div>
        <select aria-label="Tháng xếp hạng BSI" value={selectedPeriod} onChange={(event) => changePeriod(event.target.value)}>
          {selectedPeriod === "latest" && <option value="latest">Kỳ mới nhất</option>}
          {periods.map((period) => <option value={periodValue(period.year, period.month)} key={periodValue(period.year, period.month)}>{periodLabel(periodValue(period.year, period.month))}</option>)}
        </select>
      </div>
      <div className="social-layout">
        <nav className="category-tabs" aria-label="Loại bảng xếp hạng BSI">
          {categories.map((item) => {
            const Icon = item.icon;
            return <button type="button" key={item.tab} aria-pressed={item.tab === tab} onClick={() => changeCategory(item.tab)}><Icon size={16} />{item.label}</button>;
          })}
        </nav>
        <div className="social-chart-card">
          <div className="social-chart-title">
            <span>TOP10 {activeCategory.poster}</span>
            <h3>10 {activeCategory.poster} NỔI BẬT TRÊN SOCIAL MEDIA</h3>
            <p>{periodLabel(selectedPeriod)}</p>
          </div>
          <div className="social-chart-scroll">
            <div className="social-chart-frame">
              <strong className="social-chart-axis">CHỈ SỐ ẢNH HƯỞNG XÃ HỘI (BSI)</strong>
              <ol
                className="social-chart"
                key={`${tab}-${selectedPeriod}`}
                aria-label={`Top 10 ${activeCategory.label}`}
                style={{ gridTemplateColumns: `repeat(${displayItems.length}, minmax(68px, 1fr))` }}
              >
                {displayItems.map((item, index) => {
                  const height = 16 + (item.scoreValue / maxScore) * 62;
                  const chartStyle = {
                    "--bar-height": `${height}%`,
                    "--bar-delay": `${index * 70}ms`
                  } as CSSProperties;
                  const itemContent = (
                    <>
                      <div className="social-bar-stage">
                        <div className="social-bar-meta">
                          <SocialAvatar src={item.image} fallback={item.fallback} name={item.name} />
                          <b>{item.score}</b>
                        </div>
                        <div className="social-bar" aria-hidden="true" />
                      </div>
                      <strong title={item.name}>{item.name}</strong>
                    </>
                  );
                  const detailHref = tab === "influencer" && item.influencerKey
                    ? `/nguoi-noi-tieng/${encodeURIComponent(item.influencerKey)}`
                    : null;
                  return (
                    <li key={`${tab}-${item.rank}`} style={chartStyle}>
                      {detailHref ? (
                        <Link className="social-chart-item-link" href={detailHref} aria-label={`Xem chi tiết ${item.name}`}>
                          {itemContent}
                        </Link>
                      ) : (
                        <div className="social-chart-item-link">{itemContent}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <p className="buzzmetrics">Được cung cấp dữ liệu từ <strong>Buzzmetrics BSI</strong></p>
    </section>
  );
}
