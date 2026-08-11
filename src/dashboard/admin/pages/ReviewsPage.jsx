import AdminSectionPage from '../../../components/admin/AdminSectionPage'

export default function ReviewsPage() {
  return (
    <AdminSectionPage title="Reviews" description="Monitor customer sentiment and approvals." badge="Feedback">
      <div className="space-y-3">
        {[
          'Ashwagandha Capsules received a 4.9-star review with strong repeat intent.',
          'Turmeric Face Oil gained positive testimonial momentum on skin improvement.',
        ].map((review) => (
          <div key={review} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-300">
            {review}
          </div>
        ))}
      </div>
    </AdminSectionPage>
  )
}

