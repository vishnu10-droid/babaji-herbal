import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import StatsCard from "../components/dashboard/StatsCard";
import SalesChart from "../components/dashboard/SalesChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import PieAnalytics from "../components/dashboard/PieAnalytics";
import OrdersTable from "../components/dashboard/OrdersTable";
import TopProducts from "../components/dashboard/TopProducts";
import LowStock from "../components/dashboard/LowStock";
import QuickActions from "../components/dashboard/QuickActions";
import { stats } from "./admin/data/stats";
import { renderSectionPage } from "./admin/routes/sectionRoutes.jsx";

export default function Dashboard() {
  const pathname = useLocation().pathname;
  return (
    <div className="min-h-screen bg-[#f4f8ff] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-5 p-3 md:p-6"
          >
            {pathname === "/admin" || pathname === "/admin/" ? (
              <>
                <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-500 p-6 text-white shadow-xl shadow-blue-600/15">
                  <p className="text-sm text-blue-100">Welcome back</p>
                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    Store overview
                  </h1>
                  <p className="mt-2 text-sm text-blue-100">
                    Track your wellness store performance from one place.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                  ))}
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
                  <SalesChart />
                  <PieAnalytics />
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                  <RevenueChart />
                  <QuickActions />
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                  <OrdersTable />
                  <div className="space-y-5">
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
  );
}
