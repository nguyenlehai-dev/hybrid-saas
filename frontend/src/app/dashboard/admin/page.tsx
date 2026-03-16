"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpspanel.io.vn/api";

interface SpamInfo { risk_score: number; risk_level: string; flags: string[]; tasks_count: number; failed_tasks: number; recent_tasks_1h: number; daily_tasks_24h: number; }
interface Stats { total_users: number; active_users_today: number; total_tasks: number; tasks_today: number; total_credits_spent: number; credits_spent_today: number; pending_orders: number; }
interface UserItem { id: string; email: string; username: string; full_name: string | null; role: string; is_active: boolean; credits_balance: number; last_login_at: string | null; created_at: string; tasks_count: number; total_spent: number; spam?: SpamInfo; }
interface Activity { user_email: string; username: string; task_id: string; task_type: string; status: string; credits_cost: number; prompt: string | null; created_at: string; }
interface OrderItem { id: string; order_code: string; user_email: string; username: string; plan_name: string; amount_vnd: number; credits_amount: number; status: string; transfer_content: string; created_at: string; }
interface VoucherItem { id: string; code: string; credits_amount: number; description: string | null; is_used: boolean; used_by_email: string | null; used_at: string | null; created_at: string; }

const STATUS_COLORS: Record<string, string> = { completed: "#10b981", failed: "#ef4444", queued: "#f59e0b", processing: "#3b82f6" };
const RISK_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  safe: { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "An toàn" },
  warning: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", label: "⚠️ Cảnh báo" },
  danger: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "🚨 Nguy hiểm" },
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "orders" | "activity" | "vouchers">("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const PER_PAGE = 15;
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [newVoucher, setNewVoucher] = useState({ code: "", credits_amount: "", description: "" });
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", username: "", password: "", full_name: "", role: "user", credits_balance: "10" });
  const [spamAlerts, setSpamAlerts] = useState<UserItem[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { if (!token) { window.location.href = "/login"; return; } if (tab !== "users") setPage(1); fetchData(); }, [tab]);
  useEffect(() => { if (tab === "users") fetchData(); }, [page]);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      if (tab === "overview") {
        const res = await fetch(`${API_URL}/admin/stats`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        setStats(await res.json());
        const ordRes = await fetch(`${API_URL}/admin/orders?status=pending`, { headers });
        setOrders(await ordRes.json());
      }
      if (tab === "users") {
        const res = await fetch(`${API_URL}/admin/users?page=${page}&per_page=${PER_PAGE}${search ? `&search=${search}` : ""}`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        const ud = await res.json();
        setUsers(ud.users || []);
        setTotalPages(ud.total_pages || 1);
        setTotalUsers(ud.total || 0);
        // Filter spam alerts
        setSpamAlerts((ud.users || []).filter((u: UserItem) => u.spam && u.spam.risk_level !== "safe"));
      }
      if (tab === "orders") {
        const res = await fetch(`${API_URL}/admin/orders`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        setOrders(await res.json());
      }
      if (tab === "activity") {
        const res = await fetch(`${API_URL}/admin/activity?limit=50`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        setActivity(await res.json());
      }
      if (tab === "vouchers") {
        const res = await fetch(`${API_URL}/admin/vouchers`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        setVouchers(await res.json());
      }
    } catch { setError("Lỗi kết nối"); }
    setLoading(false);
  };

  const showMsg = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3000); };

  const toggleUser = async (userId: string) => {
    const res = await fetch(`${API_URL}/admin/users/${userId}/toggle-active`, { method: "POST", headers });
    showMsg(`✅ ${(await res.json()).message}`); fetchData();
  };

  const addCredits = async (userId: string) => {
    const amount = prompt("Nhập số credits muốn thêm:");
    if (!amount || isNaN(Number(amount))) return;
    const res = await fetch(`${API_URL}/admin/users/${userId}/add-credits?amount=${amount}`, { method: "POST", headers });
    showMsg(`✅ ${(await res.json()).message}`); fetchData();
  };

  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`⚠️ Xác nhận XÓA tài khoản "${username}"?\nHành động này không thể hoàn tác!`)) return;
    const res = await fetch(`${API_URL}/admin/users/${userId}`, { method: "DELETE", headers });
    const data = await res.json();
    if (res.ok) { showMsg(`✅ ${data.message}`); fetchData(); }
    else { alert(data.detail); }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.username || !newUser.password) { alert("Vui lòng nhập đầy đủ thông tin"); return; }
    const res = await fetch(`${API_URL}/admin/users/create`, {
      method: "POST", headers, body: JSON.stringify({
        ...newUser, credits_balance: parseFloat(newUser.credits_balance) || 10,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      showMsg(`✅ ${data.message}`);
      setShowCreateUser(false);
      setNewUser({ email: "", username: "", password: "", full_name: "", role: "user", credits_balance: "10" });
      fetchData();
    } else { alert(data.detail); }
  };

  const approveOrder = async (orderId: string) => {
    if (!confirm("Xác nhận đã nhận tiền và duyệt đơn?")) return;
    const res = await fetch(`${API_URL}/admin/orders/${orderId}/approve`, { method: "POST", headers });
    showMsg(`✅ ${(await res.json()).message}`); fetchData();
  };

  const rejectOrder = async (orderId: string) => {
    if (!confirm("Xác nhận từ chối đơn hàng này?")) return;
    const res = await fetch(`${API_URL}/admin/orders/${orderId}/reject`, { method: "POST", headers });
    showMsg(`✅ ${(await res.json()).message}`); fetchData();
  };

  const saveEditUser = async () => {
    if (!editUser) return;
    const res = await fetch(`${API_URL}/admin/users/${editUser.id}`, {
      method: "PUT", headers, body: JSON.stringify({
        email: editUser.email, username: editUser.username,
        full_name: editUser.full_name, role: editUser.role,
        credits_balance: editUser.credits_balance,
      }),
    });
    showMsg(`✅ ${(await res.json()).message}`); setEditUser(null); fetchData();
  };

  const createVoucher = async () => {
    if (!newVoucher.code || !newVoucher.credits_amount) { alert("Nhập mã và số credits"); return; }
    const res = await fetch(`${API_URL}/admin/vouchers`, {
      method: "POST", headers, body: JSON.stringify({
        code: newVoucher.code, credits_amount: parseFloat(newVoucher.credits_amount),
        description: newVoucher.description || null,
      }),
    });
    const data = await res.json();
    if (res.ok) { showMsg(`✅ ${data.message}`); setNewVoucher({ code: "", credits_amount: "", description: "" }); fetchData(); }
    else { alert(data.detail); }
  };

  const deleteVoucher = async (id: string) => {
    if (!confirm("Xóa voucher này?")) return;
    const res = await fetch(`${API_URL}/admin/vouchers/${id}`, { method: "DELETE", headers });
    showMsg(`✅ ${(await res.json()).message}`); fetchData();
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

  // Client-side pagination for non-user tabs
  const paginate = <T,>(items: T[], perPage = 10) => {
    const total = Math.ceil(items.length / perPage);
    const start = (page - 1) * perPage;
    return { data: items.slice(start, start + perPage), total, count: items.length };
  };

  const PaginationBar = ({ currentPage, totalPg, count, onPageChange }: { currentPage: number; totalPg: number; count: number; onPageChange: (p: number) => void }) => totalPg <= 1 ? null : (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--border-color)", fontSize: "0.8rem" }}>
      <span style={{ color: "var(--text-muted)" }}>Trang {currentPage}/{totalPg} ({count} mục)</span>
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px", opacity: currentPage <= 1 ? 0.4 : 1 }}>← Trước</button>
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPg) }, (_, i) => {
          let p = i + 1;
          if (totalPg > 5) {
            if (currentPage <= 3) p = i + 1;
            else if (currentPage >= totalPg - 2) p = totalPg - 4 + i;
            else p = currentPage - 2 + i;
          }
          return (
            <button key={p} onClick={() => onPageChange(p)} className={`btn ${currentPage === p ? "btn-primary" : "btn-secondary"} btn-sm`}
              style={{ fontSize: "0.75rem", padding: "4px 10px", minWidth: "32px" }}>{p}</button>
          );
        })}
        <button onClick={() => onPageChange(Math.min(totalPg, currentPage + 1))} disabled={currentPage >= totalPg} className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px", opacity: currentPage >= totalPg ? 0.4 : 1 }}>Sau →</button>
      </div>
    </div>
  );

  return (
    <>
        <div className="page-header">
          <div>
            <h1>👑 Quản trị hệ thống</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Quản lý users, đơn hàng, hoạt động</p>
          </div>
        </div>

        {error ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--error)" }}>{error}</div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {(["overview", "orders", "users", "vouchers", "activity"] as const).map((t) => (
                <button key={t} onClick={() => { setTab(t); setPage(1); }}
                  className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} btn-sm`}>
                  {t === "overview" ? "📊 Tổng quan" : t === "orders" ? `💳 Đơn hàng${stats?.pending_orders ? ` (${stats.pending_orders})` : ""}` : t === "users" ? "👥 Users" : t === "vouchers" ? "🎟️ Voucher" : "📋 Hoạt động"}
                </button>
              ))}
            </div>

            {actionMsg && (
              <div style={{ padding: "10px 16px", marginBottom: "12px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", color: "var(--success)", fontSize: "0.85rem" }}>{actionMsg}</div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>⏳ Đang tải...</div>
            ) : (
              <>
                {/* Overview */}
                {tab === "overview" && stats && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                      {[
                        { label: "👥 Tổng users", value: stats.total_users, sub: `${stats.active_users_today} online` },
                        { label: "🎨 Tổng tasks", value: stats.total_tasks, sub: `${stats.tasks_today} hôm nay` },
                        { label: "💰 Credits dùng", value: stats.total_credits_spent.toFixed(0), sub: `${stats.credits_spent_today.toFixed(0)} hôm nay` },
                        { label: "💳 Đơn chờ duyệt", value: stats.pending_orders, sub: "cần xử lý" },
                      ].map((item, i) => (
                        <div key={i} className="glass-card" style={{ padding: "20px" }}>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>{item.label}</div>
                          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: i === 3 && stats.pending_orders > 0 ? "#f59e0b" : undefined }}>{item.value}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{item.sub}</div>
                        </div>
                      ))}
                    </div>

                    {orders.length > 0 && (
                      <>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px", color: "#f59e0b" }}>⚠️ Đơn hàng chờ duyệt ({orders.length})</h3>
                        <div className="glass-card" style={{ padding: 0, overflow: "auto", marginBottom: "20px" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                                {["Mã đơn", "User", "Gói", "Số tiền", "NDCK", "Thời gian", "Hành động"].map(h => (
                                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((o) => (
                                <tr key={o.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{o.order_code}</td>
                                  <td style={{ padding: "10px 12px" }}>{o.username}<br/><span style={{fontSize:"0.7rem",color:"var(--text-muted)"}}>{o.user_email}</span></td>
                                  <td style={{ padding: "10px 12px" }}>{o.plan_name}</td>
                                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{formatVND(o.amount_vnd)}</td>
                                  <td style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--text-accent)", fontWeight: 600 }}>{o.transfer_content}</td>
                                  <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{formatDate(o.created_at)}</td>
                                  <td style={{ padding: "10px 12px" }}>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      <button onClick={() => approveOrder(o.id)} className="btn btn-primary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>✅ Duyệt</button>
                                      <button onClick={() => rejectOrder(o.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>❌</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Orders Tab */}
                {tab === "orders" && (
                  <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
                    {orders.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Chưa có đơn hàng nào</div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: "800px" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            {["Mã đơn", "User", "Gói", "Số tiền", "Credits", "NDCK", "Trạng thái", "Thời gian", "Hành động"].map(h => (
                              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{o.order_code}</td>
                              <td style={{ padding: "10px 12px" }}>{o.username}</td>
                              <td style={{ padding: "10px 12px" }}>{o.plan_name}</td>
                              <td style={{ padding: "10px 12px" }}>{formatVND(o.amount_vnd)}</td>
                              <td style={{ padding: "10px 12px" }}>{o.credits_amount}</td>
                              <td style={{ padding: "10px 12px", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-accent)" }}>{o.transfer_content}</td>
                              <td style={{ padding: "10px 12px" }}>
                                <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: o.status === "approved" ? "rgba(16,185,129,0.15)" : o.status === "rejected" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: o.status === "approved" ? "#10b981" : o.status === "rejected" ? "#ef4444" : "#f59e0b" }}>
                                  {o.status === "approved" ? "Đã duyệt" : o.status === "rejected" ? "Từ chối" : "Chờ duyệt"}
                                </span>
                              </td>
                              <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{formatDate(o.created_at)}</td>
                              <td style={{ padding: "10px 12px" }}>
                                {o.status === "pending" && (
                                  <div style={{ display: "flex", gap: "4px" }}>
                                    <button onClick={() => approveOrder(o.id)} className="btn btn-primary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>✅ Duyệt</button>
                                    <button onClick={() => rejectOrder(o.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>❌</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                  <>
                    {/* Spam Alerts Banner */}
                    {spamAlerts.length > 0 && (
                      <div style={{ padding: "16px", marginBottom: "16px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ef4444", marginBottom: "10px" }}>
                          🚨 Phát hiện {spamAlerts.length} tài khoản đáng ngờ
                        </h3>
                        {spamAlerts.map((u) => (
                          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "6px", borderRadius: "8px", background: "rgba(239,68,68,0.06)", fontSize: "0.8rem" }}>
                            <span style={{ fontWeight: 700, minWidth: "120px" }}>{u.username}</span>
                            <span style={{ color: "var(--text-muted)", minWidth: "180px" }}>{u.email}</span>
                            <span style={{ padding: "2px 8px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 600, background: RISK_COLORS[u.spam?.risk_level || "safe"].bg, color: RISK_COLORS[u.spam?.risk_level || "safe"].color }}>
                              Risk: {u.spam?.risk_score || 0}%
                            </span>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", flex: 1 }}>
                              {u.spam?.flags.map((f, i) => (
                                <span key={i} style={{ fontSize: "0.7rem", color: "#ef4444" }}>{f}</span>
                              ))}
                            </div>
                            <button onClick={() => toggleUser(u.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>
                              {u.is_active ? "🚫 Khóa" : "✅ Mở"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search + Create */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                      <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); fetchData(); } }} placeholder="🔍 Tìm email hoặc username..." className="form-input" style={{ maxWidth: "300px", flex: 1 }} />
                      <button onClick={() => { setPage(1); fetchData(); }} className="btn btn-secondary btn-sm">Tìm</button>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Tổng: {totalUsers} users</span>
                      <button onClick={() => setShowCreateUser(true)} className="btn btn-primary btn-sm">➕ Tạo tài khoản</button>
                    </div>

                    {/* Users Table */}
                    <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: "900px" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            {["User", "Role", "Status", "Risk", "Credits", "Tasks", "Ngày tạo", "Hành động"].map(h => (
                              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => {
                            const risk = RISK_COLORS[u.spam?.risk_level || "safe"];
                            return (
                              <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)", background: u.spam?.risk_level === "danger" ? "rgba(239,68,68,0.04)" : u.spam?.risk_level === "warning" ? "rgba(245,158,11,0.04)" : undefined }}>
                                <td style={{ padding: "10px 12px" }}>
                                  <div style={{ fontWeight: 600 }}>{u.username}</div>
                                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{u.email}</div>
                                  {u.full_name && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{u.full_name}</div>}
                                </td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: u.role === "admin" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)", color: u.role === "admin" ? "#f59e0b" : "#3b82f6" }}>{u.role}</span>
                                </td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: u.is_active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: u.is_active ? "#10b981" : "#ef4444" }}>{u.is_active ? "Active" : "Banned"}</span>
                                </td>
                                <td style={{ padding: "10px 12px" }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <span style={{ padding: "2px 8px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 600, background: risk.bg, color: risk.color, display: "inline-block", width: "fit-content" }}>
                                      {risk.label} {(u.spam?.risk_score || 0) > 0 ? `(${u.spam?.risk_score}%)` : ""}
                                    </span>
                                    {u.spam?.flags && u.spam.flags.length > 0 && (
                                      <div style={{ fontSize: "0.65rem", color: "#ef4444", maxWidth: "180px" }}>
                                        {u.spam.flags.slice(0, 2).join(" · ")}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{u.credits_balance.toFixed(1)}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span>{u.tasks_count}</span>
                                  {u.spam && u.spam.failed_tasks > 0 && (
                                    <span style={{ fontSize: "0.65rem", color: "#ef4444", marginLeft: "4px" }}>({u.spam.failed_tasks} fail)</span>
                                  )}
                                </td>
                                <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{u.created_at ? formatDate(u.created_at) : "—"}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                    <button onClick={() => setEditUser({...u})} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>✏️</button>
                                    <button onClick={() => toggleUser(u.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>{u.is_active ? "🚫" : "✅"}</button>
                                    <button onClick={() => addCredits(u.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>💰+</button>
                                    {u.role !== "admin" && (
                                      <button onClick={() => deleteUser(u.id, u.username)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px", color: "#ef4444" }}>🗑️</button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <PaginationBar currentPage={page} totalPg={totalPages} count={totalUsers} onPageChange={setPage} />
                    </div>
                  </>
                )}

                {/* Activity Tab */}
                {tab === "activity" && (
                  <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: "600px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                          {["Thời gian", "User", "Loại", "Status", "Credits", "Prompt"].map(h => (
                            <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activity.map((a, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{formatDate(a.created_at)}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{a.username}</td>
                            <td style={{ padding: "10px 12px" }}>{a.task_type}</td>
                            <td style={{ padding: "10px 12px" }}><span style={{ color: STATUS_COLORS[a.status] || "#6b7280", fontWeight: 600 }}>{a.status}</span></td>
                            <td style={{ padding: "10px 12px" }}>{a.credits_cost}</td>
                            <td style={{ padding: "10px 12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{a.prompt || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Vouchers Tab */}
                {tab === "vouchers" && (
                  <>
                    <div className="glass-card" style={{ padding: "20px", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "12px" }}>➕ Tạo Voucher mới</h3>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "end" }}>
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Mã voucher</label>
                          <input value={newVoucher.code} onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})} placeholder="VD: WELCOME2026" className="form-input" style={{ width: "160px" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Credits</label>
                          <input value={newVoucher.credits_amount} onChange={(e) => setNewVoucher({...newVoucher, credits_amount: e.target.value})} placeholder="50" type="number" className="form-input" style={{ width: "100px" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Mô tả</label>
                          <input value={newVoucher.description} onChange={(e) => setNewVoucher({...newVoucher, description: e.target.value})} placeholder="Tùy chọn..." className="form-input" style={{ width: "180px" }} />
                        </div>
                        <button onClick={createVoucher} className="btn btn-primary btn-sm">🎟️ Tạo</button>
                      </div>
                    </div>
                    <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
                      {vouchers.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Chưa có voucher</div>
                      ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: "600px" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                              {["Mã", "Credits", "Mô tả", "Trạng thái", "Người dùng", "Ngày tạo", ""].map(h => (
                                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {vouchers.map((v) => (
                              <tr key={v.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={{ padding: "10px 12px", fontWeight: 700, fontFamily: "monospace", color: "var(--text-accent)" }}>{v.code}</td>
                                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#10b981" }}>+{v.credits_amount}</td>
                                <td style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{v.description || "—"}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: v.is_used ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: v.is_used ? "#ef4444" : "#10b981" }}>
                                    {v.is_used ? "Đã dùng" : "Khả dụng"}
                                  </span>
                                </td>
                                <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{v.is_used ? v.used_by_email : "—"}</td>
                                <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{formatDate(v.created_at)}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <button onClick={() => deleteVoucher(v.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>🗑️</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setEditUser(null)}>
            <div style={{ maxWidth: "400px", width: "100%", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>✏️ Sửa user</h3>
              {[
                { label: "Email", key: "email" },
                { label: "Username", key: "username" },
                { label: "Họ tên", key: "full_name" },
                { label: "Credits", key: "credits_balance" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>{f.label}</label>
                  <input
                    value={(editUser as unknown as Record<string, string | number | null>)[f.key] ?? ""}
                    onChange={(e) => setEditUser({ ...editUser, [f.key]: f.key === "credits_balance" ? parseFloat(e.target.value) || 0 : e.target.value })}
                    className="form-input" style={{ width: "100%" }}
                    type={f.key === "credits_balance" ? "number" : "text"}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Role</label>
                <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="form-input" style={{ width: "100%" }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={saveEditUser} className="btn btn-primary" style={{ flex: 1 }}>💾 Lưu</button>
                <button onClick={() => setEditUser(null)} className="btn btn-secondary" style={{ flex: 1 }}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUser && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowCreateUser(false)}>
            <div style={{ maxWidth: "420px", width: "100%", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: "28px" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px" }}>➕ Tạo tài khoản mới</h3>
              {[
                { label: "Email *", key: "email", type: "email", placeholder: "user@example.com" },
                { label: "Username *", key: "username", type: "text", placeholder: "username" },
                { label: "Mật khẩu *", key: "password", type: "password", placeholder: "Tối thiểu 6 ký tự" },
                { label: "Họ tên", key: "full_name", type: "text", placeholder: "Nguyễn Văn A" },
                { label: "Credits ban đầu", key: "credits_balance", type: "number", placeholder: "10" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>{f.label}</label>
                  <input
                    value={(newUser as unknown as Record<string, string>)[f.key] || ""}
                    onChange={(e) => setNewUser({ ...newUser, [f.key]: e.target.value })}
                    className="form-input" style={{ width: "100%" }}
                    type={f.type} placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="form-input" style={{ width: "100%" }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={createUser} className="btn btn-primary" style={{ flex: 1 }}>✅ Tạo tài khoản</button>
                <button onClick={() => setShowCreateUser(false)} className="btn btn-secondary" style={{ flex: 1 }}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </>
  );
}
