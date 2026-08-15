import Button from './Button'

export default function Newsletter() {
  return (
    <section className="section-shell py-14">
      <div className="rounded-4xl bg-linear-to-r from-[#0B6B3A] to-[#1d7d49] p-8 text-center text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F8B133]">Newsletter</p>
        <h2 className="mt-2 font-display text-3xl">Join our herbal circle</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80">Get wellness tips, offers, and first access to new natural bundles every month.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <input type="email" placeholder="Enter your email" className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none" />
          <Button variant="secondary" className="rounded-full">Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
