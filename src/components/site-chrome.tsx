"use client";

import Image from "next/image";
import { Menu, Search, X, Megaphone, Phone } from "lucide-react";
import { useState } from "react";

export function SiteChrome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="agency-bar">
        <div className="site-container agency-inner">
          <div className="agency-copy">
            <p>BỘ VĂN HÓA, THỂ THAO VÀ DU LỊCH</p>
            <p>CỤC PHÁT THANH TRUYỀN HÌNH VÀ THÔNG TIN ĐIỆN TỬ</p>
            <p>TRUNG TÂM ĐO KIỂM PHÁT THANH, TRUYỀN HÌNH VÀ THÔNG TIN ĐIỆN TỬ</p>
          </div>
          <div className="agency-actions">
            <button type="button" disabled title="Liên hệ bị vô hiệu hóa trong bản local"><Phone size={16} />02439449082</button>
            <button type="button" disabled title="Phản ánh bị vô hiệu hóa trong bản local">PHẢN ÁNH</button>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <div className="brand-block">
            <a className="logo-link" href="https://kol.gov.vn/" target="_blank" rel="noreferrer" aria-label="Mở website nguồn kol.gov.vn">
              <Image src="/assets/logo.svg" alt="kol.gov.vn" width={300} height={49} priority />
            </a>
            <div className="brand-divider" aria-hidden="true" />
            <div className="portal-copy">
              <strong>TRANG THÔNG TIN ĐIỆN TỬ TỔNG HỢP</strong>
              <span>Cổng thông tin &amp; Cơ sở dữ liệu về <em>Creators</em></span>
            </div>
          </div>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <a href="#news">Bản tin</a><a href="#documents">Tài liệu</a><a href="#about">Giới thiệu</a>
            <button type="button" disabled aria-label="Tìm kiếm đã bị vô hiệu hóa"><Search size={17} /><span>Tìm kiếm...</span></button>
          </nav>
          <div className="mobile-controls">
            <button type="button" disabled aria-label="Tìm kiếm đã bị vô hiệu hóa"><Search size={21} /></button>
            <button type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <nav className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`} aria-label="Điều hướng mobile">
          <div className="site-container"><a href="#news" onClick={() => setMenuOpen(false)}>Bản tin</a><a href="#documents" onClick={() => setMenuOpen(false)}>Tài liệu</a><a href="#about" onClick={() => setMenuOpen(false)}>Giới thiệu</a></div>
        </nav>
      </header>
      <div className="ticker" aria-label="Cập nhật xếp hạng tĩnh">
        <div className="site-container ticker-inner">
          <div className="ticker-label"><Megaphone size={13} />CẬP NHẬT</div>
          <div className="ticker-window">
            <div className="ticker-track">
              <span><b>Misthy TV Shorts</b> <i>+7.1 Tr lượt xem</i> · 1 tuần qua</span>
              <span><b>OPPO X9 Ultra &amp; Find X9S</b> <em>#1 Chiến dịch Tháng 05</em></span>
              <span><b>Hà Huy official</b> <i>+507.2 Tr lượt xem</i> · 1 tuần qua</span>
              <span><b>Sting F1</b> <em>#2 Chiến dịch Tháng 05</em></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
