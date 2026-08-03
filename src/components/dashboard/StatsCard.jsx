import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, title, value, growth, subtitle, tone = 'emerald' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let animationFrame = 0
    const duration = 1400
    const startTime = performance.now()

    const updateValue = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * eased))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      }
    }

    animationFrame = requestAnimationFrame(updateValue)

    return () => cancelAnimationFrame(animationFrame)
  }, [value])

  const toneStyles = {
    emerald: 'from-emerald-500/20 to-emerald-400/0 text-emerald-300',
    blue: 'from-blue-500/20 to-blue-400/0 text-blue-300',
    amber: 'from-amber-500/20 to-amber-400/0 text-amber-300',
    rose: 'from-rose-500/20 to-rose-400/0 text-rose-300',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_12px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {displayValue.toLocaleString()}
          </p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${toneStyles[tone]} p-3`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-300">+{growth}%</span>
        <span className="text-slate-400">{subtitle}</span>
      </div>
    </motion.div>
  )
}
