import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="section-shell flex items-center gap-2 py-5 text-sm text-slate-600">
      <Link to="/" className="hover:text-[#0B6B3A]">Home</Link>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <ChevronRight size={14} />
          {item.to ? (
            <Link to={item.to} className="hover:text-[#0B6B3A]">{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
