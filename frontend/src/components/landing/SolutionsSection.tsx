"use client";
import { PiGlobe, PiPalette, PiPencilLine, PiRocketLaunch, PiSparkle } from "react-icons/pi";

const solutions = [
  {
    icon: <PiRocketLaunch />,
    title: "THIẾT KẾ LANDING PAGE BẰNG WP",
    subtitle: "WordPress Landing Page chuyên nghiệp",
    desc: "Thiết kế landing page tối ưu chuyển đổi trên nền tảng WordPress — dễ quản trị, chuẩn SEO, tích hợp sẵn form liên hệ và hệ thống tracking chuyển đổi.",
    gradient: "linear-gradient(135deg, #f97316, #ef4444)",
    iconBg: "#fff7ed",
    iconColor: "#f97316",
    accentLight: "rgba(249,115,22,0.08)",
    accentShadow: "rgba(249,115,22,0.25)",
  },
  {
    icon: <PiSparkle />,
    title: "THIẾT KẾ HÌNH ẢNH BẰNG PROMPT",
    subtitle: "AI Image Generation từ mô tả văn bản",
    desc: "Tạo hình ảnh chất lượng cao từ prompt — ảnh sản phẩm, banner quảng cáo, ảnh minh họa bài viết với công nghệ AI tiên tiến nhất hiện nay.",
    gradient: "linear-gradient(135deg, #a855f7, #6366f1)",
    iconBg: "#faf5ff",
    iconColor: "#a855f7",
    accentLight: "rgba(168,85,247,0.08)",
    accentShadow: "rgba(168,85,247,0.25)",
  },
  {
    icon: <PiPencilLine />,
    title: "QUẢN TRỊ & SÁNG TẠO NỘI DUNG",
    subtitle: "Content Marketing đa kênh",
    desc: "Xây dựng chiến lược nội dung sáng tạo trên Facebook, TikTok, Instagram, Website — giúp thương hiệu tiếp cận hàng triệu khách hàng tiềm năng.",
    gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
    iconBg: "#ecfeff",
    iconColor: "#06b6d4",
    accentLight: "rgba(6,182,212,0.08)",
    accentShadow: "rgba(6,182,212,0.25)",
  },
  {
    icon: <PiGlobe />,
    title: "THIẾT KẾ WEBSITE CHUYÊN NGHIỆP",
    subtitle: "Website chuẩn SEO & Responsive",
    desc: "Thiết kế và phát triển website bán hàng, giới thiệu doanh nghiệp với giao diện hiện đại, tốc độ tải nhanh, tối ưu trải nghiệm người dùng trên mọi thiết bị.",
    gradient: "linear-gradient(135deg, #16a34a, #15803d)",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    accentLight: "rgba(22,163,74,0.08)",
    accentShadow: "rgba(22,163,74,0.25)",
  },
  {
    icon: <PiPalette />,
    title: "KẾT NỐI NỀN TẢNG DỰNG HÌNH ẢNH & VIDEO AI",
    subtitle: "AI Video & Image Platform Integration",
    desc: "Kết nối trực tiếp đến các nền tảng dựng hình ảnh, video bằng AI hàng đầu — tự động hóa quy trình sản xuất nội dung đa phương tiện cho doanh nghiệp.",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    iconBg: "#fdf2f8",
    iconColor: "#ec4899",
    accentLight: "rgba(236,72,153,0.08)",
    accentShadow: "rgba(236,72,153,0.25)",
  },
];

export default function SolutionsSection() {
  return (
    <section id="services" style={{
      padding: "80px 0 100px",
      background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(22,163,74,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.03) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#16a34a", display: "inline-block",
            }} />
            <span style={{
              color: "#16a34a", fontSize: "0.85rem", fontWeight: 700,
              letterSpacing: 1, textTransform: "uppercase" as const,
            }}>DỊCH VỤ CỦA VPS PANEL AI</span>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#16a34a", display: "inline-block",
            }} />
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800,
            color: "#111827", lineHeight: 1.3,
          }}>
            GIẢI PHÁP TOÀN DIỆN CHO<br />
            <span style={{ color: "#16a34a" }}>DOANH NGHIỆP</span> THỜI ĐẠI SỐ
          </h2>
          <p style={{
            color: "#6b7280", fontSize: "0.95rem", maxWidth: 560,
            margin: "16px auto 0", lineHeight: 1.7,
          }}>
            Từ thiết kế website đến AI sáng tạo nội dung — chúng tôi mang đến giải pháp công nghệ hiện đại nhất cho doanh nghiệp của bạn
          </p>
        </div>

        {/* Row 1: 3 cards */}
        <div className="solutions-grid-responsive" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24,
          marginBottom: 24,
        }}>
          {solutions.slice(0, 3).map((item, i) => (
            <ServiceCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Row 2: 2 cards — centered */}
        <div className="solutions-grid-responsive-row2" style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24,
          maxWidth: 800, margin: "0 auto",
        }}>
          {solutions.slice(3, 5).map((item, i) => (
            <ServiceCard key={i + 3} item={item} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Service Card Component ── */
function ServiceCard({ item, index }: { item: typeof solutions[0]; index: number }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        position: "relative",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${item.accentShadow}`;
        e.currentTarget.style.borderColor = `${item.iconColor}33`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.04)";
      }}
    >
      {/* Gradient Top Bar */}
      <div style={{
        height: 4, width: "100%",
        background: item.gradient,
      }} />

      {/* Card Content */}
      <div style={{ padding: "28px 24px 24px" }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: item.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.6rem", color: item.iconColor,
          marginBottom: 20,
          transition: "transform 0.3s, background 0.3s",
        }}>
          {item.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "0.95rem", fontWeight: 800,
          color: "#111827", lineHeight: 1.3, marginBottom: 6,
          letterSpacing: "0.2px",
        }}>{item.title}</h3>

        {/* Subtitle */}
        <p style={{
          fontSize: "0.78rem", color: item.iconColor,
          fontWeight: 600, marginBottom: 12,
          letterSpacing: "0.3px",
        }}>{item.subtitle}</p>

        {/* Description */}
        <p style={{
          fontSize: "0.85rem", color: "#6b7280",
          lineHeight: 1.7, marginBottom: 24,
          minHeight: 72,
        }}>{item.desc}</p>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 22px", borderRadius: 8,
            background: item.gradient,
            color: "#fff", fontSize: "0.8rem", fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s",
            boxShadow: `0 4px 12px ${item.accentShadow}`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 20px ${item.accentShadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${item.accentShadow}`;
            }}
          >Tư vấn ngay</a>
          <a href="/ho-tro-khach-hang" style={{
            fontSize: "0.8rem", fontWeight: 600,
            color: item.iconColor, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 4,
            transition: "gap 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.gap = "8px"}
            onMouseLeave={e => e.currentTarget.style.gap = "4px"}
          >Chi tiết <span>→</span></a>
        </div>
      </div>
    </div>
  );
}
