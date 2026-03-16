"use client";
import { useState, useEffect } from "react";
import { PiX, PiLightning, PiMapPin, PiPhone, PiEnvelopeSimple, PiUser, PiSignOut, PiSparkle, PiGear } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t, lang } = useLang();
  const supportHref = "/support";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <div className={`mobile-menu-overlay ${isOpen ? "active" : ""}`} onClick={onClose} />
      <div className={`mobile-menu-panel ${isOpen ? "active" : ""}`}>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 20px 0" }}>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "#fff", fontSize: "1.2rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><PiX /></button>
        </div>

        {/* Logo */}
        <div style={{ padding: "16px 24px 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 42, height: 42, borderRadius: 10,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", color: "#fff",
          }}><PiLightning /></span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>Nulith</span>
        </div>

        {/* User section */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {isLoggedIn ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", color: "#fff",
                }}><PiUser /></div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{username}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Thành viên</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="/dashboard" onClick={onClose} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
                  background: "#16a34a", color: "#fff", fontSize: "0.8rem", fontWeight: 600,
                }}>Dashboard</a>
                <a href="/dashboard/generate" onClick={onClose} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
                  background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.8rem", fontWeight: 600,
                }}>Tạo ảnh AI</a>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: 12 }}>
                {t("footer.desc")}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="/login" onClick={onClose} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                  background: "#16a34a", color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                }}>Đăng nhập</a>
                <a href="/register" onClick={onClose} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                  background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                }}>Đăng ký</a>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div style={{ padding: "8px 0" }}>
          {[
            { label: t("nav.about"), href: "/#about" },
            { label: t("nav.services"), href: "/#services" },
            { label: "✨ Tạo ảnh AI", href: "/dashboard/generate" },
            { label: t("nav.projects"), href: "/projects" },
            { label: t("nav.support"), href: supportHref },
            { label: t("nav.blog"), href: "/blog" },
          ].map((item, i) => (
            <a key={i} href={item.href}
              onClick={onClose}
              style={{
                display: "block", padding: "14px 24px",
                color: "#fff", fontSize: "0.95rem", fontWeight: 600,
                textTransform: "uppercase" as const, letterSpacing: "0.5px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "background 0.2s",
              }}
            >{item.label}</a>
          ))}
        </div>

        {/* Logout button for logged in users */}
        {isLoggedIn && (
          <div style={{ padding: "8px 24px" }}>
            <button onClick={handleLogout} style={{
              width: "100%", padding: "12px 0", borderRadius: 8,
              background: "rgba(239,68,68,0.15)", color: "#ef4444",
              fontSize: "0.85rem", fontWeight: 600, border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}>
              <PiSignOut /> Đăng xuất
            </button>
          </div>
        )}

        {/* Contact Info */}
        <div style={{ padding: "20px 24px", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiMapPin style={{ color: "#16a34a" }} /> Ho Chi Minh City, Vietnam
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiPhone style={{ color: "#16a34a" }} /> 0765.168.xxx
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PiEnvelopeSimple style={{ color: "#16a34a" }} /> admin@vpspanel.io.vn
          </div>
        </div>
      </div>
    </>
  );
}
