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
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Category analytics</p>
        <h3 className="text-lg font-semibold text-slate-900">Top categories</h3>
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
              contentStyle={{ background: '#fff', borderColor: '#dbeafe', borderRadius: 16 }}
              labelStyle={{ color: '#0f172a' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
