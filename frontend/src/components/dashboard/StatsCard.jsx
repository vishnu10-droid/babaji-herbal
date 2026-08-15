import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, title, value, growth, subtitle }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => { let frame; const start = performance.now(); const tick = (now) => { const progress = Math.min((now - start) / 900, 1); setDisplayValue(Math.round(value * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [value]);
  return <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{title}</p><p className="mt-3 text-3xl font-bold text-slate-900">{displayValue.toLocaleString()}</p></div><div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon size={21} /></div></div><div className="mt-5 flex items-center justify-between text-sm"><span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600">+{growth}%</span><span className="text-slate-400">{subtitle}</span></div></motion.div>;
}
