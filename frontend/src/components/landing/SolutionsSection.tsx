"use client";

const solutions = [
  {
    img: "/images/solution-website.png",
    title: "THIẾT KẾ WEBSITE CHUYÊN NGHIỆP",
    subtitle: "Giải pháp thiết kế website bán hàng, giới thiệu dịch vụ chuyên nghiệp",
    desc: "Sở hữu một website chuẩn SEO, giao diện responsive với đầy đủ tính năng bán hàng online, giới thiệu dịch vụ, dự án,...",
  },
  {
    img: "/images/solution-branding.png",
    title: "THIẾT KẾ NHẬN DIỆN THƯƠNG HIỆU",
    subtitle: "Giải pháp xây dựng bộ nhận diện thương hiệu cho doanh nghiệp",
    desc: "Thiết kế logo, nhận diện thương hiệu, ấn phẩm truyền thông, profile doanh nghiệp ấn tượng, độc đáo, hiệu quả",
  },
  {
    img: "/images/solution-content.png",
    title: "QUẢN TRỊ VÀ SÁNG TẠO NỘI DUNG",
    subtitle: "Phát triển và sáng tạo nội dung trên các kênh truyền thông",
    desc: "Xây dựng chiến lược content sáng tạo trên các kênh digital giúp doanh nghiệp tiếp cận được hàng triệu khách hàng",
  },
  {
    img: "/images/solution-landing.png",
    title: "THIẾT KẾ LANDING PAGE",
    subtitle: "Landing page tối ưu chuyển đổi và tìm kiếm khách hàng tiềm năng",
    desc: "Giải pháp tuyệt vời, tối ưu hiệu quả cho các chiến dịch bán hàng và truyền thông thương hiệu của bạn",
  },
  {
    img: "/images/solution-seo.png",
    title: "DỊCH VỤ SEO TỔNG THỂ",
    subtitle: "Giải pháp tối ưu hóa công cụ tìm kiếm cho website của bạn",
    desc: "Chiến lược SEO bài bản, kế hoạch rõ ràng kết hợp với nội dung chuyên sâu giúp khách hàng tìm thấy bạn trên Google",
  },
  {
    img: "/images/solution-marketing.png",
    title: "PHÒNG MARKETING THUÊ NGOÀI",
    subtitle: "Sở hữu đội Marketing mà không phải tốn công xây dựng",
    desc: "Xu hướng giúp doanh nghiệp của bạn tối ưu hóa chi phí và sở hữu đội ngũ nhân sự marketing chất lượng, chuyên nghiệp",
  },
];

export default function SolutionsSection() {
  return (
    <section style={{
      padding: "80px 0 100px",
      background: "#f9fafb",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{
            color: "#16a34a", fontSize: "0.85rem", fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase" as const,
          }}>DỊCH VỤ CỦA VPS PANEL AI</span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800,
            color: "#111827", lineHeight: 1.3, marginTop: 10,
          }}>
            GIẢI PHÁP CHO DOANH NGHIỆP<br />
            TRONG THỜI ĐẠI 4.0
          </h2>
        </div>

        {/* Solutions Grid — 3 columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
        }} className="solutions-grid-responsive">
          {solutions.map((item, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
            >
              {/* Card Image */}
              <div style={{
                width: "100%", aspectRatio: "16/10",
                overflow: "hidden",
                background: "#f3f4f6",
              }}>
                <img src={item.img} alt={item.title} style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>

              {/* Card Content */}
              <div style={{ padding: "20px 22px 24px" }}>
                {/* Icon + Title Row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    overflow: "hidden",
                  }}>
                    <img src="/images/solution-icon.png" alt="" style={{
                      width: "100%", height: "100%", objectFit: "cover",
                    }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: "0.85rem", fontWeight: 800,
                      color: "#111827", lineHeight: 1.3, marginBottom: 4,
                    }}>{item.title}</h3>
                    <p style={{
                      fontSize: "0.75rem", color: "#6b7280",
                      lineHeight: 1.4, margin: 0,
                    }}>{item.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: "0.82rem", color: "#4b5563",
                  lineHeight: 1.7, marginBottom: 20,
                  minHeight: 60,
                }}>{item.desc}</p>

                {/* Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <a href="#contact" style={{
                    display: "inline-block", padding: "10px 22px",
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#fff", fontSize: "0.78rem", fontWeight: 700,
                    textDecoration: "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(22,163,74,0.25)"; }}
                  >Liên hệ tư vấn</a>
                  <a href="#" style={{
                    fontSize: "0.78rem", fontWeight: 600,
                    color: "#16a34a", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 4,
                    transition: "gap 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.gap = "8px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "4px"}
                  >Xem thêm <span>›</span></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
