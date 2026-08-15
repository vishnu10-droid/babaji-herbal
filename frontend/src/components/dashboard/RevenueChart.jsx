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
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Revenue chart</p>
          <h3 className="text-lg font-semibold text-slate-900">Monthly growth</h3>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">Live</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: '#fff', borderColor: '#dbeafe', borderRadius: 16 }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
