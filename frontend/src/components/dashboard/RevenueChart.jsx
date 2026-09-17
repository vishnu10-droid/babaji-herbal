import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function RevenueChart({ data = [], loading = false }) {
  const total = data.reduce((sum, m) => sum + Number(m.revenue || 0), 0);
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Revenue chart</p>
          <h3 className="text-lg font-semibold text-slate-900">Monthly growth</h3>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">{loading ? "Loading..." : `₹${total.toLocaleString("en-IN")}`}</span>
      </div>
      <div className="h-64 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No revenue yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ background: '#fff', borderColor: '#dbeafe', borderRadius: 16 }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Line type="monotone" dataKey="revenue" name="Revenue ₹" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
