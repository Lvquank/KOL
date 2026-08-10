"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Star, TrendingUp, X, Search } from "lucide-react";
import { useState, Suspense } from "react";
import { featuredPeople, networkRows, peopleRows } from "@/data/content";

function PeriodToggle({ value, onChange }: { value: "week" | "month"; onChange: (value: "week" | "month") => void }) {
  return (
    <div className="period-toggle">
      <button type="button" aria-pressed={value === "week"} onClick={() => onChange("week")}>
        Tuần
      </button>
      <button type="button" aria-pressed={value === "month"} onClick={() => onChange("month")}>
        Tháng
      </button>
    </div>
  );
}

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const [peoplePeriod, setPeoplePeriod] = useState<"week" | "month">("week");
  const [networkPeriod, setNetworkPeriod] = useState<"week" | "month">("week");

  // Filter creator rows if search query is set
  const filteredFeatured = query
    ? featuredPeople.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.legalName.toLowerCase().includes(query)
      )
    : featuredPeople;

  const filteredPeople = query
    ? peopleRows.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.legalName.toLowerCase().includes(query)
      )
    : peopleRows;

  // Filter MCN network rows if search query is set
  const filteredNetworks = query
    ? networkRows.filter(
        (n) =>
          n.name.toLowerCase().includes(query) ||
          n.detail.toLowerCase().includes(query)
      )
    : networkRows;

  const clearSearch = () => {
    router.replace("/", { scroll: false });
  };

  return (
    <>
      <div className="ranking-note">
        <span>
          BXH được cập nhật liên tục từ CSDL do KOL và MCN đăng ký. Chủ các trang/kênh chịu trách nhiệm nội dung đăng tải trên trang/kênh của mình.
        </span>
        <strong>Muốn góp mặt trên BXH?</strong>
        <button type="button" disabled>
          Hãy đăng ký ngay!
        </button>
      </div>

      {query && (
        <div className="search-filter-bar">
          <span>
            <Search size={15} /> Kết quả lọc cho từ khóa: <strong>&ldquo;{query}&rdquo;</strong>
          </span>
          <button type="button" onClick={clearSearch}>
            Xóa bộ lọc <X size={14} />
          </button>
        </div>
      )}

      <section className="rankings-grid" aria-label="Bảng xếp hạng tĩnh" id="xep-hang">
        <article className="ranking-panel">
          <div className="panel-heading">
            <h2>KOL đang được chú ý</h2>
            <PeriodToggle value={peoplePeriod} onChange={setPeoplePeriod} />
          </div>
          <p className="snapshot-label">Ảnh chụp dữ liệu: {peoplePeriod === "week" ? "Tuần" : "Tháng"}</p>
          
          {filteredFeatured.length > 0 && (
            <div className="featured-people">
              {filteredFeatured.map((person) => (
                <div className="featured-person" key={person.rank}>
                  <Image src={person.image} alt={person.name} fill sizes="190px" />
                  <span className={`rank-badge rank-${person.rank}`}>
                    <Star size={10} fill="currentColor" />Top {person.rank}
                  </span>
                  <div className="person-overlay">
                    <h3>{person.name}</h3>
                    <p>{person.legalName}</p>
                    <strong>
                      {person.metric} <small><TrendingUp size={10} />{person.delta}</small>
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rank-list">
            {filteredPeople.map((person) => (
              <div className="person-row" key={person.rank}>
                <span className="row-rank">{person.rank}</span>
                <Image src={person.image} alt={person.name} width={40} height={40} />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.legalName}</span>
                </div>
                <p>
                  <small>Tương tác</small>
                  <b><TrendingUp size={12} />{person.metric}</b>
                  <em>{person.delta}</em>
                </p>
              </div>
            ))}
            {filteredFeatured.length === 0 && filteredPeople.length === 0 && (
              <div className="empty-search-notice">Không tìm thấy KOL phù hợp với &ldquo;{query}&rdquo;</div>
            )}
          </div>
          <button type="button" className="all-button" disabled>
            Xem tất cả <ArrowRight size={18} strokeWidth={2.25} />
          </button>
        </article>

        <article className="ranking-panel network-panel">
          <div className="panel-heading">
            <h2>Top MCN tăng trưởng</h2>
            <PeriodToggle value={networkPeriod} onChange={setNetworkPeriod} />
          </div>
          <p className="snapshot-label">Ảnh chụp dữ liệu: {networkPeriod === "week" ? "Tuần" : "Tháng"}</p>
          <div className="network-list">
            {filteredNetworks.map((network) => (
              <div className={`network-row network-${network.rank}`} key={network.rank}>
                <span>{String(network.rank).padStart(2, "0")}</span>
                <Image src={network.image} alt={network.name} width={48} height={48} />
                <div>
                  <strong>{network.name}</strong>
                  <small>{network.detail}</small>
                </div>
                <p>
                  <small>Tương tác</small>
                  <b><TrendingUp size={12} />{network.metric}</b>
                  <em>{network.delta}</em>
                </p>
              </div>
            ))}
            {filteredNetworks.length === 0 && (
              <div className="empty-search-notice">Không tìm thấy MCN phù hợp với &ldquo;{query}&rdquo;</div>
            )}
          </div>
          <button type="button" className="all-button" disabled>
            Xem tất cả <ArrowRight size={18} strokeWidth={2.25} />
          </button>
        </article>
      </section>
    </>
  );
}

export function Rankings() {
  return (
    <Suspense fallback={null}>
      <RankingsContent />
    </Suspense>
  );
}
