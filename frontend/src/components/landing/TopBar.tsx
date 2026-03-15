"use client";
import { PiMagnifyingGlass } from "react-icons/pi";

export default function TopBar() {
  return (
    <div className="topbar-desktop" style={{
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      padding: "8px 0",
      fontSize: "0.82rem",
      color: "#fff",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Language Switcher */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button style={{
            padding: "3px 10px", borderRadius: 4, border: "none",
            background: "rgba(255,255,255,0.2)", color: "#fff",
            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
          }}>EN</button>
          <button style={{
            padding: "3px 10px", borderRadius: 4, border: "none",
            background: "#fff", color: "#16a34a",
            fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
          }}>VI</button>
        </div>

        {/* Center Promo Text */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Hỗ trợ giá các gói dịch vụ</span>
          <span style={{ color: "#fde047", fontWeight: 700, textDecoration: "underline" }}>lên tới 50%</span>
          <span>trong mùa dịch</span>
        </div>

        {/* Search Icon */}
        <button style={{
          background: "none", border: "none", color: "#fff",
          fontSize: "1.1rem", cursor: "pointer", display: "flex",
          alignItems: "center", opacity: 0.8,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}
        ><PiMagnifyingGlass /></button>
      </div>
    </div>
  );
}
