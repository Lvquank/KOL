"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "Tất cả" | "Hoạt động cục" | "Sự kiện" | "Tin tức nổi bật";

const posts = [
  { title: "Thủ tướng: Mỗi người dân cần ứng xử văn minh trên không gian mạng", category: "Tin tức nổi bật", date: "07/08/2026", image: "/assets/news/an-ninh-mang.webp", brief: "Tại lễ mít tinh hưởng ứng Ngày An ninh mạng Việt Nam, Thủ tướng đề nghị mỗi người dân tự trang bị kỹ năng số và cùng chung sức xây dựng môi trường mạng lành mạnh." },
  { title: "Chuẩn hóa kỹ năng Livestream, nâng cao trách nhiệm của nhà sáng tạo nội dung số.", category: "Tin tức nổi bật", date: "03/08/2026", image: "/assets/news/livestream.webp", brief: "Lớp bồi dưỡng nghiệp vụ Livestream góp phần nâng cao năng lực nghề nghiệp, nhận thức pháp luật và trách nhiệm của đội ngũ sáng tạo nội dung số." },
  { title: "Livestream lậu có thể bị xử phạt tới 250 triệu đồng", category: "Tin tức nổi bật", date: "30/07/2026", image: "/assets/news/ban-quyen.webp", brief: "Các chuyên gia cảnh báo tình trạng đăng tải, livestream trái phép những nội dung số đang diễn ra ngày càng tinh vi và cần được xử lý nghiêm." },
  { title: "Hình thành đội ngũ nhà sáng tạo nội dung số chuyên nghiệp", category: "Sự kiện", date: "29/07/2026", image: "/assets/news/livestream.webp", brief: "Chương trình đào tạo hướng đến việc hình thành lực lượng nhà sáng tạo nội dung số có kỹ năng, trách nhiệm và phát triển bền vững." },
  { title: "Trung tâm Đo kiểm hợp tác chiến lược với Nutifood nhằm đào tạo nguồn nhân lực truyền thông số", category: "Hoạt động cục", date: "25/07/2026", image: "/assets/news/gioi-thieu.webp", brief: "Trung tâm Đo kiểm Phát thanh, Truyền hình và Thông tin điện tử ký kết thỏa thuận hợp tác chiến lược nhằm phát triển nguồn nhân lực truyền thông số." },
  { title: "Bộ quy tắc ứng xử văn hóa trên môi trường số", category: "Hoạt động cục", date: "20/07/2026", image: "/assets/news/bo-quy-tac.webp", brief: "Các khuyến nghị góp phần xây dựng không gian số an toàn, lành mạnh và có trách nhiệm cho cộng đồng." },
] as const;

const categories: Category[] = ["Tất cả", "Hoạt động cục", "Sự kiện", "Tin tức nổi bật"];

export function NewsArchive() {
  const [category, setCategory] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");
  const filteredPosts = useMemo(() => posts.filter((post) => (category === "Tất cả" || post.category === category) && `${post.title} ${post.brief}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [category, query]);
  const featured = posts[4];

  return <div className="archive-page">
    <div className="archive-crumb"><div className="site-container"><Link href="/">Trang chủ</Link><span>/</span><strong>Bản tin</strong></div></div>
    <section className="archive-title"><div className="site-container"><h1>Bản tin</h1><p>Thông tin, báo cáo, phân tích từ Cục Phát thanh, truyền hình và thông tin điện tử</p></div></section>
    <div className="site-container archive-layout">
      <section className="archive-main">
        <div className="archive-filters">
          <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm tin tức..." /></label>
          <div>{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>
        <p className="archive-count">Tìm thấy {filteredPosts.length} bài viết</p>
        <div className="archive-list">{filteredPosts.map((post) => <a href={`https://kol.gov.vn/tin-tuc/${post.title === posts[0].title ? "thu-tuong-moi-nguoi-dan-can-ung-xu-van-minh-tren-khong-gian-mang" : ""}`} target="_blank" rel="noreferrer" className="archive-card" key={post.title}>
          <div className="archive-image"><Image src={post.image} alt={post.title} fill sizes="(max-width: 767px) 100vw, 240px" /></div>
          <div className="archive-copy"><span>{post.category}</span><h2>{post.title}</h2><p>{post.brief}</p><small><Clock3 size={13} />{post.date}<i>·</i>1 phút đọc</small></div>
        </a>)}</div>
        {filteredPosts.length === 0 && <p className="archive-empty">Không tìm thấy bài viết phù hợp.</p>}
        <div className="archive-pages"><button type="button" aria-current="page">1</button><button type="button">2</button></div>
      </section>
      <aside className="archive-sidebar">
        <section><h2>Tin nổi bật</h2><a className="sidebar-featured" href="https://kol.gov.vn/tin-tuc" target="_blank" rel="noreferrer"><Image src={featured.image} alt="" width={110} height={76} /><span><b>{featured.category}</b>{featured.title}<small>{featured.date}</small></span></a></section>
        <section><h2>Tin mới nhất</h2>{posts.slice(0, 4).map((post) => <a className="sidebar-row" href="https://kol.gov.vn/tin-tuc" target="_blank" rel="noreferrer" key={post.title}><span>{post.title}<small>{post.date}</small></span></a>)}</section>
        <section><h2>Danh mục</h2>{categories.slice(1).map((item) => <button type="button" key={item} onClick={() => setCategory(item)}>{item}<span>{posts.filter((post) => post.category === item).length}</span></button>)}</section>
      </aside>
    </div>
  </div>;
}
