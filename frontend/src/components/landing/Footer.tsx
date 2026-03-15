"use client";
import { PiLightning, PiMapPin, PiPhone, PiEnvelopeSimple, PiFacebookLogo, PiTwitterLogo, PiLinkedinLogo, PiHeart } from "react-icons/pi";

export default function Footer() {
  return (
    <footer style={{ background: "#064e3b", color: "rgba(255,255,255,0.7)", padding: "60px 0 30px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="footer-grid-responsive" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
              }}><PiLightning style={{ color: "#fff" }} /></span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>VPS Panel AI</span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 280 }}>
              Nền tảng AI xử lý ảnh và quản lý server thông minh. Được phát triển tại Việt Nam 🇻🇳
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {[<PiFacebookLogo key="fb" />, <PiTwitterLogo key="tw" />, <PiLinkedinLogo key="li" />].map((s, i) => (
                <span key={i} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", cursor: "pointer", color: "rgba(255,255,255,0.7)",
                }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: 16 }}>Dịch vụ</h4>
            {["Tạo Ảnh Từ Văn Bản", "Ảnh Review Sản Phẩm", "Làm Đẹp Da AI", "Nâng Cấp 4K", "Chỉnh Sửa Ảnh"].map((l, i) => (
              <a key={i} href="#tools" style={{ display: "block", padding: "5px 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: 16 }}>Hỗ trợ</h4>
            {["Hướng dẫn", "API Docs", "Bảng giá", "FAQ"].map((l, i) => (
              <a key={i} href="#" style={{ display: "block", padding: "5px 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: 16 }}>Thông tin liên hệ</h4>
            <p style={{ fontSize: "0.88rem", lineHeight: 2, display: "flex", flexDirection: "column" as const, gap: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><PiMapPin /> Ho Chi Minh City, Vietnam</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><PiPhone /> 0765.168.xxx</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><PiEnvelopeSimple /> admin@vpspanel.io.vn</span>
            </p>
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24,
          textAlign: "center", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)",
        }}>
          © 2026 VPS Panel AI. Bản quyền thuộc về VPS Panel AI. Được tạo với <PiHeart style={{ color: "#ef4444", margin: "0 4px", verticalAlign: "middle" }} /> tại Việt Nam 🇻🇳
        </div>
      </div>
    </footer>
  );
}
