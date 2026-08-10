import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

const documentSlug = "bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so";
const introductionSlug = "gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn";

const otherPosts = [
  { title: "Thủ tướng: Mỗi người dân cần ứng xử văn minh trên không gian mạng", image: "/assets/news/an-ninh-mang.webp", date: "07/08/2026" },
  { title: "Chuẩn hóa kỹ năng Livestream, nâng cao trách nhiệm của nhà sáng tạo nội dung số.", image: "/assets/news/livestream.webp", date: "03/08/2026" },
  { title: "Livestream lậu có thể bị xử phạt tới 250 triệu đồng", image: "/assets/news/ban-quyen.webp", date: "30/07/2026" },
];

function RuleContent() {
  return <div className="article-body"><Image src="/assets/news/quy-tac-1.jpg" alt="Quy tắc ứng xử trên môi trường số" width={1875} height={3333} /><Image src="/assets/news/quy-tac-2.jpg" alt="Quy tắc ứng xử trên môi trường số" width={2813} height={7500} /><Image src="/assets/news/quy-tac-3.jpg" alt="Quy tắc ứng xử trên môi trường số" width={1875} height={2344} /></div>;
}

function IntroductionContent() {
  return <div className="article-body article-prose">
    <p>Cổng thông tin điện tử và cơ sở dữ liệu về nhà sáng tạo nội dung số và quảng cáo trực tuyến Việt Nam (kol.gov.vn) là nền tảng thông tin chính thống do Cục Phát thanh, truyền hình và Thông tin điện tử - Bộ Văn hóa Thể thao và Du lịch chủ trì xây dựng; giao Trung tâm Đo kiểm Phát thanh truyền hình và Thông tin điện tử quản lý, vận hành. Cổng được phát triển với sự đồng hành của Công ty NetSpace trong vai trò đối tác công nghệ, phối hợp quản lý, vận hành hệ thống và phát triển hệ sinh thái sáng tạo nội dung số, góp phần thúc đẩy môi trường số minh bạch, an toàn và phát triển bền vững tại Việt Nam.</p>
    <h2>TẦM NHÌN</h2>
    <p>Trở thành nền tảng thông tin và cơ sở dữ liệu quốc gia uy tín về nhà sáng tạo nội dung số và quảng cáo trực tuyến Việt Nam; là cầu nối tin cậy giữa cơ quan quản lý nhà nước, nền tảng số, doanh nghiệp và cộng đồng nhà sáng tạo nội dung, góp phần xây dựng môi trường số minh bạch, an toàn và phát triển bền vững.</p>
    <h2>SỨ MỆNH</h2>
    <ul><li>Xây dựng và vận hành cơ sở dữ liệu tập trung về KOL, KOC, Creator và MCN tại Việt Nam.</li><li>Cung cấp thông tin chính thống, minh bạch và đáng tin cậy về hệ sinh thái sáng tạo nội dung số.</li><li>Hỗ trợ công tác quản lý nhà nước, bảo vệ quyền lợi của người dùng và các chủ thể tham gia môi trường số.</li><li>Thúc đẩy các chuẩn mực nghề nghiệp, đạo đức và trách nhiệm xã hội trong hoạt động sáng tạo nội dung và quảng cáo trực tuyến.</li><li>Kết nối nhà sáng tạo nội dung, doanh nghiệp, nền tảng số và cơ quan quản lý nhằm tạo dựng hệ sinh thái phát triển lành mạnh, chuyên nghiệp và hiệu quả.</li></ul>
    <h2>GIÁ TRỊ CỐT LÕI</h2>
    <ul><li>Thông tin được xây dựng trên cơ sở dữ liệu xác thực và tuân thủ quy định pháp luật.</li><li>Công khai các tiêu chí, chỉ số và thông tin theo nguyên tắc rõ ràng, khách quan.</li><li>Bảo đảm độ chính xác, an toàn và khả năng kiểm chứng của dữ liệu.</li><li>Tạo môi trường hợp tác hiệu quả giữa nhà sáng tạo nội dung, doanh nghiệp, nền tảng số và cơ quan quản lý.</li><li>Không ngừng ứng dụng công nghệ và phương thức quản trị hiện đại để nâng cao chất lượng dịch vụ.</li><li>Khuyến khích sáng tạo nội dung tích cực, tuân thủ pháp luật và đóng góp cho cộng đồng.</li></ul>
  </div>;
}

export default async function ArticlePage({ params }: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  if (slug !== documentSlug && slug !== introductionSlug) notFound();
  const isIntroduction = slug === introductionSlug;
  const title = isIntroduction ? "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN" : "BỘ QUY TẮC ỨNG XỬ VĂN HOÁ TRÊN MÔI TRƯỜNG SỐ";
  const date = isIntroduction ? "14/07/2026" : "16/07/2026";
  const minutes = isIntroduction ? "2 phút đọc" : "1 phút đọc";

  return <>
    <SiteChrome showTicker={false} />
    <main className="article-page">
      <div className="article-crumb"><div className="site-container"><Link href="/">Trang chủ</Link><span>›</span><Link href="/tin-tuc">Bản tin</Link><span>›</span><strong>{title}</strong></div></div>
      <div className="site-container article-layout">
        <article className="article-main">
          <Link className="article-back" href="/tin-tuc"><ArrowLeft size={15} />Quay lại danh sách</Link>
          <div className="article-card">
            <div className="article-hero"><Image src={isIntroduction ? "/assets/news/gioi-thieu-hero.webp" : "/assets/news/bo-quy-tac.webp"} alt={title} fill priority sizes="(max-width: 1023px) 100vw, 740px" /></div>
            <div className="article-copy">{!isIntroduction && <span className="article-category">Hoạt động cục</span>}<h1>{title}</h1><div className="article-meta"><span><CalendarDays size={14} />{date}</span><i>·</i><span><Clock3 size={14} />{minutes}</span></div>{isIntroduction ? <IntroductionContent /> : <RuleContent />}</div>
          </div>
          <section className="related-posts"><h2><i />Bài viết liên quan</h2><div><Link href="/tin-tuc" className="related-card"><Image src="/assets/news/an-ninh-mang.webp" alt="" width={400} height={225} /><span>Tin tức nổi bật</span><strong>Thủ tướng: Mỗi người dân cần ứng xử văn minh trên không gian mạng</strong><small><CalendarDays size={12} />07/08/2026</small></Link><Link href="/tin-tuc" className="related-card"><Image src="/assets/news/livestream.webp" alt="" width={400} height={225} /><span>Tin tức nổi bật</span><strong>Chuẩn hóa kỹ năng Livestream, nâng cao trách nhiệm của nhà sáng tạo nội dung số.</strong><small><CalendarDays size={12} />03/08/2026</small></Link></div></section>
        </article>
        <aside className="article-sidebar"><h2><i />Tin khác</h2>{otherPosts.map((post) => <Link href="/tin-tuc" className="article-other" key={post.title}><Image src={post.image} alt="" width={72} height={52} /><span><strong>{post.title}</strong><small><CalendarDays size={11} />{post.date}</small></span></Link>)}<Link href="/tin-tuc" className="article-all">Xem tất cả tin tức ›</Link></aside>
      </div>
    </main>
    <SiteFooter />
  </>;
}
