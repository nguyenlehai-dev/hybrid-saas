"use client";
import { useState, useRef } from "react";
import { PiList, PiMagnifyingGlass, PiPhone, PiCaretDown, PiGlobe, PiPalette, PiRocketLaunch, PiSparkle, PiPencilLine, PiChartLineUp } from "react-icons/pi";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const serviceItems = [
  {
    icon: <PiRocketLaunch />,
    title: "Thiết kế Landing Page bằng WP",
    desc: "Landing page tối ưu chuyển đổi trên nền tảng WordPress, chuẩn SEO...",
    href: "/#services",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    icon: <PiSparkle />,
    title: "Thiết kế hình ảnh bằng Prompt",
    desc: "Tạo hình ảnh chất lượng cao từ mô tả văn bản với công nghệ AI...",
    href: "/#services",
    color: "#a855f7",
    bg: "#faf5ff",
  },
  {
    icon: <PiPencilLine />,
    title: "Quản trị & sáng tạo nội dung",
    desc: "Chiến lược content đa kênh Facebook, TikTok, Instagram, Website...",
    href: "/#services",
    color: "#06b6d4",
    bg: "#ecfeff",
  },
  {
    icon: <PiGlobe />,
    title: "Thiết kế website chuyên nghiệp",
    desc: "Website bán hàng, giới thiệu doanh nghiệp chuẩn SEO & responsive...",
    href: "/#services",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: <PiPalette />,
    title: "Kết nối nền tảng AI hình ảnh & video",
    desc: "Tích hợp các nền tảng dựng hình ảnh, video bằng AI hàng đầu...",
    href: "/#services",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    icon: <PiChartLineUp />,
    title: "Dịch vụ SEO tổng thể",
    desc: "Chiến lược SEO bài bản, kế hoạch rõ ràng, tối ưu công cụ tìm kiếm...",
    href: "/#services",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
];

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div style={{ position: "relative", zIndex: 100, background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Hamburger (mobile only) */}
          <button className="hamburger-btn" onClick={onOpenMobileMenu} style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#16a34a", border: "none", cursor: "pointer",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "1.2rem",
          }}><PiList /></button>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: "1.6rem", fontWeight: 800,
              color: "#16a34a", letterSpacing: "-0.5px",
            }}>
              VPS<span style={{ color: "#15803d" }}>Panel</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="nav-links-desktop" style={{ alignItems: "center", gap: 32 }}>
            {[
              { label: "VỀ CHÚNG TÔI", href: "#about" },
              { label: "DỊCH VỤ", href: "#services", dropdown: true },
              { label: "DỰ ÁN", href: "#tools" },
              { label: "HỖ TRỢ KHÁCH HÀNG", href: "/ho-tro-khach-hang" },
              { label: "TUYỂN DỤNG", href: "#", hot: true },
              { label: "BLOG", href: "#" },
            ].map((item, i) => (
              <div
                key={i}
                style={{ position: "relative" }}
                onMouseEnter={item.dropdown ? handleMouseEnter : undefined}
                onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
              >
                <a href={item.href}
                  style={{
                    color: (item.dropdown && showDropdown) ? "#16a34a" : "#374151",
                    fontSize: "0.82rem", fontWeight: 600,
                    transition: "color 0.2s", position: "relative",
                    display: "flex", alignItems: "center", gap: 4,
                    letterSpacing: "0.3px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                  onMouseLeave={e => {
                    if (!(item.dropdown && showDropdown)) {
                      e.currentTarget.style.color = "#374151";
                    }
                  }}
                >
                  {item.label}
                  {item.dropdown && <PiCaretDown style={{
                    fontSize: "0.7rem",
                    transition: "transform 0.2s",
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
                  }} />}
                  {item.hot && (
                    <span style={{
                      position: "absolute", top: -8, right: -22,
                      background: "#ef4444", color: "#fff",
                      fontSize: "0.55rem", fontWeight: 700, padding: "1px 5px",
                      borderRadius: 4, lineHeight: 1.3,
                    }}>HOT</span>
                  )}
                </a>

                {/* ── MEGA DROPDOWN ── */}
                {item.dropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingTop: 16,
                    opacity: showDropdown ? 1 : 0,
                    visibility: showDropdown ? "visible" : "hidden",
                    transition: "opacity 0.25s ease, visibility 0.25s ease",
                    pointerEvents: showDropdown ? "auto" : "none",
                  }}>
                    {/* Arrow */}
                    <div style={{
                      position: "absolute", top: 8, left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: 12, height: 12, background: "#fff",
                      boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)",
                      zIndex: 1,
                    }} />

                    <div style={{
                      width: 680,
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)",
                      padding: "24px 28px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}>
                      {serviceItems.map((service, si) => (
                        <a key={si} href={service.href} style={{
                          display: "flex", alignItems: "flex-start", gap: 14,
                          padding: "14px 16px",
                          borderRadius: 12,
                          transition: "background 0.2s",
                          textDecoration: "none",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {/* Icon */}
                          <div style={{
                            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                            background: service.bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.3rem", color: service.color,
                          }}>
                            {service.icon}
                          </div>
                          {/* Text */}
                          <div>
                            <div style={{
                              fontSize: "0.85rem", fontWeight: 700, color: "#111827",
                              marginBottom: 4, lineHeight: 1.3,
                            }}>{service.title}</div>
                            <div style={{
                              fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.5,
                            }}>{service.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="nav-actions-desktop" style={{ alignItems: "center", gap: 16 }}>
            <a href="/login" style={{
              padding: "10px 24px", borderRadius: 24,
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: "0.85rem", fontWeight: 600,
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.3)"; }}
            ><PiPhone style={{ fontSize: "1rem" }} /> LIÊN HỆ TƯ VẤN</a>
          </div>

          {/* Search icon (mobile only) */}
          <button className="hamburger-btn" style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#16a34a", border: "none", cursor: "pointer",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "1.1rem",
          }}><PiMagnifyingGlass /></button>
        </nav>
      </div>
    </div>
  );
}
