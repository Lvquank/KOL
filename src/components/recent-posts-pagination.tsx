"use client";

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4
 * Hallmark · component: YouTube pagination · genre: editorial · theme: existing KOL portal
 * states: default · hover · focus · active · disabled
 * contrast: pass
 */

/* eslint-disable @next/next/no-img-element */

import { ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { PlatformIcon } from "@/components/detail-shared";
import {
  formatCompactNumber,
  formatDetailDate,
  normalizeMediaUrl,
  type ApiInfluencerPost,
} from "@/lib/api-influencer";

type RecentPostsPaginationProps = {
  posts: ApiInfluencerPost[];
};

const POSTS_PER_PAGE = 3;
const PROPOSAL_BUTTON_TEXT_STYLE: CSSProperties = {
  color: "var(--muted)",
  fontFamily: "inherit",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: 1,
};

function visiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 3) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const start = Math.min(Math.max(currentPage - 1, 1), totalPages - 2);
  return Array.from({ length: 3 }, (_, index) => start + index);
}

export function RecentPostsPagination({ posts }: RecentPostsPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const pageStart = (activePage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const pages = visiblePages(activePage, totalPages);

  if (!currentPosts.length) return null;

  return (
    <div>
      <div
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Trang ${activePage}, hiển thị ${currentPosts.length} video YouTube`}
      >
        {currentPosts.map((post) => {
          const thumbnail = normalizeMediaUrl(post.thumbnail_url);

          return (
            <a
              key={post.post_key}
              href={post.source_url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Xem video YouTube: ${post.title}`}
              className={`group min-w-0 overflow-hidden rounded-[4px] border border-gray-200 bg-white transition-colors hover:border-gray-300 focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 active:border-primary ${
                post.source_url ? "cursor-pointer" : "pointer-events-none"
              }`}
            >
              <article className="flex h-full min-w-0 flex-col">
                <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm">
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-gray-900">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                  <span className="absolute right-2.5 top-2.5">
                    <PlatformIcon platform={post.platform || "youtube"} circular size="tiny" />
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-3">
                  <h3 className="line-clamp-2 min-w-0 [overflow-wrap:anywhere] text-[14px] font-bold leading-[1.45] text-gray-900">
                    {post.title}
                  </h3>
                  <div className="mt-auto grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-2 pt-3 text-[11px] tabular-nums text-gray-400">
                    <span className="flex items-center gap-1 whitespace-nowrap" title="Lượt xem">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatCompactNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap" title="Lượt thích">
                      <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatCompactNumber(post.likes)}
                    </span>
                    <time className="justify-self-end whitespace-nowrap" dateTime={post.published_date || undefined}>
                      {formatDetailDate(post.published_date)}
                    </time>
                  </div>
                </div>
              </article>
            </a>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-gray-100 pt-3"
          aria-label="Phân trang nội dung YouTube"
        >
          <button
            type="button"
            aria-label="Trang video trước"
            disabled={activePage === 1}
            className="flex h-10 min-w-10 items-center justify-center gap-1 whitespace-nowrap rounded-[4px] border border-gray-200 bg-white px-2 transition-colors hover:border-primary hover:text-primary focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 active:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:min-w-8"
            style={PROPOSAL_BUTTON_TEXT_STYLE}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          <div className="flex min-w-0 items-center justify-center gap-1">
            {pages[0] > 1 ? <span className="px-0.5 text-[12px] text-gray-400">…</span> : null}
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`Xem trang video ${page}`}
                aria-current={page === activePage ? "page" : undefined}
                className={`h-10 min-w-10 whitespace-nowrap rounded-[4px] border px-2 tabular-nums transition-colors focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 active:bg-orange-50 sm:h-8 sm:min-w-8 ${
                  page === activePage
                    ? "border-primary bg-primary"
                    : "border-transparent bg-white hover:border-gray-200 hover:text-primary"
                }`}
                style={{
                  ...PROPOSAL_BUTTON_TEXT_STYLE,
                  color: page === activePage ? "var(--proposal-button-ink)" : "var(--muted)",
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            {pages.at(-1)! < totalPages ? <span className="px-0.5 text-[12px] text-gray-400">…</span> : null}
            <span className="hidden whitespace-nowrap pl-1 text-[12px] text-gray-400 sm:inline">/ {posts.length} video</span>
          </div>

          <button
            type="button"
            aria-label="Trang video tiếp theo"
            disabled={activePage === totalPages}
            className="flex h-10 min-w-10 items-center justify-center gap-1 whitespace-nowrap rounded-[4px] border border-gray-200 bg-white px-2 transition-colors hover:border-primary hover:text-primary focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 active:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:min-w-8"
            style={PROPOSAL_BUTTON_TEXT_STYLE}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
