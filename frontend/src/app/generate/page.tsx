"use client";
import { useState, useEffect } from "react";
import { PiCaretRight, PiSparkle } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

const TASK_TYPES = [
  { value: "text_to_image", label: "✨ Text to Image", cost: 1.0, desc: "Tạo ảnh từ mô tả văn bản" },
  { value: "image_to_image", label: "🔄 Image to Image", cost: 1.5, desc: "Chuyển đổi phong cách ảnh" },
  { value: "review_product", label: "📸 Review Product", cost: 2.0, desc: "Ảnh review sản phẩm chuyên nghiệp" },
  { value: "multishots", label: "🎭 Multishots", cost: 3.0, desc: "Tạo nhiều góc chụp sản phẩm" },
  { value: "inpaint", label: "🖌️ Inpaint", cost: 1.5, desc: "Chỉnh sửa vùng chọn trên ảnh" },
  { value: "skin_enhancer", label: "💄 Skin Enhancer", cost: 2.0, desc: "Làm đẹp da và retouching" },
  { value: "upscale", label: "🔍 Upscale", cost: 0.5, desc: "Nâng cấp độ phân giải" },
  { value: "crop", label: "✂️ Smart Crop", cost: 0.25, desc: "Cắt ảnh thông minh" },
  { value: "video_generate", label: "🎬 Video Generate", cost: 5.0, desc: "Tạo video từ ảnh" },
];

interface GenerationResult {
  task_id: string;
  status: string;
  output_image_url?: string;
}

export default function GeneratePublicPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(0);
  const [selectedType, setSelectedType] = useState("text_to_image");
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setIsLoggedIn(true);
    setUsername(user || "User");

    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.credits_balance !== undefined) setCredits(data.credits_balance); })
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  const currentTool = TASK_TYPES.find(t => t.value === selectedType)!;

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Vui lòng nhập prompt mô tả ảnh"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          task_type: selectedType, prompt, negative_prompt: negPrompt,
          width, height, steps, cfg_scale: cfgScale, seed: -1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.error || data.detail || "Đã xảy ra lỗi");
      setResult({ task_id: data.task_id, status: data.status, output_image_url: data.output_image_url });

      // Refresh credits
      const meRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const meData = await meRes.json();
      if (meData.credits_balance !== undefined) setCredits(meData.credits_balance);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#fafbfc", position: "relative", display: "flex", flexDirection: "column" as const }}>
        <TopBar />
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ HERO BREADCRUMB ══════ */}
      <section style={{
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #16a34a 100%)",
        padding: "60px 0 70px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", top: -100, right: -50 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", bottom: -80, left: "20%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.85rem" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >Trang chủ</a>
            <PiCaretRight style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }} />
            <span style={{ color: "#fff", fontWeight: 600 }}>Tạo ảnh AI</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
            🎨 Thiết kế hình ảnh bằng AI
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7 }}>
            Chọn công cụ và nhập prompt để tạo ảnh chuyên nghiệp chỉ trong vài giây
          </p>

          {/* Credits Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 20, padding: "8px 20px", borderRadius: 24, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
            <PiSparkle style={{ color: "#fbbf24" }} />
            <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>
              {username} • <span style={{ color: "#fbbf24" }}>{credits.toFixed(0)} credits</span>
            </span>
          </div>
        </div>
      </section>

      {/* ══════ MAIN CONTENT ══════ */}
      <section style={{ padding: "50px 0 80px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div className="generate-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }}>

            {/* Left: Form */}
            <div>
              {/* Tool Selection */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#111827" }}>Chọn công cụ AI</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
                  {TASK_TYPES.map(tool => (
                    <button key={tool.value} onClick={() => setSelectedType(tool.value)} style={{
                      padding: "14px 12px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left",
                      background: selectedType === tool.value ? "linear-gradient(135deg, #16a34a, #15803d)" : "#f9fafb",
                      color: selectedType === tool.value ? "#fff" : "#374151",
                      boxShadow: selectedType === tool.value ? "0 4px 12px rgba(22,163,74,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => { if (selectedType !== tool.value) e.currentTarget.style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { if (selectedType !== tool.value) e.currentTarget.style.background = "#f9fafb"; }}
                    >
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{tool.label}</div>
                      <div style={{ fontSize: "0.72rem", marginTop: 4, opacity: 0.7 }}>{tool.desc}</div>
                      <div style={{ fontSize: "0.7rem", marginTop: 6, fontWeight: 700, opacity: 0.8 }}>{tool.cost} credits</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#111827" }}>Mô tả ảnh</h3>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Prompt</label>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Mô tả ảnh bạn muốn tạo... Ví dụ: Professional product photo of a modern smartwatch on white marble, studio lighting, 4K quality"
                    style={{
                      width: "100%", minHeight: 120, padding: "14px 16px", borderRadius: 12,
                      border: "2px solid #e5e7eb", fontSize: "0.9rem", resize: "vertical",
                      outline: "none", transition: "border-color 0.2s", fontFamily: "inherit", lineHeight: 1.6,
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Negative Prompt (tùy chọn)</label>
                  <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="Những gì KHÔNG muốn trong ảnh... Ví dụ: blurry, low quality, watermark"
                    style={{
                      width: "100%", minHeight: 80, padding: "14px 16px", borderRadius: 12,
                      border: "2px solid #e5e7eb", fontSize: "0.9rem", resize: "vertical",
                      outline: "none", transition: "border-color 0.2s", fontFamily: "inherit", lineHeight: 1.6,
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#111827" }}>Cài đặt nâng cao</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Width (px)</label>
                    <select value={width} onChange={e => setWidth(Number(e.target.value))} style={{
                      width: "100%", padding: "10px 12px", borderRadius: 10, border: "2px solid #e5e7eb", fontSize: "0.85rem", outline: "none",
                    }}>
                      {[512, 768, 1024, 2048].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Height (px)</label>
                    <select value={height} onChange={e => setHeight(Number(e.target.value))} style={{
                      width: "100%", padding: "10px 12px", borderRadius: 10, border: "2px solid #e5e7eb", fontSize: "0.85rem", outline: "none",
                    }}>
                      {[512, 768, 1024, 2048].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Steps: {steps}</label>
                    <input type="range" min={10} max={60} value={steps} onChange={e => setSteps(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#16a34a" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>CFG Scale: {cfgScale}</label>
                    <input type="range" min={1} max={20} step={0.5} value={cfgScale} onChange={e => setCfgScale(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#16a34a" }} />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding: "12px 18px", borderRadius: 12, marginBottom: 16, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "0.85rem" }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Generate Button */}
              <button onClick={handleGenerate} disabled={loading} style={{
                width: "100%", padding: "16px 32px", borderRadius: 14, border: "none", cursor: loading ? "wait" : "pointer",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#fff", fontSize: "1rem", fontWeight: 700,
                boxShadow: loading ? "none" : "0 4px 15px rgba(22,163,74,0.3)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(22,163,74,0.4)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 15px rgba(22,163,74,0.3)"; }}
              >
                {loading ? "⏳ Đang gửi yêu cầu..." : `🎨 Tạo ảnh — ${currentTool.cost} credits`}
              </button>
            </div>

            {/* Right: Preview / Result */}
            <div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", position: "sticky", top: 100 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#111827" }}>Kết quả</h3>

                {result ? (
                  <div>
                    <div style={{ padding: "14px", background: "#f0fdf4", borderRadius: 12, marginBottom: 16 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a" }}>✅ Task đã được tạo</div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 4 }}>ID: {result.task_id}</div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        Status: <span style={{ fontWeight: 600, color: result.status === "completed" ? "#16a34a" : "#f59e0b" }}>{result.status}</span>
                      </div>
                    </div>

                    {result.output_image_url ? (
                      <>
                        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                          <img src={result.output_image_url} alt="Generated" style={{ width: "100%", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <a href={result.output_image_url} download style={{
                            flex: 1, padding: "10px", borderRadius: 10, textAlign: "center",
                            background: "#16a34a", color: "#fff", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
                          }}>📥 Tải về</a>
                          <a href={result.output_image_url} target="_blank" rel="noopener noreferrer" style={{
                            flex: 1, padding: "10px", borderRadius: 10, textAlign: "center",
                            border: "1px solid #e5e7eb", color: "#374151", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none",
                          }}>🔍 Xem full</a>
                        </div>
                      </>
                    ) : (
                      <div style={{
                        aspectRatio: "1", background: "#f9fafb", borderRadius: 12,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                      }}>
                        <div style={{ fontSize: "2rem", animation: "pulse 2s infinite" }}>⏳</div>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>Đang xử lý trên AI Engine...</div>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Thường mất 10-30 giây</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: "1", background: "#f9fafb", borderRadius: 12,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 12, border: "2px dashed #e5e7eb",
                  }}>
                    <div style={{ fontSize: "3rem" }}>🎨</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151" }}>Ảnh sẽ hiện ở đây</div>
                    <div style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center", padding: "0 20px" }}>
                      Nhập prompt và nhấn &quot;Tạo ảnh&quot; để bắt đầu
                    </div>
                  </div>
                )}

                {/* Tool Info */}
                <div style={{ marginTop: 20, padding: 16, background: "#f9fafb", borderRadius: 12 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "#111827" }}>{currentTool.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 8 }}>{currentTool.desc}</div>
                  <div style={{ fontSize: "0.8rem" }}>
                    Chi phí: <span style={{ color: "#16a34a", fontWeight: 700 }}>{currentTool.cost} credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      <style>{`
        @media (max-width: 768px) {
          .generate-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
