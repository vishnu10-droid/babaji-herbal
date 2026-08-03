import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const chartData = [
  { name: 'Pain Relief', value: 26 },
  { name: 'Weight Loss', value: 21 },
  { name: 'Diabetes Care', value: 18 },
  { name: 'General Wellness', value: 17 },
  { name: 'Female Wellness', value: 18 },
]

const colors = ['#10b981', '#34d399', '#38bdf8', '#f59e0b', '#f87171']

export default function PieAnalytics() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4">
        <p className="text-sm text-slate-400">Category Analytics</p>
        <h3 className="text-lg font-semibold text-white">Top Categories</h3>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: 16 }}
              labelStyle={{ color: '#f8fafc' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
