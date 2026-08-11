"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fetchApiNews,
  fetchApiCategories,
  formatNewsDate,
  type ApiNewsItem,
  type ApiCategoryItem,
  FALLBACK_NEWS,
  FALLBACK_CATEGORIES,
} from "@/lib/api-news";

interface NewsArchiveProps {
  initialCategories?: ApiCategoryItem[];
  initialNews?: ApiNewsItem[];
}

const PAGE_SIZE = 6;

export function NewsArchive({
  initialCategories = FALLBACK_CATEGORIES,
  initialNews = FALLBACK_NEWS,
}: NewsArchiveProps) {
  const [items, setItems] = useState<ApiNewsItem[]>(
    initialNews && initialNews.length > 0 ? initialNews : FALLBACK_NEWS
  );
  const [categoriesList, setCategoriesList] = useState<ApiCategoryItem[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : FALLBACK_CATEGORIES
  );
  const [category, setCategory] = useState<string>("Tất cả");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Client-side refresh backup on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchApiCategories(), fetchApiNews()]).then(([cats, newsData]) => {
      if (!isMounted) return;
      if (cats && cats.length > 0) {
        setCategoriesList(cats);
      }
      if (newsData && newsData.length > 0) {
        setItems(newsData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
  };

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const categoryNames = useMemo(() => {
    const names = categoriesList.map((c) => c.name);
    return ["Tất cả", ...Array.from(new Set(names))];
  }, [categoriesList]);

  const filteredPosts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchCategory =
        category === "Tất cả" ||
        item.category === category ||
        item.categories?.some((c) => c.name === category);

      const matchText =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [items, category, query]);

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, page]);

  const featured = items[0] || FALLBACK_NEWS[0];
  const latestPosts = items.slice(0, 5);

  return (
    <div className="archive-page">
      <div className="archive-crumb">
        <div className="site-container">
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <strong>Bản tin</strong>
        </div>
      </div>
      <section className="archive-title">
        <div className="site-container">
          <h1>Bản tin</h1>
          <p>Thông tin, báo cáo, phân tích từ Cục Phát thanh, truyền hình và thông tin điện tử</p>
        </div>
      </section>
      <div className="site-container archive-layout">
        <section className="archive-main">
          <div className="archive-filters">
            <label>
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="Tìm kiếm tin tức..."
              />
            </label>
            <div>
              {categoryNames.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={category === item}
                  onClick={() => handleCategoryChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="archive-count">Tìm thấy {filteredPosts.length} bài viết</p>
          <div className="archive-list">
            {paginatedPosts.map((post) => (
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="archive-card"
                key={post.slug || post.title}
              >
                <div className="archive-image">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 240px"
                    unoptimized={post.image_url.startsWith("http")}
                  />
                </div>
                <div className="archive-copy">
                  <span>{post.category || "TIN TỨC"}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt || post.title}</p>
                  <small>
                    <Clock3 size={13} />
                    {formatNewsDate(post.published_date)}
                    <i>·</i>
                    {post.reading_minutes ? `${post.reading_minutes} phút đọc` : "2 phút đọc"}
                  </small>
                </div>
              </Link>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="archive-empty">Không tìm thấy bài viết phù hợp.</p>
          )}
          {totalPages > 1 && (
            <div className="archive-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => {
                    setPage(p);
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </section>
        <aside className="archive-sidebar">
          {featured && (
            <section>
              <h2>Tin nổi bật</h2>
              <Link
                className="sidebar-featured"
                href={`/tin-tuc/${featured.slug}`}
              >
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  width={110}
                  height={76}
                  unoptimized={featured.image_url.startsWith("http")}
                />
                <span>
                  <b>{featured.category || "TIN NỔI BẬT"}</b>
                  {featured.title}
                  <small>{formatNewsDate(featured.published_date)}</small>
                </span>
              </Link>
            </section>
          )}
          <section>
            <h2>Tin mới nhất</h2>
            {latestPosts.map((post) => (
              <Link
                className="sidebar-row"
                href={`/tin-tuc/${post.slug}`}
                key={post.slug || post.title}
              >
                <span>
                  {post.title}
                  <small>{formatNewsDate(post.published_date)}</small>
                </span>
              </Link>
            ))}
          </section>
          <section>
            <h2>Danh mục</h2>
            {categoriesList.map((item) => (
              <button
                type="button"
                key={item.category_key || item.name}
                onClick={() => handleCategoryChange(item.name)}
              >
                {item.name}
                <span>{item.post_count}</span>
              </button>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
