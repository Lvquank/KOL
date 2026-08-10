"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { documentItems, newsItems, sourceUrl } from "@/data/content";

export function NewsBoard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % newsItems.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="news-section" id="news">
      <div className="section-heading-row">
        <h2>Bản tin</h2>
        <a href={`${sourceUrl}tin-tuc`} target="_blank" rel="noreferrer">Xem tất cả <ChevronRight size={16} /></a>
      </div>
      <div className="news-layout">
        <div className="news-grid">
          {newsItems.map((item) => (
            <a className="news-card" href={`${sourceUrl}${item.sourcePath}`} target="_blank" rel="noreferrer" key={item.title}>
              <div className="news-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 240px" /></div>
              <div className="news-copy"><span>TIN TỨC NỔI BẬT</span><h3>{item.title}</h3></div>
            </a>
          ))}
        </div>
        <div className="mobile-carousel" aria-roledescription="carousel">
          <a className="mobile-hero" href={`${sourceUrl}${newsItems[active].sourcePath}`} target="_blank" rel="noreferrer">
            <Image src={newsItems[active].image} alt={newsItems[active].title} fill sizes="100vw" priority />
            <div className="mobile-hero-overlay"><p>Bảo vệ bản quyền chương trình phát trực tuyến</p><div><span>TIN TỨC NỔI BẬT</span><time>{newsItems[active].date}</time></div><h3>{newsItems[active].title}</h3></div>
          </a>
          <button type="button" className="carousel-arrow left" aria-label="Tin trước" onClick={() => setActive((active + newsItems.length - 1) % newsItems.length)}><ChevronLeft size={17} /></button>
          <button type="button" className="carousel-arrow right" aria-label="Tin tiếp theo" onClick={() => setActive((active + 1) % newsItems.length)}><ChevronRight size={17} /></button>
          <div className="carousel-dots">{newsItems.map((item, index) => <button type="button" key={item.title} aria-label={`Xem tin ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} />)}</div>
        </div>
        <div className="document-list" id="documents">
          {documentItems.map((item) => (
            <a href={sourceUrl} target="_blank" rel="noreferrer" key={item.title}>
              <div className="document-thumb"><Image src={item.image} alt="" fill sizes="140px" /></div><span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
