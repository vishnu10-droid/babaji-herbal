import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function CouponsPage() {
  return (
    <AdminSectionPage title="Coupons" description="Launch promotional discounts with campaign tracking." badge="Promotions">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { code: 'SAVE10', status: 'Active', campaign: 'Spring Sale' },
          { code: 'HERBAL20', status: 'Scheduled', campaign: 'Health Week' },
        ].map((coupon) => (
          <div key={coupon.code} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-base font-semibold text-white">{coupon.code}</p>
            <p className="mt-1 text-xs text-slate-400">Campaign: {coupon.campaign}</p>
            <p className="mt-1 text-xs text-slate-400">Status: {coupon.status}</p>
          </div>
        ))}
      </div>
    </AdminSectionPage>
  )
}

