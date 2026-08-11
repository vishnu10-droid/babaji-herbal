import AdminSectionPage from '../../../components/admin/AdminSectionPage'
import SalesChart from '../../../components/dashboard/SalesChart'
import RevenueChart from '../../../components/dashboard/RevenueChart'

export default function ReportsPage() {
  return (
    <AdminSectionPage title="Reports" description="Review sales, customer, and product performance summaries." badge="Analytics">
      <div className="grid gap-4 xl:grid-cols-2">
        <SalesChart />
        <RevenueChart />
      </div>
    </AdminSectionPage>
  )
}
