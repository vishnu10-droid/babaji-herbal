import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const colors = ['#10b981', '#34d399', '#38bdf8', '#f59e0b', '#f87171']

export default function PieAnalytics({ data = [], loading = false }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Category analytics</p>
        <h3 className="text-lg font-semibold text-slate-900">Revenue by category</h3>
      </div>

      <div className="h-72 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No sales yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', borderColor: '#dbeafe', borderRadius: 16 }}
                labelStyle={{ color: '#0f172a' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
