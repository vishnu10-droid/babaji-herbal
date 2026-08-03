export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-xs font-semibold text-[#0B6B3A] ${className}`}>
      {children}
    </span>
  )
}
