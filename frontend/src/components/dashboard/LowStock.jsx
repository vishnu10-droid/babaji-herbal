import { TriangleAlert } from "lucide-react";

export default function LowStock({ items = [], loading = false }) {
  return <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]"><p className="text-sm text-slate-500">Low stock products</p><h3 className="mb-4 text-lg font-bold text-slate-900">Action needed</h3>{loading ? <p className="py-6 text-center text-sm text-slate-400">Loading...</p> : items.length === 0 ? <p className="py-6 text-center text-sm text-slate-400">All stocked up</p> : <div className="space-y-3">{items.map((item) => <div key={item._id || item.name} className="flex items-center gap-3 rounded-xl bg-amber-50 p-3"><div className="rounded-lg bg-white p-2 text-amber-600"><TriangleAlert size={16} /></div><div><p className="text-sm font-semibold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">Only {item.stock} left</p></div></div>)}</div>}</div>;
}
