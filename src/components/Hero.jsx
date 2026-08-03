import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Star } from 'lucide-react'
import Button from './Button'

export default function Hero() {
  return (
    <section className="section-shell relative overflow-hidden py-10 lg:py-16">
      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-4 inline-flex rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-xs font-semibold text-[#0B6B3A]">
            Nature-inspired wellness
          </div>
          <h1 className="font-display text-5xl font-semibold leading-tight text-[#1B1B1B] lg:text-6xl">
            Suitable Ingredient For Acne-Prone Skin
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Premium herbal remedies for calm skin, stronger immunity, and deeply nourishing everyday rituals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-full px-6 py-3">
              Shop Now <ArrowRight className="ml-2" size={16} />
            </Button>
            <Button variant="ghost" className="rounded-full px-6 py-3">Explore Wellness</Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-700">
            <div className="flex items-center gap-1 text-[#F8B133]">
              <Star size={16} fill="#F8B133" /> <Star size={16} fill="#F8B133" /> <Star size={16} fill="#F8B133" /> <Star size={16} fill="#F8B133" /> <Star size={16} fill="#F8B133" />
            </div>
            <span>4.9 rating from 1,200+ customers</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative rounded-4xl bg-linear-to-br from-[#0B6B3A] to-[#124e2e] p-6 text-white shadow-2xl">
          <div className="absolute -left-4 top-6 rounded-full bg-[#F8B133] px-3 py-1 text-xs font-bold text-[#1B1B1B]">20% OFF</div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Organic CBD</span>
                <Leaf size={18} className="text-[#F8B133]" />
              </div>
              <div className="mt-4 h-48 rounded-2xl bg-[radial-gradient(circle_at_top,#ffffff,#bdd4c8)] shadow-inner" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 text-sm">24h delivery</div>
              <div className="rounded-2xl bg-white/10 p-4 text-sm">FDA approved</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
