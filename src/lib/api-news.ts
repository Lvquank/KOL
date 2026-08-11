export interface ApiNewsCategory {
  key: string;
  name: string;
}

export interface ApiCategoryItem {
  category_key: string;
  name: string;
  post_count: number;
}

export interface ApiNewsTag {
  key: string;
  name: string;
}

export interface ApiNewsItem {
  slug: string;
  source_url: string;
  category: string;
  title: string;
  excerpt: string | null;
  published_date: string;
  reading_minutes: number;
  image_url: string;
  scraped_at: string;
  categories: ApiNewsCategory[];
  tags: string[];
  body_html?: string;
  normalized_tags?: ApiNewsTag[];
}

export interface ApiNewsResponse {
  success?: boolean;
  data: ApiNewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function formatNewsDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoString;
  }
}

export async function fetchApiCategories(): Promise<ApiCategoryItem[]> {
  try {
    const fetchOptions: RequestInit =
      typeof window === "undefined" ? { next: { revalidate: 60 } } as RequestInit : { cache: "no-store" };
    const res = await fetch("http://127.0.0.1:4000/api/v1/news/categories", fetchOptions);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return FALLBACK_CATEGORIES;
  } catch (error) {
    console.warn("Failed to fetch categories from API, using fallback categories:", error);
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchApiNews(category?: string): Promise<ApiNewsItem[]> {
  try {
    const fetchOptions: RequestInit =
      typeof window === "undefined" ? { next: { revalidate: 60 } } as RequestInit : { cache: "no-store" };
    
    const url = "http://127.0.0.1:4000/api/v1/news?limit=100";
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const json: ApiNewsResponse = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      if (category && category !== "Tất cả") {
        return json.data.filter(
          (item) =>
            item.category === category ||
            item.categories?.some((c) => c.name === category)
        );
      }
      return json.data;
    }
    return FALLBACK_NEWS;
  } catch (error) {
    console.warn("Failed to fetch news from API, using fallback news:", error);
    return FALLBACK_NEWS;
  }
}

export async function fetchNewsDetailBySlug(slug: string): Promise<ApiNewsItem | null> {
  try {
    const fetchOptions: RequestInit =
      typeof window === "undefined" ? { next: { revalidate: 60 } } as RequestInit : { cache: "no-store" };
    const res = await fetch(`http://127.0.0.1:4000/api/v1/news/${encodeURIComponent(slug)}`, fetchOptions);
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    if (json && !json.error && json.title) {
      return json as ApiNewsItem;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch news detail for slug ${slug}:`, error);
    return null;
  }
}

export const FALLBACK_CATEGORIES: ApiCategoryItem[] = [
  { category_key: "cat_cadb46c1e6821f3171eb8cb921b116db", name: "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN", post_count: 1 },
  { category_key: "cat_25414bded41259026cb057437927f13d", name: "Hoạt động cục", post_count: 3 },
  { category_key: "cat_dccfc214162f94f6792daababbed2b2c", name: "Sự kiện", post_count: 3 },
  { category_key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật", post_count: 7 },
];

export const FALLBACK_NEWS: ApiNewsItem[] = [
  {
    slug: "thu-tuong-moi-nguoi-dan-can-ung-xu-van-minh-tren-khong-gian-mang",
    source_url: "https://kol.gov.vn/tin-tuc/thu-tuong-moi-nguoi-dan-can-ung-xu-van-minh-tren-khong-gian-mang",
    category: "Tin tức nổi bật",
    title: "Thủ tướng: Mỗi người dân cần ứng xử văn minh trên không gian mạng",
    excerpt: "Tại lễ mít tinh hưởng ứng Ngày An ninh mạng Việt Nam, Thủ tướng đề nghị mỗi người dân tự trang bị kỹ năng số và cùng chung sức xây dựng môi trường mạng lành mạnh.",
    published_date: "2026-08-07T00:00:00.000Z",
    reading_minutes: 5,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/08/ngay-an-ninh-mang-67Ccwl-raEhyR.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "chuan-hoa-ky-nang-livestream-nang-cao-trach-nhiem-cua-nha-sang-tao-noi-dung-so",
    source_url: "https://kol.gov.vn/tin-tuc/chuan-hoa-ky-nang-livestream-nang-cao-trach-nhiem-cua-nha-sang-tao-noi-dung-so",
    category: "Tin tức nổi bật",
    title: "Chuẩn hóa kỹ năng Livestream, nâng cao trách nhiệm của nhà sáng tạo nội dung số.",
    excerpt: "Lớp bồi dưỡng nghiệp vụ Livestream góp phần nâng cao năng lực nghề nghiệp, nhận thức pháp luật và trách nhiệm của đội ngũ sáng tạo nội dung số.",
    published_date: "2026-08-03T00:00:00.000Z",
    reading_minutes: 4,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/08/1-jwb7jJ-HsLpV9.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "livestream-lau-co-the-bi-xu-phat-toi-250-trieu-dong",
    source_url: "https://kol.gov.vn/tin-tuc/livestream-lau-co-the-bi-xu-phat-toi-250-trieu-dong",
    category: "Tin tức nổi bật",
    title: "Livestream lậu có thể bị xử phạt tới 250 triệu đồng",
    excerpt: "Các chuyên gia cảnh báo tình trạng đăng tải, livestream trái phép những nội dung số đang diễn ra ngày càng tinh vi và cần được xử lý nghiêm.",
    published_date: "2026-07-30T00:00:00.000Z",
    reading_minutes: 3,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/3-X0d4fT-yZJi6q.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "hinh-thanh-doi-ngu-nha-sang-tao-noi-dung-so-chuyen-nghiep",
    source_url: "https://kol.gov.vn/tin-tuc/hinh-thanh-doi-ngu-nha-sang-tao-noi-dung-so-chuyen-nghiep",
    category: "Tin tức nổi bật",
    title: "Hình thành đội ngũ nhà sáng tạo nội dung số chuyên nghiệp",
    excerpt: "Chương trình đào tạo hướng đến việc hình thành lực lượng nhà sáng tạo nội dung số có kỹ năng, trách nhiệm và phát triển bền vững.",
    published_date: "2026-07-29T00:00:00.000Z",
    reading_minutes: 5,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/1-VdBApl-ic847Y.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "xay-dung-doi-ngu-nha-sang-tao-noi-dung-so-chuyen-nghiep",
    source_url: "https://kol.gov.vn/tin-tuc/xay-dung-doi-ngu-nha-sang-tao-noi-dung-so-chuyen-nghiep",
    category: "Tin tức nổi bật",
    title: "Xây dựng đội ngũ nhà sáng tạo nội dung số chuyên nghiệp",
    excerpt: "Công tác bồi dưỡng kỹ năng và định hướng ứng xử văn minh trên không gian mạng.",
    published_date: "2026-07-26T00:00:00.000Z",
    reading_minutes: 4,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/16-v1-DSnaSZ-0FDWbY.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "trung-tam-do-kiem-phat-thanh-truyen-hinh-va-thong-tin-dien-tu-hop-tac-chien-luoc-voi-nutifood",
    source_url: "https://kol.gov.vn/tin-tuc/trung-tam-do-kiem-phat-thanh-truyen-hinh-va-thong-tin-dien-tu-hop-tac-chien-luoc-voi-nutifood",
    category: "Hoạt động cục",
    title: "Trung tâm Đo kiểm hợp tác chiến lược với Nutifood nhằm đào tạo nguồn nhân lực truyền thông số",
    excerpt: "Trung tâm Đo kiểm Phát thanh, Truyền hình và Thông tin điện tử ký kết thỏa thuận hợp tác chiến lược cùng Nutifood.",
    published_date: "2026-07-24T17:00:00.000Z",
    reading_minutes: 7,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/6-Tmej8n-YH6zkw.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_25414bded41259026cb057437927f13d", name: "Hoạt động cục" }],
    tags: []
  },
  {
    slug: "nang-tam-chuyen-nghiep-cho-nha-sang-tao-noi-dung-so",
    source_url: "https://kol.gov.vn/tin-tuc/nang-tam-chuyen-nghiep-cho-nha-sang-tao-noi-dung-so",
    category: "Sự kiện",
    title: "Nâng tầm chuyên nghiệp cho nhà sáng tạo nội dung số",
    excerpt: "Hội thảo chuyên đề nâng cao kỹ năng truyền thông số chuyên nghiệp.",
    published_date: "2026-07-19T17:00:00.000Z",
    reading_minutes: 7,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/blobid6-zvjt5a6esetmi7gc-OCN2fn-IxYOcW.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_dccfc214162f94f6792daababbed2b2c", name: "Sự kiện" }],
    tags: []
  },
  {
    slug: "nhieu-nghe-si-kol-koc-creator-doanh-nghiep-tham-gia-lop-boi-duong-nghiep-vu-livestream-khoa-11",
    source_url: "https://kol.gov.vn/tin-tuc/nhieu-nghe-si-kol-koc-creator-doanh-nghiep-tham-gia-lop-boi-duong-nghiep-vu-livestream-khoa-11",
    category: "Hoạt động cục",
    title: "Nhiều nghệ sĩ, KOL, KOC, CREATOR, doanh nghiệp tham gia Lớp Bồi dưỡng nghiệp vụ Livestream Khóa 11",
    excerpt: "Chương trình do Trung tâm đo kiểm phát thanh truyền hình và thông tin điện tử phối hợp tổ chức.",
    published_date: "2026-07-18T17:00:00.000Z",
    reading_minutes: 4,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/111-EAbcks-vZV5CN.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_25414bded41259026cb057437927f13d", name: "Hoạt động cục" }],
    tags: []
  },
  {
    slug: "bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so",
    source_url: "https://kol.gov.vn/tin-tuc/bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so",
    category: "Hoạt động cục",
    title: "BỘ QUY TẮC ỨNG XỬ VĂN HOÁ TRÊN MÔI TRƯỜNG SỐ",
    excerpt: "Bộ quy tắc ứng xử văn hóa trên không gian mạng.",
    published_date: "2026-07-15T17:00:00.000Z",
    reading_minutes: 1,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so-WRzxZr-cTRcuf.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_25414bded41259026cb057437927f13d", name: "Hoạt động cục" }],
    tags: []
  },
  {
    slug: "cuc-phat-thanh-truyen-hinh-va-thong-tin-dien-tu-ra-mat-cong-thong-tin-dien-tu-va-co-so-du-lieu-ve-nha-sang-tao-noi-dung-so-va-quang-cao-truc-tuyen-viet-nam-kolgovvn",
    source_url: "https://kol.gov.vn/tin-tuc/cuc-phat-thanh-truyen-hinh-va-thong-tin-dien-tu-ra-mat-cong-thong-tin-dien-tu-va-co-so-du-lieu-ve-nha-sang-tao-noi-dung-so-va-quang-cao-truc-tuyen-viet-nam-kolgovvn",
    category: "Tin tức nổi bật",
    title: "Cục Phát thanh, truyền hình và Thông tin điện tử ra mắt Cổng thông tin điện tử kol.gov.vn",
    excerpt: "Lễ ra mắt Cổng thông tin điện tử và cơ sở dữ liệu về nhà sáng tạo nội dung số.",
    published_date: "2026-07-15T17:00:00.000Z",
    reading_minutes: 6,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/14-7-2026-1-o1ct2H-r4MjiV.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "dau-tranh-voi-thong-tin-sai-lech-khang-dinh-vai-tro-cua-bao-chi-chinh-thong-bai-2-tin-gia-hoanh-hanh-va-vai-tro-hang-rao-mien-dich-cua-bao-chi-chinh-thong",
    source_url: "https://kol.gov.vn/tin-tuc/dau-tranh-voi-thong-tin-sai-lech-khang-dinh-vai-tro-cua-bao-chi-chinh-thong-bai-2-tin-gia-hoanh-hanh-va-vai-tro-hang-rao-mien-dich-cua-bao-chi-chinh-thong",
    category: "Sự kiện",
    title: "Đấu tranh với thông tin sai lệch: Bài 2 - Tin giả hoành hành và vai trò hàng rào miễn dịch của báo chí chính thống",
    excerpt: "Đấu tranh với tin giả trên không gian mạng.",
    published_date: "2026-07-15T17:00:00.000Z",
    reading_minutes: 10,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/13-7-2026-10-WHTH2R-AEiKEn.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_dccfc214162f94f6792daababbed2b2c", name: "Sự kiện" }],
    tags: []
  },
  {
    slug: "siet-quan-tri-hoi-nhom-tren-mang-xa-hoi-tu-17",
    source_url: "https://kol.gov.vn/tin-tuc/siet-quan-tri-hoi-nhom-tren-mang-xa-hoi-tu-17",
    category: "Sự kiện",
    title: "Siết quản trị hội nhóm trên mạng xã hội từ 1/7",
    excerpt: "Quy định siết chặt hoạt động quản trị các hội nhóm mạng xã hội.",
    published_date: "2026-07-15T17:00:00.000Z",
    reading_minutes: 7,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/02-07-2026-k1wsWx-kxqSj0.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_dccfc214162f94f6792daababbed2b2c", name: "Sự kiện" }],
    tags: []
  },
  {
    slug: "thong-bao-ve-lop-hoc-boi-duong-nghiep-vu-livestream-khoa-11-thang-072026",
    source_url: "https://kol.gov.vn/tin-tuc/thong-bao-ve-lop-hoc-boi-duong-nghiep-vu-livestream-khoa-11-thang-072026",
    category: "Tin tức nổi bật",
    title: "Thông báo về lớp học bồi dưỡng nghiệp vụ Livestream khóa 11 (Tháng 07/2026)",
    excerpt: "Thông báo lớp bồi dưỡng livestream chuyên nghiệp.",
    published_date: "2026-07-15T17:00:00.000Z",
    reading_minutes: 1,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/chatgpt-image-14-16-29-1-thg-7-2026-i00wNz-JROj6P.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_6422c21749908dea4d96717cc05540ea", name: "Tin tức nổi bật" }],
    tags: []
  },
  {
    slug: "gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn",
    source_url: "https://kol.gov.vn/tin-tuc/gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn",
    category: "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN",
    title: "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN",
    excerpt: "Giới thiệu tổng quan nền tảng kol.gov.vn",
    published_date: "2026-07-13T17:00:00.000Z",
    reading_minutes: 2,
    image_url: "https://s3.hn-1.cloud.cmctelecom.vn/netspace/shared/2026/07/gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn-ngang-Sptupt-S2bhzl.webp",
    scraped_at: "2026-08-10T04:07:12.000Z",
    categories: [{ key: "cat_cadb46c1e6821f3171eb8cb921b116db", name: "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN" }],
    tags: []
  }
];
