"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Menu, Search, X, Megaphone, Phone } from "lucide-react";
const ROTATING_WORDS = ["Creators", "Brands", "MCNs", "KOLs"];

function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const currentWord = ROTATING_WORDS[wordIndex];
    const typeSpeed = isDeleting ? 60 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.slice(0, text.length + 1);
        setText(nextText);
        if (nextText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        const nextText = currentWord.slice(0, text.length - 1);
        setText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <em className="rotating-portal-word">
      {text}
      <span className="typing-cursor" aria-hidden="true">|</span>
    </em>
  );
}

function HeaderSearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(paramQuery);

  // Sync internal input state when URL param changes externally
  const [prevParamQuery, setPrevParamQuery] = useState(paramQuery);
  if (prevParamQuery !== paramQuery) {
    setPrevParamQuery(paramQuery);
    setQuery(paramQuery);
  }

  const updateSearch = (val: string) => {
    setQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }
    // Navigate to current page or home with updated query
    const targetPath = pathname === "/tin-tuc" ? "/tin-tuc" : "/";
    const queryString = params.toString();
    router.replace(queryString ? `${targetPath}?${queryString}` : targetPath, { scroll: false });
  };

  const handleClear = () => {
    updateSearch("");
  };

  return (
    <form
      className="header-search-form"
      onSubmit={(e) => {
        e.preventDefault();
        updateSearch(query);
      }}
    >
      <Search size={16} className="header-search-icon" />
      <input
        type="text"
        className="header-search-input"
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => updateSearch(e.target.value)}
        aria-label="Tìm kiếm..."
      />
      {query && (
        <button
          type="button"
          className="header-search-clear"
          onClick={handleClear}
          aria-label="Xóa từ khóa tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}

export function SiteChrome({ showTicker = true }: { showTicker?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
            <button type="button" disabled title="Liên hệ bị vô hiệu hóa trong bản local">
              <Phone size={16} />02439449082
            </button>
            <button type="button" disabled title="Phản ánh bị vô hiệu hóa trong bản local">
              PHẢN ÁNH
            </button>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <div className="brand-block">
            <Link className="logo-link" href="/" aria-label="Về trang chủ">
              <Image src="/assets/logo.svg" alt="kol.gov.vn" width={300} height={49} priority />
            </Link>
            <div className="brand-divider" aria-hidden="true" />
            <div className="portal-copy">
              <strong>TRANG THÔNG TIN ĐIỆN TỬ TỔNG HỢP</strong>
              <span>Cổng thông tin &amp; Cơ sở dữ liệu về <RotatingWord /></span>
            </div>
          </div>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <Link href="/tin-tuc">Bản tin</Link>
            <Link href="/tin-tuc/bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so">Tài liệu</Link>
            <Link href="/tin-tuc/gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn">Giới thiệu</Link>
            
            <Suspense fallback={
              <div className="header-search-form">
                <Search size={16} className="header-search-icon" />
                <input type="text" className="header-search-input" placeholder="Tìm kiếm..." disabled />
              </div>
            }>
              <HeaderSearchBox />
            </Suspense>
          </nav>
          <div className="mobile-controls">
            <button
              type="button"
              className="header-search-btn-mobile"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-label="Tìm kiếm thông tin"
            >
              {mobileSearchOpen ? <X size={21} /> : <Search size={21} />}
            </button>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Inline Search Bar */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar">
            <div className="site-container">
              <Suspense fallback={null}>
                <HeaderSearchBox />
              </Suspense>
            </div>
          </div>
        )}

        <nav className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`} aria-label="Điều hướng mobile">
          <div className="site-container">
            <Link href="/tin-tuc" onClick={() => setMenuOpen(false)}>Bản tin</Link>
            <Link href="/tin-tuc/bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so" onClick={() => setMenuOpen(false)}>Tài liệu</Link>
            <Link href="/tin-tuc/gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn" onClick={() => setMenuOpen(false)}>Giới thiệu</Link>
          </div>
        </nav>
      </header>
      {showTicker && (
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
      )}
    </>
  );
}
