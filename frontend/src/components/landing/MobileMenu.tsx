"use client";
import { PiX, PiLightning, PiMapPin, PiPhone, PiEnvelopeSimple } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t, lang } = useLang();
  const supportHref = "/support";
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

        {/* About */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.7 }}>
            {t("footer.desc")}
          </p>
          <a href="/login" style={{
            display: "inline-block", marginTop: 12,
            padding: "10px 28px", borderRadius: 30,
            background: "#16a34a", color: "#fff",
            fontSize: "0.85rem", fontWeight: 600,
          }}>{t("sol.more")}</a>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: "8px 0" }}>
          {[
            { label: t("nav.about"), href: "/#about" },
            { label: t("nav.services"), href: "/#services" },
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

        {/* Contact Info */}
        <div style={{ padding: "20px 24px", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiMapPin style={{ color: "#16a34a" }} /> Ho Chi Minh City, Vietnam
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiPhone style={{ color: "#16a34a" }} /> 0765.168.xxx
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PiEnvelopeSimple style={{ color: "#16a34a" }} /> admin@nulith.io.vn
          </div>
        </div>
      </div>
    </>
  );
}
