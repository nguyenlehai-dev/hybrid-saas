"use client";
import { PiCoin, PiCheck } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

export default function PricingSection() {
  const { t } = useLang();

  const plans = [
    { name: t("price.plan1"), price: "99K", credits: "50", features: [t("price.f1.1"), "512x512", t("price.f1.2"), t("price.f1.3")] },
    { name: t("price.plan2"), price: "299K", credits: "200", features: [t("price.f2.1"), "1024x1024", t("price.f2.2"), t("price.f2.3"), t("price.f2.4")], popular: true },
    { name: t("price.plan3"), price: "799K", credits: "600", features: [t("price.f3.1"), "2048x2048", t("price.f3.2"), t("price.f3.3"), t("price.f3.4")] },
    { name: t("price.plan4"), price: "2.499K", credits: "2,500", features: [t("price.f3.1"), "4K", t("price.f4.1"), t("price.f4.2"), t("price.f4.3"), t("price.f4.4")], isContact: true },
  ];

  return (
    <section id="pricing" style={{ padding: "80px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>{t("price.tag")}</span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111827", marginTop: 8 }}>
            {t("price.title")}
          </h2>
        </div>
        <div className="pricing-grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, padding: "36px 24px",
              textAlign: "center", position: "relative",
              display: "flex", flexDirection: "column" as const,
              border: plan.popular ? "2px solid #16a34a" : "1px solid #f1f5f9",
              boxShadow: plan.popular ? "0 12px 40px rgba(22,163,74,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
              transform: plan.popular ? "scale(1.02)" : "none",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
                  padding: "4px 18px", borderRadius: "0 0 8px 8px",
                  fontSize: "0.7rem", fontWeight: 700, letterSpacing: 0.5,
                }}>{t("price.popular")}</div>
              )}
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827" }}>
                {plan.price} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>VNĐ</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: 20 }}>{t("price.monthly")}</div>
              <div style={{
                display: "inline-block", padding: "6px 18px", borderRadius: 20,
                background: "rgba(22,163,74,0.08)", color: "#16a34a",
                fontSize: "0.85rem", fontWeight: 600, marginBottom: 24,
              }}><PiCoin style={{ marginRight: 4 }} /> {plan.credits} {t("price.points")}</div>
              <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 24, flex: 1 }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{
                    padding: "8px 0", fontSize: "0.88rem", color: "#475569",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <PiCheck style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <a href="/login" style={{
                marginTop: "auto",
                display: "block", padding: "12px", borderRadius: 8,
                background: plan.popular ? "linear-gradient(135deg, #16a34a, #15803d)" : "#f8fafc",
                color: plan.popular ? "#fff" : "#111827", fontWeight: 600, fontSize: "0.92rem",
                border: plan.popular ? "none" : "1px solid #e2e8f0",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#111827"; } }}
              >{(plan as any).isContact ? t("price.contact") : t("price.cta")}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
