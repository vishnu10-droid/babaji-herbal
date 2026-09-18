import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, RefreshCw, Wallet, ReceiptIndianRupee, Truck } from "lucide-react";
import { getMyOrders } from "../../service/order.api";
import { inr, orderStatusTone } from "./UserDashboard";

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setTransactions(await getMyOrders());
    } catch (e) {
      setError(e.response?.data?.message || "Could not load transactions. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? transactions : transactions.filter((o) => o.status === filter)),
    [transactions, filter],
  );

  const totalPaid = transactions
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const savedShipping = transactions
    .filter((o) => o.status !== "Cancelled" && Number(o.shipping) === 0)
    .length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#123d2a]">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">Every payment against your orders, in one place.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A]/5 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-[#0B3B24] to-[#128a4d] p-5 text-white shadow-lg shadow-[#0B6B3A]/20">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Wallet size={19} /></span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/70">Total paid</p>
          <h3 className="mt-1 text-2xl font-bold">{loading ? "…" : inr(totalPaid)}</h3>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B6B3A]/10">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A]"><ReceiptIndianRupee size={19} /></span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Transactions</p>
          <h3 className="mt-1 text-2xl font-bold text-[#123d2a]">{loading ? "…" : transactions.length}</h3>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B6B3A]/10">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><Truck size={19} /></span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Free deliveries</p>
          <h3 className="mt-1 text-2xl font-bold text-[#123d2a]">{loading ? "…" : savedShipping}</h3>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", "Delivered", "Shipped", "Pending", "Cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              filter === f ? "bg-[#0B6B3A] text-white shadow" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-5">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Link to="/login" className="mt-4 inline-block rounded-full bg-[#0B6B3A] px-6 py-2.5 text-sm font-bold text-white">Login</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
              <CreditCard size={22} />
            </span>
            <p className="mt-3 font-bold text-slate-700">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-500">Your payments will appear here after you place an order.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-full bg-[#0B6B3A] px-6 py-2.5 text-sm font-bold text-white">Shop now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-[#0B6B3A]/25">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 font-bold text-[#0B6B3A]">
                    ₹
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">#{String(order._id).slice(-6).toUpperCase()}</p>
                    <p className="truncate text-xs text-slate-500">
                      {(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"} ·{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-[#123d2a]">{inr(order.totalAmount)}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${orderStatusTone(order.status)}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
