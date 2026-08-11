import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ item }) {
  return (
    <article className="group rounded-3xl border border-[#0B6B3A]/10 bg-white p-4 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef6ef] to-[#f8f4e8] p-4">
        <img src={item.image} alt={item.name} className="h-52 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute right-3 top-3 flex gap-2">
          <button className="rounded-full bg-white/90 p-2 text-[#0B6B3A]"><Heart size={16} /></button>
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-[#F8B133] px-3 py-1 text-xs font-semibold text-[#1B1B1B]">{item.discount}% off</div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{item.category}</span>
          <span className="flex items-center gap-1 text-[#F8B133]"><Star size={14} fill="#F8B133" /> {item.rating}</span>
        </div>
        <Link to={`/product/${item.id}`} className="mt-2 block font-semibold text-[#1B1B1B] hover:text-[#0B6B3A]">{item.name}</Link>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#0B6B3A]">${item.price}</p>
            <p className="text-xs text-slate-400 line-through">${item.oldPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#0B6B3A] p-2 text-white"><ShoppingCart size={16} /></button>
            <button className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A]"><Eye size={16} /></button>
          </div>
        </div>
      </div>
    </article>
  )
}
