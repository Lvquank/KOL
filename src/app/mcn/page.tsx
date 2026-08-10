import type { Metadata } from "next";
import { RankingDirectory } from "@/components/ranking-directory";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Top MCN tăng trưởng — Bản tham chiếu local",
  description: "Bảng xếp hạng MCN sử dụng dữ liệu PostgreSQL local."
};

export default function McnPage() {
  return <><SiteChrome showTicker={false} /><main><RankingDirectory kind="owner" /></main><SiteFooter /></>;
}
