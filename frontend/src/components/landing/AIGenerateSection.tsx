"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

export default function AIGenerateSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ task_id: string; output_image_url?: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "User");
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data.credits_balance) setCredits(data.credits_balance); })
        .catch(() => {});
    }
  }, []);

  if (!isLoggedIn) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Vui lòng nhập prompt mô tả ảnh"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ task_type: "text_to_image", prompt, negative_prompt: "", width: 512, height: 512, steps: 30, cfg_scale: 7, seed: -1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.error || data.detail || "Lỗi");
      setResult({ task_id: data.task_id, output_image_url: data.output_image_url });
      const meRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const meData = await meRes.json();
      if (meData.credits_balance) setCredits(meData.credits_balance);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section id="ai-generate" style={{
      padding: "80px 0", background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)", position: "relative",
    }}>
      <svg style={{ position: "absolute", top: -2, left: 0, width: "100%" }} viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,0 C480,60 960,0 1440,40 L1440,0 L0,0 Z" fill="#f8fafc" />
      </svg>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(22,163,74,0.1)", marginBottom: 16 }}>
            <span style={{ fontSize: "0.8rem" }}>✨</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#16a34a" }}>Xin chào, {username}!</span>
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>•</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#16a34a" }}>{credits.toFixed(0)} credits</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 10 }}>
            🎨 Tạo ảnh AI nhanh
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>
            Nhập prompt để tạo ảnh chuyên nghiệp — hoặc vào trang đầy đủ để tùy chỉnh chi tiết
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Mô tả ảnh bạn muốn tạo... Ví dụ: Professional product photo of a modern smartwatch, studio lighting, 4K"
            style={{
              width: "100%", minHeight: 100, padding: "14px 18px", borderRadius: 14,
              border: "2px solid #e5e7eb", fontSize: "0.9rem", resize: "vertical",
              outline: "none", transition: "border-color 0.2s", fontFamily: "inherit", lineHeight: 1.6, marginBottom: 16,
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
            onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          />

          {error && (
            <div style={{ padding: "10px 16px", borderRadius: 10, marginBottom: 12, background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "0.85rem" }}>⚠️ {error}</div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
            <button onClick={handleGenerate} disabled={loading} style={{
              padding: "14px 32px", borderRadius: 14, border: "none", cursor: loading ? "wait" : "pointer",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: "0.9rem", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)", transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? "⏳ Đang xử lý..." : "🎨 Tạo ảnh — 1 credit"}
            </button>
            <a href="/generate" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
              Mở Studio đầy đủ →
            </a>
          </div>

          {result && (
            <div style={{ marginTop: 24, padding: "20px", background: "#f0fdf4", borderRadius: 14 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a", marginBottom: 8 }}>✅ Task đã tạo!</div>
              {result.output_image_url ? (
                <div>
                  <img src={result.output_image_url} alt="AI Generated" style={{ width: "100%", maxWidth: 512, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <a href={result.output_image_url} download style={{ padding: "8px 20px", borderRadius: 8, background: "#16a34a", color: "#fff", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>📥 Tải về</a>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>⏳ Đang xử lý... Kết quả sẽ có trong <a href="/generate" style={{ color: "#16a34a", fontWeight: 600 }}>Studio</a></div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
