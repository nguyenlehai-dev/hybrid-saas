"use client";

import { useState } from "react";

const API_URL = "/api";

export default function RegisterPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Đã xảy ra lỗi");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
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
            <span style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--accent-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem"
            }}>⚡</span>
            Nulith
          </a>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "40px 32px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", marginBottom: "8px" }}>
            Tạo tài khoản
          </h1>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "32px" }}>
            Đăng ký để nhận 10 credits miễn phí 🎁
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
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <label>Username *</label>
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
            <div className="form-group">
              <label>Email *</label>
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
              <label>Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Ít nhất 6 ký tự"
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
              {loading ? "⏳ Đang tạo..." : "🚀 Đăng ký miễn phí"}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}>
            Đã có tài khoản?{" "}
            <a href="/login" style={{ color: "var(--text-accent)", fontWeight: 600 }}>
              Đăng nhập
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Bằng việc đăng ký, bạn đồng ý với Điều khoản và Chính sách bảo mật
        </p>
      </div>
    </div>
  );
}
