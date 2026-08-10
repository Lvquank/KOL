import type { NewsItem, RankedNetwork, RankedPerson, SocialItem } from "@/types/content";

export const sourceUrl = "https://kol.gov.vn/";

export const newsItems: NewsItem[] = [
  {
    title: "Thủ tướng: Mỗi người dân cần ứng xử văn minh trên không gian mạng",
    image: "/assets/news/an-ninh-mang.webp",
    sourcePath: "tin-tuc/thu-tuong-moi-nguoi-dan-can-ung-xu-van-minh-tren-khong-gian-mang",
    date: "07/08/2026",
  },
  {
    title: "Chuẩn hóa kỹ năng Livestream, nâng cao trách nhiệm của nhà sáng tạo nội dung số.",
    image: "/assets/news/livestream.webp",
    sourcePath: "tin-tuc/chuan-hoa-ky-nang-livestream-nang-cao-trach-nhiem-cua-nha-sang-tao-noi-dung-so",
    date: "03/08/2026",
  },
  {
    title: "Livestream lậu có thể bị xử phạt tới 250 triệu đồng",
    image: "/assets/news/ban-quyen.webp",
    sourcePath: "tin-tuc/livestream-lau-co-the-bi-xu-phat-toi-250-trieu-dong",
    date: "30/07/2026",
  },
];

export const documentItems = [
  { title: "GIỚI THIỆU TỔNG QUAN VỀ CỔNG THÔNG TIN KOL.GOV.VN", image: "/assets/news/gioi-thieu.webp", localPath: "/tin-tuc/gioi-thieu-tong-quan-ve-cong-thong-tin-kolgovvn" },
  { title: "BỘ QUY TẮC ỨNG XỬ VĂN HOÁ TRÊN MÔI TRƯỜNG SỐ", image: "/assets/news/bo-quy-tac.webp", localPath: "/tin-tuc/bo-quy-tac-ung-xu-van-hoa-tren-moi-truong-so" },
  { title: "THÔNG CÁO BÁO CHÍ", image: "/assets/news/thong-cao.webp" },
];

export const featuredPeople: RankedPerson[] = [
  { rank: 2, name: "BEN EAGLE", legalName: "BEN EAGLE", image: "/assets/kols/ben-eagle.jpg", metric: "+87.7 Tr", delta: "28.6%", key: "kol_b7ee88dd5df07f7770bd1b25e2d2268c" },
  { rank: 1, name: "Son Tung M-TP", legalName: "Nguyễn Thanh Tùng", image: "/assets/kols/son-tung.jpg", metric: "−52 Tr", delta: "5.0%", key: "3714" },
  { rank: 3, name: "Lê Dương Bảo.Lâm", legalName: "Lê Dương Bảo Lâm", image: "/assets/kols/le-duong-bao-lam.jpg", metric: "+24.5 Tr", delta: "33.7%", key: "kol_410895ba45bbcc8d6e6210cfada937e5" },
];

export const peopleRows: RankedPerson[] = [
  { rank: 4, name: "Chang Dory", legalName: "Chang Dory", image: "/assets/kols/chang-dory.jpg", metric: "+14.7 Tr", delta: "+3.1%", key: "kol_a20425ba091c7e03b9604d6f36265c06" },
  { rank: 5, name: "Ngô Đức Duy", legalName: "Ngô Đức Duy", image: "/assets/kols/ngo-duc-duy.jpg", metric: "+9.8 Tr", delta: "+6.2%", key: "kol_f9ee33246a44f0393412fe4b182245c2" },
  { rank: 6, name: "Ivan", legalName: "Nghiêm Vũ Hoàng Long", image: "/assets/kols/ivan.jpg", metric: "+9.5 Tr", delta: "+2.5%", key: "kol_07cbd063660c1911c7dd6366236fafeb" },
  { rank: 7, name: "HIEUTHUHAI", legalName: "Trần Minh Hiếu", image: "/assets/kols/hieuthuhai.jpg", metric: "+9.1 Tr", delta: "+1.7%", key: "kol_7dc50e76cc5e2d1a0703dbe2b9e3359c" },
  { rank: 8, name: "Nguyễn Chí Thanh", legalName: "Nguyễn Chí Thanh", image: "/assets/kols/nguyen-chi-thanh.webp", metric: "+7.2 Tr", delta: "+4.4%", key: "kol_aaff6828036ca84867c775ab313881a1" },
  { rank: 9, name: "Phương Mỹ Chi", legalName: "Phương Mỹ Chi", image: "/assets/kols/phuong-my-chi.jpg", metric: "+6.4 Tr", delta: "+3.7%", key: "kol_2d3aaf00acfeece36efcee31fa3f8e47" },
  { rank: 10, name: "Tuyền Văn Hóa", legalName: "Tuyền Văn Hóa", image: "/assets/kols/tuyen-van-hoa.jpg", metric: "+6.2 Tr", delta: "+19.7%", key: "kol_cfe0971058e2effca817ebbeb70e5283" },
];

export const networkRows: RankedNetwork[] = [
  { rank: 1, name: "VCCorp", detail: "34 kênh · 0 KOL", image: "/assets/mcn/vccorp.webp", metric: "+56 Tr", delta: "+24.9%" },
  { rank: 2, name: "Viettel", detail: "56 kênh · 1 KOL", image: "/assets/mcn/viettel.webp", metric: "+13.7 Tr", delta: "+7.7%" },
  { rank: 3, name: "Zeit Media", detail: "12 kênh · 0 KOL", image: "/assets/mcn/zeit.webp", metric: "+12.7 Tr", delta: "+26.1%" },
  { rank: 4, name: "VieNETWORK", detail: "71 kênh · 0 KOL", image: "/assets/mcn/vie-network.webp", metric: "+4.3 Tr", delta: "+1.5%" },
  { rank: 5, name: "NetSpace", detail: "62 kênh · 10 KOL", image: "/assets/mcn/netspace.webp", metric: "+2.8 Tr", delta: "+1.2%" },
  { rank: 6, name: "TVH Media", detail: "27 kênh · 28 KOL", image: "/assets/mcn/tvh.webp", metric: "+2.4 Tr", delta: "+0.8%" },
  { rank: 7, name: "VietNamNet", detail: "4 kênh · 0 KOL", image: "/assets/mcn/vietnamnet.webp", metric: "+1.2 Tr", delta: "+18.4%" },
  { rank: 8, name: "Radiant VN", detail: "13 kênh · 0 KOL", image: "/assets/mcn/radiant.webp", metric: "+645,389", delta: "+2.0%" },
  { rank: 9, name: "Trung tâm Nội Dung Số", detail: "26 kênh · 1 KOL", image: "/assets/mcn/noi-dung-so.webp", metric: "+611,677", delta: "+0.5%" },
  { rank: 10, name: "Vietnam Music Award", detail: "23 kênh · 0 KOL", image: "/assets/mcn/vma.webp", metric: "+96,735", delta: "+0.4%" },
];

export const socialItems: SocialItem[] = [
  { rank: 1, name: "Sơn Tùng M-TP", score: "280.629", image: "/assets/social/son-tung.jpg" },
  { rank: 2, name: "Hoa Hậu Hương Giang", score: "109.486", image: "/assets/social/huong-giang.jpg" },
  { rank: 3, name: "HIEUTHUHAI", score: "32.691", image: "/assets/social/hieuthuhai.jpg" },
  { rank: 4, name: "Binz", score: "28.823", image: "/assets/social/binz.jpg" },
  { rank: 5, name: "SOOBIN", score: "27.023", image: "/assets/social/soobin.jpg" },
  { rank: 6, name: "RHYDER", score: "23.370", image: "/assets/social/rhyder.jpg" },
  { rank: 7, name: "Nguyễn Văn Chung", score: "23.265", image: "/assets/social/nguyen-van-chung.jpg" },
  { rank: 8, name: "Quang Hùng MasterD", score: "23.094", image: "/assets/social/quang-hung.jpg" },
  { rank: 9, name: "Bùi Công Nam", score: "22.770", image: "/assets/social/bui-cong-nam.jpg" },
  { rank: 10, name: "CongB", score: "20.761", image: "/assets/social/congb.jpg" },
];
