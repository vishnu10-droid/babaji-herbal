import { PlusCircle, Tag, ImagePlus, PackagePlus } from 'lucide-react'

const actions = [
  { label: 'Add Product', icon: PackagePlus },
  { label: 'Add Category', icon: PlusCircle },
  { label: 'Create Coupon', icon: Tag },
  { label: 'Add Banner', icon: ImagePlus },
]

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Quick Actions</p>
        <h3 className="text-lg font-semibold text-white">Speed Tasks</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/15 bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 px-4 py-3 text-left text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.14)]"
            >
              <span className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                <Icon size={16} />
              </span>
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
