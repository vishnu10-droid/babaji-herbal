import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 13000 },
  { month: 'Feb', revenue: 16800 },
  { month: 'Mar', revenue: 19400 },
  { month: 'Apr', revenue: 22200 },
  { month: 'May', revenue: 24800 },
  { month: 'Jun', revenue: 28600 },
]

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Revenue Chart</p>
          <h3 className="text-lg font-semibold text-white">Monthly Growth</h3>
        </div>
        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">Live</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: 16 }}
              labelStyle={{ color: '#f8fafc' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
