import { motion } from 'framer-motion'
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
import { stats } from './admin/data/stats'
import { renderSectionPage } from './admin/routes/sectionRoutes.jsx'

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
