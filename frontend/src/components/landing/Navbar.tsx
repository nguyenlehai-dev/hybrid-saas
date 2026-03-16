"use client";
import { useState, useRef, useEffect } from "react";
import { PiList, PiMagnifyingGlass, PiPhone, PiCaretDown, PiGlobe, PiPalette, PiRocketLaunch, PiSparkle, PiPencilLine, PiChartLineUp, PiUser, PiSignOut, PiGear, PiUserCircle } from "react-icons/pi";
import { useLang } from "@/lib/i18n";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { lang, t } = useLang();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "User");
      setUserRole(role || "user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUsername("");
    window.location.href = "/";
  };

  const supportHref = "/support";

  const serviceItems = [
    { icon: <PiRocketLaunch />, title: t("svc.landing.title"), desc: t("svc.landing.desc"), href: "/#services", color: "#f97316", bg: "#fff7ed" },
    { icon: <PiSparkle />, title: t("svc.prompt.title"), desc: t("svc.prompt.desc"), href: "/dashboard/generate", color: "#a855f7", bg: "#faf5ff" },
    { icon: <PiPencilLine />, title: t("svc.content.title"), desc: t("svc.content.desc"), href: "/#services", color: "#06b6d4", bg: "#ecfeff" },
    { icon: <PiGlobe />, title: t("svc.website.title"), desc: t("svc.website.desc"), href: "/#services", color: "#16a34a", bg: "#f0fdf4" },
    { icon: <PiPalette />, title: t("svc.ai.title"), desc: t("svc.ai.desc"), href: "/dashboard/generate", color: "#ec4899", bg: "#fdf2f8" },
    { icon: <PiChartLineUp />, title: t("svc.seo.title"), desc: t("svc.seo.desc"), href: "/#services", color: "#16a34a", bg: "#f0fdf4" },
  ];

  const navItems = [
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.services"), href: "/#services", dropdown: true, hot: true },
    { label: t("nav.projects"), href: "/projects", hot: true },
    { label: t("nav.support"), href: supportHref },
    { label: t("nav.blog"), href: "/blog" },
  ];

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setShowDropdown(false), 200);
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimeout.current) clearTimeout(userMenuTimeout.current);
    setShowUserMenu(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setShowUserMenu(false), 200);
  };

  return (
    <div style={{ position: "relative", zIndex: 100, background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Hamburger (mobile only) */}
          <button className="hamburger-btn" onClick={onOpenMobileMenu} style={{
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
              Nulith
            </span>
          </a>

          {/* Nav Links */}
          <div className="nav-links-desktop" style={{ alignItems: "center", gap: 32 }}>
            {navItems.map((item, i) => (
              <div
                key={i}
                style={{ position: "relative" }}
                onMouseEnter={item.dropdown ? handleMouseEnter : undefined}
                onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
              >
                <a href={item.href}
                  style={{
                    color: (item.dropdown && showDropdown) ? "#16a34a" : "#374151",
                    fontSize: "0.82rem", fontWeight: 600,
                    transition: "color 0.2s", position: "relative",
                    display: "flex", alignItems: "center", gap: 4,
                    letterSpacing: "0.3px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                  onMouseLeave={e => {
                    if (!(item.dropdown && showDropdown)) {
                      e.currentTarget.style.color = "#374151";
                    }
                  }}
                >
                  {item.label}
                  {item.dropdown && <PiCaretDown style={{
                    fontSize: "0.7rem",
                    transition: "transform 0.2s",
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
                  }} />}
                  {item.hot && (
                    <span style={{
                      position: "absolute", top: -8, right: -22,
                      background: "#ef4444", color: "#fff",
                      fontSize: "0.55rem", fontWeight: 700, padding: "1px 5px",
                      borderRadius: 4, lineHeight: 1.3,
                    }}>HOT</span>
                  )}
                </a>

                {/* ── MEGA DROPDOWN ── */}
                {item.dropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingTop: 16,
                    opacity: showDropdown ? 1 : 0,
                    visibility: showDropdown ? "visible" : "hidden",
                    transition: "opacity 0.25s ease, visibility 0.25s ease",
                    pointerEvents: showDropdown ? "auto" : "none",
                  }}>
                    {/* Arrow */}
                    <div style={{
                      position: "absolute", top: 8, left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: 12, height: 12, background: "#fff",
                      boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)",
                      zIndex: 1,
                    }} />

                    <div style={{
                      width: 680,
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)",
                      padding: "24px 28px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}>
                      {serviceItems.map((service, si) => (
                        <a key={si} href={service.href} style={{
                          display: "flex", alignItems: "flex-start", gap: 14,
                          padding: "14px 16px",
                          borderRadius: 12,
                          transition: "background 0.2s",
                          textDecoration: "none",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <div style={{
                            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                            background: service.bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.3rem", color: service.color,
                          }}>
                            {service.icon}
                          </div>
                          <div>
                            <div style={{
                              fontSize: "0.85rem", fontWeight: 700, color: "#111827",
                              marginBottom: 4, lineHeight: 1.3,
                            }}>{service.title}</div>
                            <div style={{
                              fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.5,
                            }}>{service.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Auth Buttons */}
          <div className="nav-actions-desktop" style={{ alignItems: "center", gap: 12 }}>
            {isLoggedIn ? (
              /* Logged In: User Menu */
              <div
                style={{ position: "relative" }}
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 24,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", fontSize: "0.82rem", fontWeight: 600,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.3)"; }}
                >
                  <PiUserCircle style={{ fontSize: "1.2rem" }} />
                  {username}
                  <PiCaretDown style={{ fontSize: "0.65rem", transition: "transform 0.2s", transform: showUserMenu ? "rotate(180deg)" : "rotate(0)" }} />
                </button>

                {/* User Dropdown */}
                <div style={{
                  position: "absolute", top: "100%", right: 0,
                  paddingTop: 10,
                  opacity: showUserMenu ? 1 : 0,
                  visibility: showUserMenu ? "visible" : "hidden",
                  transition: "opacity 0.2s, visibility 0.2s",
                  pointerEvents: showUserMenu ? "auto" : "none",
                }}>
                  <div style={{
                    background: "#fff", borderRadius: 12, width: 220,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)",
                    padding: "8px 0", overflow: "hidden",
                  }}>
                    {/* User Info */}
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{username}</div>
                      <div style={{ fontSize: "0.72rem", color: userRole === "admin" ? "#f59e0b" : "#9ca3af", marginTop: 2 }}>{userRole === "admin" ? "Quản trị viên" : "Thành viên"}</div>
                    </div>
                    {[
                      { icon: <PiUser />, label: "Dashboard", href: "/dashboard" },
                      { icon: <PiSparkle />, label: "Tạo ảnh AI", href: "/dashboard/generate" },
                      { icon: <PiGear />, label: "Quản lý tài khoản", href: "/dashboard" },
                      ...(userRole === "admin" ? [{ icon: <PiGear />, label: "👑 Quản trị hệ thống", href: "/dashboard/admin" }] : []),
                    ].map((menuItem, mi) => (
                      <a key={mi} href={menuItem.href} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 16px", fontSize: "0.82rem", fontWeight: 500,
                        color: menuItem.href === "/dashboard/admin" ? "#f59e0b" : "#374151",
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: "1rem", color: menuItem.href === "/dashboard/admin" ? "#f59e0b" : "#16a34a" }}>{menuItem.icon}</span>
                        {menuItem.label}
                      </a>
                    ))}
                    <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />
                    <button onClick={handleLogout} style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "10px 16px", fontSize: "0.82rem", fontWeight: 500,
                      color: "#ef4444", border: "none", background: "transparent",
                      cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <PiSignOut style={{ fontSize: "1rem" }} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Not Logged In: Login + Register */
              <>
                <a href="/login" style={{
                  padding: "8px 20px", borderRadius: 24,
                  fontSize: "0.82rem", fontWeight: 600,
                  color: "#374151", transition: "color 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#16a34a"}
                  onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                >
                  <PiUser style={{ fontSize: "1rem" }} />
                  Đăng nhập
                </a>
                <a href="/register" style={{
                  padding: "10px 24px", borderRadius: 24,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", fontSize: "0.82rem", fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,163,74,0.3)"; }}
                ><PiRocketLaunch style={{ fontSize: "1rem" }} /> Đăng ký</a>
              </>
            )}
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
  );
}
