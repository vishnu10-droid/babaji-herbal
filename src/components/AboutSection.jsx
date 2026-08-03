import { Leaf, ShieldCheck, Truck } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-4xl bg-linear-to-br from-[#0B6B3A] to-[#145f35] p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F8B133]">Our Story</p>
          <h2 className="mt-3 font-display text-3xl">Nature-led wellness for modern living</h2>
          <p className="mt-4 text-sm text-white/80">Babaji Herbals brings traditional Ayurveda and modern extraction methods together to create daily rituals of balance and vitality.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <Leaf className="text-[#0B6B3A]" />
            <h3 className="mt-3 font-semibold">Mission</h3>
            <p className="mt-2 text-sm text-slate-600">Blending purity with premium care in every bottle.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <ShieldCheck className="text-[#0B6B3A]" />
            <h3 className="mt-3 font-semibold">Vision</h3>
            <p className="mt-2 text-sm text-slate-600">To build trustworthy herbal wellness for every home.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <Truck className="text-[#0B6B3A]" />
            <h3 className="mt-3 font-semibold">Impact</h3>
            <p className="mt-2 text-sm text-slate-600">On-time delivery and dependable natural quality.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
