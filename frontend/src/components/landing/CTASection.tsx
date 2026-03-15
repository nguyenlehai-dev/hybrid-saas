"use client";
import { PiRocketLaunch, PiEnvelopeSimple } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

export default function CTASection() {
  const { t } = useLang();
  return (
    <section id="contact" style={{
      padding: "80px 0",
      background: "linear-gradient(135deg, #15803d 0%, #064e3b 100%)",
      position: "relative",
    }}>
      <svg style={{ position: "absolute", top: -2, left: 0, width: "100%" }} viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,0 C480,60 960,0 1440,40 L1440,0 L0,0 Z" fill="#f8fafc" />
      </svg>
      <div style={{
        maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center",
        position: "relative", zIndex: 2,
      }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          {t("cta.title")}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>
          {t("cta.desc")}
        </p>
        <div className="cta-buttons-row" style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <a href="/login" style={{
            padding: "14px 36px", borderRadius: 10,
            background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff",
            fontWeight: 700, fontSize: "1rem",
            boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
          }}><PiRocketLaunch style={{ marginRight: 6 }} /> {t("cta.btn1")}</a>
          <a href="mailto:admin@vpspanel.io.vn" style={{
            padding: "14px 36px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.3)", color: "#fff",
            fontWeight: 600, fontSize: "1rem",
          }}><PiEnvelopeSimple style={{ marginRight: 6 }} /> {t("cta.btn2")}</a>
        </div>
      </div>
    </section>
  );
}
