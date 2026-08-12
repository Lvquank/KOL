import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { fetchNewsDetailBySlug, fetchApiNews, formatNewsDate, type ApiNewsItem } from "@/lib/api-news";

const documentSlug = "bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so";
const introductionSlug = "gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn";

function RuleContent() {
  return (
    <div className="article-body">
      <Image src="/assets/news/quy-tac-1.jpg" alt="Quy tắc ứng xử trên môi trường số" width={1875} height={3333} unoptimized />
      <Image src="/assets/news/quy-tac-2.jpg" alt="Quy tắc ứng xử trên môi trường số" width={2813} height={7500} unoptimized />
      <Image src="/assets/news/quy-tac-3.jpg" alt="Quy tắc ứng xử trên môi trường số" width={1875} height={2344} unoptimized />
    </div>
  );
}

function IntroductionContent() {
  return (
    <div className="article-body article-prose">
      <p>
        Cổng thông tin điện tử và cơ sở dữ liệu về nhà sáng tạo nội dung số và quảng cáo trực tuyến Việt Nam (kol.gov.vn) là nền tảng thông tin chính thống do Cục Phát thanh, truyền hình và Thông tin điện tử - Bộ Văn hóa Thể thao và Du lịch chủ trì xây dựng; giao Trung tâm Đo kiểm Phát thanh truyền hình và Thông tin điện tử quản lý, vận hành. Cổng được phát triển với sự đồng hành của Công ty NetSpace trong vai trò đối tác công nghệ, phối hợp quản lý, vận hành hệ thống và phát triển hệ sinh thái sáng tạo nội dung số, góp phần thúc đẩy môi trường số minh bạch, an toàn và phát triển bền vững tại Việt Nam.
      </p>
      <h2>TẦM NHÌN</h2>
      <p>
        Trở thành nền tảng thông tin và cơ sở dữ liệu quốc gia uy tín về nhà sáng tạo nội dung số và quảng cáo trực tuyến Việt Nam; là cầu nối tin cậy giữa cơ quan quản lý nhà nước, nền tảng số, doanh nghiệp và cộng đồng nhà sáng tạo nội dung, góp phần xây dựng môi trường số minh bạch, an toàn và phát triển bền vững.
      </p>
      <h2>SỨ MỆNH</h2>
      <ul>
        <li>Xây dựng và vận hành cơ sở dữ liệu tập trung về KOL, KOC, Creator và MCN tại Việt Nam.</li>
        <li>Cung cấp thông tin chính thống, minh bạch và đáng tin cậy về hệ sinh thái sáng tạo nội dung số.</li>
        <li>Hỗ trợ công tác quản lý nhà nước, bảo vệ quyền lợi của người dùng và các chủ thể tham gia môi trường số.</li>
        <li>Thúc đẩy các chuẩn mực nghề nghiệp, đạo đức và trách nhiệm xã hội trong hoạt động sáng tạo nội dung và quảng cáo trực tuyến.</li>
        <li>Kết nối nhà sáng tạo nội dung, doanh nghiệp, nền tảng số và cơ quan quản lý nhằm tạo dựng hệ sinh thái phát triển lành mạnh, chuyên nghiệp và hiệu quả.</li>
      </ul>
      <h2>GIÁ TRỊ CỐT LÕI</h2>
      <ul>
        <li>Thông tin được xây dựng trên cơ sở dữ liệu xác thực và tuân thủ quy định pháp luật.</li>
        <li>Công khai các tiêu chí, chỉ số và thông tin theo nguyên tắc rõ ràng, khách quan.</li>
        <li>Bảo đảm độ chính xác, an toàn và khả năng kiểm chứng của dữ liệu.</li>
        <li>Tạo môi trường hợp tác hiệu quả giữa nhà sáng tạo nội dung, doanh nghiệp, nền tảng số và cơ quan quản lý.</li>
        <li>Không ngừng ứng dụng công nghệ và phương thức quản trị hiện đại để nâng cao chất lượng dịch vụ.</li>
        <li>Khuyến khích sáng tạo nội dung tích cực, tuân thủ pháp luật và đóng góp cho cộng đồng.</li>
      </ul>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch dynamic news detail directly from database via API
  const article: ApiNewsItem | null = await fetchNewsDetailBySlug(slug);

  if (!article) {
    notFound();
  }

  // Fetch all news for sidebar & related items
  const allNews = await fetchApiNews();
  const relatedPosts = allNews.filter((item) => item.slug !== article?.slug).slice(0, 2);
  const sidebarPosts = allNews.filter((item) => item.slug !== article?.slug).slice(0, 4);

  const title = article.title;
  const categoryName = article.category || article.categories?.[0]?.name || "Tin tức";
  const date = formatNewsDate(article.published_date);
  const minutes = `${article.reading_minutes || 2} phút đọc`;

  return (
    <>
      <SiteChrome showTicker={false} />
      <main className="article-page">
        <div className="article-crumb">
          <div className="site-container">
            <Link href="/">Trang chủ</Link>
            <span>›</span>
            <Link href="/tin-tuc">Bản tin</Link>
            <span>›</span>
            <strong>{title}</strong>
          </div>
        </div>

        <div className="site-container article-layout">
          <article className="article-main">
            <Link className="article-back" href="/tin-tuc">
              <ArrowLeft size={15} /> Quay lại danh sách
            </Link>
            <div className="article-card">
              <div className="article-hero">
                <Image
                  src={article.image_url}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 740px"
                  unoptimized={article.image_url.startsWith("http")}
                />
              </div>
              <div className="article-copy">
                <span className="article-category">{categoryName}</span>
                <h1>{title}</h1>
                <div className="article-meta">
                  <span>
                    <CalendarDays size={14} />
                    {date}
                  </span>
                  <i>·</i>
                  <span>
                    <Clock3 size={14} />
                    {minutes}
                  </span>
                </div>

                {article.body_html ? (
                  <div
                    className="article-body article-prose"
                    dangerouslySetInnerHTML={{ __html: article.body_html }}
                  />
                ) : slug === documentSlug ? (
                  <RuleContent />
                ) : slug === introductionSlug ? (
                  <IntroductionContent />
                ) : (
                  <div className="article-body article-prose">
                    <p>{article.excerpt || article.title}</p>
                  </div>
                )}
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <section className="related-posts">
                <h2>
                  <i /> Bài viết liên quan
                </h2>
                <div>
                  {relatedPosts.map((post) => (
                    <Link
                      href={`/tin-tuc/${post.slug}`}
                      className="related-card"
                      key={post.slug || post.title}
                    >
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={400}
                        height={225}
                        unoptimized={post.image_url.startsWith("http")}
                      />
                      <span>{post.category || "Tin tức"}</span>
                      <strong>{post.title}</strong>
                      <small>
                        <CalendarDays size={12} />
                        {formatNewsDate(post.published_date)}
                      </small>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="article-sidebar">
            <h2>
              <i /> Tin khác
            </h2>
            {sidebarPosts.map((post) => (
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="article-other"
                key={post.slug || post.title}
              >
                <Image
                  src={post.image_url}
                  alt={post.title}
                  width={72}
                  height={52}
                  unoptimized={post.image_url.startsWith("http")}
                />
                <span>
                  <strong>{post.title}</strong>
                  <small>
                    <CalendarDays size={11} />
                    {formatNewsDate(post.published_date)}
                  </small>
                </span>
              </Link>
            ))}
            <Link href="/tin-tuc" className="article-all">
              Xem tất cả tin tức ›
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
