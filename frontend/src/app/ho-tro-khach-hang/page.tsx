"use client";
import { useState } from "react";
import { PiCaretDown, PiCaretUp, PiLightning, PiMapPin, PiPhone, PiEnvelopeSimple, PiFacebookLogo, PiTwitterLogo, PiLinkedinLogo, PiHeart, PiList, PiX, PiMagnifyingGlass, PiCaretRight } from "react-icons/pi";

/* ── FAQ Data per service ── */
const faqData: Record<string, { intro: string; questions: { q: string; a: string }[] }> = {
  website: {
    intro: "Dịch vụ thiết kế và lập trình website bán hàng, website giới thiệu doanh nghiệp và quảng bá dịch vụ, sản phẩm,… tạo kênh tìm kiếm khách hàng tiềm năng cho doanh nghiệp và chủ shop.",
    questions: [
      {
        q: "Website bán hàng là gì?",
        a: "Website bán hàng là cửa hàng của bạn trên internet. Nơi bạn có thể giới thiệu sản phẩm, dịch vụ của mình đến với những người có nhu cầu và họ có thể tiến hành mua hàng của bạn ngay trên website mà không cần đến cửa hàng. Vì vậy, website bán hàng của bạn cần thể hiện đầy đủ thông tin sản phẩm, dịch vụ, thông tin liên lạc cũng như các công cụ đặt hàng, thanh toán trực tuyến.",
      },
      {
        q: "Website giới thiệu dịch vụ, thông tin doanh nghiệp là gì?",
        a: "Khách hàng đang quan tâm đến dịch vụ và thông tin doanh nghiệp của bạn, bạn và họ không trực tiếp gặp mặt để bạn có thể giới thiệu thì website sẽ là chỗ để khách hàng của bạn vào tham khảo, tìm kiếm thông tin. Thông qua website bạn có thể quảng bá thương hiệu, hình ảnh của doanh nghiệp, tạo độ tin tưởng và khách hàng sẽ nhìn vào website để có thể đưa ra đánh giá mức độ chuyên nghiệp của bạn.",
      },
      {
        q: "Có nên làm website không?",
        a: "Bất cứ doanh nghiệp hay cá nhân nào đang kinh doanh cũng đều cần thiết kế website vì website giúp quảng bá về sản phẩm hay doanh nghiệp 24/7. Bên cạnh đó, website còn giúp bạn mở rộng cơ hội tìm kiếm khách hàng, đối tác.",
      },
      {
        q: "Thời gian thiết kế website trong bao lâu?",
        a: "Việc thiết kế web đến lúc hoàn thiện thông thường mất khoảng 15 – 20 ngày phụ thuộc theo yêu cầu, mức độ phức tạp, quy mô của sản phẩm, doanh nghiệp và được thực hiện theo quy trình:\n\nBước 1: Tiếp nhận yêu cầu, phối hợp ý tưởng với khách hàng.\nBước 2: Xây dựng mẫu thiết kế giao diện dạng ảnh 2D.\nBước 3: Tiếp nhận ý kiến điều chỉnh và chỉnh sửa.\nBước 4: Cắt giao diện, lập trình code.\nBước 5: Vận hành thử nghiệm và chỉnh sửa lỗi.\nBước 6: Bàn giao và hướng dẫn quản trị.",
      },
      {
        q: "Chính sách bảo hành và hỗ trợ kỹ thuật như thế nào?",
        a: "Bảo hành từ 1 – 3 năm: Chúng tôi sẽ tiến hành sửa chữa các lỗi phát sinh trong quá trình sử dụng website.\n\nLiên tục nâng cấp: Hệ thống quản trị website sẽ không ngừng được nâng cấp với các tính năng và công nghệ mới nhất.\n\nHỗ trợ sửa chữa lỗi phát sinh nhanh: Các lỗi nhỏ sẽ được hỗ trợ ngay lập tức.",
      },
      {
        q: "Cần phải trả những loại chi phí nào khi thiết kế website?",
        a: "Để thiết kế một website, quý khách cần chi trả cho 3 loại chi phí:\n\n• Tên miền: Địa chỉ định danh dẫn tới website của bạn\n• Hosting: Thuê không gian lưu trữ website trên mạng Internet\n• Thiết kế website: Tùy thuộc vào yêu cầu thực tế, bao gồm giao diện, chức năng, quản trị nội dung và các chi phí duy trì, nâng cấp.",
      },
    ],
  },
  branding: {
    intro: "Dịch vụ thiết kế nhận diện thương hiệu, logo, biểu tượng doanh nghiệp và sáng tác slogan chuyên nghiệp.",
    questions: [
      { q: "Nhận diện thương hiệu là gì?", a: "Nhận diện thương hiệu là tập hợp các yếu tố hình ảnh mà doanh nghiệp sử dụng để tạo ấn tượng với khách hàng, bao gồm logo, màu sắc, phông chữ, danh thiếp, bao bì sản phẩm và các ấn phẩm truyền thông." },
      { q: "Tại sao cần thiết kế nhận diện thương hiệu?", a: "Nhận diện thương hiệu giúp doanh nghiệp tạo sự khác biệt, xây dựng niềm tin và tạo ấn tượng chuyên nghiệp trong mắt khách hàng. Một bộ nhận diện nhất quán sẽ giúp thương hiệu dễ nhận biết hơn." },
      { q: "Bộ nhận diện thương hiệu bao gồm những gì?", a: "Bao gồm: Logo, bộ màu sắc thương hiệu, phông chữ, danh thiếp, phong bì thư, giấy tiêu đề, chữ ký email, biển hiệu, banner, profile doanh nghiệp và các ấn phẩm truyền thông." },
      { q: "Thời gian hoàn thành là bao lâu?", a: "Thời gian hoàn thành bộ nhận diện thương hiệu thông thường từ 7 – 15 ngày tùy thuộc vào quy mô và yêu cầu cụ thể của khách hàng." },
      { q: "Chi phí thiết kế nhận diện thương hiệu?", a: "Chi phí phụ thuộc vào phạm vi công việc, số lượng ấn phẩm cần thiết kế và mức độ phức tạp. Vui lòng liên hệ để được báo giá chi tiết." },
    ],
  },
  content: {
    intro: "Dịch vụ quản trị và sáng tạo nội dung trên các kênh truyền thông, giúp doanh nghiệp tiếp cận hàng triệu khách hàng tiềm năng.",
    questions: [
      { q: "Content Marketing là gì?", a: "Content Marketing là chiến lược tạo và chia sẻ nội dung có giá trị, phù hợp và nhất quán để thu hút và giữ chân khách hàng mục tiêu, từ đó thúc đẩy hành động mua hàng." },
      { q: "Các loại nội dung mà VPS Panel AI cung cấp?", a: "Chúng tôi cung cấp: Bài viết SEO, content mạng xã hội (Facebook, Instagram, TikTok), email marketing, video script, infographic, ebook và whitepaper." },
      { q: "Quy trình sản xuất nội dung như thế nào?", a: "Bước 1: Nghiên cứu thị trường và đối thủ.\nBước 2: Xây dựng chiến lược content.\nBước 3: Lên kế hoạch nội dung (content calendar).\nBước 4: Sản xuất nội dung.\nBước 5: Đăng tải và quản lý.\nBước 6: Đo lường và tối ưu." },
      { q: "Bao lâu thì thấy hiệu quả?", a: "Content Marketing thường cần 3-6 tháng để thấy kết quả rõ rệt. Tuy nhiên, với chiến lược đúng đắn và nội dung chất lượng, bạn có thể thấy sự cải thiện về traffic và tương tác sau 1-2 tháng." },
    ],
  },
  landing: {
    intro: "Dịch vụ thiết kế Landing Page tối ưu chuyển đổi, giúp tìm kiếm khách hàng tiềm năng và tăng doanh số bán hàng.",
    questions: [
      { q: "Landing Page là gì?", a: "Landing Page (trang đích) là một trang web đơn lẻ được thiết kế với mục đích cụ thể, thường là thu thập thông tin khách hàng tiềm năng hoặc thúc đẩy một hành động chuyển đổi cụ thể." },
      { q: "Landing Page khác gì với Website thông thường?", a: "Landing Page tập trung vào một mục tiêu duy nhất với một call-to-action rõ ràng, trong khi website thông thường có nhiều trang và mục đích khác nhau. Landing Page được tối ưu để tăng tỷ lệ chuyển đổi." },
      { q: "Tỷ lệ chuyển đổi trung bình là bao nhiêu?", a: "Tỷ lệ chuyển đổi trung bình của Landing Page dao động từ 2-5%. Tuy nhiên, với thiết kế và tối ưu tốt, có thể đạt 10-20% hoặc cao hơn tùy ngành." },
      { q: "Chi phí thiết kế Landing Page?", a: "Chi phí phụ thuộc vào độ phức tạp, tính năng tích hợp và yêu cầu thiết kế. Vui lòng liên hệ để được tư vấn và báo giá chi tiết." },
    ],
  },
  seo: {
    intro: "Dịch vụ SEO tổng thể giúp website của bạn đạt thứ hạng cao trên Google, tăng lượng truy cập tự nhiên và chuyển đổi khách hàng.",
    questions: [
      { q: "SEO là gì?", a: "SEO (Search Engine Optimization) là quá trình tối ưu hóa website để cải thiện thứ hạng trên các công cụ tìm kiếm như Google, Bing, giúp tăng lượng truy cập tự nhiên (organic traffic)." },
      { q: "SEO mất bao lâu để thấy kết quả?", a: "Thông thường SEO cần 3-6 tháng để thấy kết quả rõ rệt. Thời gian cụ thể phụ thuộc vào mức độ cạnh tranh của từ khóa, chất lượng website hiện tại và chiến lược SEO được áp dụng." },
      { q: "Dịch vụ SEO bao gồm những gì?", a: "Bao gồm: Nghiên cứu từ khóa, tối ưu On-page (nội dung, thẻ meta, URL, hình ảnh), xây dựng liên kết (backlink), tối ưu tốc độ website, SEO kỹ thuật và báo cáo hàng tháng." },
      { q: "Tại sao nên chọn VPS Panel AI cho SEO?", a: "Chúng tôi có đội ngũ chuyên gia SEO với hơn 5 năm kinh nghiệm, chiến lược SEO bài bản, cam kết KPI rõ ràng và báo cáo minh bạch. Đã hỗ trợ hơn 500+ doanh nghiệp cải thiện thứ hạng Google." },
    ],
  },
  marketing: {
    intro: "Dịch vụ phòng Marketing thuê ngoài giúp doanh nghiệp tối ưu chi phí và sở hữu đội ngũ nhân sự marketing chất lượng, chuyên nghiệp.",
    questions: [
      { q: "Phòng Marketing thuê ngoài là gì?", a: "Phòng Marketing thuê ngoài là dịch vụ cung cấp đội ngũ marketing chuyên nghiệp cho doanh nghiệp mà không cần tuyển dụng và đào tạo nhân sự nội bộ. Bạn sẽ có một team marketing hoàn chỉnh với chi phí tối ưu." },
      { q: "Lợi ích khi thuê ngoài Marketing?", a: "• Tiết kiệm chi phí tuyển dụng và đào tạo\n• Đội ngũ chuyên nghiệp, kinh nghiệm đa ngành\n• Linh hoạt điều chỉnh quy mô theo nhu cầu\n• Tiếp cận công nghệ và công cụ marketing mới nhất\n• Tập trung vào kinh doanh cốt lõi" },
      { q: "Team Marketing thuê ngoài bao gồm những ai?", a: "Tùy theo gói dịch vụ, team có thể bao gồm: Marketing Manager, Content Creator, SEO Specialist, Social Media Manager, Graphic Designer, Ads Specialist và Data Analyst." },
      { q: "Chi phí thuê phòng Marketing ngoài?", a: "Chi phí phụ thuộc vào quy mô team, phạm vi công việc và thời gian hợp tác. Vui lòng liên hệ để được tư vấn gói dịch vụ phù hợp với nhu cầu và ngân sách của doanh nghiệp." },
    ],
  },
};

const tabs = [
  { id: "website", label: "VPS Website" },
  { id: "branding", label: "VPS Branding" },
  { id: "content", label: "VPS Content" },
  { id: "landing", label: "VPS Landing" },
  { id: "seo", label: "VPS SEO" },
  { id: "marketing", label: "VPS Marketing" },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("website");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentData = faqData[activeTab];

  return (
    <div style={{ overflow: "hidden" }}>
      {/* ══════ NAVBAR ══════ */}
      <div style={{ background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
                VPS<span style={{ color: "#15803d" }}>Panel</span>
              </span>
            </a>
            <div className="nav-links-desktop" style={{ alignItems: "center", gap: 32 }}>
              {[
                { label: "TRANG CHỦ", href: "/" },
                { label: "DỊCH VỤ", href: "/#services" },
                { label: "DỰ ÁN", href: "/#tools" },
                { label: "HỖ TRỢ KHÁCH HÀNG", href: "/ho-tro-khach-hang", active: true },
                { label: "BLOG", href: "#" },
              ].map((item, i) => (
                <a key={i} href={item.href}
                  style={{
                    color: item.active ? "#16a34a" : "#374151",
                    fontSize: "0.82rem", fontWeight: 600,
                    letterSpacing: "0.3px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                  onMouseLeave={e => { if (!item.active) e.currentTarget.style.color = "#374151"; }}
                >{item.label}</a>
              ))}
            </div>
            <div className="nav-actions-desktop" style={{ alignItems: "center", gap: 16 }}>
              <a href="/login" style={{
                padding: "10px 24px", borderRadius: 24,
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                display: "flex", alignItems: "center", gap: 6,
              }}><PiPhone style={{ fontSize: "1rem" }} /> LIÊN HỆ TƯ VẤN</a>
            </div>
            <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#16a34a", border: "none", cursor: "pointer",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "1.2rem",
            }}>{mobileMenuOpen ? <PiX /> : <PiList />}</button>
          </nav>
        </div>
      </div>

      {/* ══════ HERO BREADCRUMB ══════ */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)",
        padding: "60px 0 70px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          top: -100, right: -50,
        }} />
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          bottom: -80, left: "20%",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.85rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Trang chủ</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <span style={{ color: "#fff", fontWeight: 600 }}>Hỗ trợ khách hàng</span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#fff", lineHeight: 1.3, marginBottom: 12,
          }}>
            Hỗ trợ khách hàng
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7 }}>
            Với hơn 5 năm kinh nghiệm chuyên sâu — Đã có 500+ khách hàng tin tưởng sử dụng dịch vụ
          </p>
        </div>
      </section>

      {/* ══════ MAIN CONTENT ══════ */}
      <section style={{ padding: "60px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="support-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, alignItems: "flex-start" }}>

            {/* ── LEFT: Tab Navigation ── */}
            <div style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              position: "sticky", top: 90,
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOpenFaq(0); }}
                  style={{
                    width: "100%", padding: "16px 24px",
                    background: activeTab === tab.id ? "linear-gradient(135deg, #16a34a, #15803d)" : "#fff",
                    color: activeTab === tab.id ? "#fff" : "#374151",
                    border: "none", borderBottom: "1px solid #f1f5f9",
                    fontSize: "0.9rem", fontWeight: 600,
                    textAlign: "left", cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "#f0fdf4";
                      e.currentTarget.style.color = "#16a34a";
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#374151";
                    }
                  }}
                >
                  {tab.label}
                  <PiCaretRight style={{ fontSize: "0.8rem", opacity: activeTab === tab.id ? 1 : 0.4 }} />
                </button>
              ))}
            </div>

            {/* ── RIGHT: FAQ Content ── */}
            <div>
              {/* Section Intro */}
              <div style={{
                background: "#fff", borderRadius: 16, padding: "28px 32px",
                marginBottom: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                borderLeft: "4px solid #16a34a",
              }}>
                <h2 style={{
                  fontSize: "1.3rem", fontWeight: 800, color: "#111827",
                  marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#16a34a",
                    display: "inline-block",
                  }} />
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
                  {currentData.intro}
                </p>
              </div>

              {/* FAQ Accordion */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {currentData.questions.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 12,
                    boxShadow: openFaq === i ? "0 4px 20px rgba(22,163,74,0.1)" : "0 1px 8px rgba(0,0,0,0.04)",
                    border: openFaq === i ? "1px solid rgba(22,163,74,0.2)" : "1px solid #f1f5f9",
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}>
                    {/* Question */}
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: "100%", padding: "20px 24px",
                        background: "transparent", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", gap: 16,
                      }}
                    >
                      <span style={{
                        fontSize: "0.95rem", fontWeight: 600,
                        color: openFaq === i ? "#16a34a" : "#111827",
                        textAlign: "left", flex: 1,
                        transition: "color 0.2s",
                      }}>
                        <span style={{
                          color: "#16a34a", fontWeight: 700, marginRight: 8,
                        }}>{i + 1}.</span>
                        {item.q}
                      </span>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: openFaq === i ? "#16a34a" : "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s",
                      }}>
                        {openFaq === i
                          ? <PiCaretUp style={{ color: "#fff", fontSize: "0.8rem" }} />
                          : <PiCaretDown style={{ color: "#16a34a", fontSize: "0.8rem" }} />
                        }
                      </div>
                    </button>

                    {/* Answer */}
                    <div style={{
                      maxHeight: openFaq === i ? 500 : 0,
                      opacity: openFaq === i ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s ease, opacity 0.3s ease",
                    }}>
                      <div style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid #f1f5f9",
                      }}>
                        <p style={{
                          color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.8,
                          paddingTop: 16, margin: 0, whiteSpace: "pre-line",
                        }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER (simplified) ══════ */}
      <footer style={{ background: "#064e3b", color: "rgba(255,255,255,0.7)", padding: "60px 0 30px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="footer-grid-responsive" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
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
              {["Thiết kế Website", "Nhận diện thương hiệu", "Content Marketing", "Landing Page", "SEO tổng thể"].map((l, i) => (
                <a key={i} href="/#services" style={{ display: "block", padding: "5px 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
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
    </div>
  );
}
