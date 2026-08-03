import { TriangleAlert } from 'lucide-react'

const stockItems = [
  { name: 'Neem Skin Gel', stock: 9, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' },
  { name: 'Moringa Powder', stock: 6, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80' },
  { name: 'Immunity Drops', stock: 4, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=200&q=80' },
]

export default function LowStock() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Low Stock Products</p>
        <h3 className="text-lg font-semibold text-white">Action Needed</h3>
      </div>

      <div className="space-y-3">
        {stockItems.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-slate-400">Stock: {item.stock} left</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">
              <TriangleAlert size={12} /> Warning
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
