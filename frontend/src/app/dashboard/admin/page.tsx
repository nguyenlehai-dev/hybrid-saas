"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vpspanel.io.vn";

interface Stats { total_users: number; active_users_today: number; total_tasks: number; tasks_today: number; total_credits_spent: number; credits_spent_today: number; pending_orders: number; }
interface UserItem { id: string; email: string; username: string; full_name: string | null; role: string; is_active: boolean; credits_balance: number; last_login_at: string | null; created_at: string; tasks_count: number; total_spent: number; }
interface Activity { user_email: string; username: string; task_id: string; task_type: string; status: string; credits_cost: number; prompt: string | null; created_at: string; }
interface OrderItem { id: string; order_code: string; user_email: string; username: string; plan_name: string; amount_vnd: number; credits_amount: number; status: string; transfer_content: string; created_at: string; }
interface VoucherItem { id: string; code: string; credits_amount: number; description: string | null; is_used: boolean; used_by_email: string | null; used_at: string | null; created_at: string; }

const STATUS_COLORS: Record<string, string> = { completed: "#10b981", failed: "#ef4444", queued: "#f59e0b", processing: "#3b82f6" };

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
  const PER_PAGE = 10;
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [newVoucher, setNewVoucher] = useState({ code: "", credits_amount: "", description: "" });
  const [editUser, setEditUser] = useState<UserItem | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { if (!token) { window.location.href = "/login"; return; } setPage(1); fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      if (tab === "overview") {
        const res = await fetch(`${API_URL}/admin/stats`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        setStats(await res.json());
        // Also fetch pending orders
        const ordRes = await fetch(`${API_URL}/admin/orders?status=pending`, { headers });
        setOrders(await ordRes.json());
      }
      if (tab === "users") {
        const res = await fetch(`${API_URL}/admin/users?per_page=50${search ? `&search=${search}` : ""}`, { headers });
        if (res.status === 403) { setError("⛔ Bạn không có quyền admin"); setLoading(false); return; }
        const ud = await res.json();
        setUsers(ud.users || []);
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

  const paginate = <T,>(items: T[]) => {
    const total = Math.ceil(items.length / PER_PAGE);
    const start = (page - 1) * PER_PAGE;
    return { data: items.slice(start, start + PER_PAGE), total, count: items.length };
  };

  const PaginationBar = ({ total, count }: { total: number; count: number }) => total <= 1 ? null : (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--border-color)", fontSize: "0.8rem" }}>
      <span style={{ color: "var(--text-muted)" }}>Trang {page}/{total} ({count} mục)</span>
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px", opacity: page <= 1 ? 0.4 : 1 }}>← Trước</button>
        <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page >= total} className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px", opacity: page >= total ? 0.4 : 1 }}>Sau →</button>
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
                <button key={t} onClick={() => setTab(t)}
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

                    {/* Pending orders on overview */}
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
                              {paginate(orders).data.map((o) => (
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
                          <PaginationBar total={paginate(orders).total} count={paginate(orders).count} />
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
                          {paginate(orders).data.map((o) => (
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
                    <PaginationBar total={paginate(orders).total} count={paginate(orders).count} />
                  </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                  <>
                    <div style={{ marginBottom: "16px" }}>
                      <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchData()} placeholder="🔍 Tìm theo email hoặc username..." className="form-input" style={{ maxWidth: "400px" }} />
                    </div>
                    <div className="glass-card" style={{ padding: 0, overflow: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: "700px" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            {["User", "Role", "Status", "Credits", "Tasks", "Hành động"].map(h => (
                              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginate(users).data.map((u) => (
                            <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                              <td style={{ padding: "10px 12px" }}><div style={{ fontWeight: 600 }}>{u.username}</div><div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{u.email}</div></td>
                              <td style={{ padding: "10px 12px" }}><span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: u.role === "admin" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)", color: u.role === "admin" ? "#f59e0b" : "#3b82f6" }}>{u.role}</span></td>
                              <td style={{ padding: "10px 12px" }}><span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, background: u.is_active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: u.is_active ? "#10b981" : "#ef4444" }}>{u.is_active ? "Active" : "Banned"}</span></td>
                              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{u.credits_balance.toFixed(1)}</td>
                              <td style={{ padding: "10px 12px" }}>{u.tasks_count}</td>
                              <td style={{ padding: "10px 12px" }}>
                                <div style={{ display: "flex", gap: "4px" }}>
                                  <button onClick={() => setEditUser({...u})} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>✏️ Sửa</button>
                                  <button onClick={() => toggleUser(u.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>{u.is_active ? "🚫" : "✅"}</button>
                                  <button onClick={() => addCredits(u.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>💰+</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PaginationBar total={paginate(users).total} count={paginate(users).count} />
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
                        {paginate(activity).data.map((a, i) => (
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
                    <PaginationBar total={paginate(activity).total} count={paginate(activity).count} />
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
                            {paginate(vouchers).data.map((v) => (
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
                      <PaginationBar total={paginate(vouchers).total} count={paginate(vouchers).count} />
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
      </>

  );
}
