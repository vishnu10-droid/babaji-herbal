import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const salesData = [
  { month: 'Jan', sales: 4200 },
  { month: 'Feb', sales: 4800 },
  { month: 'Mar', sales: 5300 },
  { month: 'Apr', sales: 6100 },
  { month: 'May', sales: 6600 },
  { month: 'Jun', sales: 7100 },
]

export default function SalesChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Sales Overview</p>
          <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">+18.2%</span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: 16 }}
              labelStyle={{ color: '#f8fafc' }}
            />
            <Area type="monotone" dataKey="sales" stroke="#10b981" fill="url(#salesFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
