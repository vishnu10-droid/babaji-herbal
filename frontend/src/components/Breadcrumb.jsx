import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="section-shell flex flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden py-3 text-[13px] text-slate-600 sm:py-5 sm:text-sm">
      <Link to="/" className="shrink-0 hover:text-[#0B6B3A]">Home</Link>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 items-center gap-2">
          <ChevronRight size={14} className="shrink-0" />
          {item.to ? (
            <Link to={item.to} className="truncate hover:text-[#0B6B3A]">{item.label}</Link>
          ) : (
            <span className="truncate">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
