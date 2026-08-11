"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { documentItems, newsItems, sourceUrl } from "@/data/content";
import { apiGet, type ApiListResponse, formatNewsDate, isAbortError, type NewsPost } from "@/lib/api";

type DisplayNews = {
  slug: string;
  title: string;
  image: string;
  fallbackImage: string;
  date: string;
  category: string;
  excerpt: string;
};

function NewsImage({ item, priority = false }: { item: DisplayNews; priority?: boolean }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = item.image && failedSource !== item.image ? item.image : item.fallbackImage;
  return <img src={source} alt={item.title} fetchPriority={priority ? "high" : undefined} onError={() => setFailedSource(item.image)} />;
}

function slugFromPath(path: string) {
  return path.split("/").filter(Boolean).at(-1) || path;
}

export function NewsBoard() {
  const [active, setActive] = useState(0);
  const [apiPosts, setApiPosts] = useState<NewsPost[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiGet<ApiListResponse<NewsPost>>("/news?limit=3&sort=publishedAt&order=desc", controller.signal)
      .then((response) => {
        setApiPosts(response.data);
        setUsingFallback(false);
        setActive(0);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) setUsingFallback(true);
      });
    return () => controller.abort();
  }, []);

  const displayItems = useMemo<DisplayNews[]>(() => {
    if (apiPosts.length > 0) {
      return apiPosts.map((post, index) => ({
        slug: post.slug,
        title: post.title,
        image: post.image_url || newsItems[index]?.image || "/assets/news/an-ninh-mang.webp",
        fallbackImage: newsItems[index]?.image || "/assets/news/an-ninh-mang.webp",
        date: formatNewsDate(post.published_date),
        category: post.category || "Tin tức nổi bật",
        excerpt: post.excerpt || "Bản tin cập nhật chính thức từ kol.gov.vn"
      }));
    }
    return newsItems.map((item) => ({
      slug: slugFromPath(item.sourcePath),
      title: item.title,
      image: item.image,
      fallbackImage: item.image,
      date: item.date,
      category: "Tin tức nổi bật",
      excerpt: "Tin mới từ Cổng thông tin KOL"
    }));
  }, [apiPosts]);

  useEffect(() => {
    if (displayItems.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % displayItems.length), 5000);
    return () => window.clearInterval(timer);
  }, [displayItems.length]);

  const activeItem = displayItems[active] || displayItems[0];

  return (
    <section className="news-section" id="news">
      <div className="section-heading-row">
        <div><h2>Bản tin</h2>{usingFallback && <small className="api-fallback-label">Đang hiển thị dữ liệu dự phòng</small>}</div>
        <Link href="/tin-tuc">Xem tất cả <ChevronRight size={16} /></Link>
      </div>
      <div className="news-layout">
        <div className="news-grid">
          {displayItems.map((item) => (
            <Link className="news-card" href={`/tin-tuc/${item.slug}`} key={item.slug || item.title}>
              <div className="news-image"><NewsImage item={item} /></div>
              <div className="news-copy"><span>{item.category.toUpperCase()}</span><h3>{item.title}</h3></div>
            </Link>
          ))}
        </div>
        {activeItem && (
          <div className="mobile-carousel" aria-roledescription="carousel">
            <Link className="mobile-hero" href={`/tin-tuc/${activeItem.slug}`}>
              <NewsImage item={activeItem} priority />
              <div className="mobile-hero-overlay"><p>{activeItem.excerpt}</p><div><span>{activeItem.category.toUpperCase()}</span><time>{activeItem.date}</time></div><h3>{activeItem.title}</h3></div>
            </Link>
            <button type="button" className="carousel-arrow left" aria-label="Tin trước" onClick={() => setActive((active + displayItems.length - 1) % displayItems.length)}><ChevronLeft size={17} /></button>
            <button type="button" className="carousel-arrow right" aria-label="Tin tiếp theo" onClick={() => setActive((active + 1) % displayItems.length)}><ChevronRight size={17} /></button>
            <div className="carousel-dots">{displayItems.map((item, index) => <button type="button" key={item.slug} aria-label={`Xem tin ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} />)}</div>
          </div>
        )}
        <div className="document-list" id="documents">
          {documentItems.map((item) => (
            <a href={item.localPath ?? sourceUrl} target={item.localPath ? undefined : "_blank"} rel={item.localPath ? undefined : "noreferrer"} key={item.title}>
              <div className="document-thumb"><Image src={item.image} alt="" fill sizes="140px" /></div><span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
