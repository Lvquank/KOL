import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiNewsItem } from "@/lib/api-news";

type LocalNewsPost = {
  slug: string;
  source_url: string;
  category: string;
  title: string;
  excerpt: string | null;
  published_date: string;
  reading_minutes: number;
  image_url: string;
  scraped_at?: string;
  tags?: string[];
  body_html?: string;
};

const categoryKeys: Record<string, string> = {
  "Hoạt động cục": "cat_25414bded41259026cb057437927f13d",
  "Sự kiện": "cat_dccfc214162f94f6792daababbed2b2c",
  "Tin tức nổi bật": "cat_6422c21749908dea4d96717cc05540ea",
  "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN": "cat_cadb46c1e6821f3171eb8cb921b116db",
};

let localNewsPostsPromise: Promise<LocalNewsPost[]> | null = null;

function loadLocalNewsPosts(): Promise<LocalNewsPost[]> {
  if (!localNewsPostsPromise) {
    const sourcePath = path.join(
      process.cwd(),
      "..",
      "kol_gov_scraper",
      "raw",
      "news_posts.json",
    );

    localNewsPostsPromise = readFile(sourcePath, "utf8").then(
      (contents) => JSON.parse(contents) as LocalNewsPost[],
    );
  }

  return localNewsPostsPromise;
}

export async function findLocalNewsPost(slug: string): Promise<ApiNewsItem | null> {
  try {
    const localNewsPosts = await loadLocalNewsPosts();
    const post = localNewsPosts.find((item) => item.slug === slug);
    if (!post) return null;

    return {
      ...post,
      scraped_at: post.scraped_at || "",
      categories: [
        {
          key: categoryKeys[post.category] || post.category,
          name: post.category,
        },
      ],
      tags: post.tags || [],
    };
  } catch (error) {
    console.warn(`Failed to read local news fallback for slug ${slug}:`, error);
    return null;
  }
}
