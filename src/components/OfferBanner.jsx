export default function OfferBanner() {
  return (
    <section className="section-shell py-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0B6B3A] to-[#1d7d49] p-8 text-white shadow-xl">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#F8B133]">Spring wellness</p>
            <h3 className="mt-2 font-display text-3xl">Subscribe monthly and save 20%</h3>
            <p className="mt-2 max-w-xl text-sm text-white/85">Curated herbal bundles delivered monthly for balanced wellness.</p>
          </div>
          <button className="rounded-full bg-[#F8B133] px-6 py-3 font-semibold text-[#1B1B1B]">Claim Offer</button>
        </div>
      </div>
    </section>
  )
}
