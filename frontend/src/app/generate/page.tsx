"use client";
import { useState, useEffect } from "react";
import { PiCaretRight, PiSparkle, PiClockCounterClockwise, PiQuestion, PiListBullets, PiSquaresFour, PiImage, PiDownloadSimple, PiArrowsOut } from "react-icons/pi";
import { TopBar, Navbar, MobileMenu, Footer, FloatingButtons } from "@/components/landing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

const AI_MODELS = [
  { id: "mixProV3_v3", name: "MixPro V3 (Anime)", icon: "🎌", tag: "NEW" },
  { id: "Realistic_Vision_V5", name: "Realistic Vision V5", icon: "🎨", tag: "HOT" },
  { id: "v1-5-pruned-emaonly", name: "Stable Diffusion 1.5", icon: "⚡", tag: "" },
];

const SAMPLERS = [
  "DPM++ 2M Karras", "DPM++ SDE Karras", "DPM++ 2M SDE Karras",
  "DPM++ 2M", "DPM++ SDE", "DPM++ 2M SDE", "DPM++ 2M SDE Heun",
  "DPM++ 2S a Karras", "DPM++ 2S a", "DPM++ 3M SDE Karras", "DPM++ 3M SDE",
  "Euler a", "Euler", "LMS", "Heun",
  "DPM2 Karras", "DPM2 a Karras", "DPM2", "DPM2 a",
  "DDIM", "PLMS", "UniPC",
];

interface GenerationResult {
  task_id: string;
  status: string;
  output_image_url?: string;
  prompt?: string;
  model?: string;
  width?: number;
  height?: number;
  created_at?: string;
  input_params?: any;
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
  const [sampler, setSampler] = useState("DPM++ 2M Karras");
  const [batchCount, setBatchCount] = useState(1);
  const [seed, setSeed] = useState(-1);
  const [restoreFaces, setRestoreFaces] = useState(false);
  const [hiresFixEnabled, setHiresFixEnabled] = useState(false);
  const [hiresScale, setHiresScale] = useState(2);
  const [hiresSteps, setHiresSteps] = useState(0);
  const [denoising, setDenoising] = useState(0.35);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [selectedModel, setSelectedModel] = useState("Realistic_Vision_V5");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GenerationResult | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);

  const loadHistory = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/ai/history?per_page=50`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setResults(data.tasks.map((t: any) => ({
          task_id: t.id, status: t.status, output_image_url: t.output_image_url,
          prompt: t.input_params?.prompt, model: t.input_params?.model,
          width: t.input_params?.width, height: t.input_params?.height,
          created_at: t.created_at, input_params: t.input_params,
        })));
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
        body: JSON.stringify({
          task_type: "text_to_image", prompt, negative_prompt: negPrompt,
          width, height, steps, cfg_scale: cfgScale, seed,
          model: selectedModel,
          extra_params: {
            sampler_name: sampler, n_iter: batchCount,
            restore_faces: restoreFaces,
            enable_hr: hiresFixEnabled, hr_scale: hiresScale,
            hr_second_pass_steps: hiresSteps, denoising_strength: denoising,
          },
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(res.status === 504 || res.status === 502 ? "AI Engine đang xử lý quá lâu. Thử giảm kích thước hoặc steps." : `Server trả về lỗi (${res.status})`);
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.error || (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)) || "Đã xảy ra lỗi");
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

            {/* Sampler */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "block" }}>Sampling method</label>
              <select value={sampler} onChange={e => setSampler(e.target.value)} style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: "0.82rem", outline: "none", cursor: "pointer",
                appearance: "none" as any,
              }}>
                {SAMPLERS.map(s => <option key={s} value={s} style={{ background: "#1e293b" }}>{s}</option>)}
              </select>
            </div>

            {/* Steps + CFG in row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Steps</label>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 5 }}>{steps}</span>
                </div>
                <input type="range" min={10} max={60} value={steps} onChange={e => setSteps(Number(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>CFG Scale</label>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 5 }}>{cfgScale}</span>
                </div>
                <input type="range" min={1} max={20} step={0.5} value={cfgScale} onChange={e => setCfgScale(Number(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
              </div>
            </div>

            {/* Batch + Seed */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 6, display: "block" }}>Batch count</label>
                <input type="number" min={1} max={8} value={batchCount} onChange={e => setBatchCount(Number(e.target.value))} style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "0.82rem", outline: "none",
                }} />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 6, display: "block" }}>Seed</label>
                <input type="number" value={seed} onChange={e => setSeed(Number(e.target.value))} placeholder="-1 = random" style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "0.82rem", outline: "none",
                }} />
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" as const }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                <input type="checkbox" checked={restoreFaces} onChange={e => setRestoreFaces(e.target.checked)} style={{ accentColor: "#16a34a" }} />
                Restore faces
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                <input type="checkbox" checked={hiresFixEnabled} onChange={e => setHiresFixEnabled(e.target.checked)} style={{ accentColor: "#16a34a" }} />
                Hires. fix
              </label>
            </div>

            {/* Hires settings (conditional) */}
            {hiresFixEnabled && (
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Upscale by</label>
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{hiresScale}x</span>
                    </div>
                    <input type="range" min={1.5} max={4} step={0.5} value={hiresScale} onChange={e => setHiresScale(Number(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Denoising</label>
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{denoising}</span>
                    </div>
                    <input type="range" min={0} max={1} step={0.05} value={denoising} onChange={e => setDenoising(Number(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <label style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Hires steps</label>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{hiresSteps || "auto"}</span>
                  </div>
                  <input type="range" min={0} max={60} value={hiresSteps} onChange={e => setHiresSteps(Number(e.target.value))} style={{ width: "100%", accentColor: "#16a34a" }} />
                </div>
              </div>
            )}
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
              <div style={{ maxWidth: 750, margin: "0 auto", padding: "30px 20px" }}>
                <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: 6 }}>📖 Hướng dẫn sử dụng AI Generate</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginBottom: 24, lineHeight: 1.6 }}>
                  Tạo ảnh chất lượng cao bằng AI với Stable Diffusion. Dưới đây là hướng dẫn chi tiết từng bước.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Section 1: Model */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#fff" }}>1</span>
                      Chọn Model AI
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.7 }}>
                      <b style={{ color: "rgba(255,255,255,0.7)" }}>Realistic Vision V5</b> — Tạo ảnh thực tế, chân dung, sản phẩm, phong cảnh. Phù hợp cho hầu hết nhu cầu.<br/>
                      <b style={{ color: "rgba(255,255,255,0.7)" }}>Stable Diffusion 1.5</b> — Model gốc, đa dạng phong cách, từ anime đến realistic.
                    </p>
                  </div>

                  {/* Section 2: Prompt */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#fff" }}>2</span>
                      Viết Prompt (Mô tả ảnh)
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.7, marginBottom: 10 }}>
                      Mô tả chi tiết hình ảnh bạn muốn tạo. <b style={{ color: "rgba(255,255,255,0.7)" }}>Nên viết bằng tiếng Anh</b> để đạt kết quả tốt nhất.
                    </p>
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ color: "#4ade80", fontSize: "0.72rem", fontWeight: 600, marginBottom: 6 }}>✅ VÍ DỤ PROMPT TỐT:</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.6, fontStyle: "italic" }}>
                        &quot;Professional product photo of a modern smartwatch on white marble, studio lighting, 4K quality, sharp focus, bokeh background&quot;
                      </div>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ color: "#f87171", fontSize: "0.72rem", fontWeight: 600, marginBottom: 6 }}>⚠️ NEGATIVE PROMPT (Những gì không muốn):</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.6, fontStyle: "italic" }}>
                        &quot;blurry, low quality, distorted, ugly, watermark, text, bad anatomy, deformed fingers&quot;
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Sampler */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#fff" }}>3</span>
                      Sampling Method (Phương pháp lấy mẫu)
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { name: "DPM++ 2M", note: "⭐ Mặc định, nhanh, chất lượng tốt" },
                        { name: "Euler a", note: "Sáng tạo, phong cách đa dạng" },
                        { name: "DPM++ SDE", note: "Chi tiết cao, chậm hơn" },
                        { name: "DDIM", note: "Ổn định, tái tạo được với same seed" },
                      ].map(s => (
                        <div key={s.name} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
                          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 600 }}>{s.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}>{s.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Settings */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#fff" }}>4</span>
                      Cài đặt tham số
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { param: "Steps (10-60)", desc: "Số bước xử lý. Cao hơn = chi tiết hơn nhưng chậm hơn. Khuyến nghị: 20-30" },
                        { param: "CFG Scale (1-20)", desc: "Mức tuân theo prompt. Thấp = sáng tạo tự do, Cao = bám sát prompt. Khuyến nghị: 7-8" },
                        { param: "Seed", desc: "Số hạt giống. -1 = ngẫu nhiên. Cùng seed + prompt = cùng kết quả. Dùng để tái tạo ảnh đã thích" },
                        { param: "Batch count (1-8)", desc: "Tạo nhiều ảnh cùng lúc với seed khác nhau. Tốn thêm credits theo số lượng" },
                        { param: "Restore faces", desc: "Tự động sửa khuôn mặt người. Bật khi tạo ảnh chân dung" },
                      ].map(p => (
                        <div key={p.param} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ minWidth: 130, color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 600 }}>{p.param}</div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", lineHeight: 1.5 }}>{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Hires Fix */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#fff" }}>5</span>
                      Hires. Fix (Nâng cấp độ phân giải)
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.7, marginBottom: 8 }}>
                      Tạo ảnh ở kích thước nhỏ trước, sau đó <b style={{ color: "rgba(255,255,255,0.7)" }}>upscale lên kích thước lớn hơn</b> với chi tiết tốt hơn. Thay vì tạo ảnh 2K trực tiếp (chậm, hay lỗi), hãy dùng Hires Fix:
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)" }}>
                        <div style={{ color: "#4ade80", fontSize: "0.72rem", fontWeight: 600, marginBottom: 4 }}>✅ CÁCH TỐT</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", lineHeight: 1.5 }}>512×512 + Hires Fix 2x<br/>→ Ra ảnh 1024×1024 đẹp</div>
                      </div>
                      <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <div style={{ color: "#f87171", fontSize: "0.72rem", fontWeight: 600, marginBottom: 4 }}>❌ CÁCH XẤU</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", lineHeight: 1.5 }}>2K trực tiếp<br/>→ Chậm, hay lỗi, ảnh xấu</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {[
                        { param: "Upscale by", desc: "Hệ số phóng to (1.5x - 4x)" },
                        { param: "Denoising (0-1)", desc: "Mức tạo chi tiết mới. 0.3-0.5 = giữ cấu trúc. 0.6+ = thay đổi nhiều" },
                        { param: "Hires steps", desc: "Bước xử lý upscale. 0 = tự động. 10-20 = đủ tốt" },
                      ].map(p => (
                        <div key={p.param} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ minWidth: 120, color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600 }}>{p.param}</div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Tips */}
                  <div style={{ padding: "18px", borderRadius: 12, background: "linear-gradient(135deg, rgba(22,163,74,0.06), rgba(22,163,74,0.02))", border: "1px solid rgba(22,163,74,0.15)" }}>
                    <h3 style={{ color: "#4ade80", fontSize: "0.92rem", fontWeight: 700, marginBottom: 12 }}>💡 Mẹo tạo ảnh đẹp</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        "Viết prompt bằng tiếng Anh, chi tiết và cụ thể",
                        "Thêm từ khóa chất lượng: masterpiece, best quality, 4K, ultra-detailed",
                        "Luôn dùng Negative Prompt để loại bỏ lỗi phổ biến",
                        "Dùng Realistic Vision V5 cho ảnh thực tế, SD 1.5 cho anime/art",
                        "DPM++ 2M là sampler tốt nhất cho hầu hết trường hợp",
                        "Steps 20-30 là đủ, không cần quá 50",
                        "CFG Scale 7-8 cân bằng giữa sáng tạo và chính xác",
                        "Dùng Hires Fix thay vì chọn kích thước lớn trực tiếp",
                        "Lưu lại Seed của ảnh đẹp để tái tạo hoặc tinh chỉnh",
                      ].map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "#22c55e", fontSize: "0.75rem", flexShrink: 0 }}>✦</span>
                          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", lineHeight: 1.5 }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      <div style={{ position: "relative", aspectRatio: viewMode === "grid" ? "1" : "auto", cursor: "pointer" }} onClick={() => setSelectedImage(r)}>
                        <img src={r.output_image_url} alt="Generated" style={{
                          width: "100%", height: viewMode === "grid" ? "100%" : "auto",
                          objectFit: "cover", display: "block",
                        }} />
                        <div style={{
                          position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                          opacity: 0, transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                        >
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: "1.2rem", backdropFilter: "blur(6px)",
                          }}><PiArrowsOut /></div>
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

      {/* ── IMAGE DETAIL MODAL ── */}
      {selectedImage && selectedImage.output_image_url && (
        <div onClick={() => setSelectedImage(null)} style={{
          position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)",
          display: "flex", backdropFilter: "blur(8px)",
        }}>
          {/* Left: Image */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, minWidth: 0 }} onClick={() => setSelectedImage(null)}>
            <img src={selectedImage.output_image_url} alt="Preview" style={{
              maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }} onClick={e => e.stopPropagation()} />
          </div>

          {/* Right: Info Panel */}
          <div onClick={e => e.stopPropagation()} style={{
            width: 360, background: "#1a2332", borderLeft: "1px solid rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", overflowY: "auto",
          }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{username.slice(0,1).toUpperCase()}</div>
                <div>
                  <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>{username}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}>Owner</div>
                </div>
              </div>
              <button onClick={() => setSelectedImage(null)} style={{
                width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: "1.1rem",
              }}>✕</button>
            </div>

            {/* Prompt */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.5px" }}>✨ PROMPT</span>
                <button onClick={() => {
                  navigator.clipboard.writeText(selectedImage.prompt || "");
                  setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000);
                }} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: promptCopied ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.05)",
                  color: promptCopied ? "#4ade80" : "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600,
                }}>{promptCopied ? "Copied!" : "Copy"}</button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", lineHeight: 1.6, margin: 0, wordBreak: "break-word" }}>
                {selectedImage.prompt || "No prompt"}
              </p>
            </div>

            {/* Information */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 12 }}>ℹ️ INFORMATION</div>
              {[
                { label: "Model", value: AI_MODELS.find(m => m.id === selectedImage.model)?.name || selectedImage.model || "Unknown" },
                { label: "Resolution", value: selectedImage.width && selectedImage.height ? `${selectedImage.width}×${selectedImage.height}` : "N/A" },
                { label: "Sampler", value: selectedImage.input_params?.sampler_name || "DPM++ 2M Karras" },
                { label: "Steps", value: selectedImage.input_params?.steps || "?" },
                { label: "CFG Scale", value: selectedImage.input_params?.cfg_scale || "?" },
                { label: "Seed", value: selectedImage.input_params?.seed ?? "-1" },
                { label: "Created", value: selectedImage.created_at ? new Date(selectedImage.created_at).toLocaleString("vi-VN") : "N/A" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{item.label}</span>
                  <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 500 }}>{String(item.value)}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ padding: "16px 20px", marginTop: "auto" }}>
              <a href={selectedImage.output_image_url} download style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", textDecoration: "none",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <PiDownloadSimple /> Download
              </a>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                <a href={selectedImage.output_image_url} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  fontSize: "0.78rem", cursor: "pointer", textDecoration: "none",
                }}><PiArrowsOut /> Open</a>
                <button onClick={() => {
                  navigator.clipboard.writeText(selectedImage.output_image_url || "");
                }} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  fontSize: "0.78rem", cursor: "pointer",
                }}>📋 Copy URL</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
