"use client";
import { useState, useEffect, useCallback } from "react";
import { PiCalendarBlank, PiArrowRight, PiCaretRight } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";
import { useLang } from "@/lib/i18n";

/* ── Featured Section Component ── */
function FeaturedSection({ posts }: { posts: typeof blogPosts }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section style={{ padding: "60px 0 40px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="blog-featured-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "stretch" }}>

          {/* LEFT — Big Slider */}
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
            <a href={`/blog/${posts[activeSlide]?.slug}`} style={{ display: "block", textDecoration: "none", height: "100%" }}>
              <div style={{
                width: "100%", height: "100%", minHeight: 380, overflow: "hidden", background: "#f3f4f6",
                position: "relative",
              }}>
                {posts.map((post, i) => (
                  <img key={post.id} src={post.image} alt={post.title} style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%", objectFit: "cover",
                    opacity: i === activeSlide ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                  }} />
                ))}
                {/* Overlay gradient */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "50%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  zIndex: 1,
                }} />
                {/* Title overlay */}
                <div style={{
                  position: "absolute", bottom: 20, left: 24, right: 24,
                  zIndex: 2,
                }}>
                  <h3 style={{
                    fontSize: "1.2rem", fontWeight: 800, color: "#fff",
                    lineHeight: 1.4, textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}>{posts[activeSlide]?.title}</h3>
                </div>
              </div>
            </a>

            {/* Dots */}
            <div style={{
              position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 8, zIndex: 3,
            }}>
              {posts.map((_, i) => (
                <button key={i} onClick={() => setActiveSlide(i)} style={{
                  width: i === activeSlide ? 24 : 8, height: 8,
                  borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === activeSlide ? "#16a34a" : "rgba(255,255,255,0.6)",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>

          {/* RIGHT — Post List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{
              fontSize: "1.3rem", fontWeight: 800, color: "#111827",
              marginBottom: 0, paddingBottom: 14,
              borderBottom: "2px solid #e5e7eb",
            }}>Bài viết nổi bật</h3>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
              {posts.map((post, i) => (
                <a key={post.id} href={`/blog/${post.slug}`} style={{
                  display: "flex", gap: 14, padding: "18px 10px",
                  borderBottom: i < posts.length - 1 ? "1px solid #f0f0f0" : "none",
                  textDecoration: "none",
                  borderRadius: 8,
                  transition: "background 0.2s",
                  flex: 1, alignItems: "center",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: 100, height: 72, borderRadius: 10, overflow: "hidden",
                    flexShrink: 0, background: "#f3f4f6",
                  }}>
                    <img src={post.image} alt={post.title} style={{
                      width: "100%", height: "100%", objectFit: "cover",
                    }} />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: "#9ca3af", fontSize: "0.75rem", marginBottom: 5,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <PiCalendarBlank style={{ fontSize: "0.7rem" }} /> {post.date}
                    </div>
                    <h4 style={{
                      fontSize: "0.85rem", fontWeight: 700, color: "#111827",
                      lineHeight: 1.45, margin: 0,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    }}>{post.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Blog Data ── */
const blogPosts = [
  {
    id: 1,
    slug: "xay-dung-website-chuyen-nghiep",
    title: "Xây dựng website chuyên nghiệp cho doanh nghiệp thời đại số",
    excerpt: "Website không chỉ là bộ mặt online mà còn là công cụ bán hàng 24/7. Tìm hiểu cách xây dựng một website chuyên nghiệp giúp tăng doanh thu...",
    image: "/images/solution-website.png",
    category: "Website",
    date: "15/03/2026",
    featured: true,
  },
  {
    id: 2,
    slug: "digital-marketing-hieu-qua",
    title: "Digital Marketing — Giải pháp bán hàng hiệu quả cho mọi doanh nghiệp",
    excerpt: "Trong thời đại 4.0, Digital Marketing trở thành công cụ không thể thiếu. Khám phá các chiến lược marketing số giúp tối ưu chi phí và gia tăng hiệu quả...",
    image: "/images/solution-content.png",
    category: "Marketing",
    date: "12/03/2026",
    featured: true,
  },
  {
    id: 3,
    slug: "seo-website-len-top-google",
    title: "SEO Website lên TOP Google — Hướng dẫn từ A đến Z cho người mới",
    excerpt: "SEO là phương pháp tối ưu hóa website để đạt thứ hạng cao trên công cụ tìm kiếm. Bài viết hướng dẫn chi tiết các bước SEO cơ bản...",
    image: "/images/solution-seo.png",
    category: "SEO",
    date: "10/03/2026",
    featured: true,
  },
  {
    id: 4,
    slug: "landing-page-ban-hang",
    title: "Landing Page — Công thức bán hàng đột phá của mọi doanh nghiệp",
    excerpt: "Landing Page được mệnh danh là 'ông hoàng' nền tảng bán hàng trong giới Digital Marketing bởi những ưu điểm và lợi ích 'khủng khiếp' của nó...",
    image: "/images/solution-landing.png",
    category: "Landing Page",
    date: "08/03/2026",
    featured: false,
  },
  {
    id: 5,
    slug: "content-marketing-da-kenh",
    title: "Content Marketing đa kênh — Chiến lược tiếp cận hàng triệu khách hàng",
    excerpt: "Sáng tạo nội dung trên Facebook, TikTok, Instagram giúp doanh nghiệp xây dựng thương hiệu mạnh mẽ và thu hút khách hàng tiềm năng...",
    image: "/images/solution-branding.png",
    category: "Content",
    date: "05/03/2026",
    featured: false,
  },
  {
    id: 6,
    slug: "ai-trong-marketing",
    title: "Ứng dụng AI trong Marketing — Xu hướng không thể bỏ qua năm 2026",
    excerpt: "Công nghệ AI đang thay đổi cách doanh nghiệp tiếp cận marketing. Từ tạo hình ảnh, viết content đến phân tích dữ liệu khách hàng...",
    image: "/images/solution-marketing.png",
    category: "AI",
    date: "01/03/2026",
    featured: false,
  },
  {
    id: 7,
    slug: "thiet-ke-nhan-dien-thuong-hieu",
    title: "Thiết kế nhận diện thương hiệu — Bước đầu tiên để khách hàng nhớ đến bạn",
    excerpt: "Bộ nhận diện thương hiệu chuyên nghiệp giúp doanh nghiệp tạo ấn tượng mạnh và nổi bật giữa hàng ngàn đối thủ cạnh tranh...",
    image: "/images/solution-website.png",
    category: "Thương hiệu",
    date: "26/02/2026",
    featured: false,
  },
  {
    id: 8,
    slug: "ban-hang-da-kenh-4-0",
    title: "Giải pháp bán hàng đa kênh trong thời đại công nghệ 4.0",
    excerpt: "Kinh doanh đa kênh không còn là lựa chọn mà là yêu cầu bắt buộc. Tìm hiểu cách triển khai chiến lược omni-channel hiệu quả...",
    image: "/images/solution-content.png",
    category: "Marketing",
    date: "20/02/2026",
    featured: false,
  },
];

const categories = ["Tất cả", "Website", "Marketing", "SEO", "Landing Page", "Content", "AI", "Thương hiệu"];

export default function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const { t } = useLang();

  const featuredPosts = blogPosts.filter((p) => p.featured);
  const filteredPosts = activeCategory === "Tất cả"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <div style={{ overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#fafbfc", position: "relative", display: "flex", flexDirection: "column" as const }}>
        <TopBar />
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ HERO BREADCRUMB ══════ */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)",
        padding: "60px 0 70px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          top: -100, right: -50,
        }} />
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          bottom: -80, left: "20%",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.85rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Trang chủ</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <span style={{ color: "#fff", fontWeight: 600 }}>Blog</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#fff", lineHeight: 1.3, marginBottom: 12,
          }}>
            Nulith Blog
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7 }}>
            Với hơn 5 năm kinh nghiệm chuyên sâu — Chia sẻ kiến thức, xu hướng và giải pháp marketing số cho doanh nghiệp
          </p>
        </div>
      </section>

      {/* ══════ FEATURED SECTION ══════ */}
      <FeaturedSection posts={blogPosts.slice(0, 4)} />

      {/* ══════ ALL POSTS ══════ */}
      <section style={{ padding: "40px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Category Filter */}
          <div style={{
            display: "flex", flexWrap: "wrap" as const, gap: 10, marginBottom: 40,
            justifyContent: "center",
          }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: "8px 20px", borderRadius: 24, border: "none", cursor: "pointer",
                background: activeCategory === cat ? "linear-gradient(135deg, #16a34a, #15803d)" : "#fff",
                color: activeCategory === cat ? "#fff" : "#374151",
                fontSize: "0.82rem", fontWeight: 600,
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(22,163,74,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              >{cat}</button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="blog-grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {filteredPosts.map((post) => (
              <a key={post.id} href={`/blog/${post.slug}`} style={{
                display: "block", background: "#fff", borderRadius: 16, overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                transition: "transform 0.3s, box-shadow 0.3s",
                textDecoration: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              >
                {/* Image */}
                <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#f3f4f6" }}>
                  <img src={post.image} alt={post.title} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.4s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
                {/* Content */}
                <div style={{ padding: "20px 22px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{
                      display: "inline-block", padding: "4px 12px", borderRadius: 20,
                      background: "#f0fdf4", color: "#16a34a",
                      fontSize: "0.72rem", fontWeight: 700,
                    }}>{post.category}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af", fontSize: "0.75rem" }}>
                      <PiCalendarBlank /> {post.date}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "0.9rem", fontWeight: 700, color: "#111827",
                    lineHeight: 1.45, marginBottom: 10,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>{post.title}</h3>
                  <p style={{
                    fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>{post.excerpt}</p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: "#16a34a", fontSize: "0.82rem", fontWeight: 700,
                    transition: "gap 0.2s",
                  }}>
                    Xem thêm <PiArrowRight />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      {/* ── Blog Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .blog-featured-layout { grid-template-columns: 1fr !important; }
          .blog-grid-responsive { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-featured-layout { grid-template-columns: 1fr !important; }
          .blog-grid-responsive { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
