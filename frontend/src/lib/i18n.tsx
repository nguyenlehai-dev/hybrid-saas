"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Lang = "vi" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "vi",
  setLang: () => {},
  t: (k) => k,
});

export function useLang() {
  return useContext(LangContext);
}

/* ═══════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════ */
const translations: Record<string, Record<Lang, string>> = {
  /* ── TopBar ── */
  "topbar.promo": {
    vi: "Hỗ trợ giá các gói dịch vụ lên tới 50% trong mùa dịch",
    en: "Up to 50% off all service packages this season",
  },

  /* ── Navbar ── */
  "nav.about": { vi: "VỀ CHÚNG TÔI", en: "ABOUT US" },
  "nav.services": { vi: "DỊCH VỤ", en: "SERVICES" },
  "nav.projects": { vi: "DỰ ÁN", en: "PROJECTS" },
  "nav.support": { vi: "HỖ TRỢ KHÁCH HÀNG", en: "CUSTOMER SUPPORT" },
  "nav.careers": { vi: "TUYỂN DỤNG", en: "CAREERS" },
  "nav.blog": { vi: "BLOG", en: "BLOG" },
  "nav.cta": { vi: "LIÊN HỆ TƯ VẤN", en: "CONTACT US" },

  /* ── Navbar Dropdown Services ── */
  "svc.landing.title": { vi: "Thiết kế Landing Page bằng WP", en: "WordPress Landing Page Design" },
  "svc.landing.desc": { vi: "Landing page tối ưu chuyển đổi trên nền tảng WordPress, chuẩn SEO...", en: "Conversion-optimized landing pages on WordPress, SEO-ready..." },
  "svc.prompt.title": { vi: "Thiết kế hình ảnh bằng Prompt", en: "AI Image Design via Prompt" },
  "svc.prompt.desc": { vi: "Tạo hình ảnh chất lượng cao từ mô tả văn bản với công nghệ AI...", en: "Create high-quality images from text descriptions with AI..." },
  "svc.content.title": { vi: "Quản trị & sáng tạo nội dung", en: "Content Management & Creation" },
  "svc.content.desc": { vi: "Chiến lược content đa kênh Facebook, TikTok, Instagram, Website...", en: "Multi-channel content strategy for Facebook, TikTok, Instagram..." },
  "svc.website.title": { vi: "Thiết kế website chuyên nghiệp", en: "Professional Website Design" },
  "svc.website.desc": { vi: "Website bán hàng, giới thiệu doanh nghiệp chuẩn SEO & responsive...", en: "E-commerce & business websites, SEO-optimized & responsive..." },
  "svc.ai.title": { vi: "Kết nối nền tảng AI hình ảnh & video", en: "AI Image & Video Platform Integration" },
  "svc.ai.desc": { vi: "Tích hợp các nền tảng dựng hình ảnh, video bằng AI hàng đầu...", en: "Integrate leading AI image & video generation platforms..." },
  "svc.seo.title": { vi: "Dịch vụ SEO tổng thể", en: "Comprehensive SEO Services" },
  "svc.seo.desc": { vi: "Chiến lược SEO bài bản, kế hoạch rõ ràng, tối ưu công cụ tìm kiếm...", en: "Strategic SEO planning, clear roadmaps, search engine optimization..." },

  /* ── Hero ── */
  "hero.badge": { vi: "🚀 Giải pháp Marketing số #1 Việt Nam", en: "🚀 #1 Digital Marketing Solutions in Vietnam" },
  "hero.heading_prefix": { vi: "Giải pháp", en: "Solutions for" },
  "hero.heading_suffix": { vi: "cho doanh nghiệp thời đại số", en: "businesses in the digital era" },
  "hero.desc": {
    vi: "Giải pháp marketing số toàn diện — từ thiết kế website chuyên nghiệp, sáng tạo nội dung đa kênh đến ứng dụng AI trong truyền thông. Được tin dùng bởi 500+ doanh nghiệp Việt Nam.",
    en: "Comprehensive digital marketing solutions — from professional website design, multi-channel content creation to AI-powered communications. Trusted by 500+ businesses in Vietnam.",
  },
  "hero.cta1": { vi: "Bắt đầu miễn phí", en: "Start for Free" },
  "hero.cta2": { vi: "Xem giới thiệu", en: "Watch Introduction" },
  "hero.stat.users": { vi: "Doanh nghiệp", en: "Businesses" },
  "hero.stat.images": { vi: "Ảnh đã xử lý", en: "Images Processed" },
  "hero.stat.uptime": { vi: "Uptime", en: "Uptime" },

  /* ── Banner Carousel ── */
  "banner.title": { vi: "Giải pháp Marketing số hàng đầu Việt Nam!", en: "Vietnam's Leading Digital Marketing Solutions!" },

  /* ── About ── */
  "about.tag": { vi: "VỀ CHÚNG TÔI", en: "ABOUT US" },
  "about.title": { vi: "CHÚNG TÔI LÀ AI?", en: "WHO ARE WE?" },
  "about.desc": {
    vi: "Nulith là đơn vị chuyên cung cấp giải pháp marketing số toàn diện tại Việt Nam — từ thiết kế website, sáng tạo nội dung, SEO đến ứng dụng công nghệ AI vào truyền thông và quảng cáo cho doanh nghiệp.",
    en: "Nulith is a leading digital marketing solutions provider in Vietnam — from website design, content creation, SEO to applying AI technology in communications and advertising for businesses.",
  },
  "about.card1.title": { vi: "Sứ mệnh", en: "Mission" },
  "about.card1.desc": {
    vi: "Đồng hành cùng doanh nghiệp Việt trong hành trình chuyển đổi số — giúp tối ưu chi phí marketing và gia tăng hiệu quả kinh doanh",
    en: "Partnering with Vietnamese businesses on their digital transformation journey — optimizing marketing costs and boosting business performance",
  },
  "about.card2.title": { vi: "Tầm nhìn", en: "Vision" },
  "about.card2.desc": {
    vi: "Trở thành đơn vị cung cấp giải pháp marketing số hàng đầu Đông Nam Á, phục vụ hơn 10,000 doanh nghiệp vào năm 2027",
    en: "Become the leading digital marketing solutions provider in Southeast Asia, serving over 10,000 businesses by 2027",
  },
  "about.card3.title": { vi: "Giá trị", en: "Values" },
  "about.card3.desc": {
    vi: "Sáng tạo không ngừng, chất lượng là trên hết, luôn lấy hiệu quả của khách hàng làm thước đo thành công",
    en: "Endless creativity, quality-first, always measuring success by our clients' results",
  },

  /* ── Solutions ── */
  "sol.tag": { vi: "DỊCH VỤ CỦA NULITH", en: "NULITH SERVICES" },
  "sol.title1": { vi: "GIẢI PHÁP CHO DOANH NGHIỆP", en: "SOLUTIONS FOR BUSINESSES" },
  "sol.title2": { vi: "TRONG THỜI ĐẠI 4.0", en: "IN THE 4.0 ERA" },
  "sol.s1.title": { vi: "THIẾT KẾ LANDING PAGE BẰNG WP", en: "WORDPRESS LANDING PAGE DESIGN" },
  "sol.s1.sub": { vi: "Landing page tối ưu chuyển đổi và tìm kiếm khách hàng tiềm năng", en: "Conversion-optimized landing page for lead generation" },
  "sol.s1.desc": { vi: "Thiết kế landing page tối ưu chuyển đổi trên nền tảng WordPress — dễ quản trị, chuẩn SEO, tích hợp sẵn form liên hệ và hệ thống tracking chuyển đổi.", en: "Conversion-optimized landing pages on WordPress — easy to manage, SEO-ready, with built-in contact forms and conversion tracking." },
  "sol.s2.title": { vi: "THIẾT KẾ HÌNH ẢNH BẰNG PROMPT", en: "AI IMAGE DESIGN VIA PROMPT" },
  "sol.s2.sub": { vi: "AI Image Generation từ mô tả văn bản", en: "AI Image Generation from text descriptions" },
  "sol.s2.desc": { vi: "Tạo hình ảnh chất lượng cao từ prompt — ảnh sản phẩm, banner quảng cáo, ảnh minh họa bài viết với công nghệ AI tiên tiến nhất hiện nay.", en: "Create high-quality images from prompts — product photos, ad banners, article illustrations with cutting-edge AI technology." },
  "sol.s3.title": { vi: "QUẢN TRỊ VÀ SÁNG TẠO NỘI DUNG", en: "CONTENT MANAGEMENT & CREATION" },
  "sol.s3.sub": { vi: "Phát triển và sáng tạo nội dung trên các kênh truyền thông", en: "Develop and create content across media channels" },
  "sol.s3.desc": { vi: "Xây dựng chiến lược content sáng tạo trên các kênh digital giúp doanh nghiệp tiếp cận được hàng triệu khách hàng.", en: "Build creative content strategies across digital channels to help businesses reach millions of customers." },
  "sol.s4.title": { vi: "THIẾT KẾ WEBSITE CHUYÊN NGHIỆP", en: "PROFESSIONAL WEBSITE DESIGN" },
  "sol.s4.sub": { vi: "Giải pháp thiết kế website bán hàng, giới thiệu dịch vụ chuyên nghiệp", en: "E-commerce & service showcase website solutions" },
  "sol.s4.desc": { vi: "Sở hữu một website chuẩn SEO, giao diện responsive với đầy đủ tính năng bán hàng online, giới thiệu dịch vụ, dự án,...", en: "SEO-optimized websites with responsive design, full e-commerce capabilities, service & project showcases..." },
  "sol.s5.title": { vi: "KẾT NỐI NỀN TẢNG DỰNG HÌNH ẢNH & VIDEO AI", en: "AI IMAGE & VIDEO PLATFORM INTEGRATION" },
  "sol.s5.sub": { vi: "Tích hợp các nền tảng AI hàng đầu", en: "Integrate leading AI platforms" },
  "sol.s5.desc": { vi: "Kết nối trực tiếp đến các nền tảng dựng hình ảnh, video bằng AI — tự động hóa quy trình sản xuất nội dung đa phương tiện cho doanh nghiệp.", en: "Direct integration with AI image & video platforms — automate multimedia content production for businesses." },
  "sol.s6.title": { vi: "DỊCH VỤ SEO TỔNG THỂ", en: "COMPREHENSIVE SEO SERVICES" },
  "sol.s6.sub": { vi: "Giải pháp tối ưu hóa công cụ tìm kiếm cho website của bạn", en: "Search engine optimization solutions for your website" },
  "sol.s6.desc": { vi: "Chiến lược SEO bài bản, kế hoạch rõ ràng kết hợp với nội dung chuyên sâu giúp khách hàng tìm thấy bạn trên Google.", en: "Strategic SEO planning with clear roadmaps and specialized content to help customers find you on Google." },
  "sol.cta": { vi: "Liên hệ tư vấn", en: "Contact Us" },
  "sol.more": { vi: "Xem thêm", en: "Learn More" },

  /* ── Testimonials ── */
  "test.tag": { vi: "KHÁCH HÀNG NÓI GÌ", en: "WHAT CUSTOMERS SAY" },
  "test.title": { vi: "ĐƯỢC TIN TƯỞNG BỞI", en: "TRUSTED BY" },
  "test.title2": { vi: "500+ DOANH NGHIỆP", en: "500+ BUSINESSES" },

  /* ── Case Studies ── */
  "case.tag": { vi: "DỰ ÁN TIÊU BIỂU", en: "FEATURED PROJECTS" },
  "case.title": { vi: "NHỮNG DỰ ÁN CHÚNG TÔI TỰ HÀO", en: "PROJECTS WE'RE PROUD OF" },

  /* ── Pricing ── */
  "price.tag": { vi: "Bảng giá", en: "Pricing" },
  "price.title": { vi: "Chọn gói phù hợp", en: "Choose Your Plan" },
  "price.monthly": { vi: "/ tháng", en: "/ month" },
  "price.points": { vi: "Điểm", en: "Credits" },
  "price.cta": { vi: "Chọn gói này", en: "Select Plan" },
  "price.contact": { vi: "Liên hệ", en: "Contact Us" },

  /* ── CTA ── */
  "cta.title": { vi: "Sẵn sàng bắt đầu?", en: "Ready to Get Started?" },
  "cta.desc": {
    vi: "Trải nghiệm sức mạnh AI ngay hôm nay với 50 credits miễn phí",
    en: "Experience the power of AI today with 50 free credits",
  },
  "cta.btn1": { vi: "Bắt đầu miễn phí", en: "Start for Free" },
  "cta.btn2": { vi: "Liên hệ tư vấn", en: "Contact Sales" },

  /* ── Footer ── */
  "footer.desc": {
    vi: "Giải pháp marketing số toàn diện — thiết kế web, sáng tạo nội dung và ứng dụng AI cho doanh nghiệp Việt 🇻🇳",
    en: "Comprehensive digital marketing solutions — web design, content creation and AI for Vietnamese businesses 🇻🇳",
  },
  "footer.services": { vi: "Dịch vụ", en: "Services" },
  "footer.support": { vi: "Hỗ trợ", en: "Support" },
  "footer.contact": { vi: "Liên hệ", en: "Contact" },
  "footer.guide": { vi: "Hướng dẫn", en: "Guides" },
  "footer.pricing": { vi: "Bảng giá", en: "Pricing" },
  "footer.copyright": {
    vi: "© 2026 Nulith. Bản quyền thuộc về Nulith.",
    en: "© 2026 Nulith. All rights reserved.",
  },

  /* ── Support Page ── */
  "sup.home": { vi: "Trang chủ", en: "Home" },
  "sup.title": { vi: "Hỗ trợ khách hàng", en: "Customer Support" },
  "sup.desc": {
    vi: "Với hơn 5 năm kinh nghiệm chuyên sâu — Đã có 500+ khách hàng tin tưởng sử dụng dịch vụ",
    en: "With over 5 years of expertise — Trusted by 500+ satisfied customers",
  },

  /* ── Mobile Menu ── */
  "mobile.home": { vi: "TRANG CHỦ", en: "HOME" },
  "mobile.contact": { vi: "LIÊN HỆ", en: "CONTACT" },
  "mobile.phone_label": { vi: "Hotline tư vấn:", en: "Support Hotline:" },
  "mobile.email_label": { vi: "Email:", en: "Email:" },

  /* ── Hero extra ── */
  "hero.searching": { vi: "BẠN ĐANG TÌM KIẾM", en: "YOU ARE LOOKING FOR" },
  "hero.heading": { vi: "GIẢI PHÁP CHO", en: "SOLUTIONS FOR" },
  "hero.desc2": {
    vi: "Với sự thấu hiểu và tận tâm, Nulith tự hào mang đến những giải pháp toàn diện cho khách hàng",
    en: "With deep understanding and dedication, Nulith proudly delivers comprehensive solutions for our clients",
  },
  "hero.btn1": { vi: "Về Chúng Tôi", en: "About Us" },
  "hero.btn2": { vi: "Xem Profile", en: "View Profile" },

  /* ── Banner ── */
  "banner.desc": {
    vi: "Khám phá sức mạnh marketing số kết hợp công nghệ AI cho doanh nghiệp",
    en: "Discover the power of digital marketing combined with AI technology for businesses",
  },

  /* ── Pricing plans ── */
  "price.plan1": { vi: "Khởi Đầu", en: "Starter" },
  "price.plan2": { vi: "Chuyên Nghiệp", en: "Professional" },
  "price.plan3": { vi: "Doanh Nghiệp", en: "Enterprise" },
  "price.plan4": { vi: "Cao Cấp", en: "Premium" },
  "price.popular": { vi: "PHỔ BIẾN", en: "POPULAR" },
  "price.f1.1": { vi: "20 ảnh/ngày", en: "20 images/day" },
  "price.f1.2": { vi: "Tạo ảnh từ văn bản", en: "Text-to-image" },
  "price.f1.3": { vi: "Nâng cấp độ nét", en: "Upscale quality" },
  "price.f2.1": { vi: "100 ảnh/ngày", en: "100 images/day" },
  "price.f2.2": { vi: "Tất cả công cụ", en: "All tools" },
  "price.f2.3": { vi: "Chỉnh sửa + Làm đẹp", en: "Edit + Enhance" },
  "price.f2.4": { vi: "Hỗ trợ ưu tiên", en: "Priority support" },
  "price.f3.1": { vi: "Không giới hạn", en: "Unlimited" },
  "price.f3.2": { vi: "Tất cả AI", en: "All AI models" },
  "price.f3.3": { vi: "Xử lý ưu tiên", en: "Priority processing" },
  "price.f3.4": { vi: "Truy cập API", en: "API access" },
  "price.f4.1": { vi: "Server riêng", en: "Dedicated server" },
  "price.f4.2": { vi: "Tạo Landing Page", en: "Landing page builder" },
  "price.f4.3": { vi: "Video AI", en: "AI Video" },
  "price.f4.4": { vi: "Hỗ trợ 24/7", en: "24/7 support" },

  /* ── Testimonials extra ── */
  "test.desc": {
    vi: "Đánh giá từ khách hàng đã sử dụng dịch vụ của chúng tôi",
    en: "Reviews from customers who have used our services",
  },

  /* ── Case Studies extra ── */
  "case.desc": {
    vi: "Những dự án tiêu biểu chúng tôi đã thực hiện",
    en: "Featured projects we have successfully delivered",
  },
  "case.view": { vi: "Xem chi tiết", en: "View Details" },

  /* ── Footer service links ── */
  "footer.s1": { vi: "Thiết kế Website", en: "Website Design" },
  "footer.s2": { vi: "Nhận diện thương hiệu", en: "Brand Identity" },
  "footer.s3": { vi: "Content Marketing", en: "Content Marketing" },
  "footer.s4": { vi: "Landing Page", en: "Landing Page" },
  "footer.s5": { vi: "SEO tổng thể", en: "SEO Services" },
  "footer.info": { vi: "Thông tin liên hệ", en: "Contact Info" },
  "footer.made": { vi: "tại Việt Nam", en: "in Vietnam" },

  /* ── CTA extra ── */
  "cta.ready": { vi: "Sẵn sàng bắt đầu?", en: "Ready to Get Started?" },
};

/* ─── Provider ─── */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
