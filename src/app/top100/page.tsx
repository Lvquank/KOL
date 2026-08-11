import type { Metadata } from "next";
import { RankingDirectory } from "@/components/ranking-directory";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "KOL đang được chú ý — Bản tham chiếu local",
  description: "Top 100 KOL sử dụng dữ liệu PostgreSQL local."
};

export default function Top100Page() {
  return <><SiteChrome showTicker={false} /><main><RankingDirectory kind="influencer" /></main><SiteFooter /></>;
}
