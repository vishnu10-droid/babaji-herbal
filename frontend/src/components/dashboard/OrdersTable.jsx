import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const statusStyle = { Pending: "bg-amber-100 text-amber-700", Processing: "bg-orange-100 text-orange-700", Shipped: "bg-blue-100 text-blue-700", Delivered: "bg-emerald-100 text-emerald-700", Cancelled: "bg-rose-100 text-rose-700" };

export default function OrdersTable({ orders = [], loading = false }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => orders.filter((order) => Object.values(order).some((value) => String(value ?? "").toLowerCase().includes(search.toLowerCase()))),
    [orders, search]
  );

  return <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]"><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-sm text-slate-500">Recent orders</p><h3 className="text-lg font-bold text-slate-900">Order management</h3></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order..." className="rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-2 text-sm outline-none focus:border-blue-500" /></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-blue-50 text-xs uppercase text-blue-700"><tr>{["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((head) => <th key={head} className="px-3 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">No orders yet</td></tr> : filtered.map((order, index) => <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} key={order.id} className="border-t border-blue-50 text-slate-700"><td className="px-3 py-3 font-semibold text-blue-600">#{String(order.id).slice(-6).toUpperCase()}</td><td className="px-3 py-3">{order.customer}</td><td className="max-w-[220px] truncate px-3 py-3">{order.product}</td><td className="px-3 py-3 font-semibold">₹{Number(order.amount || 0).toLocaleString("en-IN")}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[order.status] || "bg-slate-100 text-slate-600"}`}>{order.status}</span></td><td className="whitespace-nowrap px-3 py-3">{order.date ? new Date(order.date).toLocaleDateString("en-IN") : "-"}</td></motion.tr>)}</tbody></table></div></div>;
}
