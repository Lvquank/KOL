"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { documentItems, sourceUrl } from "@/data/content";
import { fetchApiNews, formatNewsDate, type ApiNewsItem, FALLBACK_NEWS } from "@/lib/api-news";

export function NewsBoard() {
  const [items, setItems] = useState<ApiNewsItem[]>(FALLBACK_NEWS);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetchApiNews().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);

  const displayItems = items.slice(0, 3);

  useEffect(() => {
    if (displayItems.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % displayItems.length),
      5000
    );
    return () => window.clearInterval(timer);
  }, [displayItems.length]);

  const activeItem = displayItems[active] || displayItems[0] || FALLBACK_NEWS[0];

  return (
    <section className="news-section" id="news">
      <div className="section-heading-row">
        <h2>Bản tin</h2>
        <Link href="/tin-tuc">
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>
      <div className="news-layout">
        <div className="news-grid">
          {displayItems.map((item) => (
            <Link
              className="news-card"
              href={`/tin-tuc/${item.slug}`}
              key={item.slug || item.title}
            >
              <div className="news-image">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  unoptimized={item.image_url.startsWith("http")}
                />
              </div>
              <div className="news-copy">
                <span>{(item.category || "TIN TỨC NỔI BẬT").toUpperCase()}</span>
                <h3>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {activeItem && (
          <div className="mobile-carousel" aria-roledescription="carousel">
            <Link
              className="mobile-hero"
              href={`/tin-tuc/${activeItem.slug}`}
            >
              <Image
                src={activeItem.image_url}
                alt={activeItem.title}
                fill
                sizes="100vw"
                priority
                unoptimized={activeItem.image_url.startsWith("http")}
              />
              <div className="mobile-hero-overlay">
                <p>{activeItem.excerpt || "Bản tin cập nhật chính thức từ kol.gov.vn"}</p>
                <div>
                  <span>{(activeItem.category || "TIN TỨC NỔI BẬT").toUpperCase()}</span>
                  <time>{formatNewsDate(activeItem.published_date)}</time>
                </div>
                <h3>{activeItem.title}</h3>
              </div>
            </Link>
            <button
              type="button"
              className="carousel-arrow left"
              aria-label="Tin trước"
              onClick={() => setActive((active + displayItems.length - 1) % displayItems.length)}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              className="carousel-arrow right"
              aria-label="Tin tiếp theo"
              onClick={() => setActive((active + 1) % displayItems.length)}
            >
              <ChevronRight size={17} />
            </button>
            <div className="carousel-dots">
              {displayItems.map((item, index) => (
                <button
                  type="button"
                  key={item.slug || item.title}
                  aria-label={`Xem tin ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="document-list" id="documents">
          {documentItems.map((item) => (
            <a
              href={item.localPath ?? sourceUrl}
              target={item.localPath ? undefined : "_blank"}
              rel={item.localPath ? undefined : "noreferrer"}
              key={item.title}
            >
              <div className="document-thumb">
                <Image src={item.image} alt="" fill sizes="140px" />
              </div>
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
