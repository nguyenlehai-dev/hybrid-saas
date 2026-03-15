"use client";

import { useState, useEffect } from "react";

const API_URL = "/api";

interface TaskItem {
  id: string;
  task_type: string;
  status: string;
  credits_cost: number;
  input_params: Record<string, any>;
  output_image_url: string | null;
  output_metadata: Record<string, any>;
  error_message: string | null;
  processing_time_ms: number | null;
  created_at: string;
  completed_at: string | null;
}

const TASK_LABELS: Record<string, string> = {
  text_to_image: "✨ Text to Image",
  image_to_image: "🔄 Image to Image",
  review_product: "📸 Review Product",
  multishots: "🎭 Multishots",
  inpaint: "🖌️ Inpaint",
  skin_enhancer: "💄 Skin Enhancer",
  upscale: "🔍 Upscale",
  crop: "✂️ Smart Crop",
  video_generate: "🎬 Video Generate",
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", label: "Hoàn thành" },
  failed: { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", label: "Lỗi" },
  queued: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", label: "Đang chờ" },
  processing: { bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", label: "Đang xử lý" },
  cancelled: { bg: "rgba(107, 114, 128, 0.15)", color: "#6b7280", label: "Đã hủy" },
};

export default function GalleryPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<TaskItem | null>(null);

  const perPage = 12;

  useEffect(() => {
    fetchHistory();
  }, [page, filter, statusFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      let url = `${API_URL}/ai/history?page=${page}&per_page=${perPage}`;
      if (filter) url += `&task_type=${filter}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };


  return (
    <>
        <div className="page-header">
          <div>
            <h1>🖼️ Thư viện ảnh</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Lịch sử tạo ảnh AI — {total} ảnh
            </p>
          </div>
          <a href="/dashboard/generate" className="btn btn-primary">
            ✨ Tạo ảnh mới
          </a>
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: "16px", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: "200px" }}
          >
            <option value="">Tất cả công cụ</option>
            {Object.entries(TASK_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: "180px" }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="completed">✅ Hoàn thành</option>
            <option value="failed">❌ Lỗi</option>
            <option value="queued">⏳ Đang chờ</option>
          </select>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px", animation: "pulse 2s infinite" }}>⏳</div>
            Đang tải...
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎨</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>Chưa có ảnh nào</div>
            <div style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Bắt đầu tạo ảnh AI để xem lịch sử ở đây
            </div>
            <a href="/dashboard/generate" className="btn btn-primary">✨ Tạo ảnh đầu tiên</a>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {tasks.map((task) => {
              const statusInfo = STATUS_STYLES[task.status] || STATUS_STYLES.queued;
              return (
                <div
                  key={task.id}
                  className="glass-card"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    cursor: task.output_image_url ? "pointer" : "default",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onClick={() => task.output_image_url && setSelectedImage(task)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                >
                  {/* Image */}
                  <div style={{
                    aspectRatio: "1",
                    background: "var(--bg-hover)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    {task.output_image_url ? (
                      <img
                        src={task.output_image_url}
                        alt={task.input_params?.prompt || "Generated"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ fontSize: "3rem", opacity: 0.3 }}>
                        {task.status === "failed" ? "❌" : "⏳"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                        {TASK_LABELS[task.task_type] || task.task_type}
                      </span>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        fontWeight: 600,
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "4px",
                    }}>
                      {task.input_params?.prompt || "—"}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      <span>{formatDate(task.created_at)}</span>
                      <span>{task.credits_cost} credits</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Trước
            </button>
            <span style={{ padding: "8px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Trang {page} / {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Tiếp →
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div
              style={{
                maxWidth: "900px", maxHeight: "90vh", width: "100%",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={selectedImage.output_image_url!}
                  alt="Generated"
                  style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", background: "#000" }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(0,0,0,0.6)", border: "none",
                    color: "#fff", width: 36, height: 36, borderRadius: "50%",
                    fontSize: "1.2rem", cursor: "pointer",
                  }}
                >✕</button>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>
                  {TASK_LABELS[selectedImage.task_type]}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                  {selectedImage.input_params?.prompt}
                </div>
                <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>📐 {selectedImage.input_params?.width}×{selectedImage.input_params?.height}</span>
                  <span>🔄 {selectedImage.input_params?.steps} steps</span>
                  <span>⏱️ {selectedImage.processing_time_ms ? `${(selectedImage.processing_time_ms / 1000).toFixed(1)}s` : "—"}</span>
                  <span>💰 {selectedImage.credits_cost} credits</span>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <a
                    href={selectedImage.output_image_url!}
                    download
                    className="btn btn-primary btn-sm"
                  >
                    📥 Tải về
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
