"use client";
import { PiList, PiMagnifyingGlass, PiPhone, PiCaretDown } from "react-icons/pi";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
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
              <a key={i} href={item.href}
                style={{
                  color: "#374151", fontSize: "0.82rem", fontWeight: 600,
                  transition: "color 0.2s", position: "relative",
                  display: "flex", alignItems: "center", gap: 4,
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                onMouseLeave={e => e.currentTarget.style.color = "#374151"}
              >
                {item.label}
                {item.dropdown && <PiCaretDown style={{ fontSize: "0.7rem" }} />}
                {item.hot && (
                  <span style={{
                    position: "absolute", top: -8, right: -22,
                    background: "#ef4444", color: "#fff",
                    fontSize: "0.55rem", fontWeight: 700, padding: "1px 5px",
                    borderRadius: 4, lineHeight: 1.3,
                  }}>HOT</span>
                )}
              </a>
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
