"use client";
import { useState } from "react";

export default function BannerCarousel() {
  const [bannerIndex, setBannerIndex] = useState(0);

  const slides = [
    { img: "/images/gdrive-banner.png", alt: "VPS Panel AI Banner 1" },
    { img: "/images/gdrive-banner.png", alt: "VPS Panel AI Banner 2" },
    { img: "/images/gdrive-banner.png", alt: "VPS Panel AI Banner 3" },
    { img: "/images/gdrive-banner.png", alt: "VPS Panel AI Banner 4" },
    { img: "/images/gdrive-banner.png", alt: "VPS Panel AI Banner 5" },
  ];

  return (
    <section style={{ background: "#fff", position: "relative", marginTop: "-8pc", zIndex: 10 }}>
      {/* Green swoosh curve from hero */}
      <svg viewBox="0 0 1440 80" style={{ display: "block", width: "100%", marginTop: -1 }} preserveAspectRatio="none">
        <path d="M0,0 L0,20 Q360,80 720,40 Q1080,0 1440,30 L1440,0 Z" fill="#ecfdf5" />
        <path d="M0,60 Q200,80 400,50 Q700,10 1000,40 Q1200,55 1440,30" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.3" />
      </svg>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", top: -80 }}>
        {/* Carousel with arrows layout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Left Arrow */}
          <button
            className="banner-carousel-arrows"
            onClick={() => setBannerIndex(prev => Math.max(0, prev - 1))}
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              background: "#16a34a", border: "none", cursor: "pointer",
              color: "#fff", fontSize: "1.3rem", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: bannerIndex === 0 ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
            disabled={bannerIndex === 0}
          >‹</button>

          {/* Carousel container */}
          <div style={{ flex: 1, overflow: "hidden", borderRadius: 16 }}>
            <div style={{
              display: "flex",
              transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
              transform: `translateX(-${bannerIndex * (100 / 3)}%)`,
            }}>
              {slides.map((slide, i) => (
                <div key={i} className="banner-carousel-slide" style={{
                  flex: "0 0 calc(100% / 3)",
                  padding: "0 8px",
                  boxSizing: "border-box" as const,
                }}>
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className="banner-carousel-arrows"
            onClick={() => setBannerIndex(prev => Math.min(2, prev + 1))}
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              background: "#16a34a", border: "none", cursor: "pointer",
              color: "#fff", fontSize: "1.3rem", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: bannerIndex === 2 ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
            disabled={bannerIndex === 2}
          >›</button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setBannerIndex(i)}
              style={{
                width: bannerIndex === i ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: bannerIndex === i ? "#16a34a" : "#d1d5db",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
