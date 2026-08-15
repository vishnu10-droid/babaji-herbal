import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function BannerPage() {
  return (
    <AdminSectionPage title="Banner Manager" description="Update hero banners and seasonal landing visuals." badge="Marketing">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
        Banner campaign setup preview: Desktop image, mobile image, CTA copy, and placement status.
      </div>
    </AdminSectionPage>
  )
}
