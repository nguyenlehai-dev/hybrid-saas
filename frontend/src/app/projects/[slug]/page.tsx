"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PiCaretRight, PiUser, PiMapPin, PiCalendarCheck, PiGlobe, PiArrowLeft } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

/* ── Projects Data ── */
const projects = [
  { id: 1, slug: "tb-rice", title: "TB Rice – Tinh hoa từ thiên nhiên", image: "/images/solution-branding.png", tags: ["Logo", "Nhận diện"], client: "TB Rice", field: "Nông sản", date: "10/03/2026",
    content: `<h2>Thiết kế Logo & Nhận diện thương hiệu TB Rice</h2><p>TB Rice là thương hiệu gạo cao cấp, mang đến sản phẩm tinh hoa từ thiên nhiên Việt Nam. Nulith đã thiết kế bộ nhận diện thương hiệu hoàn chỉnh bao gồm logo, namecard, bao bì sản phẩm và các ấn phẩm truyền thông.</p><h3>Yêu cầu dự án</h3><p>Khách hàng mong muốn một hình ảnh thương hiệu vừa hiện đại vừa mang đậm bản sắc Việt, thể hiện sự tinh khiết và chất lượng của sản phẩm gạo.</p><h3>Giải pháp</h3><p>Sử dụng tông màu xanh lá kết hợp vàng gold, biểu tượng hạt gạo cách điệu, font chữ thanh lịch tạo nên bộ nhận diện sang trọng nhưng gần gũi.</p>` },
  { id: 2, slug: "f1-auto", title: "F1 Auto – Garage ô tô chất lượng 5 sao", image: "/images/solution-website.png", tags: ["Logo", "Nhận diện"], client: "F1 Auto", field: "Ô tô", date: "08/03/2026",
    content: `<h2>F1 Auto – Nhận diện thương hiệu Garage 5 sao</h2><p>F1 Auto là garage ô tô cao cấp chuyên sửa chữa, bảo dưỡng xe sang. Nulith thiết kế bộ nhận diện mạnh mẽ, chuyên nghiệp phản ánh đẳng cấp dịch vụ.</p><h3>Kết quả</h3><p>Logo kết hợp biểu tượng tốc độ và sự chính xác, bộ nhận diện ứng dụng trên đồng phục, biển hiệu, hóa đơn và các ấn phẩm marketing.</p>` },
  { id: 3, slug: "vde-agency", title: "VDE Agency – Vượt trên sự hoàn hảo", image: "/images/solution-content.png", tags: ["Website", "Truyền thông"], client: "VDE Agency", field: "Truyền thông", date: "05/03/2026",
    content: `<h2>Website VDE Agency</h2><p>Thiết kế website giới thiệu công ty truyền thông VDE Agency với giao diện hiện đại, animation mượt mà, thể hiện sự sáng tạo và chuyên nghiệp của agency.</p><h3>Công nghệ</h3><p>Next.js, Framer Motion, responsive design trên mọi thiết bị.</p>` },
  { id: 4, slug: "solar-top", title: "Solar Top – Chọn điện mặt trời chất lượng", image: "/images/solution-seo.png", tags: ["Logo", "Nhận diện"], client: "Solar Top", field: "Năng lượng", date: "01/03/2026",
    content: `<h2>Solar Top – Thương hiệu điện mặt trời</h2><p>Thiết kế bộ nhận diện thương hiệu cho Solar Top – đơn vị hàng đầu trong lĩnh vực năng lượng mặt trời tại Việt Nam.</p>` },
  { id: 5, slug: "bach-nien-gia", title: "BĐS Bách Niên Gia – Khơi nguồn thịnh vượng", image: "/images/solution-landing.png", tags: ["Website", "Bất động sản"], client: "Bách Niên Gia", field: "Bất động sản", date: "26/02/2026",
    content: `<h2>Website BĐS Bách Niên Gia</h2><p>Website bất động sản cao cấp với hệ thống tìm kiếm dự án, bản đồ tương tác, và trang quản trị nội dung cho đội ngũ BĐS.</p>` },
  { id: 6, slug: "ichiban-logistic", title: "Ichiban Logistic – Không ngừng cải tiến", image: "/images/solution-marketing.png", tags: ["Logo"], client: "Ichiban", field: "Logistics", date: "20/02/2026",
    content: `<h2>Logo Ichiban Logistic</h2><p>Thiết kế logo chuyên nghiệp cho công ty logistics Ichiban, thể hiện sự nhanh chóng, tin cậy và kết nối toàn cầu.</p>` },
  { id: 7, slug: "ogo-academy", title: "OGO – Học viện ngôi sao livestream", image: "/images/solution-branding.png", tags: ["Logo", "Nhận diện"], client: "OGO Academy", field: "Giáo dục", date: "15/02/2026",
    content: `<h2>OGO – Học viện Livestream</h2><p>Thiết kế trọn bộ nhận diện thương hiệu cho học viện đào tạo livestream OGO với phong cách trẻ trung, năng động.</p>` },
  { id: 8, slug: "tb-vietnam", title: "TB Vietnam – Tinh hoa từ thiên nhiên", image: "/images/solution-website.png", tags: ["Catalogue", "Sản phẩm số"], client: "TB Vietnam", field: "Nông sản", date: "10/02/2026",
    content: `<h2>Catalogue TB Vietnam</h2><p>Thiết kế catalogue sản phẩm cao cấp, thể hiện chất lượng và giá trị thương hiệu TB Vietnam trong từng trang.</p>` },
  { id: 9, slug: "floors-by-nature", title: "Floors by Nature – Sàn gỗ nội thất Australia", image: "/images/solution-content.png", tags: ["Website", "Nội thất"], client: "Floors by Nature", field: "Nội thất", date: "05/02/2026",
    content: `<h2>Website Floors by Nature</h2><p>Website thương mại điện tử cho thương hiệu sàn gỗ Australia, với catalog sản phẩm, bộ lọc thông minh và trang tư vấn thiết kế.</p>` },
  { id: 10, slug: "santino-fashion", title: "Santino – Thời trang nam phong cách lịch lãm", image: "/images/solution-seo.png", tags: ["Website", "Thời trang"], client: "Santino", field: "Thời trang", date: "01/02/2026",
    content: `<h2>Website Santino Fashion</h2><p>Website thời trang nam cao cấp với thiết kế tối giản, sang trọng, hệ thống giỏ hàng và thanh toán trực tuyến.</p>` },
  { id: 11, slug: "intech-holdings", title: "INTECH HOLDINGS – Tập đoàn năng lượng", image: "/images/solution-landing.png", tags: ["Website", "Tập đoàn"], client: "INTECH", field: "Năng lượng", date: "26/01/2026",
    content: `<h2>Website Tập đoàn INTECH</h2><p>Website giới thiệu tập đoàn đa ngành với cấu trúc thông tin rõ ràng, giao diện chuyên nghiệp thể hiện tầm vóc doanh nghiệp.</p>` },
  { id: 12, slug: "nulith-landing", title: "Nulith – Landing Page tối ưu chuyển đổi", image: "/images/solution-marketing.png", tags: ["Landing Page"], client: "Nulith", field: "Marketing", date: "20/01/2026",
    content: `<h2>Landing Page Nulith</h2><p>Thiết kế landing page tối ưu chuyển đổi cho dịch vụ marketing, đồng bộ với chiến dịch quảng cáo Google Ads và Facebook Ads.</p>` },
  { id: 13, slug: "molyci-academy", title: "Molyci Academy – Viện đào tạo Nail chuyên nghiệp", image: "/images/solution-branding.png", tags: ["Logo"], client: "Molyci", field: "Đào tạo", date: "15/01/2026",
    content: `<h2>Logo Molyci Academy</h2><p>Thiết kế logo tinh tế cho viện đào tạo nail Molyci, kết hợp sự thanh lịch và chuyên nghiệp.</p>` },
  { id: 14, slug: "content-tiktok", title: "TikTok Brand Viral – Chiến dịch sáng tạo nội dung", image: "/images/solution-content.png", tags: ["Content Creator"], client: "Nhiều thương hiệu", field: "Content", date: "10/01/2026",
    content: `<h2>Chiến dịch Content TikTok</h2><p>Sản xuất nội dung viral cho nhiều thương hiệu trên TikTok, đạt hàng triệu lượt xem và tăng nhận diện thương hiệu mạnh mẽ.</p>` },
  { id: 15, slug: "phi-linh-wedding", title: "Phi Linh Wedding – Pocket Planner for Your Wedding", image: "/images/solution-website.png", tags: ["Logo", "Nhận diện"], client: "Phi Linh Wedding", field: "Wedding", date: "05/01/2026",
    content: `<h2>Logo & Nhận diện Phi Linh Wedding</h2><p>Thiết kế bộ nhận diện lãng mạn, sang trọng cho dịch vụ tổ chức tiệc cưới Phi Linh Wedding.</p>` },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827" }}>Dự án không tồn tại</h1>
        <a href="/projects" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <PiArrowLeft /> Quay lại Dự án
        </a>
      </div>
    );
  }

  const dateParts = project.date.split("/");
  const day = dateParts[0];
  const monthNames = ["", "Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
  const monthLabel = monthNames[parseInt(dateParts[1])] || `Th${dateParts[1]}`;

  const relatedProjects = projects.filter((p) => p.slug !== slug && p.tags.some((t) => project.tags.includes(t))).slice(0, 3);

  return (
    <div style={{ overflow: "hidden" }}>
      <TopBar />
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ HERO ══════ */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)",
        padding: "60px 0 70px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: -100, right: -50 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", bottom: -80, left: "20%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.85rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Trang chủ</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <a href="/projects" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Dự án</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <span style={{ color: "#fff", fontWeight: 600 }}>Chi tiết</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.35 }}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* ══════ CONTENT ══════ */}
      <section style={{ padding: "50px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="project-detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 36, alignItems: "start" }}>

            {/* LEFT */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ position: "relative" }}>
                <img src={project.image} alt={project.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", top: 20, left: 20,
                  background: "#fff", borderRadius: 10, padding: "8px 14px",
                  textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", lineHeight: 1.2,
                }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#16a34a" }}>{day}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>{monthLabel}</div>
                </div>
              </div>
              <div className="project-article-content" style={{ padding: "36px 40px 48px" }}>
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 90 }}>
              {/* Info Card */}
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", padding: "16px 24px" }}>
                  <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Thông tin dự án</h3>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {[
                    { icon: <PiUser />, label: "Khách hàng:", value: project.client },
                    { icon: <PiMapPin />, label: "Lĩnh vực:", value: project.field },
                    { icon: <PiCalendarCheck />, label: "Ngày cập nhật:", value: project.date },
                    { icon: <PiGlobe />, label: project.tags.join(", "), value: "" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 24px",
                      borderBottom: i < 3 ? "1px solid #f3f4f6" : "none",
                    }}>
                      <span style={{ color: "#16a34a", fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>{item.label}</span>
                        {item.value && <span style={{ fontSize: "0.82rem", color: "#6b7280", marginLeft: 4 }}>{item.value}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              {relatedProjects.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", padding: "16px 24px" }}>
                    <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, margin: 0 }}>Dự án liên quan</h3>
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    {relatedProjects.map((rp, i) => (
                      <a key={rp.id} href={`/projects/${rp.slug}`} style={{
                        display: "flex", gap: 12, padding: "14px 20px",
                        borderBottom: i < relatedProjects.length - 1 ? "1px solid #f3f4f6" : "none",
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
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      <style>{`
        @media (max-width: 1024px) { .project-detail-layout { grid-template-columns: 1fr !important; } }
        .project-article-content h2 { font-size: 1.4rem; font-weight: 800; color: #111827; margin: 32px 0 14px; line-height: 1.4; }
        .project-article-content h3 { font-size: 1.1rem; font-weight: 700; color: #16a34a; margin: 28px 0 10px; line-height: 1.4; }
        .project-article-content p { font-size: 0.92rem; color: #374151; line-height: 1.85; margin: 0 0 16px; }
        .project-article-content ul { margin: 0 0 16px; padding-left: 20px; }
        .project-article-content li { font-size: 0.92rem; color: #374151; line-height: 1.85; margin-bottom: 6px; }
        .project-article-content blockquote { margin: 24px 0; padding: 20px 24px; border-left: 4px solid #16a34a; background: #f0fdf4; border-radius: 0 12px 12px 0; font-style: italic; color: #15803d; font-size: 0.95rem; line-height: 1.7; }
      `}</style>
    </div>
  );
}
