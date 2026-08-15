export default function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-[#0B6B3A]/10 bg-white p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B6B3A]/10 text-[#0B6B3A]">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 font-semibold text-[#1B1B1B]">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  )
}
