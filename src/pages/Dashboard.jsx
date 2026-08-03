import { motion } from 'framer-motion'
import { Package, Boxes, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import StatsCard from '../components/dashboard/StatsCard'
import SalesChart from '../components/dashboard/SalesChart'
import RevenueChart from '../components/dashboard/RevenueChart'
import PieAnalytics from '../components/dashboard/PieAnalytics'
import OrdersTable from '../components/dashboard/OrdersTable'
import TopProducts from '../components/dashboard/TopProducts'
import LowStock from '../components/dashboard/LowStock'
import QuickActions from '../components/dashboard/QuickActions'
import AdminSectionPage from '../components/admin/AdminSectionPage'

const stats = [
  { title: 'Total Products', value: 248, growth: 12.4, subtitle: 'vs last month', tone: 'emerald', icon: Package },
  { title: 'Total Categories', value: 16, growth: 8.7, subtitle: 'new segments', tone: 'blue', icon: Boxes },
  { title: 'Total Orders', value: 824, growth: 15.3, subtitle: 'fulfilled this month', tone: 'amber', icon: ShoppingCart },
  { title: 'Total Customers', value: 3156, growth: 10.8, subtitle: 'active accounts', tone: 'rose', icon: Users },
  { title: 'Revenue', value: 128450, growth: 21.9, subtitle: 'monthly net sales', tone: 'emerald', icon: DollarSign },
]

const renderSectionPage = (pathname) => {
  if (pathname === '/admin/products') {
    return (
      <AdminSectionPage title="All Products" description="Manage product inventory, pricing, and catalog visibility." badge="Catalog">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            { name: 'Ashwagandha Capsules', status: 'Active', stock: 120 },
            { name: 'Herbal Immunity Mix', status: 'Featured', stock: 76 },
            { name: 'Turmeric Face Oil', status: 'Active', stock: 58 },
          ].map((item) => (
            <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-xs text-slate-400">Status: {item.status}</p>
              <p className="mt-1 text-xs text-slate-400">Stock: {item.stock} units</p>
            </div>
          ))}
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/products/add') {
    return (
      <AdminSectionPage title="Add Product" description="Create a new herbal product for your storefront." badge="New">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Product form preview: Name, SKU, Category, Price, Inventory, SEO title, and product image fields.
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/categories') {
    return (
      <AdminSectionPage title="All Categories" description="Organize products under wellness-focused categories." badge="Structure">
        <div className="grid gap-3 md:grid-cols-3">
          {['Pain Relief', 'Weight Loss', 'Diabetes Care', 'Female Wellness', 'General Wellness', 'Sexual Wellness'].map((category) => (
            <div key={category} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white">
              {category}
            </div>
          ))}
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/categories/add') {
    return (
      <AdminSectionPage title="Add Category" description="Create a new category for your herbal inventory hierarchy." badge="Create">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Category form preview: title, slug, parent category, status, and description.
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/orders') {
    return (
      <AdminSectionPage title="Orders" description="Track order flow and fulfillment statuses." badge="Operations">
        <OrdersTable />
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/customers') {
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

  if (pathname === '/admin/coupons') {
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

  if (pathname === '/admin/reviews') {
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

  if (pathname === '/admin/banner') {
    return (
      <AdminSectionPage title="Banner Manager" description="Update hero banners and seasonal landing visuals." badge="Marketing">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Banner campaign setup preview: Desktop image, mobile image, CTA copy, and placement status.
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/media') {
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

  if (pathname.startsWith('/admin/reports')) {
    return (
      <AdminSectionPage title="Reports" description="Review sales, customer, and product performance summaries." badge="Analytics">
        <div className="grid gap-4 xl:grid-cols-2">
          <SalesChart />
          <RevenueChart />
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/settings') {
    return (
      <AdminSectionPage title="Settings" description="Manage your operational preferences and platform controls." badge="Config">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Store settings preview: policy, tax, shipping, inventory sync, and notification preferences.
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/profile') {
    return (
      <AdminSectionPage title="Profile" description="Review your admin identity and access details." badge="Account">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Profile card preview: name, role, email, permissions, and last activity monitoring.
        </div>
      </AdminSectionPage>
    )
  }

  if (pathname === '/admin/logout') {
    return (
      <AdminSectionPage title="Logout" description="Signed out successfully from Babaji Herbals admin." badge="Session">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
          Logout action placeholder ready to integrate with authentication.
        </div>
      </AdminSectionPage>
    )
  }

  return null
}

export default function Dashboard() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 p-3 md:p-5"
          >
            {pathname === '/admin' || pathname === '/admin/' ? (
              <>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
                  <SalesChart />
                  <PieAnalytics />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <RevenueChart />
                  <QuickActions />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                  <OrdersTable />
                  <div className="space-y-4">
                    <TopProducts />
                    <LowStock />
                  </div>
                </div>
              </>
            ) : (
              renderSectionPage(pathname)
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}
