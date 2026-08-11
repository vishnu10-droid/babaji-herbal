import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function MediaPage() {
  return (
    <AdminSectionPage title="Media Gallery" description="Browse uploaded product photography and brand assets." badge="Assets">
      <div className="grid gap-3 md:grid-cols-3">
        {['Product Shots', 'Ingredient Closeups', 'Packaging', 'Lifestyle Hero'].map((asset) => (
          <div key={asset} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white">{asset}</div>
        ))}
      </div>
    </AdminSectionPage>
  )
}
