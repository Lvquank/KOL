import type { Metadata } from "next";
import { DataCatalog } from "@/components/data-catalog";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Bộ dữ liệu KOLs, MCN và Influencers | KOL.GOV.VN local",
  description: "Thông tin và tệp CSV của bộ dữ liệu KOL, kênh mạng xã hội và MCN trong PostgreSQL local."
};

export default function DataKolPage() {
  return (
    <>
      <SiteChrome showTicker={false} />
      <DataCatalog />
      <SiteFooter />
    </>
  );
}
