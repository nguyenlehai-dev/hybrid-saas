"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  credits_balance: number;
}

interface Task {
  id: string;
  task_type: string;
  status: string;
  credits_cost: number;
  created_at: string;
  output_image_url: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) { window.location.href = "/login"; return; }
    setUser(JSON.parse(stored));

    fetch(`${API_URL}/ai/history?per_page=10`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(data => {
      setTasks(data.tasks || []);
    }).catch(() => { });
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      completed: { label: "Hoàn thành", bg: "rgba(16,185,129,0.1)", color: "#059669" },
      processing: { label: "Đang xử lý", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
      queued: { label: "Đang chờ", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
      failed: { label: "Lỗi", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
      pending: { label: "Chờ xử lý", bg: "rgba(107,114,128,0.1)", color: "#6b7280" },
    };
    return map[status] || map.pending;
  };

  const taskTypeLabels: Record<string, string> = {
    text_to_image: "✨ Text to Image",
    image_to_image: "🔄 Image to Image",
    review_product: "📸 Review Product",
    multishots: "🎭 Multishots",
    inpaint: "🖌️ Inpaint",
    skin_enhancer: "💄 Skin Enhancer",
    upscale: "🔍 Upscale",
    crop: "✂️ Smart Crop",
    video_generate: "🎬 Video",
  };

  const statCards = [
    { label: "Credits còn lại", value: user?.credits_balance?.toFixed(2) || "0.00", icon: "🪙", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
    { label: "Ảnh đã tạo", value: tasks.length.toString(), icon: "🎨", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
    { label: "Landing Pages", value: "0", icon: "🌐", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { label: "API Calls", value: "0", icon: "⚡", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  ];

  const quickTools = [
    { icon: "✨", name: "Text to Image", type: "text_to_image", desc: "Tạo ảnh từ prompt" },
    { icon: "📸", name: "Review Product", type: "review_product", desc: "Ảnh review sản phẩm" },
    { icon: "💄", name: "Skin Enhancer", type: "skin_enhancer", desc: "Làm đẹp da" },
    { icon: "🔍", name: "Upscale", type: "upscale", desc: "Nâng độ phân giải" },
    { icon: "🖌️", name: "Inpaint", type: "inpaint", desc: "Sửa vùng ảnh" },
    { icon: "🎭", name: "Multishots", type: "multishots", desc: "Nhiều góc chụp" },
  ];

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Xin chào, {user?.username || "User"} 👋</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            Quản lý AI và theo dõi hoạt động của bạn
          </p>
        </div>
        <a href="/dashboard/generate" className="btn btn-primary" style={{ fontSize: "0.9rem" }}>
          🎨 Tạo ảnh mới
        </a>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{card.label}</div>
                <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: card.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem",
              }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>
          Tạo nhanh
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {quickTools.map((tool, i) => (
            <a key={i} href={`/dashboard/generate?type=${tool.type}`} className="card" style={{
              padding: "18px 16px", display: "flex", flexDirection: "column", gap: 8,
              textDecoration: "none", cursor: "pointer",
            }}>
              <span style={{ fontSize: "1.6rem" }}>{tool.icon}</span>
              <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)" }}>{tool.name}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{tool.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>
          Hoạt động gần đây
        </h2>
        {tasks.length === 0 ? (
          <div className="card" style={{
            padding: "60px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎨</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
              Chưa có hoạt động nào
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
              Bắt đầu tạo ảnh AI đầu tiên của bạn!
            </p>
            <a href="/dashboard/generate" className="btn btn-primary">
              🎨 Tạo ảnh ngay
            </a>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>Loại</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>Trạng thái</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>Credits</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const badge = getStatusBadge(task.status);
                  return (
                    <tr key={task.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 500 }}>
                        {taskTypeLabels[task.task_type] || task.task_type}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem",
                          fontWeight: 600, background: badge.bg, color: badge.color,
                        }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-accent)" }}>
                        {task.credits_cost}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        {new Date(task.created_at).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
