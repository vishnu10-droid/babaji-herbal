import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function CustomersPage() {
  return (
    <AdminSectionPage title="Customers" description="Review customer insights and account activity." badge="CRM">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          { name: 'Riya Sharma', value: '1,268 orders', tag: 'VIP' },
          { name: 'Atul Joshi', value: '842 orders', tag: 'Repeat' },
          { name: 'Nina Verma', value: '410 orders', tag: 'New' },
        ].map((customer) => (
          <div key={customer.name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-sm font-semibold text-white">{customer.name}</p>
            <p className="mt-1 text-xs text-slate-400">{customer.value}</p>
            <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">{customer.tag}</span>
          </div>
        ))}
      </div>
    </AdminSectionPage>
  )
}

