import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const initialOrders = [
  { id: '#ORD-1042', customer: 'Riya Sharma', product: 'Ashwagandha Capsules', amount: '$148.00', status: 'Pending', date: '2026-04-03' },
  { id: '#ORD-1043', customer: 'Karan Patel', product: 'Herbal Oil', amount: '$84.00', status: 'Processing', date: '2026-04-03' },
  { id: '#ORD-1044', customer: 'Nina Verma', product: 'Weight Loss Mix', amount: '$240.00', status: 'Shipped', date: '2026-04-02' },
  { id: '#ORD-1045', customer: 'Atul Joshi', product: 'Diabetes Care Pack', amount: '$192.00', status: 'Delivered', date: '2026-04-01' },
  { id: '#ORD-1046', customer: 'Sneha Iyer', product: 'Turmeric Drops', amount: '$72.00', status: 'Cancelled', date: '2026-03-29' },
]

const statusStyles = {
  Pending: 'bg-amber-500/15 text-amber-300',
  Processing: 'bg-orange-500/15 text-orange-300',
  Shipped: 'bg-blue-500/15 text-blue-300',
  Delivered: 'bg-emerald-500/15 text-emerald-300',
  Cancelled: 'bg-rose-500/15 text-rose-300',
}

export default function OrdersTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return initialOrders.filter((order) => {
      const q = search.toLowerCase()
      return [order.id, order.customer, order.product, order.status].some((field) => field.toLowerCase().includes(q))
    })
  }, [search])

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_10px_35px_rgba(2,6,23,0.45)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Recent Orders</p>
          <h3 className="text-lg font-semibold text-white">Order Management</h3>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order..."
          className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-3 font-medium">Order ID</th>
              <th className="px-3 py-3 font-medium">Customer</th>
              <th className="px-3 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Amount</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-slate-800 text-slate-200">
                <td className="px-3 py-3 font-medium text-emerald-300">{order.id}</td>
                <td className="px-3 py-3">{order.customer}</td>
                <td className="px-3 py-3">{order.product}</td>
                <td className="px-3 py-3">{order.amount}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-3">{order.date}</td>
                <td className="px-3 py-3">
                  <button className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:text-emerald-300">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>Showing {filtered.length} results</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border border-slate-800 p-2">
            <ChevronLeft size={16} />
          </button>
          <span className="rounded-xl bg-slate-800 px-3 py-2 text-white">{page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-slate-800 p-2">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
