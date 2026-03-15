"use client";
import { useLang } from "@/lib/i18n";

export default function CaseStudiesSection() {
  const { lang } = useLang();

  const cases = lang === "en" ? [
    { category: "AI Tools", title: "AI Image Generation", bg: "#e8f4fd", img: "/images/case-ai-image.png" },
    { category: "AI Marketing", title: "SEO Content Writing", bg: "#f3e8f9", img: "/images/case-seo-content.png" },
    { category: "AI Business", title: "AI Chatbot Assistant", bg: "#e8f0fd", img: "/images/case-chatbot.png" },
    { category: "AI Creative", title: "AI Video Creation", bg: "#0a0e2a", img: "/images/case-video-ai.png" },
    { category: "AI Analytics", title: "AI Data Analysis", bg: "#e8f4fd", img: "/images/case-data-insights.png" },
  ] : [
    { category: "Công cụ AI", title: "Tạo Ảnh AI Tự Động", bg: "#e8f4fd", img: "/images/case-ai-image.png" },
    { category: "AI Marketing", title: "Viết Nội Dung SEO", bg: "#f3e8f9", img: "/images/case-seo-content.png" },
    { category: "AI Doanh Nghiệp", title: "Trợ Lý Chatbot AI", bg: "#e8f0fd", img: "/images/case-chatbot.png" },
    { category: "AI Sáng Tạo", title: "Tạo Video AI", bg: "#0a0e2a", img: "/images/case-video-ai.png" },
    { category: "AI Phân Tích", title: "Phân Tích Dữ Liệu AI", bg: "#e8f4fd", img: "/images/case-data-insights.png" },
  ];
  return (
    <section id="tools" style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 50 }}>
          <div>
            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>{lang === "en" ? "Featured Projects" : "Dự Án Tiêu Biểu"}</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111827", marginTop: 8, lineHeight: 1.3 }}>
              {lang === "en" ? <>Impressive results from<br />real projects</> : <>Kết quả ấn tượng từ<br />các dự án thực tế</>}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", border: "2px solid #16a34a",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#16a34a", fontSize: "1.1rem", fontWeight: 700,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#16a34a"; }}
              onClick={() => {
                const el = document.getElementById("case-carousel");
                if (el) el.scrollBy({ left: -300, behavior: "smooth" });
              }}
            >‹</div>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#16a34a",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: "1.1rem", fontWeight: 700,
              transition: "all 0.2s",
            }}
              onClick={() => {
                const el = document.getElementById("case-carousel");
                if (el) el.scrollBy({ left: 300, behavior: "smooth" });
              }}
            >›</div>
          </div>
        </div>

        <div id="case-carousel" className="case-carousel" style={{
          display: "flex", gap: 20, overflowX: "auto",
          paddingBottom: 10,
        }}>
          {cases.map((item, i) => (
            <div key={i} style={{
              cursor: "pointer",
              transition: "all 0.3s", position: "relative",
              borderRadius: 16, background: "#fff",
              border: "1px solid #f1f5f9",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              minWidth: 270, flex: "0 0 calc(25% - 15px)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{
                width: "100%", height: 280, overflow: "hidden",
                background: item.bg, borderRadius: "16px 16px 0 0",
              }}>
                <img src={item.img} alt={item.title} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.5s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "20px 24px" }}>
                <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 }}>{item.category}</span>
                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111827", marginTop: 6, lineHeight: 1.3 }}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
