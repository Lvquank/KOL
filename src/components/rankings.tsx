"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Search, Star, TrendingUp, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { featuredPeople, networkRows, peopleRows } from "@/data/content";
import { normalizeMediaUrl } from "@/lib/api-influencer";
import {
  apiGet,
  type ApiListResponse,
  formatCompactMetric,
  formatPercent,
  formatSnapshotDate,
  type GrowthRanking,
  isAbortError
} from "@/lib/api";
import type { RankedNetwork, RankedPerson } from "@/types/content";

type Period = "week" | "month";

const fallbackPeople = [...featuredPeople, ...peopleRows].sort((a, b) => a.rank - b.rank);

function PeriodToggle({ value, onChange, label }: { value: Period; onChange: (value: Period) => void; label: string }) {
  return (
    <div className="period-toggle" aria-label={label}>
      <button type="button" aria-pressed={value === "week"} onClick={() => onChange("week")}>Tuần</button>
      <button type="button" aria-pressed={value === "month"} onClick={() => onChange("month")}>Tháng</button>
    </div>
  );
}

function DataImage({ src, fallback, alt, className }: { src: string | null; fallback: string; alt: string; className?: string }) {
  const resolved = normalizeMediaUrl(src);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const currentSource = resolved && failedSource !== resolved ? resolved : fallback;
  return <img className={className} src={currentSource} alt={alt} onError={() => resolved && setFailedSource(resolved)} />;
}

function mapPeople(rows: GrowthRanking[]): RankedPerson[] {
  return rows.map((row) => ({
    rank: row.rank,
    name: row.entity?.nickName || row.subtitle || row.name,
    legalName: row.entity?.name || row.name,
    image: row.avatar_url || fallbackPeople.find((person) => person.rank === row.rank)?.image || "/assets/kols/ivan.jpg",
    metric: formatCompactMetric(row.growth_current),
    delta: formatPercent(row.growth_rate),
    key: row.entity?.key || row.influencer_key || undefined
  }));
}

function mapNetworks(rows: GrowthRanking[]): RankedNetwork[] {
  return rows.map((row) => {
    const fallback = networkRows.find((network) => network.rank === row.rank);
    const channels = row.entity?.totalChannels ?? 0;
    const kols = row.entity?.totalKols ?? 0;
    return {
      rank: row.rank,
      name: row.name,
      detail: `${channels} kênh · ${kols} KOL`,
      image: row.avatar_url || fallback?.image || "/assets/mcn/vccorp.webp",
      metric: formatCompactMetric(row.growth_current),
      delta: formatPercent(row.growth_rate),
      sourceId: row.entity?.sourceId || row.mcn_source_id || fallback?.sourceId
    };
  });
}

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [peoplePeriod, setPeoplePeriod] = useState<Period>("week");
  const [networkPeriod, setNetworkPeriod] = useState<Period>("week");
  const [peopleApiRows, setPeopleApiRows] = useState<GrowthRanking[]>([]);
  const [networkApiRows, setNetworkApiRows] = useState<GrowthRanking[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [peopleFallback, setPeopleFallback] = useState(false);
  const [networkFallback, setNetworkFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const periodDays = peoplePeriod === "week" ? 7 : 28;
    apiGet<ApiListResponse<GrowthRanking>>(
      `/growth/rankings?entityType=influencer&periodDays=${periodDays}&limit=10`,
      controller.signal
    )
      .then((response) => {
        setPeopleApiRows(response.data);
        setPeopleFallback(false);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setPeopleFallback(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setPeopleLoading(false);
      });
    return () => controller.abort();
  }, [peoplePeriod]);

  useEffect(() => {
    const controller = new AbortController();
    const periodDays = networkPeriod === "week" ? 7 : 28;
    apiGet<ApiListResponse<GrowthRanking>>(
      `/growth/rankings?entityType=owner&periodDays=${periodDays}&limit=10`,
      controller.signal
    )
      .then((response) => {
        setNetworkApiRows(response.data);
        setNetworkFallback(false);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setNetworkFallback(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setNetworkLoading(false);
      });
    return () => controller.abort();
  }, [networkPeriod]);

  const people = useMemo(
    () => (peopleApiRows.length > 0 ? mapPeople(peopleApiRows) : fallbackPeople).slice(0, 10),
    [peopleApiRows]
  );
  const networks = useMemo(
    () => (networkApiRows.length > 0 ? mapNetworks(networkApiRows) : networkRows).slice(0, 10),
    [networkApiRows]
  );
  const featured = [people.find((person) => person.rank === 2), people.find((person) => person.rank === 1), people.find((person) => person.rank === 3)]
    .filter((person): person is RankedPerson => Boolean(person));
  const secondaryPeople = people.filter((person) => person.rank > 3);
  const matchesQuery = (name: string, detail: string) => !query || name.toLowerCase().includes(query) || detail.toLowerCase().includes(query);
  const filteredFeatured = featured.filter((person) => matchesQuery(person.name, person.legalName));
  const filteredPeople = secondaryPeople.filter((person) => matchesQuery(person.name, person.legalName));
  const filteredNetworks = networks.filter((network) => matchesQuery(network.name, network.detail));
  const peopleSnapshot = peopleApiRows[0]?.scraped_at;
  const networkSnapshot = networkApiRows[0]?.scraped_at;

  const changePeoplePeriod = (period: Period) => {
    if (period === peoplePeriod) return;
    setPeopleLoading(true);
    setPeoplePeriod(period);
  };

  const changeNetworkPeriod = (period: Period) => {
    if (period === networkPeriod) return;
    setNetworkLoading(true);
    setNetworkPeriod(period);
  };

  const clearSearch = () => router.replace("/", { scroll: false });
  const notice = "BXH được cập nhật liên tục từ CSDL do KOL và MCN đăng ký. Chủ các trang/kênh chịu trách nhiệm nội dung đăng tải trên trang/kênh của mình.";

  return (
    <>
      <div className="ranking-note">
        <div className="ranking-note-window" aria-label={notice}>
          <div className="ranking-note-track" aria-hidden="true">
            <span>{notice}</span><span>{notice}</span>
          </div>
        </div>
        <div className="ranking-note-cta">
          <strong>Muốn góp mặt trên BXH?</strong>
          <button type="button" disabled>Hãy đăng ký ngay!</button>
        </div>
      </div>

      {query && (
        <div className="search-filter-bar">
          <span><Search size={15} /> Kết quả lọc cho từ khóa: <strong>&ldquo;{query}&rdquo;</strong></span>
          <button type="button" onClick={clearSearch}>Xóa bộ lọc <X size={14} /></button>
        </div>
      )}

      <section className="rankings-grid" aria-label="Bảng xếp hạng tăng trưởng" id="xep-hang">
        <article className="ranking-panel" aria-busy={peopleLoading}>
          <div className="panel-heading">
            <h2>KOL đang được chú ý</h2>
            <PeriodToggle value={peoplePeriod} onChange={changePeoplePeriod} label="Kỳ xếp hạng KOL" />
          </div>
          <p className="snapshot-label">
            {peopleLoading ? "Đang cập nhật dữ liệu…" : peopleFallback ? "Dữ liệu dự phòng · Backend chưa kết nối" : `Ảnh chụp dữ liệu: ${formatSnapshotDate(peopleSnapshot)}`}
          </p>

          {filteredFeatured.length > 0 && (
            <div className="featured-people">
              {filteredFeatured.map((person) => (
                <Link
                  href={`/nguoi-noi-tieng/${person.key || encodeURIComponent(person.name)}`}
                  className="featured-person"
                  key={person.rank}
                >
                  <DataImage className="ranking-image-fill" src={person.image} fallback={fallbackPeople.find((item) => item.rank === person.rank)?.image || "/assets/kols/ivan.jpg"} alt={person.name} />
                  <span className={`rank-badge rank-${person.rank}`}><Star size={10} fill="currentColor" />Top {person.rank}</span>
                  <div className="person-overlay">
                    <h3>{person.name}</h3><p>{person.legalName}</p>
                    <strong>{person.metric} <small><TrendingUp size={10} />{person.delta}</small></strong>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="rank-list" tabIndex={0} aria-label="Danh sách KOL, cuộn để xem thêm">
            {filteredPeople.map((person) => (
              <Link
                href={`/nguoi-noi-tieng/${person.key || encodeURIComponent(person.name)}`}
                className="person-row cursor-pointer"
                key={person.rank}
              >
                <span className="row-rank">{person.rank}</span>
                <DataImage src={person.image} fallback={fallbackPeople.find((item) => item.rank === person.rank)?.image || "/assets/kols/ivan.jpg"} alt={person.name} />
                <div><strong>{person.name}</strong><span>{person.legalName}</span></div>
                <p><small>Tương tác</small><b><TrendingUp size={12} />{person.metric}</b><em>{person.delta}</em></p>
              </Link>
            ))}
            {filteredFeatured.length === 0 && filteredPeople.length === 0 && <div className="empty-search-notice">Không tìm thấy KOL phù hợp với &ldquo;{query}&rdquo;</div>}
          </div>
          <Link className="all-button" href="/top100">Xem tất cả <ArrowRight size={18} strokeWidth={2.25} /></Link>
        </article>

        <article className="ranking-panel network-panel" aria-busy={networkLoading}>
          <div className="panel-heading">
            <h2>Top MCN tăng trưởng</h2>
            <PeriodToggle value={networkPeriod} onChange={changeNetworkPeriod} label="Kỳ xếp hạng MCN" />
          </div>
          <p className="snapshot-label">
            {networkLoading ? "Đang cập nhật dữ liệu…" : networkFallback ? "Dữ liệu dự phòng · Backend chưa kết nối" : `Ảnh chụp dữ liệu: ${formatSnapshotDate(networkSnapshot)}`}
          </p>
          <div className="network-list" tabIndex={0} aria-label="Danh sách MCN, cuộn để xem thêm">
            {filteredNetworks.map((network) => (
              <Link
                href={`/mcn/${encodeURIComponent(network.sourceId || network.name)}`}
                className={`network-row network-${network.rank}`}
                key={network.rank}
              >
                <span>{String(network.rank).padStart(2, "0")}</span>
                <DataImage src={network.image} fallback={networkRows.find((item) => item.rank === network.rank)?.image || "/assets/mcn/vccorp.webp"} alt={network.name} />
                <div><strong>{network.name}</strong><small>{network.detail}</small></div>
                <p><small>Tương tác</small><b><TrendingUp size={12} />{network.metric}</b><em>{network.delta}</em></p>
              </Link>
            ))}
            {filteredNetworks.length === 0 && <div className="empty-search-notice">Không tìm thấy MCN phù hợp với &ldquo;{query}&rdquo;</div>}
          </div>
          <Link className="all-button" href="/mcn">Xem tất cả <ArrowRight size={18} strokeWidth={2.25} /></Link>
        </article>
      </section>
    </>
  );
}

export function Rankings() {
  return <Suspense fallback={null}><RankingsContent /></Suspense>;
}
