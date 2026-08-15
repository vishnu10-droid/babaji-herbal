export default function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-[#1B1B1B] sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
    </div>
  )
}
