import Image from "next/image";
import { BriefcaseBusiness, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="about">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Image src="/assets/logo.svg" alt="kol.gov.vn" width={300} height={49} />
          <strong>TRANG THÔNG TIN ĐIỆN TỬ TỔNG HỢP</strong>
          <p>Cổng thông tin &amp; Cơ sở dữ liệu về <em>KOLs</em></p>
          <div className="official-card">
            <p><ShieldCheck />Người chịu trách nhiệm chính: <b>Ông Nguyễn Thanh Hải</b><span>Giám đốc Trung tâm Đo kiểm Phát thanh, truyền hình và thông tin điện tử</span></p>
            <p><BriefcaseBusiness />Đối tác công nghệ: <b>Công ty CP Công nghệ &amp; Truyền thông Không gian số (NetSpace)</b></p>
          </div>
        </div>
        <div className="footer-column">
          <strong>LIÊN HỆ</strong>
          <p><MapPin />Địa chỉ: Tầng 9, Toà nhà 115 Trần Duy Hưng, P. Yên Hòa, Hà Nội</p>
          <p><Phone />0243.9449.082</p>
          <p><Mail />quanly@kol.gov.vn</p>
        </div>
        <div className="footer-column">
          <strong>THÔNG TIN</strong>
          <nav><span>Giới thiệu</span><span>Bản tin</span><span>Tài liệu</span></nav>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>Giấy phép số: 118/GP-TTĐT ngày 18 tháng 6 năm 2026, cơ quan cấp phép Cục Phát thanh truyền hình và Thông tin điện tử</p>
        <p>Copyright © - Cục phát thanh, truyền hình và thông tin điện tử. All Rights Reserved</p>
        <p className="footer-provenance">Bản dựng local · Nguồn giao diện: <a href="https://kol.gov.vn/" target="_blank" rel="noreferrer">kol.gov.vn ↗</a></p>
      </div>
    </footer>
  );
}
