"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.nulith.io.vn";

interface Plan { id: string; name: string; slug: string; description: string | null; price_vnd: number; credits_amount: number; features: Record<string, any>; is_popular: boolean; }
interface Order { id: string; order_code: string; plan_name: string; amount_vnd: number; credits_amount: number; status: string; transfer_content: string; qr_url: string; created_at: string; }
interface Transaction { id: string; amount: number; balance_after: number; type: string; description: string | null; created_at: string; }

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  pending: { color: "#f59e0b", label: "⏳ Chờ duyệt" },
  approved: { color: "#10b981", label: "✅ Đã duyệt" },
  rejected: { color: "#ef4444", label: "❌ Từ chối" },
};

export default function CreditsPage() {
  const [balance, setBalance] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrOrder, setQrOrder] = useState<Order | null>(null);
  const [purchasing, setPurchasing] = useState("");
  const [tab, setTab] = useState<"plans" | "orders" | "history">("plans");
  const [approved, setApproved] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMsg, setVoucherMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!token) { window.location.href = "/login"; return; }
    // Handle SePay callback
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      if (payment === "success") {
        setPaymentMsg("🎉 Thanh toán thành công! Credits sẽ được cộng tự động.");
        setTab("orders");
        window.history.replaceState({}, "", "/dashboard/credits");
      } else if (payment === "error") {
        setPaymentMsg("❌ Thanh toán thất bại. Vui lòng thử lại.");
        window.history.replaceState({}, "", "/dashboard/credits");
      } else if (payment === "cancel") {
        setPaymentMsg("⚠️ Thanh toán đã bị hủy.");
        window.history.replaceState({}, "", "/dashboard/credits");
      }
    }
    fetchAll();
  }, [tab]);

  // Auto-poll order status when QR modal is open
  useEffect(() => {
    if (!qrOrder || qrOrder.status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/credits/orders`, { headers });
        const orders: Order[] = await res.json();
        const updated = orders.find((o: Order) => o.order_code === qrOrder.order_code);
        if (updated && updated.status === "approved") {
          setQrOrder({ ...qrOrder, status: "approved" });
          setApproved(true);
          // Refresh balance
          const balRes = await fetch(`${API_URL}/credits/balance`, { headers });
          const balData = await balRes.json();
          setBalance(balData.credits_balance || 0);
          clearInterval(interval);
          setTimeout(() => { setApproved(false); setQrOrder(null); }, 4000);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [qrOrder]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [balRes, planRes] = await Promise.all([
        fetch(`${API_URL}/credits/balance`, { headers }),
        fetch(`${API_URL}/credits/plans`, { headers }),
      ]);
      setBalance((await balRes.json()).credits_balance || 0);
      setPlans(await planRes.json());

      if (tab === "orders") {
        const ordRes = await fetch(`${API_URL}/credits/orders`, { headers });
        setOrders(await ordRes.json());
      }
      if (tab === "history") {
        const txRes = await fetch(`${API_URL}/credits/history?per_page=20`, { headers });
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handlePurchase = async (slug: string) => {
    setPurchasing(slug);
    try {
      const res = await fetch(`${API_URL}/credits/purchase`, {
        method: "POST", headers, body: JSON.stringify({ plan_slug: slug }),
      });
      const data = await res.json();
      if (res.ok) {
        setQrOrder({
          id: data.order_id, order_code: data.order_code,
          plan_name: data.plan_name, amount_vnd: data.amount_vnd,
          credits_amount: data.credits_amount, status: "pending",
          transfer_content: data.transfer_content, qr_url: data.qr_url,
          created_at: new Date().toISOString(),
        });
      } else {
        alert(data.detail || "Lỗi tạo đơn hàng");
      }
    } catch { alert("Lỗi kết nối"); }
    setPurchasing("");
  };

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";
  const formatDate = (s: string) => new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });


  return (
    <>
        <div className="page-header">
          <div>
            <h1>💰 Credits</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Mua credits và quản lý giao dịch</p>
          </div>
        </div>

        {/* Balance */}
        <div className="glass-card" style={{ padding: "28px", marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Số dư hiện tại</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {balance.toFixed(2)} <span style={{ fontSize: "1rem" }}>credits</span>
          </div>
          {balance <= 0 && (
            <div style={{ marginTop: "12px", padding: "10px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", color: "var(--error)", fontSize: "0.8rem" }}>
              ⚠️ Hết credits! Mua thêm gói bên dưới.
            </div>
          )}
        </div>

        {/* Voucher Redeem */}
        <div className="glass-card" style={{ padding: "16px 20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>🎟️ Có mã voucher?</span>
            <input
              value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã voucher..." className="form-input"
              style={{ flex: 1, minWidth: "140px", maxWidth: "220px" }}
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("btn-redeem")?.click()}
            />
            <button id="btn-redeem" className="btn btn-primary btn-sm" disabled={!voucherCode.trim()} onClick={async () => {
              setVoucherMsg(null);
              try {
                const res = await fetch(`${API_URL}/credits/redeem-voucher`, {
                  method: "POST", headers, body: JSON.stringify({ code: voucherCode.trim() }),
                });
                const data = await res.json();
                if (res.ok) {
                  setVoucherMsg({ type: "success", text: data.message });
                  setVoucherCode(""); setBalance(data.new_balance);
                } else {
                  setVoucherMsg({ type: "error", text: data.detail });
                }
              } catch { setVoucherMsg({ type: "error", text: "Lỗi kết nối" }); }
            }}>Đổi mã</button>
          </div>
          {voucherMsg && (
            <div style={{ marginTop: "8px", padding: "8px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, background: voucherMsg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: voucherMsg.type === "success" ? "#10b981" : "#ef4444" }}>
              {voucherMsg.text}
            </div>
          )}
        </div>

        {/* Payment Result */}
        {paymentMsg && (
          <div style={{ padding: "14px 20px", marginBottom: "16px", borderRadius: "10px", background: paymentMsg.includes("thành công") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: paymentMsg.includes("thành công") ? "#10b981" : "#ef4444", fontSize: "0.9rem", fontWeight: 600 }} onClick={() => setPaymentMsg("")}>
            {paymentMsg}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {(["plans", "orders", "history"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} btn-sm`}>
              {t === "plans" ? "🛒 Mua Credits" : t === "orders" ? "📋 Đơn hàng" : "📜 Lịch sử"}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>⏳ Đang tải...</div>
        ) : (
          <>
            {/* Plans */}
            {tab === "plans" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                {plans.map((plan) => (
                  <div key={plan.id} className="glass-card" style={{
                    padding: "24px", position: "relative", overflow: "hidden",
                    border: plan.is_popular ? "2px solid var(--accent-primary)" : undefined,
                  }}>
                    {plan.is_popular && (
                      <div style={{ position: "absolute", top: 12, right: -30, background: "var(--accent-gradient)", color: "#fff", padding: "4px 40px", fontSize: "0.7rem", fontWeight: 700, transform: "rotate(45deg)" }}>HOT</div>
                    )}
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>{plan.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>{plan.description}</div>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-accent)" }}>
                      {plan.credits_amount} <span style={{ fontSize: "0.8rem", fontWeight: 400 }}>credits</span>
                    </div>
                    <div style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "20px" }}>{formatVND(plan.price_vnd)}</div>
                    <button onClick={() => handlePurchase(plan.slug)} disabled={purchasing === plan.slug}
                      className={`btn ${plan.is_popular ? "btn-primary" : "btn-secondary"}`} style={{ width: "100%" }}>
                      {purchasing === plan.slug ? "⏳..." : "💳 Mua ngay"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Orders */}
            {tab === "orders" && (
              <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                {orders.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Chưa có đơn hàng nào</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                        {["Mã đơn", "Gói", "Số tiền", "Credits", "Trạng thái", "Thời gian", ""].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
                        return (
                          <tr key={o.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{o.order_code}</td>
                            <td style={{ padding: "10px 12px" }}>{o.plan_name}</td>
                            <td style={{ padding: "10px 12px" }}>{formatVND(o.amount_vnd)}</td>
                            <td style={{ padding: "10px 12px" }}>{o.credits_amount}</td>
                            <td style={{ padding: "10px 12px" }}><span style={{ color: st.color, fontWeight: 600 }}>{st.label}</span></td>
                            <td style={{ padding: "10px 12px", fontSize: "0.75rem" }}>{formatDate(o.created_at)}</td>
                            <td style={{ padding: "10px 12px" }}>
                              {o.status === "pending" && (
                                <button onClick={() => setQrOrder(o)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>📱 QR</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* History */}
            {tab === "history" && (
              <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                {transactions.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Chưa có giao dịch nào</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                        {["Thời gian", "Mô tả", "Số lượng", "Số dư"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "10px 12px" }}>{formatDate(tx.created_at)}</td>
                          <td style={{ padding: "10px 12px" }}>{tx.description}</td>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: tx.amount > 0 ? "var(--success)" : "var(--error)" }}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                          </td>
                          <td style={{ padding: "10px 12px" }}>{tx.balance_after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {/* QR Modal - SePay Style */}
        {qrOrder && (() => {
          const sepayQR = `https://qr.sepay.vn/img?acc=109873538727&bank=VietinBank&amount=${qrOrder.amount_vnd}&des=${encodeURIComponent(qrOrder.transfer_content)}&template=compact`;
          const vietQR = qrOrder.qr_url;
          return (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }} onClick={() => setQrOrder(null)}>
            <div style={{ maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#1a1d23", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>💳</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Nạp Credits qua chuyển khoản</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginLeft: "38px" }}>
                  Gói {qrOrder.plan_name} • +{qrOrder.credits_amount} credits
                </div>
              </div>

              {/* QR Code */}
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "12px", display: "inline-block", marginBottom: "12px" }}>
                  <img
                    src={sepayQR}
                    alt="QR Code"
                    style={{ width: "220px", height: "220px" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = vietQR; }}
                  />
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  <a href={sepayQR} download style={{ color: "#06b6d4", textDecoration: "none" }}>⬇ Tải ảnh QR</a>
                </div>
              </div>

              {/* Bank Info Table */}
              <div style={{ margin: "0 24px 16px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  ["Ngân hàng", "VietinBank"],
                  ["Số TK", "109873538727"],
                  ["Số tiền", formatVND(qrOrder.amount_vnd)],
                  ["Nội dung CK", qrOrder.transfer_content],
                  ["Credits", `+${qrOrder.credits_amount}`],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{label}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: label === "Số tiền" ? "#f59e0b" : label === "Credits" ? "#10b981" : label === "Nội dung CK" ? "#f87171" : "#e2e8f0", display: "flex", alignItems: "center", gap: "6px" }}>
                      {value}
                      {label === "Nội dung CK" && (
                        <button onClick={() => { navigator.clipboard.writeText(value); alert("Đã copy!"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#64748b", padding: "2px" }}>📋</button>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ margin: "0 24px 16px" }}>
                {qrOrder.status === "approved" ? (
                  <div style={{ padding: "12px", background: "rgba(16,185,129,0.1)", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🎉</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#10b981" }}>Thanh toán thành công!</div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>+{qrOrder.credits_amount} credits đã được cộng</div>
                  </div>
                ) : (
                  <div style={{ padding: "10px 16px", background: "linear-gradient(90deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(6,182,212,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.82rem", color: "#06b6d4" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                      Tự động kiểm tra • Đang chờ thanh toán
                    </div>
                    <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div style={{ padding: "0 24px 20px" }}>
                <button onClick={() => setQrOrder(null)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                  {qrOrder.status === "approved" ? "✅ Đóng" : "Đóng"}
                </button>
              </div>
            </div>
          </div>
          );
        })()}
    </>
  );
}
