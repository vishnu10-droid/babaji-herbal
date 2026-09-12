import { motion } from 'framer-motion'

export default function AdminSectionPage({ title, description, badge, action, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_14px_35px_rgba(15,61,42,0.07)]">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-50" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">{badge}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {action}
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </motion.section>
  )
}
