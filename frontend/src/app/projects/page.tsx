"use client";
import { useState, useRef } from "react";
import { PiCaretRight, PiArrowRight } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

/* ── Projects Data ── */
const projects = [
  { id: 1, slug: "tb-rice", title: "TB Rice – Tinh hoa từ thiên nhiên", image: "/images/solution-branding.png", tags: ["Logo", "Nhận diện"] },
  { id: 2, slug: "f1-auto", title: "F1 Auto – Garage ô tô chất lượng 5 sao", image: "/images/solution-website.png", tags: ["Logo", "Nhận diện"] },
  { id: 3, slug: "vde-agency", title: "VDE Agency – Vượt trên sự hoàn hảo", image: "/images/solution-content.png", tags: ["Website", "Truyền thông"] },
  { id: 4, slug: "solar-top", title: "Solar Top – Chọn điện mặt trời chất lượng", image: "/images/solution-seo.png", tags: ["Logo", "Nhận diện"] },
  { id: 5, slug: "bach-nien-gia", title: "BĐS Bách Niên Gia – Khơi nguồn thịnh vượng", image: "/images/solution-landing.png", tags: ["Website", "Bất động sản"] },
  { id: 6, slug: "ichiban-logistic", title: "Ichiban Logistic – Không ngừng cải tiến", image: "/images/solution-marketing.png", tags: ["Logo"] },
  { id: 7, slug: "ogo-academy", title: "OGO – Học viện ngôi sao livestream", image: "/images/solution-branding.png", tags: ["Logo", "Nhận diện"] },
  { id: 8, slug: "tb-vietnam", title: "TB Vietnam – Tinh hoa từ thiên nhiên", image: "/images/solution-website.png", tags: ["Catalogue", "Sản phẩm số"] },
  { id: 9, slug: "floors-by-nature", title: "Floors by Nature – Sàn gỗ nội thất Australia", image: "/images/solution-content.png", tags: ["Website", "Nội thất"] },
  { id: 10, slug: "santino-fashion", title: "Santino – Thời trang nam phong cách lịch lãm", image: "/images/solution-seo.png", tags: ["Website", "Thời trang"] },
  { id: 11, slug: "intech-holdings", title: "INTECH HOLDINGS – Tập đoàn năng lượng", image: "/images/solution-landing.png", tags: ["Website", "Tập đoàn"] },
  { id: 12, slug: "nulith-landing", title: "Nulith – Landing Page tối ưu chuyển đổi", image: "/images/solution-marketing.png", tags: ["Landing Page"] },
  { id: 13, slug: "molyci-academy", title: "Molyci Academy – Viện đào tạo Nail chuyên nghiệp", image: "/images/solution-branding.png", tags: ["Logo"] },
  { id: 14, slug: "content-tiktok", title: "TikTok Brand Viral – Chiến dịch sáng tạo nội dung", image: "/images/solution-content.png", tags: ["Content Creator"] },
  { id: 15, slug: "phi-linh-wedding", title: "Phi Linh Wedding – Pocket Planner for Your Wedding", image: "/images/solution-website.png", tags: ["Logo", "Nhận diện"] },
];

const filterTabs = ["Tất cả", "Website", "Nhận diện", "Landing Page", "Sản phẩm số", "Content Creator", "Logo"];

export default function ProjectsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(9);
  const [animKey, setAnimKey] = useState(0);
  const prevCountRef = useRef(9);

  const filteredProjects = activeTab === "Tất cả"
    ? projects
    : projects.filter((p) => p.tags.includes(activeTab));

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <div style={{ overflow: "hidden" }}>
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
            <span style={{ color: "#fff", fontWeight: 600 }}>Dự án</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
            Dự án của chúng tôi
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7 }}>
            Với hơn 5 năm kinh nghiệm chuyên sâu — Đã có 500+ khách hàng tin tưởng sử dụng dịch vụ
          </p>
        </div>
      </section>

      {/* ══════ FILTER TABS + PROJECTS GRID ══════ */}
      <section style={{ padding: "50px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* Tags */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              <span style={{ color: "#16a34a", fontSize: "0.8rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Tags phổ biến</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {filterTabs.map((tab) => (
                <button key={tab} onClick={() => { setActiveTab(tab); setVisibleCount(9); }} style={{
                  padding: "9px 22px", borderRadius: 24, border: "none", cursor: "pointer",
                  background: activeTab === tab ? "linear-gradient(135deg, #16a34a, #15803d)" : "#fff",
                  color: activeTab === tab ? "#fff" : "#374151",
                  fontSize: "0.82rem", fontWeight: 600,
                  boxShadow: activeTab === tab ? "0 4px 14px rgba(22,163,74,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.25s",
                }}
                  onMouseEnter={e => { if (activeTab !== tab) { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { if (activeTab !== tab) { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; } }}
                >{tab}</button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 32,
          }}>
            {displayedProjects.map((project, idx) => (
              <a key={project.id} href={`/projects/${project.slug}`} className={`project-card ${idx >= prevCountRef.current ? 'project-appear' : ''}`} style={{
                animationDelay: idx >= prevCountRef.current ? `${(idx - prevCountRef.current) * 0.1}s` : '0s',
                display: "block", background: "#fff", borderRadius: 16, overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textDecoration: "none",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              >
                {/* Image */}
                <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", position: "relative", background: "#f3f4f6" }}>
                  <img src={project.image} alt={project.title} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                  {/* Tags overlay */}
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    display: "flex", flexWrap: "wrap", gap: 6,
                  }}>
                    {project.tags.map((tag) => (
                      <span key={tag} style={{
                        padding: "4px 12px", borderRadius: 16,
                        background: "rgba(22,163,74,0.9)", color: "#fff",
                        fontSize: "0.68rem", fontWeight: 700, backdropFilter: "blur(4px)",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                {/* Title */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <h3 style={{
                    fontSize: "0.9rem", fontWeight: 700, color: "#111827",
                    lineHeight: 1.45, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>{project.title}</h3>
                </div>
              </a>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredProjects.length && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button onClick={() => { prevCountRef.current = visibleCount; setVisibleCount((c) => c + 6); setAnimKey((k) => k + 1); }} style={{
                padding: "12px 36px", borderRadius: 30, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
                fontSize: "0.88rem", fontWeight: 700,
                boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                transition: "all 0.3s", display: "inline-flex", alignItems: "center", gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(22,163,74,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,163,74,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Xem thêm <PiArrowRight /></button>
            </div>
          )}

        </div>
      </section>

      <Footer />
      <FloatingButtons />

      {/* Responsive + Animation */}
      <style>{`
        @keyframes projectFadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .project-appear {
          animation: projectFadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .projects-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
