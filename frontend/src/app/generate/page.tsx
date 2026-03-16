"use client";
import { useState, useEffect } from "react";
import { PiCaretRight, PiSparkle, PiClockCounterClockwise, PiQuestion, PiListBullets, PiSquaresFour, PiImage, PiDownloadSimple, PiArrowsOut } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

const AI_MODELS = [
  { id: "Realistic_Vision_V5", name: "Realistic Vision V5", icon: "🎨", tag: "HOT" },
  { id: "v1-5-pruned-emaonly", name: "Stable Diffusion 1.5", icon: "⚡", tag: "" },
];

interface GenerationResult {
  task_id: string;
  status: string;
  output_image_url?: string;
}

export default function GeneratePublicPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7.0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [selectedModel, setSelectedModel] = useState("Realistic_Vision_V5");
  const [showModelPicker, setShowModelPicker] = useState(false);

  const loadHistory = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/ai/history?per_page=50`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setResults(data.tasks.map((t: any) => ({ task_id: t.id, status: t.status, output_image_url: t.output_image_url, prompt: t.input_params?.prompt })));
        if (data.tasks.length > 0) setActiveTab("history");
      }
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    if (!token) { window.location.href = "/login"; return; }
    setUsername(user || "User");
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.credits_balance !== undefined) setCredits(data.credits_balance); })
      .catch(() => {});
    // Load history
    loadHistory(token);
  }, []);

  if (!mounted) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Vui lòng nhập prompt mô tả ảnh"); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ task_type: "text_to_image", prompt, negative_prompt: negPrompt, width, height, steps, cfg_scale: cfgScale, seed: -1, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.error || data.detail || "Đã xảy ra lỗi");
      // Reload full history from API
      await loadHistory(token);
      setActiveTab("history");
      const meRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const meData = await meRes.json();
      if (meData.credits_balance !== undefined) setCredits(meData.credits_balance);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const SIZES = [
    { label: "1:1", w: 512, h: 512, steps: 30, cfg: 7.0 },
    { label: "4:3", w: 768, h: 576, steps: 25, cfg: 7.5 },
    { label: "16:9", w: 1024, h: 576, steps: 20, cfg: 8.0 },
    { label: "9:16", w: 576, h: 1024, steps: 20, cfg: 8.0 },
    { label: "FHD", w: 1920, h: 1080, steps: 20, cfg: 8.0 },
    { label: "2K", w: 2560, h: 1440, steps: 15, cfg: 8.5 },
  ];
  const currentSize = SIZES.find(s => s.w === width && s.h === height) || SIZES[0];

  const selectSize = (s: typeof SIZES[0]) => {
    setWidth(s.w); setHeight(s.h); setSteps(s.steps); setCfgScale(s.cfg);
  };

  return (
    <div style={{ overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fafbfc", position: "relative", display: "flex", flexDirection: "column" as const }}>
        <TopBar />
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ MAIN WORKSPACE ══════ */}
      <div className="gen-workspace" style={{ flex: 1, display: "flex", background: "#111827" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="gen-sidebar" style={{
          width: 340, flexShrink: 0, background: "#1a2332",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Tool Tab */}
          <div style={{ padding: "14px 16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              <button style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(22,163,74,0.3)", cursor: "pointer",
                background: "rgba(22,163,74,0.15)", color: "#4ade80",
                fontSize: "0.8rem", fontWeight: 600,
              }}>✨ Text to Image</button>
            </div>
          </div>

          {/* Scrollable Form */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

            {/* Model Selector */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "block" }}>Model</label>
              <button onClick={() => setShowModelPicker(!showModelPicker)} style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "0.85rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left",
                transition: "border-color 0.2s",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                  {AI_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
                </span>
                <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>{showModelPicker ? "▲" : "▼"}</span>
              </button>

              {showModelPicker && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 50,
                  background: "#1e293b", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)", overflow: "hidden",
                }}>
                  {AI_MODELS.map(m => (
                    <button key={m.id} onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }} style={{
                      width: "100%", padding: "12px 14px", border: "none", cursor: "pointer",
                      background: selectedModel === m.id ? "rgba(22,163,74,0.12)" : "transparent",
                      color: "#fff", fontSize: "0.84rem", textAlign: "left",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => { if (selectedModel !== m.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { if (selectedModel !== m.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: selectedModel === m.id ? "#22c55e" : "rgba(255,255,255,0.15)",
                        }} />
                        <span>{m.icon} {m.name}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {m.tag && (
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                            background: m.tag === "HOT" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                            color: m.tag === "HOT" ? "#f87171" : "#fbbf24",
                          }}>{m.tag}</span>
                        )}
                        <span style={{ fontSize: "0.7rem", opacity: 0.3 }}>🔒</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "block" }}>Mô tả hình ảnh</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo..."
                style={{
                  width: "100%", minHeight: 120, padding: "12px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "0.85rem", resize: "vertical", outline: "none",
                  fontFamily: "inherit", lineHeight: 1.6, transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Negative Prompt */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "block" }}>Negative Prompt <span style={{ fontWeight: 400, opacity: 0.5 }}>(tùy chọn)</span></label>
              <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                placeholder="blurry, low quality, watermark..."
                style={{
                  width: "100%", minHeight: 60, padding: "10px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "0.82rem", resize: "vertical", outline: "none",
                  fontFamily: "inherit", lineHeight: 1.5, transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

            {/* Ratio / Size */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Tỷ lệ</label>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{width}×{height}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {SIZES.map(s => (
                  <button key={s.label} onClick={() => selectSize(s)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                    background: currentSize.label === s.label ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.05)",
                    color: currentSize.label === s.label ? "#16a34a" : "rgba(255,255,255,0.5)",
                    fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s",
                    outline: currentSize.label === s.label ? "1px solid rgba(22,163,74,0.4)" : "none",
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Steps</label>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 6 }}>{steps}</span>
              </div>
              <input type="range" min={10} max={60} value={steps} onChange={e => setSteps(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#16a34a" }} />
            </div>

            {/* CFG Scale */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>CFG Scale</label>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 6 }}>{cfgScale}</span>
              </div>
              <input type="range" min={1} max={20} step={0.5} value={cfgScale} onChange={e => setCfgScale(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#16a34a" }} />
            </div>
          </div>

          {/* Bottom: Error + Generate Button */}
          <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {error && (
              <div style={{ padding: "8px 12px", borderRadius: 8, marginBottom: 10, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: "0.78rem" }}>
                ⚠️ {error}
              </div>
            )}
            <button onClick={handleGenerate} disabled={loading} style={{
              width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
              cursor: loading ? "wait" : "pointer",
              background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", fontSize: "0.88rem", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(34,197,94,0.3)",
            }}>
              {loading ? (
                <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Đang xử lý...</>
              ) : (
                <>Tạo ảnh <PiSparkle /> 1 credit</>
              )}
            </button>

            {/* Credits Info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
              <span>{username}</span>
              <span style={{ color: "#16a34a", fontWeight: 600 }}>{credits.toFixed(0)} credits còn lại</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT AREA ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Top Bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#15202e",
          }}>
            {/* Left: Tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setActiveTab("history")} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                background: activeTab === "history" ? "rgba(255,255,255,0.08)" : "transparent",
                color: activeTab === "history" ? "#fff" : "rgba(255,255,255,0.45)", transition: "all 0.15s",
              }}><PiClockCounterClockwise /> Lịch sử</button>
              <button onClick={() => setActiveTab("create")} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                background: activeTab === "create" ? "rgba(255,255,255,0.08)" : "transparent",
                color: activeTab === "create" ? "#fff" : "rgba(255,255,255,0.45)", transition: "all 0.15s",
              }}><PiQuestion /> Hướng dẫn sử dụng</button>
            </div>

            {/* Right: View mode */}
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setViewMode("list")} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8,
                border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                background: viewMode === "list" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewMode === "list" ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.15s",
              }}><PiListBullets /> Danh sách</button>
              <button onClick={() => setViewMode("grid")} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8,
                border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                background: viewMode === "grid" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewMode === "grid" ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.15s",
              }}><PiSquaresFour /> Lưới</button>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
            {activeTab === "create" && (
              <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
                <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>📖 Hướng dẫn sử dụng</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { step: "1", title: "Nhập mô tả hình ảnh", desc: "Mô tả chi tiết hình ảnh bạn muốn tạo bằng tiếng Anh hoặc tiếng Việt. Ví dụ: 'Professional product photo of a modern smartwatch on white marble, studio lighting, 4K quality'" },
                    { step: "2", title: "Chọn tỷ lệ và cài đặt", desc: "Chọn tỷ lệ ảnh phù hợp (1:1 cho avatar, 16:9 cho banner, 9:16 cho story). Điều chỉnh Steps (chất lượng) và CFG Scale (độ sáng tạo)" },
                    { step: "3", title: "Nhấn 'Tạo ảnh'", desc: "Mỗi ảnh tốn 1 credit. Kết quả thường mất 10-30 giây. Ảnh sẽ hiện trong tab 'Lịch sử'" },
                  ].map(item => (
                    <div key={item.step} style={{
                      display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "linear-gradient(135deg, #16a34a, #15803d)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "0.85rem", fontWeight: 700,
                      }}>{item.step}</div>
                      <div>
                        <div style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && results.length === 0 && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: "100%", minHeight: 400, gap: 16,
              }}>
                <PiSparkle style={{ fontSize: "3rem", color: "rgba(255,255,255,0.15)" }} />
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", fontWeight: 600 }}>Chưa có ảnh nào</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>Các ảnh đã tạo sẽ hiển thị tại đây</div>
              </div>
            )}

            {activeTab === "history" && results.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(240px, 1fr))" : "1fr",
                gap: 16,
              }}>
                {results.map((r, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)", borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(22,163,74,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                  >
                    {r.output_image_url ? (
                      <div style={{ position: "relative", aspectRatio: viewMode === "grid" ? "1" : "auto" }}>
                        <img src={r.output_image_url} alt="Generated" style={{
                          width: "100%", height: viewMode === "grid" ? "100%" : "auto",
                          objectFit: "cover", display: "block",
                        }} />
                        {/* Hover overlay */}
                        <div style={{
                          position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                          opacity: 0, transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                        >
                          <a href={r.output_image_url} download style={{
                            width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "1.1rem", backdropFilter: "blur(4px)",
                          }}><PiDownloadSimple /></a>
                          <a href={r.output_image_url} target="_blank" rel="noopener noreferrer" style={{
                            width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "1.1rem", backdropFilter: "blur(4px)",
                          }}><PiArrowsOut /></a>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        aspectRatio: "1", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                        <div style={{ fontSize: "1.5rem", animation: "pulse 2s infinite" }}>⏳</div>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>Đang xử lý...</div>
                      </div>
                    )}
                    <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {(r as any).prompt && (
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                          {(r as any).prompt}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)" }}>ID: {r.task_id.slice(0, 8)}</div>
                        <div style={{
                          fontSize: "0.68rem", fontWeight: 600,
                          color: r.status === "completed" ? "#16a34a" : r.status === "failed" ? "#ef4444" : "#f59e0b",
                        }}>
                          {r.status === "completed" ? "✅" : r.status === "failed" ? "❌" : "⏳"} {r.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .gen-sidebar::-webkit-scrollbar { width: 4px; }
        .gen-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @media (max-width: 768px) {
          .gen-workspace { flex-direction: column !important; }
          .gen-sidebar { width: 100% !important; max-height: 60vh; }
        }
      `}</style>
    </div>
  );
}
