"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";

export default function TestimonialsSection() {
  const { lang } = useLang();
  const [testimonialVisible, setTestimonialVisible] = useState(false);
  const testimonialSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = testimonialSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTestimonialVisible(true);
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
    <section ref={testimonialSectionRef} style={{
      padding: "80px 0",
      background: "#f9fafb",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          {/* Left Column — Text — slides in from left */}
          <div style={{
            flex: "1 1 480px", minWidth: 320,
            opacity: testimonialVisible ? 1 : 0,
            transform: testimonialVisible ? "translateX(0) scale(1)" : "translateX(-120px) scale(0.95)",
            transition: "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}>
            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{
                color: "#16a34a", fontSize: "0.8rem", fontWeight: 700,
                letterSpacing: 1, textTransform: "uppercase" as const,
              }}>{lang === "en" ? "LISTEN TO FEEDBACK" : "LẮNG NGHE Ý KIẾN"}</span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800,
              color: "#111827", lineHeight: 1.3, marginBottom: 32,
            }}>
              {lang === "en" ? "WHAT CUSTOMERS SAY ABOUT" : "KHÁCH HÀNG NÓI GÌ VỀ"}<br />
              NULITH
            </h2>

            {/* Testimonial Quote Card */}
            <div style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              borderLeft: "4px solid #16a34a",
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: "0.92rem", color: "#4b5563",
                lineHeight: 1.8, fontStyle: "italic", margin: 0,
              }}>
                {lang === "en"
                  ? '\u201c Thank you Nulith for delivering amazing projects for us. With the quality of your services and products, you will surely go further. \u201d'
                  : '\u201c C\u1ea3m \u01a1n Nulith \u0111\u00e3 th\u1ef1c hi\u1ec7n c\u00e1c d\u1ef1 \u00e1n tuy\u1ec7t v\u1eddi cho b\u00ean m\u00ecnh. Ch\u1eafc ch\u1eafn v\u1edbi ch\u1ea5t l\u01b0\u1ee3ng d\u1ecbch v\u1ee5 v\u00e0 s\u1ea3n ph\u1ea9m c\u1ee7a Nulith, c\u00e1c b\u1ea1n s\u1ebd c\u00f2n ti\u1ebfn xa h\u01a1n. \u201d'}
              </p>
            </div>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img
                src="/ceo-photo.jpg"
                alt="Nguyễn Lê Hải"
                style={{
                  width: 50, height: 50, borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #e5e7eb",
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#16a34a" }}>Nguyễn Lê Hải</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>CEO Nulith</div>
              </div>
            </div>
          </div>

          {/* Right Column — Phone Image — slides in from right */}
          <div style={{
            flex: "1 1 400px", minWidth: 320,
            display: "flex", justifyContent: "center", alignItems: "center",
            position: "relative",
            opacity: testimonialVisible ? 1 : 0,
            transform: testimonialVisible ? "translateX(0) scale(1)" : "translateX(120px) scale(0.95)",
            transition: "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
          }}>
            {/* Green circle background */}
            <div style={{
              position: "absolute",
              width: "85%", aspectRatio: "1",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              zIndex: 0,
            }} />

            {/* Phone Image */}
            <img
              src="/images/testimonial-phone.png"
              alt="Social media engagement"
              style={{
                width: "90%", maxWidth: 420,
                position: "relative", zIndex: 1,
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
              }}
            />

            {/* Floating emojis */}
            <div style={{
              position: "absolute", top: "8%", left: "15%", zIndex: 2,
              fontSize: "2rem",
              animation: "floatCard 3s ease-in-out infinite",
            }}>🤗</div>
            <div style={{
              position: "absolute", top: "5%", right: "20%", zIndex: 2,
              fontSize: "2rem",
              animation: "floatCard 3.5s ease-in-out infinite 0.5s",
            }}>😍</div>
            <div style={{
              position: "absolute", bottom: "15%", left: "10%", zIndex: 2,
              fontSize: "2.2rem",
              animation: "floatCard 4s ease-in-out infinite 1s",
            }}>😘</div>
            <div style={{
              position: "absolute", bottom: "10%", right: "10%", zIndex: 2,
              fontSize: "2.2rem",
              animation: "floatCard 3.2s ease-in-out infinite 0.3s",
            }}>❤️</div>
          </div>
        </div>
      </div>
    </section>
  );
}
