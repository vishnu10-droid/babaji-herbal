import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function ProfilePage() {
  return (
    <AdminSectionPage title="Profile" description="Review your admin identity and access details." badge="Account">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
        Profile card preview: name, role, email, permissions, and last activity monitoring.
      </div>
    </AdminSectionPage>
  )
}
