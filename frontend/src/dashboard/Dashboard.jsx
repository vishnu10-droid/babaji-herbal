import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Leaf,
  Sparkles,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { getDashboardStats } from "../service/admin.api";
import { renderSectionPage } from "./admin/routes/sectionRoutes.jsx";

export default function Dashboard() {
  const pathname = useLocation().pathname;
  const isHome = pathname === "/admin" || pathname === "/admin/";

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!isHome) return;
    setStatsLoading(true);
    getDashboardStats()
      .then(setStats)
      .catch((e) =>
        setStatsError(
          e.response?.data?.message || "Could not load dashboard data.",
        ),
      )
      .finally(() => setStatsLoading(false));
  }, [isHome]);

  const cards = stats
    ? [
        {
          title: "Total Products",
          value: stats.products,
          growth: null,
          subtitle: "live count",
          tone: "emerald",
          icon: Package,
        },
        {
          title: "Total Categories",
          value: stats.categories,
          growth: null,
          subtitle: "live count",
          tone: "blue",
          icon: Boxes,
        },
        {
          title: "Total Orders",
          value: stats.orders,
          growth: null,
          subtitle: "all time",
          tone: "amber",
          icon: ShoppingCart,
        },
        {
          title: "Total Customers",
          value: stats.customers,
          growth: null,
          subtitle: "registered users",
          tone: "rose",
          icon: Users,
        },
        {
          title: "Revenue",
          value: stats.revenue,
          growth: null,
          subtitle: "excl. cancelled",
          tone: "emerald",
          icon: DollarSign,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f6faf7] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative space-y-6 overflow-hidden p-4 md:p-6 lg:p-8"
          >
            {isHome ? (
              <>
                <div className="relative overflow-hidden rounded-[2rem] bg-[#123d2a] p-6 text-white shadow-[0_22px_55px_rgba(18,61,42,0.25)] md:p-8">
                  <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
                  <div className="absolute -bottom-24 right-1/4 h-44 w-44 rounded-full border border-emerald-100/15" />
                  <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                        <Sparkles size={14} /> Your wellness business, at a
                        glance
                      </div>
                      <p className="mt-5 text-sm font-medium text-emerald-100">
                        Good morning, Admin
                      </p>
                      <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight md:text-4xl">
                        Grow with clarity.
                      </h1>
                      <p className="mt-3 text-sm leading-6 text-emerald-50/80">
                        Monitor inventory, fulfil orders, and keep every
                        customer moment moving smoothly.
                      </p>
                    </div>
                    <div className="flex min-w-[190px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                      <span className="rounded-xl bg-emerald-300 p-2.5 text-[#123d2a]">
                        <Leaf size={20} />
                      </span>
                      <div>
                        <p className="text-xs text-emerald-100">Store health</p>
                        <p className="mt-0.5 font-semibold">
                          All systems ready
                        </p>
                      </div>
                      <ArrowUpRight
                        className="ml-auto text-emerald-200"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {statsError && (
                  <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
                    {statsError}
                  </p>
                )}

                {statsLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-36 animate-pulse rounded-3xl bg-white"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {cards.map((stat) => (
                      <StatsCard key={stat.title} {...stat} />
                    ))}
                  </div>
                )}

                <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
                  <SalesChart
                    data={stats?.monthly || []}
                    loading={statsLoading}
                  />
                  <PieAnalytics
                    data={stats?.categoryShare || []}
                    loading={statsLoading}
                  />
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                  <RevenueChart
                    data={stats?.monthly || []}
                    loading={statsLoading}
                  />
                  <QuickActions />
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                  <OrdersTable
                    orders={stats?.recentOrders || []}
                    loading={statsLoading}
                  />
                  <div className="space-y-5">
                    <TopProducts
                      products={stats?.topProducts || []}
                      loading={statsLoading}
                    />
                    <LowStock
                      items={stats?.lowStock || []}
                      loading={statsLoading}
                    />
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
