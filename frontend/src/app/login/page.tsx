"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vpspanel.io.vn";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const oauthError = params.get("error");
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        id: params.get("user_id"),
        email: params.get("email"),
        username: params.get("username"),
        role: params.get("role") || "user",
      }));
      window.location.href = "/dashboard";
    }
    if (oauthError) {
      setError(oauthError === "account_deactivated" ? "Tài khoản đã bị khóa" : "Lỗi đăng nhập Google. Vui lòng thử lại.");
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Đã xảy ra lỗi");
      }

      // Save token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "440px", padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "1.5rem", fontWeight: 700 }}>
            <span className="logo-icon" style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--accent-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem"
            }}>⚡</span>
            VPS Panel AI
          </a>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "40px 32px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", marginBottom: "8px" }}>
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </h1>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "32px" }}>
            {isLogin ? "Nhập thông tin để tiếp tục" : "Đăng ký để nhận 10 credits miễn phí"}
          </p>

          {error && (
            <div style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-sm)",
              color: "var(--error)",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Họ tên</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="username"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "8px" }}
              disabled={loading}
            >
              {loading ? "⏳ Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký miễn phí")}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>hoặc</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          </div>

          {/* Google Login */}
          <a
            href={`${API_URL}/auth/google`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              width: "100%", padding: "12px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)", background: "var(--bg-card)",
              color: "#333", fontSize: "0.9rem", fontWeight: 600,
              textDecoration: "none", cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {isLogin ? "Đăng nhập với Google" : "Đăng ký với Google"}
          </a>

          <div style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}>
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{
                background: "none",
                color: "var(--text-accent)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </div>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}>
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật
        </p>
      </div>
    </div>
  );
}
