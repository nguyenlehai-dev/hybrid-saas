"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

const QUICK_TOOLS = [
  { value: "text_to_image", label: "✨ Text to Image", cost: 1.0, desc: "Tạo ảnh từ mô tả" },
  { value: "review_product", label: "📸 Review Product", cost: 2.0, desc: "Ảnh review sản phẩm" },
  { value: "skin_enhancer", label: "💄 Skin Enhancer", cost: 2.0, desc: "Làm đẹp da" },
  { value: "upscale", label: "🔍 Upscale", cost: 0.5, desc: "Nâng cấp độ phân giải" },
  { value: "inpaint", label: "🖌️ Inpaint", cost: 1.5, desc: "Chỉnh sửa vùng chọn" },
  { value: "video_generate", label: "🎬 Video", cost: 5.0, desc: "Tạo video từ ảnh" },
];

export default function AIGenerateSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState("text_to_image");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ task_id: string; output_image_url?: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "User");
      // Fetch credits
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data.credits_balance) setCredits(data.credits_balance); })
        .catch(() => {});
    }
  }, []);

  if (!isLoggedIn) return null;

  const currentTool = QUICK_TOOLS.find(t => t.value === selectedTool)!;

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Vui lòng nhập prompt mô tả ảnh"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ task_type: selectedTool, prompt, negative_prompt: "", width: 512, height: 512, steps: 30, cfg_scale: 7, seed: -1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.error || data.detail || "Lỗi");
      setResult({ task_id: data.task_id, output_image_url: data.output_image_url });
      // Refresh credits
      const meRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const meData = await meRes.json();
      if (meData.credits_balance) setCredits(meData.credits_balance);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section id="ai-generate" style={{
      padding: "80px 0",
      background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
      position: "relative",
    }}>
      {/* Top wave */}
      <svg style={{ position: "absolute", top: -2, left: 0, width: "100%" }} viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,0 C480,60 960,0 1440,40 L1440,0 L0,0 Z" fill="#f8fafc" />
      </svg>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(22,163,74,0.1)", marginBottom: 16 }}>
            <span style={{ fontSize: "0.8rem" }}>✨</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#16a34a" }}>Xin chào, {username}!</span>
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>•</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#16a34a" }}>{credits.toFixed(0)} credits</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 10 }}>
            🎨 Tạo ảnh AI ngay trên trang chủ
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>
            Nhập prompt và chọn công cụ AI để tạo ảnh chuyên nghiệp trong vài giây
          </p>
        </div>

        {/* Main Generate Card */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)",
        }}>
          {/* Tool Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
            {QUICK_TOOLS.map(tool => (
              <button key={tool.value} onClick={() => setSelectedTool(tool.value)} style={{
                padding: "12px 10px", borderRadius: 12, border: "none", cursor: "pointer",
                background: selectedTool === tool.value ? "linear-gradient(135deg, #16a34a, #15803d)" : "#f9fafb",
                color: selectedTool === tool.value ? "#fff" : "#374151",
                transition: "all 0.2s", textAlign: "center",
                boxShadow: selectedTool === tool.value ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{tool.label}</div>
                <div style={{ fontSize: "0.7rem", marginTop: 4, opacity: 0.8 }}>{tool.cost} cr</div>
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" as const }}>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Mô tả ảnh bạn muốn tạo... Ví dụ: Professional product photo of a modern smartwatch on white marble, studio lighting, 4K"
              style={{
                flex: 1, minWidth: 300, minHeight: 100, padding: "14px 18px",
                borderRadius: 14, border: "2px solid #e5e7eb", fontSize: "0.9rem",
                resize: "vertical", outline: "none", transition: "border-color 0.2s",
                fontFamily: "inherit", lineHeight: 1.6,
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
              onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 16px", borderRadius: 10, marginBottom: 12,
              background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "0.85rem",
            }}>⚠️ {error}</div>
          )}

          {/* Generate Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
            <button onClick={handleGenerate} disabled={loading} style={{
              padding: "14px 32px", borderRadius: 14, border: "none", cursor: loading ? "wait" : "pointer",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: "0.9rem", fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(22,163,74,0.3)"; }}
            >
              {loading ? "⏳ Đang xử lý..." : `🎨 Tạo ảnh — ${currentTool.cost} credits`}
            </button>
            <a href="/generate" style={{
              fontSize: "0.85rem", fontWeight: 600, color: "#16a34a",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              Mở đầy đủ công cụ →
            </a>
          </div>

          {/* Result */}
          {result && (
            <div style={{ marginTop: 24, padding: "20px", background: "#f0fdf4", borderRadius: 14 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a", marginBottom: 8 }}>
                ✅ Task đã được tạo thành công!
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 4 }}>Task ID: {result.task_id}</div>
              {result.output_image_url ? (
                <div style={{ marginTop: 12 }}>
                  <img src={result.output_image_url} alt="AI Generated" style={{ width: "100%", maxWidth: 512, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <a href={result.output_image_url} download className="btn" style={{
                      padding: "8px 20px", borderRadius: 8, background: "#16a34a", color: "#fff",
                      fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
                    }}>📥 Tải về</a>
                    <a href="/dashboard/gallery" style={{
                      padding: "8px 20px", borderRadius: 8, border: "1px solid #e5e7eb",
                      color: "#374151", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
                    }}>🖼️ Thư viện</a>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "0.85rem" }}>
                  ⏳ Đang xử lý... Thường mất 10-30 giây. Kết quả sẽ có trong <a href="/dashboard/gallery" style={{ color: "#16a34a", fontWeight: 600 }}>Thư viện ảnh</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
