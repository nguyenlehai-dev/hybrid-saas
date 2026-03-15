"use client";
import { PiGlobe, PiPalette, PiPencilLine, PiRocketLaunch, PiSparkle, PiChartLineUp } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

export default function SolutionsSection() {
  const { lang, t } = useLang();
  const supportHref = lang === "en" ? "/support" : "/ho-tro-khach-hang";

  const solutions = [
    { img: "/images/solution-website.png", icon: <PiRocketLaunch />, iconBg: "#fff7ed", iconColor: "#f97316", title: t("sol.s1.title"), subtitle: t("sol.s1.sub"), desc: t("sol.s1.desc") },
    { img: "/images/solution-branding.png", icon: <PiSparkle />, iconBg: "#faf5ff", iconColor: "#a855f7", title: t("sol.s2.title"), subtitle: t("sol.s2.sub"), desc: t("sol.s2.desc") },
    { img: "/images/solution-content.png", icon: <PiPencilLine />, iconBg: "#ecfeff", iconColor: "#06b6d4", title: t("sol.s3.title"), subtitle: t("sol.s3.sub"), desc: t("sol.s3.desc") },
    { img: "/images/solution-landing.png", icon: <PiGlobe />, iconBg: "#f0fdf4", iconColor: "#16a34a", title: t("sol.s4.title"), subtitle: t("sol.s4.sub"), desc: t("sol.s4.desc") },
    { img: "/images/solution-seo.png", icon: <PiPalette />, iconBg: "#fdf2f8", iconColor: "#ec4899", title: t("sol.s5.title"), subtitle: t("sol.s5.sub"), desc: t("sol.s5.desc") },
    { img: "/images/solution-marketing.png", icon: <PiChartLineUp />, iconBg: "#f0fdf4", iconColor: "#16a34a", title: t("sol.s6.title"), subtitle: t("sol.s6.sub"), desc: t("sol.s6.desc") },
  ];

  return (
    <section id="services" style={{ padding: "80px 0 100px", background: "#f9fafb", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const }}>{t("sol.tag")}</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#111827", lineHeight: 1.3, marginTop: 10 }}>
            {t("sol.title1")}<br />{t("sol.title2")}
          </h2>
        </div>

        <div className="solutions-grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {solutions.map((item, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#f3f4f6" }}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", color: item.iconColor,
                  }}>{item.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.4, margin: 0 }}>{item.subtitle}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.7, marginBottom: 20, minHeight: 60 }}>{item.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <a href="#contact" style={{
                    display: "inline-block", padding: "10px 22px", borderRadius: 6,
                    background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
                    fontSize: "0.78rem", fontWeight: 700, textDecoration: "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.25)"; }}
                  >{t("sol.cta")}</a>
                  <a href={supportHref} style={{
                    fontSize: "0.78rem", fontWeight: 600, color: "#16a34a", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 4, transition: "gap 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.gap = "8px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "4px"}
                  >{t("sol.more")} <span>›</span></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
