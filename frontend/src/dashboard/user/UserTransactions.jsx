import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, RefreshCw } from "lucide-react";
import { getMyOrders } from "../../service/order.api";
import { orderStatusTone } from "./UserDashboard";

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalPaid = transactions
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">Every payment against your orders, in one place.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Total transactions</p>
          <h3 className="mt-2 text-2xl font-bold">{loading ? "…" : transactions.length}</h3>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Total paid</p>
          <h3 className="mt-2 text-2xl font-bold">₹{totalPaid.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <Link to="/login" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Login</Link>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <CreditCard size={22} />
            </span>
            <p className="mt-3 font-semibold text-slate-700">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-500">Your payments will appear here after you place an order.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Shop now</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                  <th className="pb-4">Transaction / Order</th>
                  <th className="pb-4">Items</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((order) => (
                  <tr key={order._id} className="border-b border-slate-50 text-sm last:border-0">
                    <td className="py-4 font-semibold text-slate-900">#{String(order._id).slice(-6).toUpperCase()}</td>
                    <td className="max-w-[200px] truncate py-4 text-slate-500">
                      {(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}
                    </td>
                    <td className="py-4 text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="py-4 font-semibold">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusTone(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
