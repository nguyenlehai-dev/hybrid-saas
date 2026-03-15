"use client";
import { PiCoin, PiCheck } from "react-icons/pi";

const plans = [
  { name: "Khởi Đầu", price: "99K", credits: "50", features: ["20 ảnh/ngày", "512x512", "Tạo ảnh từ văn bản", "Nâng cấp độ nét"] },
  { name: "Chuyên Nghiệp", price: "299K", credits: "200", features: ["100 ảnh/ngày", "1024x1024", "Tất cả công cụ", "Chỉnh sửa + Làm đẹp", "Hỗ trợ ưu tiên"], popular: true },
  { name: "Doanh Nghiệp", price: "799K", credits: "600", features: ["Không giới hạn", "2048x2048", "Tất cả AI", "Xử lý ưu tiên", "Truy cập API"] },
  { name: "Cao Cấp", price: "2.499K", credits: "2,500", features: ["Không giới hạn", "4K siêu nét", "Server riêng", "Tạo Landing Page", "Video AI", "Hỗ trợ 24/7"] },
];

export default function PricingSection() {
  return (
    <section id="pricing" style={{ padding: "80px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Bảng giá</span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111827", marginTop: 8 }}>
            Chọn gói phù hợp
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
                }}>PHỔ BIẾN</div>
              )}
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", marginBottom: 8 }}>{plan.name}</h3>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827" }}>
                {plan.price} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>VNĐ</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: 20 }}>/ tháng</div>
              <div style={{
                display: "inline-block", padding: "6px 18px", borderRadius: 20,
                background: "rgba(22,163,74,0.08)", color: "#16a34a",
                fontSize: "0.85rem", fontWeight: 600, marginBottom: 24,
              }}><PiCoin style={{ marginRight: 4 }} /> {plan.credits} Điểm</div>
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
              >{plan.name === "Cao Cấp" ? "Liên hệ" : "Chọn gói này"}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
