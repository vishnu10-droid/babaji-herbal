import { motion } from 'framer-motion'

const products = [
  { name: 'Ashwagandha Capsules', sold: 312, progress: 85, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=200&q=80' },
  { name: 'Turmeric Face Oil', sold: 284, progress: 72, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80' },
  { name: 'Herbal Immunity Mix', sold: 261, progress: 66, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' },
]

export default function TopProducts() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Top Selling Products</p>
        <h3 className="text-lg font-semibold text-white">Best Performers</h3>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3"
          >
            <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{product.name}</span>
                <span className="text-xs text-slate-400">{product.sold} sold</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${product.progress}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
