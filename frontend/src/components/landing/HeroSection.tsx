"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";

export default function HeroSection() {
  const { t, lang } = useLang();
  /* ── Typing animation state ── */
  const typingPhrases = lang === "en"
    ? ["CONTENT MARKETING", "SEO WEBSITE", "GOOGLE ADS", "WEBSITE DESIGN", "AI IMAGE PROCESSING"]
    : ["CONTENT MARKETING", "SEO WEBSITE", "QUẢNG CÁO GOOGLE", "THIẾT KẾ WEBSITE", "XỬ LÝ ẢNH AI"];
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentPhrase = typingPhrases[typingIndex];
    const speed = isDeleting ? 40 : 80;

    typingRef.current = setTimeout(() => {
      if (!isDeleting) {
        setTypingText(currentPhrase.substring(0, typingText.length + 1));
        if (typingText.length + 1 === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypingText(currentPhrase.substring(0, typingText.length - 1));
        if (typingText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % typingPhrases.length);
        }
      }
    }, speed);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [typingText, isDeleting, typingIndex]);

  return (
    <section style={{
      padding: "60px 0 80px",
      background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 40%, #ecfdf5 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle background decoration */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: "55%", height: "100%",
        background: "radial-gradient(circle at 70% 50%, rgba(22,163,74,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="hero-grid-responsive" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Left: Text content */}
        <div style={{ paddingTop: 20 }}>
          {/* Subtitle dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#16a34a", display: "inline-block",
            }} />
            <span style={{
              color: "#374151", fontSize: "0.85rem", fontWeight: 600,
              letterSpacing: "1px", textTransform: "uppercase" as const,
            }}>{t("hero.searching")}</span>
          </div>

          {/* Main Heading with Typing Effect */}
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#111827", lineHeight: 1.3, marginBottom: 20,
          }}>
            {t("hero.heading")}{" "}<br />
            <span style={{
              color: "#16a34a",
              borderRight: "3px solid #16a34a",
              paddingRight: 4,
              animation: "blinkCursor 0.8s step-end infinite",
            }}>
              {typingText}
            </span>
          </h1>

          <p style={{
            color: "#6b7280", fontSize: "0.95rem",
            maxWidth: 420, lineHeight: 1.8, marginBottom: 32,
          }}>
            {t("hero.desc2")}
          </p>

          {/* Buttons */}
          <div className="hero-buttons-row" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a href="#about" style={{
              padding: "12px 28px", borderRadius: 24,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: "0.9rem", fontWeight: 600,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >{t("hero.btn1")}</a>
            <a href="#services" style={{
              padding: "12px 28px", borderRadius: 24,
              border: "2px solid #16a34a", color: "#16a34a",
              fontSize: "0.9rem", fontWeight: 600, transition: "all 0.2s",
              background: "transparent",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#16a34a"; }}
            >{t("hero.btn2")}</a>
          </div>
        </div>

        {/* Right: Image with floating cards */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          {/* Main image */}
          <div style={{ position: "relative" }}>
            <img
              src="/images/hero-illustration.png?v=2"
              alt="Nulith Hero"
              style={{
                width: "100%",
                borderRadius: 20,
                position: "relative",
                zIndex: 2,
              }}
            />

            {/* Floating Card 1 */}
            <img className="float-card-1" src="/images/float-card-1.png" alt="" style={{
              position: "absolute", top: "2%", left: "-12%", zIndex: 3,
              width: 280,
              animation: "floatCard 3s ease-in-out infinite",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />

            {/* Floating Card 2 */}
            <img className="float-card-2" src="/images/float-card-2.png" alt="" style={{
              position: "absolute", top: "0%", right: "-18%", zIndex: 3,
              width: 340,
              animation: "floatCard 3s ease-in-out infinite 0.5s",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />

            {/* Floating Card 3 — Chart */}
            <div className="float-card-3" style={{
              position: "absolute", top: "-5%", left: "35%", zIndex: 3,
              background: "#fff", borderRadius: 10, padding: "8px 12px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
              animation: "floatCard 3s ease-in-out infinite 1s",
              display: "flex", gap: 3, alignItems: "flex-end",
            }}>
              {[24, 36, 20, 44, 30, 50, 38].map((h, i) => (
                <div key={i} style={{
                  width: 6, height: h * 0.6, borderRadius: 3,
                  background: i === 5 ? "#16a34a" : i % 2 === 0 ? "#818cf8" : "#fbbf24",
                }} />
              ))}
            </div>

            {/* Floating Card 4 */}
            <img className="float-card-4" src="/images/float-card-4.png" alt="" style={{
              position: "absolute", bottom: "2%", right: "-15%", zIndex: 3,
              width: 300,
              animation: "floatCard 3s ease-in-out infinite 1.5s",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />

            {/* Floating Card 5 */}
            <img className="float-card-5" src="/images/float-card-5.png" alt="" style={{
              position: "absolute", bottom: "5%", left: "-8%", zIndex: 3,
              width: 320,
              animation: "floatCard 3s ease-in-out infinite 2s",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
