import { useState, useEffect } from 'react'
import { Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react'

const stats = [
  { label: 'Happy Customers', value: 12000, icon: Sparkles },
  { label: 'Natural Products', value: 250, icon: Leaf },
  { label: 'Protected Delivery', value: 98, icon: Truck },
  { label: 'Quality Assurance', value: 100, icon: ShieldCheck },
]

export default function StatsSection() {
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="section-shell py-14">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-3xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B6B3A]/10 text-[#0B6B3A]">
                <Icon size={24} />
              </div>
              <p className="mt-4 text-3xl font-bold text-[#0B6B3A]">
                {counted ? `${item.value}${item.value === 98 ? '%' : '+'}` : '0'}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
