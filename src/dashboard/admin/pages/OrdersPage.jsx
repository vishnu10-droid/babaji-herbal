import AdminSectionPage from '../../../components/admin/AdminSectionPage'
import OrdersTable from '../../../components/dashboard/OrdersTable'

export default function OrdersPage() {
  return (
    <AdminSectionPage title="Orders" description="Track order flow and fulfillment statuses." badge="Operations">
      <OrdersTable />
    </AdminSectionPage>
  )
}

