"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  credits_balance: number;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: "📊", exact: true },
  { href: "/dashboard/generate", label: "Tạo ảnh AI", icon: "🎨" },
  { href: "/dashboard/gallery", label: "Thư viện ảnh", icon: "🖼️" },
  { href: "/dashboard/credits", label: "Credits", icon: "💰" },
];

const ADMIN_NAV = { href: "/dashboard/admin", label: "Quản trị", icon: "👑" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(stored));

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const updated = {
          ...JSON.parse(stored),
          role: data.role,
          credits_balance: data.credits_balance,
          email: data.email,
          username: data.username,
        };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      {/* Sidebar — Dark */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              }}
            >
              ⚡
            </span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Nulith</span>
          </a>
        </div>

        <nav>
          <ul className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={isActive(item.href, item.exact) ? "active" : ""}
                >
                  <span style={{ fontSize: "1rem", width: 22, textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
            {user?.role === "admin" && (
              <li>
                <a
                  href={ADMIN_NAV.href}
                  className={isActive(ADMIN_NAV.href) ? "active" : ""}
                >
                  <span style={{ fontSize: "1rem", width: 22, textAlign: "center" }}>{ADMIN_NAV.icon}</span>
                  {ADMIN_NAV.label}
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px 16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* User Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "User"}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.45)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.5)",
              padding: "9px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
