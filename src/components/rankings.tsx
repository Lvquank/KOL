"use client";

import Image from "next/image";
import { Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { featuredPeople, networkRows, peopleRows } from "@/data/content";

function PeriodToggle({ value, onChange }: { value: "week" | "month"; onChange: (value: "week" | "month") => void }) {
  return <div className="period-toggle"><button type="button" aria-pressed={value === "week"} onClick={() => onChange("week")}>Tuần</button><button type="button" aria-pressed={value === "month"} onClick={() => onChange("month")}>Tháng</button></div>;
}

export function Rankings() {
  const [peoplePeriod, setPeoplePeriod] = useState<"week" | "month">("week");
  const [networkPeriod, setNetworkPeriod] = useState<"week" | "month">("week");
  return (
    <>
      <div className="ranking-note"><span>BXH được cập nhật liên tục từ CSDL do KOL và MCN đăng ký. Chủ các trang/kênh chịu trách nhiệm nội dung đăng tải trên trang/kênh của mình.</span><strong>Muốn góp mặt trên BXH?</strong><button type="button" disabled>Hãy đăng ký ngay!</button></div>
      <section className="rankings-grid" aria-label="Bảng xếp hạng tĩnh">
        <article className="ranking-panel">
          <div className="panel-heading"><h2>KOL đang được chú ý</h2><PeriodToggle value={peoplePeriod} onChange={setPeoplePeriod} /></div>
          <p className="snapshot-label">Ảnh chụp dữ liệu: {peoplePeriod === "week" ? "Tuần" : "Tháng"}</p>
          <div className="featured-people">
            {featuredPeople.map((person) => <div className="featured-person" key={person.rank}>
              <Image src={person.image} alt={person.name} fill sizes="190px" />
              <span className={`rank-badge rank-${person.rank}`}><Star size={10} fill="currentColor" />Top {person.rank}</span>
              <div className="person-overlay"><h3>{person.name}</h3><p>{person.legalName}</p><strong>{person.metric} <small><TrendingUp size={10} />{person.delta}</small></strong></div>
            </div>)}
          </div>
          <div className="rank-list">
            {peopleRows.map((person) => <div className="person-row" key={person.rank}><span className="row-rank">{person.rank}</span><Image src={person.image} alt={person.name} width={40} height={40} /><div><strong>{person.name}</strong><span>{person.legalName}</span></div><p><small>Tương tác</small><b><TrendingUp size={12} />{person.metric}</b><em>{person.delta}</em></p></div>)}
          </div>
          <button type="button" className="all-button" disabled>Xem tất cả</button>
        </article>
        <article className="ranking-panel network-panel">
          <div className="panel-heading"><h2>Top MCN tăng trưởng</h2><PeriodToggle value={networkPeriod} onChange={setNetworkPeriod} /></div>
          <p className="snapshot-label">Ảnh chụp dữ liệu: {networkPeriod === "week" ? "Tuần" : "Tháng"}</p>
          <div className="network-list">{networkRows.map((network) => <div className={`network-row network-${network.rank}`} key={network.rank}><span>{String(network.rank).padStart(2, "0")}</span><Image src={network.image} alt={network.name} width={48} height={48} /><div><strong>{network.name}</strong><small>{network.detail}</small></div><p><small>Tương tác</small><b><TrendingUp size={12} />{network.metric}</b><em>{network.delta}</em></p></div>)}</div>
          <button type="button" className="all-button" disabled>Xem tất cả</button>
        </article>
      </section>
    </>
  );
}
