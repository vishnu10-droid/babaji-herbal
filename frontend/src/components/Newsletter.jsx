import Button from './Button'

export default function Newsletter() {
  return (
    <section className="section-shell overflow-hidden py-8 sm:py-14">
      <div className="rounded-3xl bg-linear-to-r from-[#0B6B3A] to-[#1d7d49] p-5 text-center text-white shadow-xl sm:rounded-4xl sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#F8B133] sm:text-xs sm:tracking-[0.3em]">Newsletter</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Join our herbal circle</h2>
        <p className="mx-auto mt-2 max-w-2xl text-[13px] text-white/80 sm:mt-3 sm:text-sm">Get wellness tips, offers, and first access to new natural bundles every month.</p>
        <div className="mx-auto mt-5 flex max-w-md flex-col justify-center gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
          <input type="email" placeholder="Enter your email" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-base text-white placeholder:text-sm placeholder:text-white/60 focus:outline-none sm:rounded-full sm:py-3" />
          <Button variant="secondary" className="shrink-0 rounded-xl py-3.5 sm:rounded-full">Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
