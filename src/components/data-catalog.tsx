"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL, apiGet, type DatasetStats } from "@/lib/api";

const fallbackStats: Pick<DatasetStats, "influencers" | "social_channels" | "mcns"> = {
  influencers: 904,
  social_channels: 4782,
  mcns: 26
};

const fields = [
  ["name", "Họ và tên"],
  ["nick_name", "Biệt danh / Nghệ danh"],
  ["gender", "Giới tính"],
  ["identity_verified", "Đã xác minh danh tính"],
  ["channel_type", "Loại kênh (TikTok, YouTube, Facebook...)"],
  ["channel_name", "Tên kênh"],
  ["channel_url", "URL kênh"],
  ["followers", "Số lượt theo dõi"],
  ["views", "Tổng lượt xem"],
  ["likes", "Tổng lượt thích"]
] as const;

const metadata = [
  ["Nguồn dữ liệu:", "KOL.GOV.VN"],
  ["Ngôn ngữ:", "Tiếng Việt"],
  ["Định dạng:", "CSV (UTF-8)"],
  ["Ngày xuất bản:", "01/07/2025"],
  ["Giấy phép:", "Dữ liệu công khai"]
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function DataCatalog() {
  const [stats, setStats] = useState(fallbackStats);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiGet<{ data: DatasetStats }>("/stats", controller.signal)
      .then((response) => {
        setStats({
          influencers: response.data.influencers,
          social_channels: response.data.social_channels,
          mcns: response.data.mcns
        });
        setUsingFallback(false);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setUsingFallback(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="data-catalog-page">
      <div className="data-catalog-shell">
        <article className="data-catalog-card">
          <header className="data-catalog-intro">
            <h1>Bộ dữ liệu KOLs, MCN và Influencers</h1>
            <p>Cổng thông tin và cơ sở dữ liệu về quản lý, giám sát hoạt động Influencer, KOL theo quy định pháp luật Việt Nam.</p>
          </header>

          <section className="data-catalog-stats" aria-label="Thống kê bộ dữ liệu" aria-live="polite">
            <div><strong>{formatCount(stats.influencers)}</strong><span>KOL / Influencer</span></div>
            <div><strong>{formatCount(stats.social_channels)}</strong><span>Kênh mạng xã hội</span></div>
            <div><strong>{formatCount(stats.mcns)}</strong><span>MCN / Tổ chức</span></div>
          </section>

          <section className="data-catalog-section">
            <h2>Thông tin bộ dữ liệu</h2>
            <dl className="data-catalog-metadata">
              {metadata.map(([term, description]) => (
                <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
              ))}
            </dl>
          </section>

          <section className="data-catalog-section data-catalog-fields">
            <h2>Các trường dữ liệu</h2>
            <div className="data-catalog-table-wrap">
              <table>
                <caption className="sr-only">Danh sách trường trong tệp CSV KOL</caption>
                <thead><tr><th scope="col">Trường</th><th scope="col">Mô tả</th></tr></thead>
                <tbody>
                  {fields.map(([name, description]) => <tr key={name}><td><code>{name}</code></td><td>{description}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>

          <div className="data-catalog-actions">
            <a className="data-download-button" href={`${API_BASE_URL}/data/kol.csv`} download="kol-dataset.csv">
              <Download size={16} aria-hidden="true" />Tải xuống CSV
            </a>
            <Link className="data-back-button" href="/">Quay lại trang chủ</Link>
          </div>
          <p className="data-catalog-status" aria-live="polite">
            {usingFallback ? "Đang hiển thị số liệu công khai dự phòng vì backend local chưa kết nối." : "Số liệu thống kê được cập nhật từ PostgreSQL local."}
          </p>
        </article>
      </div>
    </main>
  );
}
