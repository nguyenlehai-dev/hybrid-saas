"use client";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

export default function TopBar() {
  const { lang, setLang, t } = useLang();

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
          <button onClick={() => setLang("en")} style={{
            padding: "3px 10px", borderRadius: 4, border: "none",
            background: lang === "en" ? "#fff" : "rgba(255,255,255,0.2)",
            color: lang === "en" ? "#16a34a" : "#fff",
            fontSize: "0.75rem", fontWeight: lang === "en" ? 700 : 600, cursor: "pointer",
            transition: "all 0.2s",
          }}>EN</button>
          <button onClick={() => setLang("vi")} style={{
            padding: "3px 10px", borderRadius: 4, border: "none",
            background: lang === "vi" ? "#fff" : "rgba(255,255,255,0.2)",
            color: lang === "vi" ? "#16a34a" : "#fff",
            fontSize: "0.75rem", fontWeight: lang === "vi" ? 700 : 600, cursor: "pointer",
            transition: "all 0.2s",
          }}>VI</button>
        </div>

        {/* Center Promo Text */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>{t("topbar.promo")}</span>
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
