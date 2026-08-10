"use client";

import Image from "next/image";
import { useState } from "react";
import { socialItems } from "@/data/content";

const categories = ["Chiến dịch", "Sự kiện", "Người ảnh hưởng", "Chương trình"] as const;

export function SocialIndex() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Người ảnh hưởng");
  return <section className="social-section">
    <div className="social-heading"><h2>Top10 Chỉ số ảnh hưởng trên Social Media</h2><select aria-label="Tháng" defaultValue="05/2026" disabled><option value="05/2026">Tháng 05/2026</option></select></div>
    <div className="category-tabs">{categories.map((item) => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="social-card"><div className="social-poster"><span>TOP10 {category.toUpperCase()}</span><h3>10 {category.toUpperCase()} NỔI BẬT TRÊN SOCIAL MEDIA</h3><p>Tháng 05/2026</p><strong>Chỉ số ảnh hưởng xã hội (BSI)</strong></div><ol className="social-list">{socialItems.map((item) => <li key={item.rank}><span>{item.rank}</span><Image src={item.image} alt={item.name} width={38} height={38} /><strong>{item.name}</strong><b>{item.score}</b></li>)}</ol></div>
    <p className="buzzmetrics">Được cung cấp dữ liệu từ <strong>Buzzmetrics BSI</strong></p>
  </section>;
}
