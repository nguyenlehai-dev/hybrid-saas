"use client";
import { useState, useEffect, useRef } from "react";
import { PiCheck } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

export default function AboutSection() {
  const { t, lang } = useLang();
  const [aboutVisible, setAboutVisible] = useState(false);
  const aboutSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAboutVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={aboutSectionRef} id="about" style={{ padding: "80px 0 100px", background: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="hero-grid-responsive" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left: Text content — slides in from left */}
          <div style={{
            opacity: aboutVisible ? 1 : 0,
            transform: aboutVisible ? "translateX(0) scale(1)" : "translateX(-120px) scale(0.95)",
            transition: "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}>
            {/* Subtitle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#16a34a", display: "inline-block",
              }} />
              <span style={{
                color: "#16a34a", fontSize: "0.85rem", fontWeight: 700,
                letterSpacing: "1px", textTransform: "uppercase" as const,
              }}>{t("about.tag")}</span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800,
              color: "#111827", lineHeight: 1.25, marginBottom: 20,
            }}>
              {lang === "en" ? "EMBRACING MODERN" : "HỘI NHẬP XU HƯỚNG"}<br />
              <span style={{ color: "#16a34a" }}>MARKETING</span> {lang === "en" ? "TRENDS" : "HIỆN ĐẠI"}
            </h2>

            {/* Description */}
            <p style={{
              color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.8,
              marginBottom: 28, maxWidth: 500,
            }}>
              {t("about.desc")}
            </p>

            {/* CTA Button */}
            <a href="#contact" style={{
              display: "inline-block", padding: "14px 32px", borderRadius: 28,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: "0.9rem", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
              marginBottom: 32, transition: "transform 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >{t("nav.cta")}</a>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(lang === "en" ? [
                "Build multi-platform, multi-channel strategies.",
                "Increase brand awareness for your business.",
                "Boost customer satisfaction on digital platforms.",
                "Suitable for businesses developing services or products.",
              ] : [
                "Xây dựng chiến lược đa nền tảng, đa kênh.",
                "Tăng mức độ nhận diện thương hiệu của doanh nghiệp.",
                "Tăng độ hài lòng của khách hàng trên nền tảng số.",
                "Phù hợp với doanh nghiệp phát triển dịch vụ hoặc sản phẩm.",
              ]).map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <PiCheck style={{ color: "#fff", fontSize: "0.7rem" }} />
                  </div>
                  <span style={{ color: "#374151", fontSize: "0.88rem", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image with decorations — slides in from right */}
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", position: "relative",
            opacity: aboutVisible ? 1 : 0,
            transform: aboutVisible ? "translateX(0) scale(1)" : "translateX(120px) scale(0.95)",
            transition: "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
          }}>
            {/* Yellow circle background */}
            <div style={{
              position: "absolute", width: "85%", height: "85%",
              borderRadius: "50%", background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              zIndex: 0,
            }} />

            {/* Woman image */}
            <img
              src="/images/about-woman.png"
              alt="VPS Panel AI Team"
              style={{
                width: "90%", maxWidth: 460,
                position: "relative", zIndex: 2,
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.1))",
              }}
            />

            {/* Floating card 1 — bottom left */}
            <img className="float-card-1" src="/images/about-float-1.png" alt="" style={{
              position: "absolute", bottom: "10%", left: "0%", zIndex: 3,
              width: 200,
              animation: "floatCard 3s ease-in-out infinite",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />

            {/* Floating card 2 — bottom right */}
            <img className="float-card-2" src="/images/about-float-2.png" alt="" style={{
              position: "absolute", bottom: "5%", right: "0%", zIndex: 3,
              width: 200,
              animation: "floatCard 3s ease-in-out infinite 1s",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
