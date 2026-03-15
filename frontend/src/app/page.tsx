"use client";
import { PiSparkle, PiCamera, PiSmileyWink, PiMagnifyingGlassPlus, PiPaintBrush, PiArrowsClockwise, PiImages, PiScissors, PiVideoCamera, PiMapPin, PiEnvelopeSimple, PiPhone, PiFacebookLogo, PiInstagramLogo, PiTwitterLogo, PiList, PiLightning, PiMagnifyingGlass, PiPlay, PiPalette, PiX, PiChatCircle, PiYoutubeLogo, PiRocketLaunch, PiCoin, PiCheck, PiHeart, PiLinkedinLogo, PiCaretDown, PiStar, PiUsers, PiChartLineUp, PiGlobe } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const services = [
    { icon: <PiSparkle />, title: "Tạo Ảnh Từ Văn Bản", desc: "Tạo ảnh chất lượng cao từ mô tả văn bản với AI thế hệ mới" },
    { icon: <PiCamera />, title: "Ảnh Review Sản Phẩm", desc: "Tạo ảnh review sản phẩm chuyên nghiệp cho eCommerce" },
    { icon: <PiSmileyWink />, title: "Làm Đẹp Da AI", desc: "Làm đẹp da và retouching ảnh chân dung bằng AI" },
    { icon: <PiMagnifyingGlassPlus />, title: "Nâng Cấp 4K", desc: "Nâng cấp độ phân giải ảnh lên 4K siêu nét" },
    { icon: <PiPaintBrush />, title: "Chỉnh Sửa Ảnh", desc: "Chỉnh sửa xóa nền thay thế vùng chọn trên ảnh" },
  ];

  /* ── Carousel state ── */
  const slideData = [
    { img: "/images/service-seo.png", title: "Dịch vụ SEO tổng thể" },
    { img: "/images/service-training.png", title: "Đào tạo SEO All In One" },
    { img: "/images/service-website.png", title: "Dịch vụ chăm sóc Website" },
    { img: "/images/service-ads.png", title: "Dịch vụ chạy QC Google ADS" },
    { img: "/images/service-seo.png", title: "Dịch vụ SEO tổng thể" },
    { img: "/images/service-training.png", title: "Đào tạo SEO All In One" },
    { img: "/images/service-website.png", title: "Dịch vụ chăm sóc Website" },
    { img: "/images/service-ads.png", title: "Dịch vụ chạy QC Google ADS" },
  ];
  const visibleCount = 4;
  const totalPages = slideData.length - visibleCount + 1;
  const [slideIndex, setSlideIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  /* ── Typing animation state ── */
  const typingPhrases = ["CONTENT MARKETING", "SEO WEBSITE", "QUẢNG CÁO GOOGLE", "THIẾT KẾ WEBSITE", "XỬ LÝ ẢNH AI"];
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalPages]);

  /* ── Typing effect ── */
  useEffect(() => {
    const currentPhrase = typingPhrases[typingIndex];
    const speed = isDeleting ? 40 : 80;

    typingRef.current = setTimeout(() => {
      if (!isDeleting) {
        setTypingText(currentPhrase.substring(0, typingText.length + 1));
        if (typingText.length + 1 === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypingText(currentPhrase.substring(0, typingText.length - 1));
        if (typingText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % typingPhrases.length);
        }
      }
    }, speed);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [typingText, isDeleting, typingIndex]);


  const tools = [
    { icon: <PiSparkle />, name: "Tạo Ảnh Từ Văn Bản", cost: "1.0 điểm" },
    { icon: <PiArrowsClockwise />, name: "Chuyển Đổi Ảnh", cost: "1.5 điểm" },
    { icon: <PiCamera />, name: "Ảnh Review Sản Phẩm", cost: "2.0 điểm" },
    { icon: <PiImages />, name: "Chụp Nhiều Góc", cost: "3.0 điểm" },
    { icon: <PiPaintBrush />, name: "Chỉnh Sửa Ảnh", cost: "1.5 điểm" },
    { icon: <PiSmileyWink />, name: "Làm Đẹp Da AI", cost: "2.0 điểm" },
    { icon: <PiMagnifyingGlassPlus />, name: "Nâng Cấp Độ Nét", cost: "0.5 điểm" },
    { icon: <PiScissors />, name: "Cắt Ảnh Thông Minh", cost: "0.25 điểm" },
    { icon: <PiVideoCamera />, name: "Tạo Video AI", cost: "5.0 điểm" },
  ];



  const testimonials = [
    { name: "Nguyễn Thị Hằng", role: "Giám đốc, Cửa hàng Thời trang", text: "VPS Panel AI giúp chúng tôi tạo hàng trăm ảnh sản phẩm mỗi ngày. Tiết kiệm 80% chi phí chụp ảnh.", avatar: "NT" },
    { name: "Trần Minh Đức", role: "Quản lý Marketing", text: "Chất lượng ảnh AI rất ấn tượng. Khách hàng không thể phân biệt với ảnh chụp thật.", avatar: "TM" },
  ];



  if (!mounted) return null;

  return (
    <div style={{ overflow: "hidden" }}>
      {/* ══════ FULL HEADER WRAPPER ══════ */}
      <div style={{
        background: "#fafbfc",
        position: "relative",
        display: "flex",
        flexDirection: "column" as const,
      }}>

        {/* ══════ TOP BAR — Green Announcement Bar ══════ */}
        <div className="topbar-desktop" style={{
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          padding: "8px 0",
          fontSize: "0.82rem",
          color: "#fff",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Language Switcher */}
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button style={{
                padding: "3px 10px", borderRadius: 4, border: "none",
                background: "rgba(255,255,255,0.2)", color: "#fff",
                fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
              }}>EN</button>
              <button style={{
                padding: "3px 10px", borderRadius: 4, border: "none",
                background: "#fff", color: "#16a34a",
                fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
              }}>VI</button>
            </div>

            {/* Center Promo Text */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Hỗ trợ giá các gói dịch vụ</span>
              <span style={{ color: "#fde047", fontWeight: 700, textDecoration: "underline" }}>lên tới 50%</span>
              <span>trong mùa dịch</span>
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

        {/* ══════ NAVBAR — Clean White Style ══════ */}
        <div style={{ position: "relative", zIndex: 100, background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

              {/* Hamburger (mobile only) */}
              <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)} style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "#16a34a", border: "none", cursor: "pointer",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "1.2rem",
              }}><PiList /></button>

              {/* Logo */}
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: "1.6rem", fontWeight: 800,
                  color: "#16a34a", letterSpacing: "-0.5px",
                }}>
                  VPS<span style={{ color: "#15803d" }}>Panel</span>
                </span>
              </a>

              {/* Nav Links */}
              <div className="nav-links-desktop" style={{ alignItems: "center", gap: 32 }}>
                {[
                  { label: "VỀ CHÚNG TÔI", href: "#about" },
                  { label: "DỊCH VỤ", href: "#services", dropdown: true },
                  { label: "DỰ ÁN", href: "#tools" },
                  { label: "HỖ TRỢ KHÁCH HÀNG", href: "#testimonials" },
                  { label: "TUYỂN DỤNG", href: "#", hot: true },
                  { label: "BLOG", href: "#" },
                ].map((item, i) => (
                  <a key={i} href={item.href}
                    style={{
                      color: "#374151", fontSize: "0.82rem", fontWeight: 600,
                      transition: "color 0.2s", position: "relative",
                      display: "flex", alignItems: "center", gap: 4,
                      letterSpacing: "0.3px",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                    onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                  >
                    {item.label}
                    {item.dropdown && <PiCaretDown style={{ fontSize: "0.7rem" }} />}
                    {item.hot && (
                      <span style={{
                        position: "absolute", top: -8, right: -22,
                        background: "#ef4444", color: "#fff",
                        fontSize: "0.55rem", fontWeight: 700, padding: "1px 5px",
                        borderRadius: 4, lineHeight: 1.3,
                      }}>HOT</span>
                    )}
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <div className="nav-actions-desktop" style={{ alignItems: "center", gap: 16 }}>
                <a href="/login" style={{
                  padding: "10px 24px", borderRadius: 24,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.3)"; }}
                ><PiPhone style={{ fontSize: "1rem" }} /> LIÊN HỆ TƯ VẤN</a>
              </div>

              {/* Search icon (mobile only) */}
              <button className="hamburger-btn" style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "#16a34a", border: "none", cursor: "pointer",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "1.1rem",
              }}><PiMagnifyingGlass /></button>
            </nav>
          </div>
        </div>

        {/* ══════ HERO SECTION — DIWE Style ══════ */}
        <section style={{
          padding: "60px 0 80px",
          background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 40%, #ecfdf5 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle background decoration */}
          <div style={{
            position: "absolute", right: 0, top: 0, width: "55%", height: "100%",
            background: "radial-gradient(circle at 70% 50%, rgba(22,163,74,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="hero-grid-responsive" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
            {/* Left: Text content */}
            <div style={{ paddingTop: 20 }}>
              {/* Subtitle dot */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#16a34a", display: "inline-block",
                }} />
                <span style={{
                  color: "#374151", fontSize: "0.85rem", fontWeight: 600,
                  letterSpacing: "1px", textTransform: "uppercase" as const,
                }}>BẠN ĐANG TÌM KIẾM</span>
              </div>

              {/* Main Heading with Typing Effect */}
              <h1 style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800,
                color: "#111827", lineHeight: 1.3, marginBottom: 20,
              }}>
                GIẢI PHÁP CHO{" "}<br />
                <span style={{
                  color: "#16a34a",
                  borderRight: "3px solid #16a34a",
                  paddingRight: 4,
                  animation: "blinkCursor 0.8s step-end infinite",
                }}>
                  {typingText}
                </span>
              </h1>

              <p style={{
                color: "#6b7280", fontSize: "0.95rem",
                maxWidth: 420, lineHeight: 1.8, marginBottom: 32,
              }}>
                Với sự thấu hiểu và tận tâm, VPS Panel AI tự hào mang đến những giải pháp toàn diện cho khách hàng
              </p>

              {/* Buttons */}
              <div className="hero-buttons-row" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <a href="#about" style={{
                  padding: "12px 28px", borderRadius: 24,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", fontSize: "0.9rem", fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(22,163,74,0.3)", transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >Về Chúng Tôi</a>
                <a href="#services" style={{
                  padding: "12px 28px", borderRadius: 24,
                  border: "2px solid #16a34a", color: "#16a34a",
                  fontSize: "0.9rem", fontWeight: 600, transition: "all 0.2s",
                  background: "transparent",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#16a34a"; }}
                >Xem Profile</a>
              </div>
            </div>

            {/* Right: Image with floating cards */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              {/* Main image */}
              <div style={{ position: "relative" }}>
                <img
                  src="/images/hero-illustration.png?v=2"
                  alt="VPS Panel AI Hero"
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    position: "relative",
                    zIndex: 2,
                  }}
                />

                {/* Floating Card 1 */}
                <img className="float-card-1" src="/images/float-card-1.png" alt="" style={{
                  position: "absolute", top: "2%", left: "-12%", zIndex: 3,
                  width: 280,
                  animation: "floatCard 3s ease-in-out infinite",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                }} />

                {/* Floating Card 2 */}
                <img className="float-card-2" src="/images/float-card-2.png" alt="" style={{
                  position: "absolute", top: "0%", right: "-18%", zIndex: 3,
                  width: 340,
                  animation: "floatCard 3s ease-in-out infinite 0.5s",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                }} />

                {/* Floating Card 3 — Chart (keep as is) */}
                <div className="float-card-3" style={{
                  position: "absolute", top: "-5%", left: "35%", zIndex: 3,
                  background: "#fff", borderRadius: 10, padding: "8px 12px",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                  animation: "floatCard 3s ease-in-out infinite 1s",
                  display: "flex", gap: 3, alignItems: "flex-end",
                }}>
                  {[24, 36, 20, 44, 30, 50, 38].map((h, i) => (
                    <div key={i} style={{
                      width: 6, height: h * 0.6, borderRadius: 3,
                      background: i === 5 ? "#16a34a" : i % 2 === 0 ? "#818cf8" : "#fbbf24",
                    }} />
                  ))}
                </div>

                {/* Floating Card 4 */}
                <img className="float-card-4" src="/images/float-card-4.png" alt="" style={{
                  position: "absolute", bottom: "2%", right: "-15%", zIndex: 3,
                  width: 300,
                  animation: "floatCard 3s ease-in-out infinite 1.5s",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                }} />

                {/* Floating Card 5 */}
                <img className="float-card-5" src="/images/float-card-5.png" alt="" style={{
                  position: "absolute", bottom: "5%", left: "-8%", zIndex: 3,
                  width: 320,
                  animation: "floatCard 3s ease-in-out infinite 2s",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                }} />
              </div>
            </div>
          </div>
        </section>
      </div>{/* END HEADER WRAPPER */}

      {/* ══════ MOBILE MENU ══════ */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mobile-menu-panel ${mobileMenuOpen ? "active" : ""}`}>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 20px 0" }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{
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
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", color: "#fff",
          }}><PiLightning /></span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>VPS Panel AI</span>
        </div>

        {/* About */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.7 }}>
            Nền tảng AI xử lý ảnh thông minh cho doanh nghiệp. Tạo ảnh sản phẩm, review, retouching tự động.
          </p>
          <a href="/login" style={{
            display: "inline-block", marginTop: 12,
            padding: "10px 28px", borderRadius: 30,
            background: "#6366f1", color: "#fff",
            fontSize: "0.85rem", fontWeight: 600,
          }}>Xem thêm</a>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: "8px 0" }}>
          {["Trang chủ", "Dịch vụ", "Công cụ AI", "Bảng giá", "Liên hệ"].map((item, i) => (
            <a key={i} href={i === 0 ? "/" : `#${["", "services", "tools", "pricing", "contact"][i]}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block", padding: "14px 24px",
                color: "#fff", fontSize: "0.95rem", fontWeight: 600,
                textTransform: "uppercase" as const, letterSpacing: "0.5px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "background 0.2s",
              }}
            >{item}</a>
          ))}
        </div>

        {/* Contact Info */}
        <div style={{ padding: "20px 24px", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiMapPin style={{ color: "#f97316" }} /> Ho Chi Minh City, Vietnam
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PiPhone style={{ color: "#f97316" }} /> 0765.168.xxx
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PiEnvelopeSimple style={{ color: "#f97316" }} /> admin@vpspanel.io.vn
          </div>
        </div>
      </div>

      {/* ══════ VIDEO MODAL ══════ */}
      {showVideo && (
        <div onClick={() => setShowVideo(false)} style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: "relative",
            width: "80%", maxWidth: 900,
            aspectRatio: "16/9",
            background: "#000",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}>
            {/* Close button */}
            <button onClick={() => setShowVideo(false)} style={{
              position: "absolute", top: -40, right: 0,
              background: "none", border: "none",
              color: "#fff", fontSize: "2rem", cursor: "pointer",
              fontWeight: 300, lineHeight: 1,
            }}><PiX /></button>
            <video
              src="/videos/intro.mp4"
              controls autoPlay
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      {/* ══════ BANNER CAROUSEL SECTION — DIWE Style ══════ */}
      <section style={{ padding: "50px 0 60px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* Carousel container */}
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
            <div style={{
              display: "flex",
              transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
              transform: `translateX(-${bannerIndex * (100 / 3)}%)`,
            }}>
              {[
                { img: "/images/banner-slide-1.png", alt: "Xây dựng ngôi nhà online" },
                { img: "/images/banner-slide-2.png", alt: "Giải pháp bán hàng hiệu quả" },
                { img: "/images/banner-slide-3.png", alt: "Portfolio dự án" },
                { img: "/images/banner-slide-1.png", alt: "Xây dựng ngôi nhà online" },
                { img: "/images/banner-slide-2.png", alt: "Giải pháp bán hàng hiệu quả" },
              ].map((slide, i) => (
                <div key={i} style={{
                  flex: "0 0 calc(100% / 3)",
                  padding: "0 8px",
                  boxSizing: "border-box" as const,
                }}>
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      borderRadius: 12,
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={() => setBannerIndex(prev => Math.max(0, prev - 1))}
              style={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%",
                background: "#16a34a", border: "none", cursor: "pointer",
                color: "#fff", fontSize: "1.3rem", fontWeight: 700,
                boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: bannerIndex === 0 ? 0.4 : 1,
                transition: "opacity 0.2s",
                zIndex: 5,
              }}
              disabled={bannerIndex === 0}
            >‹</button>

            {/* Right Arrow */}
            <button
              onClick={() => setBannerIndex(prev => Math.min(2, prev + 1))}
              style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%",
                background: "#16a34a", border: "none", cursor: "pointer",
                color: "#fff", fontSize: "1.3rem", fontWeight: 700,
                boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: bannerIndex === 2 ? 0.4 : 1,
                transition: "opacity 0.2s",
                zIndex: 5,
              }}
              disabled={bannerIndex === 2}
            >›</button>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {[0, 1, 2].map(i => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                style={{
                  width: bannerIndex === i ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: bannerIndex === i ? "#16a34a" : "#d1d5db",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>



      {/* ══════ SERVICES SECTION — Auto-Sliding Carousel ══════ */}
      <section id="services" style={{
        padding: "100px 0 80px",
        backgroundColor: "#003ca6",
        position: "relative",
      }}>
        {/* Top wave */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 100, display: "block", transform: "translateY(-99%)" }} viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="#003ca6" d="M0 300L-1 69.71C216 57 299.47 198.86 403 226C506 253 577 196 660 197C740 198 790.09 234.07 874 267C935.23 291 982 282.61 1000 277.61V300H0Z" />
          <path fill="#003ca6" opacity="0.5" d="M1 265.094L0 50.5C217 37.79 300.47 186.36 404 213.5C507 240.5 578 196.5 661 197.5C741 198.5 787.59 239.57 871.5 272.5C932.73 296.5 980.5 284.5 998.5 279.5V298.5L1 265.094Z" />
          <path fill="#003ca6" opacity="0.15" d="M0.999878 244.094L-0.00012207 27C217 14.29 300.47 173.86 404 201C507 228 578 196 661 197C741 198 787.59 243.07 871.5 276C932.73 300 980.5 284.5 998.5 279.5V299L0.999878 244.094Z" />
        </svg>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.85rem", letterSpacing: 1, fontStyle: "italic" }}>
              Giải pháp tăng trưởng trên nền tảng số dành cho bạn
            </span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", marginTop: 8 }}>
              Dịch vụ của VPS Panel AI
            </h2>
          </div>

          {/* Carousel */}
          <div style={{ position: "relative" }}>
            {/* Left Arrow */}
            <button onClick={() => setSlideIndex(prev => (prev - 1 + totalPages) % totalPages)} style={{
              position: "absolute", left: -24, top: "50%", transform: "translateY(-50%)",
              width: 48, height: 48, borderRadius: "50%",
              background: "#fff", border: "3px solid #003ca6", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.15)", zIndex: 3,
              fontSize: "1.4rem", color: "#003ca6", fontWeight: 700,
            }}>‹</button>
            {/* Right Arrow */}
            <button onClick={() => setSlideIndex(prev => (prev + 1) % totalPages)} style={{
              position: "absolute", right: -24, top: "50%", transform: "translateY(-50%)",
              width: 48, height: 48, borderRadius: "50%",
              background: "#fff", border: "3px solid #003ca6", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.15)", zIndex: 3,
              fontSize: "1.4rem", color: "#003ca6", fontWeight: 700,
            }}>›</button>

            {/* Sliding Track */}
            <div style={{ overflow: "hidden", borderRadius: 20 }}>
              <div style={{
                display: "flex", gap: 24,
                transform: `translateX(-${slideIndex * (270 + 24)}px)`,
                transition: "transform 0.6s ease-in-out",
              }}>
                {slideData.map((s, i) => (
                  <div key={i} style={{
                    flexShrink: 0, width: 270,
                    background: "#fff", borderRadius: 16,
                    padding: "24px 20px 28px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s",
                  }}>
                    {/* Image area */}
                    <div style={{
                      width: "100%", aspectRatio: "1", borderRadius: 14,
                      background: "linear-gradient(135deg, #e8eeff 0%, #dbeafe 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 18, overflow: "hidden",
                    }}>
                      <img src={s.img} alt={s.title} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                    </div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#7c2d12", lineHeight: 1.4 }}>{s.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 36 }}>
            {Array.from({ length: totalPages }).map((_, d) => (
              <div key={d} onClick={() => setSlideIndex(d)} style={{
                width: d === slideIndex ? 14 : 10, height: d === slideIndex ? 14 : 10, borderRadius: "50%",
                background: d === slideIndex ? "#fff" : "rgba(255,255,255,0.35)",
                border: d === slideIndex ? "2px solid rgba(255,255,255,0.5)" : "none",
                transition: "all 0.3s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Bottom arrow */}
        <svg style={{ position: "absolute", bottom: -17, left: 0, width: "100%", height: 17, display: "block", zIndex: 3 }} viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="#ffffff" d="M1000 100H0V80H479.686C481.808 80 483.843 80.8429 485.343 82.3432L497.879 94.8787C499.05 96.0503 500.95 96.0503 502.121 94.8787L514.657 82.3431C516.157 80.8428 518.192 80 520.314 80H1000V100Z" />
        </svg>
      </section>

      {/* ══════ TEAM SECTION — Circular Photos + Social ══════ */}
      <section style={{ padding: "80px 0", background: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Decorative dots image on left */}
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 300, zIndex: 0, opacity: 0.4,
        }}>
          <img src="/images/decorative-dots.png" alt="" style={{ width: "100%", height: "auto" }} />
        </div>



        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Đội Ngũ Chuyên Gia</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#7c2d12", marginTop: 8, lineHeight: 1.3 }}>
              Gặp gỡ đội ngũ chuyên gia<br />của chúng tôi
            </h2>
          </div>

          <div className="team-grid" style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { name: "Nguyễn Lê Hải", role: "Giám Đốc Điều Hành", img: "/ceo-photo.jpg", color: "#475569" },
              { name: "Nguyễn Lê Hải", role: "Giám Đốc Sáng Tạo", img: "/ceo-photo.jpg", color: "#8b5cf6" },
              { name: "Nguyễn Lê Hải", role: "Giám Đốc Kỹ Thuật", img: "/ceo-photo.jpg", color: "#2563eb" },
              { name: "Nguyễn Lê Hải", role: "Giám Đốc Marketing", img: "/ceo-photo.jpg", color: "#059669" },
            ].map((member, i) => (
              <div key={i} style={{ textAlign: "center", width: 265 }}>
                {/* Photo Circle */}
                <div style={{
                  width: 204, height: 204, borderRadius: "50%", margin: "0 auto 16px",
                  background: member.img ? "none" : `linear-gradient(135deg, ${["#cbd5e1,#94a3b8", "#fdba74,#8b5cf6", "#93c5fd,#3b82f6", "#a7f3d0,#10b981"][i]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.8rem", fontWeight: 700, color: "#fff",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  border: "4px solid #fff",
                  transition: "all 0.3s", overflow: "hidden",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {member.img && (
                    <img src={member.img} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#7c2d12", marginBottom: 4 }}>{member.name}</h4>
                <p style={{ fontSize: "0.82rem", color: "#6366f1", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>{member.role}</p>
                {/* Social icons */}
                <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                  {[
                    { icon: <PiFacebookLogo />, bg: "#1877f2" },
                    { icon: <PiInstagramLogo />, bg: "#e4405f" },
                    { icon: <PiChatCircle />, bg: "#25d366" },
                    { icon: <PiYoutubeLogo />, bg: "#ff0000" },
                  ].map((s, si) => (
                    <div key={si} style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: s.bg, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                      cursor: "pointer", transition: "transform 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >{s.icon}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="#" style={{
              display: "inline-block", padding: "12px 32px", borderRadius: 8,
              background: "linear-gradient(135deg, #7c2d12, #2d1b69)", color: "#fff",
              fontWeight: 600, fontSize: "0.95rem",
              boxShadow: "0 4px 15px rgba(249,115,22,0.12)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >Xem giới thiệu đội ngũ</a>
          </div>
        </div>

        {/* Decorative half-circle on right */}
        <div style={{
          position: "absolute", right: -80, top: "30%",
          width: 200, height: 300, borderRadius: "200px 0 0 200px",
          background: "#f8fafc", zIndex: 0,
        }} />
      </section>


      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #7c2d12 0%, #2d1b69 100%)",
        position: "relative",
      }}>
        <svg style={{ position: "absolute", top: -2, left: 0, width: "100%" }} viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,60 C480,0 960,60 1440,10 L1440,0 L0,0 Z" fill="#ffffff" />
        </svg>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ color: "#fdba74", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Khách hàng nói gì</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", marginTop: 8 }}>
              Khách hàng đánh giá<br />về dịch vụ của chúng tôi
            </h2>
          </div>
          <div className="testimonials-grid-responsive" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
                borderRadius: 16, padding: "32px", border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.92rem" }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ AI TOOLS GRID ══════ */}
      <section id="tools" style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 50 }}>
            <div>
              <span style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Dự Án Tiêu Biểu</span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#7c2d12", marginTop: 8, lineHeight: 1.3 }}>
                Kết quả ấn tượng từ<br />các dự án thực tế
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", border: "2px solid #2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#2563eb", fontSize: "1.1rem", fontWeight: 700,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2563eb"; }}
              onClick={() => {
                const el = document.getElementById("case-carousel");
                if (el) el.scrollBy({ left: -300, behavior: "smooth" });
              }}
              >‹</div>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff", fontSize: "1.1rem", fontWeight: 700,
                transition: "all 0.2s",
              }}
              onClick={() => {
                const el = document.getElementById("case-carousel");
                if (el) el.scrollBy({ left: 300, behavior: "smooth" });
              }}
              >›</div>
            </div>
          </div>

          <div id="case-carousel" className="case-carousel" style={{
            display: "flex", gap: 20, overflowX: "auto",
            paddingBottom: 10,
          }}>
            {[
              { category: "Công cụ AI", title: "Tạo Ảnh AI Tự Động", bg: "#e8f4fd", img: "/images/case-ai-image.png" },
              { category: "AI Marketing", title: "Viết Nội Dung SEO", bg: "#f3e8f9", img: "/images/case-seo-content.png" },
              { category: "AI Doanh Nghiệp", title: "Trợ Lý Chatbot AI", bg: "#e8f0fd", img: "/images/case-chatbot.png" },
              { category: "AI Sáng Tạo", title: "Tạo Video AI", bg: "#0a0e2a", img: "/images/case-video-ai.png" },
              { category: "AI Phân Tích", title: "Phân Tích Dữ Liệu AI", bg: "#e8f4fd", img: "/images/case-data-insights.png" },
            ].map((item, i) => (
              <div key={i} style={{
                cursor: "pointer",
                transition: "all 0.3s", position: "relative",
                borderRadius: 16, background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                minWidth: 270, flex: "0 0 calc(25% - 15px)",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{
                  width: "100%", height: 280, overflow: "hidden",
                  background: item.bg, borderRadius: "16px 16px 0 0",
                }}>
                  <img src={item.img} alt={item.title} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <span style={{ color: "#f97316", fontSize: "0.75rem", fontWeight: 600 }}>{item.category}</span>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#7c2d12", marginTop: 6, lineHeight: 1.3 }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PRICING ══════ */}
      <section id="pricing" style={{ padding: "80px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Bảng giá</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#7c2d12", marginTop: 8 }}>
              Chọn gói phù hợp
            </h2>
          </div>
          <div className="pricing-grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { name: "Khởi Đầu", price: "99K", credits: "50", features: ["20 ảnh/ngày", "512x512", "Tạo ảnh từ văn bản", "Nâng cấp độ nét"] },
              { name: "Chuyên Nghiệp", price: "299K", credits: "200", features: ["100 ảnh/ngày", "1024x1024", "Tất cả công cụ", "Chỉnh sửa + Làm đẹp", "Hỗ trợ ưu tiên"], popular: true },
              { name: "Doanh Nghiệp", price: "799K", credits: "600", features: ["Không giới hạn", "2048x2048", "Tất cả AI", "Xử lý ưu tiên", "Truy cập API"] },
              { name: "Cao Cấp", price: "2.499K", credits: "2,500", features: ["Không giới hạn", "4K siêu nét", "Server riêng", "Tạo Landing Page", "Video AI", "Hỗ trợ 24/7"] },
            ].map((plan, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "36px 24px",
                textAlign: "center", position: "relative",
                border: plan.popular ? "2px solid #6366f1" : "1px solid #f1f5f9",
                boxShadow: plan.popular ? "0 12px 40px rgba(99,102,241,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
                transform: plan.popular ? "scale(1.02)" : "none",
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff",
                    padding: "4px 18px", borderRadius: "0 0 8px 8px",
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: 0.5,
                  }}>PHỔ BIẾN</div>
                )}
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#7c2d12", marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#7c2d12" }}>
                  {plan.price} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>VNĐ</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: 20 }}>/ tháng</div>
                <div style={{
                  display: "inline-block", padding: "6px 18px", borderRadius: 20,
                  background: "rgba(249,115,22,0.08)", color: "#6366f1",
                  fontSize: "0.85rem", fontWeight: 600, marginBottom: 24,
                }}><PiCoin style={{ marginRight: 4 }} /> {plan.credits} Điểm</div>
                <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 24 }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{
                      padding: "8px 0", fontSize: "0.88rem", color: "#475569",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <PiCheck style={{ color: "#10b981", fontWeight: 700, flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <a href="/login" style={{
                  display: "block", padding: "12px", borderRadius: 8,
                  background: plan.popular ? "linear-gradient(135deg, #f97316, #ea580c)" : "#f8fafc",
                  color: plan.popular ? "#fff" : "#7c2d12", fontWeight: 600, fontSize: "0.92rem",
                  border: plan.popular ? "none" : "1px solid #e2e8f0",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = "#7c2d12"; e.currentTarget.style.color = "#fff"; } }}
                  onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#7c2d12"; } }}
                >{plan.name === "Cao Cấp" ? "Liên hệ" : "Chọn gói này"}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA SECTION ══════ */}
      <section id="contact" style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #7c2d12 0%, #2d1b69 100%)",
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
            Tối Ưu Trang Web<br />& Tăng Chuyển Đổi Ngay
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>
            Bắt đầu sử dụng VPS Panel AI ngay hôm nay. Đăng ký miễn phí và nhận 10 điểm để trải nghiệm.
          </p>
          <div className="cta-buttons-row" style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <a href="/login" style={{
              padding: "14px 36px", borderRadius: 10,
              background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff",
              fontWeight: 700, fontSize: "1rem",
              boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
            }}><PiRocketLaunch style={{ marginRight: 6 }} /> Bắt đầu miễn phí</a>
            <a href="mailto:admin@vpspanel.io.vn" style={{
              padding: "14px 36px", borderRadius: 10,
              border: "2px solid rgba(255,255,255,0.3)", color: "#fff",
              fontWeight: 600, fontSize: "1rem",
            }}><PiEnvelopeSimple style={{ marginRight: 6 }} /> Liên hệ tư vấn</a>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ background: "#0f172a", color: "rgba(255,255,255,0.7)", padding: "60px 0 30px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="footer-grid-responsive" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                }}><PiLightning style={{ color: "#fff" }} /></span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>VPS Panel AI</span>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 280 }}>
                Nền tảng AI xử lý ảnh và quản lý server thông minh. Được phát triển tại Việt Nam 🇻🇳
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {[<PiFacebookLogo />, <PiTwitterLogo />, <PiLinkedinLogo />].map((s, i) => (
                  <span key={i} style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "rgba(255,255,255,0.08)", display: "flex",
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
            borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24,
            textAlign: "center", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)",
          }}>
            © 2026 VPS Panel AI. Bản quyền thuộc về VPS Panel AI. Được tạo với <PiHeart style={{ color: "#ef4444", margin: "0 4px", verticalAlign: "middle" }} /> tại Việt Nam 🇻🇳
          </div>
        </div>
      </footer>
    </div>
  );
}
