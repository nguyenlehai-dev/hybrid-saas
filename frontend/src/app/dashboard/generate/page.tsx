"use client";

import { useState, useEffect } from "react";

const API_URL = "/api";

interface GenerationResult {
  task_id: string;
  status: string;
  output_image_url?: string;
}

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

export default function GeneratePage() {
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

  // Get type from URL if redirected from dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (type) setSelectedType(type);
  }, []);

  const currentTool = TASK_TYPES.find((t) => t.value === selectedType)!;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Vui lòng nhập prompt");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_type: selectedType,
          prompt,
          negative_prompt: negPrompt,
          width,
          height,
          steps,
          cfg_scale: cfgScale,
          seed: -1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail?.error || data.detail || "Đã xảy ra lỗi");
      }

      setResult({
        task_id: data.task_id,
        status: data.status,
        output_image_url: data.output_image_url,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
        <div className="page-header">
          <div>
            <h1>🎨 Tạo ảnh AI</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Chọn công cụ và nhập prompt để tạo ảnh
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left: Form */}
          <div>
            {/* Tool Selection */}
            <div className="glass-card" style={{ padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Chọn công cụ</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "8px",
              }}>
                {TASK_TYPES.map((tool) => (
                  <button
                    key={tool.value}
                    onClick={() => setSelectedType(tool.value)}
                    style={{
                      padding: "12px",
                      background: selectedType === tool.value ? "rgba(124, 58, 237, 0.2)" : "var(--bg-hover)",
                      border: selectedType === tool.value ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      color: "var(--text-primary)",
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{tool.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-accent)", marginTop: "4px" }}>
                      {tool.cost} credits
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="glass-card" style={{ padding: "24px", marginBottom: "20px" }}>
              <div className="form-group">
                <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="form-input"
                  placeholder="Mô tả ảnh bạn muốn tạo... Ví dụ: Professional product photo of a modern smartwatch on white marble, studio lighting, 4K quality"
                  style={{ minHeight: "120px" }}
                />
              </div>
              <div className="form-group">
                <label>Negative Prompt (tùy chọn)</label>
                <textarea
                  value={negPrompt}
                  onChange={(e) => setNegPrompt(e.target.value)}
                  className="form-input"
                  placeholder="Những gì bạn KHÔNG muốn trong ảnh... Ví dụ: blurry, low quality, watermark, text"
                  style={{ minHeight: "80px" }}
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="glass-card" style={{ padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Cài đặt nâng cao</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Width (px)</label>
                  <select value={width} onChange={(e) => setWidth(Number(e.target.value))} className="form-input">
                    <option value={512}>512</option>
                    <option value={768}>768</option>
                    <option value={1024}>1024</option>
                    <option value={2048}>2048</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Height (px)</label>
                  <select value={height} onChange={(e) => setHeight(Number(e.target.value))} className="form-input">
                    <option value={512}>512</option>
                    <option value={768}>768</option>
                    <option value={1024}>1024</option>
                    <option value={2048}>2048</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Steps: {steps}</label>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="form-input"
                    style={{ padding: "8px 0" }}
                  />
                </div>
                <div className="form-group">
                  <label>CFG Scale: {cfgScale}</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    className="form-input"
                    style={{ padding: "8px 0" }}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "14px 18px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-sm)",
                color: "var(--error)",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              {loading ? (
                <>⏳ Đang gửi yêu cầu...</>
              ) : (
                <>🎨 Tạo ảnh — {currentTool.cost} credits</>
              )}
            </button>
          </div>

          {/* Right: Preview / Result */}
          <div>
            <div className="glass-card" style={{ padding: "24px", position: "sticky", top: "32px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Kết quả</h3>

              {result ? (
                <div>
                  <div style={{
                    padding: "12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "16px",
                  }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--success)" }}>
                      ✅ Task đã được tạo
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      ID: {result.task_id}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Status: <span className={`badge ${result.status === "completed" ? "badge-success" : "badge-warning"}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>

                  {result.output_image_url && (
                    <div style={{
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      border: "1px solid var(--border-color)",
                    }}>
                      <img
                        src={result.output_image_url}
                        alt="Generated"
                        style={{ width: "100%", display: "block" }}
                      />
                    </div>
                  )}

                  {!result.output_image_url && (
                    <div style={{
                      aspectRatio: "1",
                      background: "var(--bg-hover)",
                      borderRadius: "var(--radius-md)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "12px",
                    }}>
                      <div style={{ fontSize: "2rem", animation: "pulse 2s infinite" }}>⏳</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        Đang xử lý trên AI Engine...
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Thường mất 10-30 giây
                      </div>
                    </div>
                  )}

                  {result.output_image_url && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <a
                      href={result.output_image_url}
                      download={`ai-generated-${result.task_id}.png`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
                    >
                      📥 Tải về
                    </a>
                    <a
                      href={result.output_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
                    >
                      🔍 Xem full
                    </a>
                    <a
                      href="/dashboard/gallery"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
                    >
                      🖼️ Thư viện
                    </a>
                  </div>
                  )}
                </div>
              ) : (
                <div style={{
                  aspectRatio: "1",
                  background: "var(--bg-hover)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "12px",
                  border: "2px dashed var(--border-color)",
                }}>
                  <div style={{ fontSize: "3rem" }}>🎨</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Ảnh sẽ hiện ở đây
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "0 20px" }}>
                    Nhập prompt và nhấn &quot;Tạo ảnh&quot; để bắt đầu
                  </div>
                </div>
              )}

              {/* Tool Info */}
              <div style={{
                marginTop: "20px",
                padding: "16px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-sm)",
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  {currentTool.label}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  {currentTool.desc}
                </div>
                <div style={{ fontSize: "0.8rem" }}>
                  Chi phí: <span style={{ color: "var(--text-accent)", fontWeight: 600 }}>{currentTool.cost} credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
