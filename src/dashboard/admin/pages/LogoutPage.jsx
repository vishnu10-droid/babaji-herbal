import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function LogoutPage() {
  return (
    <AdminSectionPage title="Logout" description="Signed out successfully from Babaji Herbals admin." badge="Session">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
        Logout action placeholder ready to integrate with authentication.
      </div>
    </AdminSectionPage>
  )
}
