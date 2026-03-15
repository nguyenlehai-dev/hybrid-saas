"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PiCaretRight, PiUser, PiMapPin, PiCalendarCheck, PiGlobe, PiShareNetwork, PiHeart, PiArrowLeft } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

/* ── Blog Data (same as blog listing) ── */
const blogPosts = [
  {
    id: 1,
    slug: "xay-dung-website-chuyen-nghiep",
    title: "Xây dựng website chuyên nghiệp cho doanh nghiệp thời đại số",
    excerpt: "Website không chỉ là bộ mặt online mà còn là công cụ bán hàng 24/7.",
    image: "/images/solution-website.png",
    category: "Website",
    date: "15/03/2026",
    client: "Doanh nghiệp SME",
    field: "Thiết kế Website",
    content: `
      <h2>Tại sao doanh nghiệp cần có website?</h2>
      <p>Trong thời đại số hóa, website trở thành kênh marketing quan trọng nhất của mọi doanh nghiệp. Một website chuyên nghiệp không chỉ giúp bạn giới thiệu sản phẩm/dịch vụ mà còn là công cụ bán hàng 24/7, tiếp cận hàng triệu khách hàng tiềm năng trên Internet.</p>

      <h3>1. Tăng độ tin cậy và uy tín</h3>
      <p>Khách hàng ngày nay có xu hướng tìm kiếm thông tin trên mạng trước khi quyết định mua hàng. Một website được thiết kế đẹp mắt, chuyên nghiệp sẽ tạo ấn tượng tốt và tăng niềm tin của khách hàng đối với doanh nghiệp của bạn.</p>

      <h3>2. Tiếp cận khách hàng mọi lúc mọi nơi</h3>
      <p>Khác với cửa hàng truyền thống, website hoạt động 24/7 và có thể tiếp cận khách hàng ở bất cứ đâu. Đây là lợi thế lớn giúp doanh nghiệp mở rộng thị trường và tăng doanh thu.</p>

      <h3>3. Tiết kiệm chi phí marketing</h3>
      <p>So với các hình thức quảng cáo truyền thống, marketing qua website có chi phí thấp hơn nhiều nhưng hiệu quả cao hơn. Bạn có thể tối ưu SEO để thu hút traffic miễn phí từ Google.</p>

      <h3>4. Đo lường và phân tích hiệu quả</h3>
      <p>Với các công cụ phân tích như Google Analytics, bạn có thể theo dõi lượng truy cập, hành vi người dùng, tỷ lệ chuyển đổi và nhiều chỉ số quan trọng khác để tối ưu hóa chiến lược kinh doanh.</p>

      <blockquote>"Website chính là văn phòng đại diện của doanh nghiệp trên Internet. Đầu tư cho website là đầu tư cho sự phát triển bền vững." — Nulith Team</blockquote>

      <h3>5. Quy trình thiết kế website tại Nulith</h3>
      <p>Tại Nulith, chúng tôi áp dụng quy trình 6 bước chuyên nghiệp:</p>
      <ul>
        <li>Bước 1: Tư vấn và phân tích yêu cầu khách hàng</li>
        <li>Bước 2: Thiết kế giao diện UI/UX</li>
        <li>Bước 3: Lập trình và phát triển</li>
        <li>Bước 4: Kiểm thử và tối ưu</li>
        <li>Bước 5: Triển khai và bàn giao</li>
        <li>Bước 6: Bảo hành và hỗ trợ kỹ thuật</li>
      </ul>

      <p>Liên hệ ngay với Nulith để được tư vấn giải pháp website phù hợp nhất cho doanh nghiệp của bạn!</p>
    `,
  },
  {
    id: 2,
    slug: "digital-marketing-hieu-qua",
    title: "Digital Marketing — Giải pháp bán hàng hiệu quả cho mọi doanh nghiệp",
    excerpt: "Trong thời đại 4.0, Digital Marketing trở thành công cụ không thể thiếu.",
    image: "/images/solution-content.png",
    category: "Marketing",
    date: "12/03/2026",
    client: "Doanh nghiệp B2B/B2C",
    field: "Digital Marketing",
    content: `
      <h2>Digital Marketing là gì?</h2>
      <p>Digital Marketing (tiếp thị số) là tập hợp các hoạt động marketing sử dụng các kênh kỹ thuật số như website, mạng xã hội, email, quảng cáo trực tuyến để tiếp cận và tương tác với khách hàng mục tiêu.</p>

      <h3>1. Các kênh Digital Marketing phổ biến</h3>
      <p>Hiện nay có rất nhiều kênh Digital Marketing hiệu quả mà doanh nghiệp có thể tận dụng: SEO, SEM (Google Ads), Social Media Marketing, Email Marketing, Content Marketing, Influencer Marketing...</p>

      <h3>2. Lợi ích của Digital Marketing</h3>
      <p>So với marketing truyền thống, Digital Marketing có nhiều ưu điểm vượt trội: chi phí thấp, đo lường chính xác, nhắm mục tiêu cụ thể, tương tác hai chiều, và khả năng lan truyền nhanh chóng.</p>

      <h3>3. Chiến lược Digital Marketing hiệu quả</h3>
      <p>Để triển khai Digital Marketing thành công, doanh nghiệp cần xây dựng chiến lược rõ ràng, xác định mục tiêu cụ thể, lựa chọn kênh phù hợp và liên tục đo lường, tối ưu.</p>

      <blockquote>"Digital Marketing không chỉ là chi tiền quảng cáo, mà là nghệ thuật kết nối với khách hàng đúng người, đúng thời điểm." — Nulith Team</blockquote>

      <p>Liên hệ Nulith ngay để được tư vấn chiến lược Digital Marketing tối ưu cho doanh nghiệp của bạn!</p>
    `,
  },
  {
    id: 3,
    slug: "seo-website-len-top-google",
    title: "SEO Website lên TOP Google — Hướng dẫn từ A đến Z cho người mới",
    excerpt: "SEO là phương pháp tối ưu hóa website để đạt thứ hạng cao trên công cụ tìm kiếm.",
    image: "/images/solution-seo.png",
    category: "SEO",
    date: "10/03/2026",
    client: "Mọi doanh nghiệp",
    field: "Dịch vụ SEO",
    content: `
      <h2>SEO là gì và tại sao quan trọng?</h2>
      <p>SEO (Search Engine Optimization) là quá trình tối ưu hóa website để cải thiện thứ hạng trên các công cụ tìm kiếm như Google. Khi website của bạn xuất hiện ở trang đầu tiên của Google, bạn sẽ thu hút được lượng truy cập tự nhiên khổng lồ mà không tốn chi phí quảng cáo.</p>

      <h3>1. Nghiên cứu từ khóa</h3>
      <p>Đây là bước quan trọng nhất trong SEO. Bạn cần tìm ra những từ khóa mà khách hàng tiềm năng đang tìm kiếm và có liên quan đến sản phẩm/dịch vụ của bạn.</p>

      <h3>2. Tối ưu On-page SEO</h3>
      <p>Tối ưu các yếu tố trên trang web: title tag, meta description, heading, content, internal links, URL structure, image alt text...</p>

      <h3>3. Xây dựng backlink chất lượng</h3>
      <p>Backlink từ các website uy tín giúp tăng độ tin cậy của website trong mắt Google, từ đó cải thiện thứ hạng từ khóa.</p>

      <blockquote>"SEO không phải là cuộc chạy nước rút, mà là cuộc marathon. Kiên trì và đúng hướng sẽ mang lại kết quả bền vững." — Nulith Team</blockquote>
    `,
  },
  {
    id: 4, slug: "landing-page-ban-hang",
    title: "Landing Page — Công thức bán hàng đột phá của mọi doanh nghiệp",
    excerpt: "Landing Page được mệnh danh là 'ông hoàng' nền tảng bán hàng.",
    image: "/images/solution-landing.png", category: "Landing Page", date: "08/03/2026",
    client: "Doanh nghiệp Online", field: "Landing Page",
    content: `<h2>Landing Page là gì?</h2><p>Landing Page (trang đích) là trang web được thiết kế với một mục đích duy nhất: chuyển đổi khách truy cập thành khách hàng tiềm năng hoặc người mua hàng.</p><h3>Tại sao Landing Page hiệu quả?</h3><p>Không giống website thông thường, Landing Page tập trung vào một thông điệp và một hành động duy nhất, giúp tăng tỷ lệ chuyển đổi lên 300-500%.</p>`,
  },
  {
    id: 5, slug: "content-marketing-da-kenh",
    title: "Content Marketing đa kênh — Chiến lược tiếp cận hàng triệu khách hàng",
    excerpt: "Sáng tạo nội dung trên Facebook, TikTok, Instagram.",
    image: "/images/solution-branding.png", category: "Content", date: "05/03/2026",
    client: "Doanh nghiệp & Cá nhân", field: "Content Marketing",
    content: `<h2>Content Marketing đa kênh</h2><p>Content Marketing đa kênh là chiến lược phân phối nội dung trên nhiều nền tảng khác nhau để tối đa hóa khả năng tiếp cận khách hàng mục tiêu.</p><h3>Các kênh phổ biến</h3><p>Facebook, TikTok, Instagram, YouTube, Blog, Email — mỗi kênh có đặc thù riêng và cần nội dung được tối ưu phù hợp.</p>`,
  },
  {
    id: 6, slug: "ai-trong-marketing",
    title: "Ứng dụng AI trong Marketing — Xu hướng không thể bỏ qua năm 2026",
    excerpt: "Công nghệ AI đang thay đổi cách doanh nghiệp tiếp cận marketing.",
    image: "/images/solution-marketing.png", category: "AI", date: "01/03/2026",
    client: "Doanh nghiệp công nghệ", field: "AI Marketing",
    content: `<h2>AI trong Marketing</h2><p>Trí tuệ nhân tạo (AI) đang cách mạng hóa ngành marketing. Từ chatbot thông minh, tạo nội dung tự động đến phân tích dữ liệu khách hàng, AI giúp doanh nghiệp tiết kiệm thời gian và nâng cao hiệu quả.</p><h3>Ứng dụng thực tế</h3><p>Tạo hình ảnh bằng AI, viết content marketing, phân tích hành vi khách hàng, chatbot hỗ trợ 24/7, cá nhân hóa trải nghiệm người dùng.</p>`,
  },
  {
    id: 7, slug: "thiet-ke-nhan-dien-thuong-hieu",
    title: "Thiết kế nhận diện thương hiệu — Bước đầu tiên để khách hàng nhớ đến bạn",
    excerpt: "Bộ nhận diện thương hiệu chuyên nghiệp.",
    image: "/images/solution-website.png", category: "Thương hiệu", date: "26/02/2026",
    client: "Startup & SME", field: "Nhận diện thương hiệu",
    content: `<h2>Nhận diện thương hiệu</h2><p>Nhận diện thương hiệu là tập hợp các yếu tố trực quan giúp khách hàng nhận ra và ghi nhớ doanh nghiệp của bạn: logo, màu sắc, typography, hình ảnh...</p><h3>Tại sao quan trọng?</h3><p>Một bộ nhận diện thương hiệu nhất quán giúp tạo sự chuyên nghiệp, tăng độ nhận biết và xây dựng niềm tin với khách hàng.</p>`,
  },
  {
    id: 8, slug: "ban-hang-da-kenh-4-0",
    title: "Giải pháp bán hàng đa kênh trong thời đại công nghệ 4.0",
    excerpt: "Kinh doanh đa kênh không còn là lựa chọn mà là yêu cầu bắt buộc.",
    image: "/images/solution-content.png", category: "Marketing", date: "20/02/2026",
    client: "Doanh nghiệp bán lẻ", field: "Omni-channel Marketing",
    content: `<h2>Bán hàng đa kênh 4.0</h2><p>Bán hàng đa kênh (Omni-channel) là chiến lược tích hợp tất cả các kênh bán hàng — online và offline — thành một trải nghiệm liền mạch cho khách hàng.</p><h3>Lợi ích</h3><p>Tăng điểm tiếp xúc với khách hàng, nâng cao trải nghiệm mua sắm, tăng tỷ lệ chuyển đổi và xây dựng lòng trung thành.</p>`,
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827" }}>Bài viết không tồn tại</h1>
        <a href="/blog" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <PiArrowLeft /> Quay lại Blog
        </a>
      </div>
    );
  }

  /* Extract day/month from dd/mm/yyyy */
  const dateParts = post.date.split("/");
  const day = dateParts[0];
  const monthNames = ["", "Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
  const monthLabel = monthNames[parseInt(dateParts[1])] || `Th${dateParts[1]}`;

  /* Related posts */
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ overflow: "hidden" }}>
      {/* Header */}
      <TopBar />
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ HERO BREADCRUMB ══════ */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)",
        padding: "60px 0 70px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: -100, right: -50 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", bottom: -80, left: "20%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.85rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Trang chủ</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <a href="/blog" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Blog</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <span style={{ color: "#fff", fontWeight: 600 }}>Chi tiết</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.35 }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* ══════ MAIN CONTENT ══════ */}
      <section style={{ padding: "50px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="blog-detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 36, alignItems: "start" }}>

            {/* LEFT — Article */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              {/* Featured Image */}
              <div style={{ position: "relative" }}>
                <img src={post.image} alt={post.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                {/* Date Badge */}
                <div style={{
                  position: "absolute", top: 20, left: 20,
                  background: "#fff", borderRadius: 10, padding: "8px 14px",
                  textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  lineHeight: 1.2,
                }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#16a34a" }}>{day}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{monthLabel}</div>
                </div>
              </div>

              {/* Article Content */}
              <div className="blog-article-content" style={{ padding: "36px 40px 48px" }}>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Share / Like */}
                <div style={{
                  marginTop: 40, paddingTop: 24,
                  borderTop: "1px solid #e5e7eb",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 24, border: "1px solid #e5e7eb",
                    background: "#fff", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: "#374151",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.color = "#16a34a"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                  ><PiShareNetwork /> Chia sẻ</button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 24, border: "1px solid #e5e7eb",
                    background: "#fff", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: "#374151",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                  ><PiHeart /> Yêu thích</button>
                </div>
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 90 }}>
              {/* Project Info Card */}
              <div style={{
                background: "#fff", borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  padding: "16px 24px",
                }}>
                  <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Thông tin dự án</h3>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {[
                    { icon: <PiUser />, label: "Khách hàng:", value: post.client },
                    { icon: <PiMapPin />, label: "Lĩnh vực:", value: post.field },
                    { icon: <PiCalendarCheck />, label: "Ngày cập nhật:", value: post.date },
                    { icon: <PiGlobe />, label: post.category, value: "" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 24px",
                      borderBottom: i < 3 ? "1px solid #f3f4f6" : "none",
                    }}>
                      <span style={{ color: "#16a34a", fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>{item.label}</span>
                        {item.value && (
                          <span style={{ fontSize: "0.82rem", color: "#6b7280", marginLeft: 4 }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              <div style={{
                background: "#fff", borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  padding: "16px 24px",
                }}>
                  <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Bài viết liên quan</h3>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {relatedPosts.map((rp, i) => (
                    <a key={rp.id} href={`/blog/${rp.slug}`} style={{
                      display: "flex", gap: 12, padding: "14px 20px",
                      borderBottom: i < relatedPosts.length - 1 ? "1px solid #f3f4f6" : "none",
                      textDecoration: "none", transition: "background 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 70, height: 50, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f3f4f6" }}>
                        <img src={rp.image} alt={rp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: "0.78rem", fontWeight: 700, color: "#111827",
                          lineHeight: 1.4, margin: 0,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                        }}>{rp.title}</h4>
                        <span style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4, display: "block" }}>{rp.date}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      {/* ── Responsive + Article Styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          .blog-detail-layout { grid-template-columns: 1fr !important; }
        }
        .blog-article-content h2 {
          font-size: 1.4rem; font-weight: 800; color: #111827;
          margin: 32px 0 14px; line-height: 1.4;
        }
        .blog-article-content h3 {
          font-size: 1.1rem; font-weight: 700; color: #16a34a;
          margin: 28px 0 10px; line-height: 1.4;
        }
        .blog-article-content p {
          font-size: 0.92rem; color: #374151; line-height: 1.85;
          margin: 0 0 16px;
        }
        .blog-article-content ul {
          margin: 0 0 16px; padding-left: 20px;
        }
        .blog-article-content li {
          font-size: 0.92rem; color: #374151; line-height: 1.85;
          margin-bottom: 6px;
        }
        .blog-article-content blockquote {
          margin: 24px 0; padding: 20px 24px;
          border-left: 4px solid #16a34a;
          background: #f0fdf4; border-radius: 0 12px 12px 0;
          font-style: italic; color: #15803d;
          font-size: 0.95rem; line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
