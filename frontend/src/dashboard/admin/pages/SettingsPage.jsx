import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function SettingsPage() {
  return (
    <AdminSectionPage title="Settings" description="Manage your operational preferences and platform controls." badge="Config">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
        Store settings preview: policy, tax, shipping, inventory sync, and notification preferences.
      </div>
    </AdminSectionPage>
  )
}
