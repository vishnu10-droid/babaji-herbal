import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

import UserSidebar from "../../components/layout/UserSidebar";
import UserNavbar from "../../components/layout/UserNavbar";

import UserProfile from "./UserProfile";
import UserOrders from "./UserOrders";
import UserWishlist from "./UserWishlist";
import UserSettings from "./UserSettings";

const UserDashboard = () => {
  const pathname = useLocation().pathname;
  const { user } = useAuth();

  const isDashboard = pathname === "/account" || pathname === "/account/";

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-slate-900">
      <div className="flex min-h-screen">
        {/* =========================
            USER SIDEBAR
        ========================= */}

        <UserSidebar />

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="min-w-0 flex-1">
          {/* Navbar */}
          <UserNavbar />

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-5 p-3 md:p-6"
          >
            {/* =================================================
                USER DASHBOARD HOME
            ================================================= */}

            {isDashboard ? (
              <>
                {/* =========================
                    WELCOME SECTION
                ========================= */}

                <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-500 p-6 text-white shadow-xl shadow-blue-600/15">
                  <p className="text-sm text-blue-100">Welcome back 👋</p>

                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    {user?.name || "My Account"}
                  </h1>

                  <p className="mt-2 text-sm text-blue-100">
                    Manage your orders, wishlist and account information.
                  </p>
                </div>

                {/* =========================
                    USER STATS
                ========================= */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard
                    title="Total Orders"
                    value="12"
                    icon="📦"
                    bg="bg-blue-50"
                  />

                  <StatCard
                    title="Wishlist Items"
                    value="5"
                    icon="❤️"
                    bg="bg-pink-50"
                  />

                  <StatCard
                    title="Cart Items"
                    value="3"
                    icon="🛒"
                    bg="bg-emerald-50"
                  />
                </div>

                {/* =========================
                    RECENT ORDERS
                ========================= */}

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Recent Orders</h2>

                      <p className="text-sm text-slate-500">
                        Your latest orders
                      </p>
                    </div>

                    <Link
                      to="/account/orders"
                      className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                          <th className="pb-3">Order</th>

                          <th className="pb-3">Date</th>

                          <th className="pb-3">Amount</th>

                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        <OrderRow
                          order="#1025"
                          date="20 Aug 2026"
                          amount="₹4,999"
                          status="Delivered"
                          color="green"
                        />

                        <OrderRow
                          order="#1024"
                          date="18 Aug 2026"
                          amount="₹1,999"
                          status="Shipped"
                          color="blue"
                        />

                        <OrderRow
                          order="#1023"
                          date="15 Aug 2026"
                          amount="₹999"
                          status="Pending"
                          color="yellow"
                        />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* =========================
                    QUICK ACTIONS
                ========================= */}

                <div>
                  <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <QuickAction
                      icon="📦"
                      title="My Orders"
                      text="Track your orders"
                      link="/account/orders"
                    />

                    <QuickAction
                      icon="❤️"
                      title="Wishlist"
                      text="View saved products"
                      link="/account/wishlist"
                    />

                    <QuickAction
                      icon="🛒"
                      title="My Cart"
                      text="View your cart"
                      link="/cart"
                    />

                    <QuickAction
                      icon="👤"
                      title="My Profile"
                      text="Update your profile"
                      link="/account/profile"
                    />
                  </div>
                </div>
              </>
            ) : pathname === "/account/profile" ? (
              /* =========================
                  PROFILE
              ========================= */

              <UserProfile />
            ) : pathname === "/account/orders" ? (
              /* =========================
                  ORDERS
              ========================= */

              <UserOrders />
            ) : pathname === "/account/wishlist" ? (
              /* =========================
                  WISHLIST
              ========================= */
              <UserWishlist />
            ) : pathname === "/account/settings" ? (
              /* =========================
                  SETTINGS
              ========================= */

              <UserSettings />
            ) : (
              /* =========================
                  PAGE NOT FOUND
              ========================= */

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h1 className="text-2xl font-bold">Page Not Found</h1>

                <p className="mt-2 text-sm text-slate-500">
                  The account page you are looking for does not exist.
                </p>

                <Link
                  to="/account"
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ title, value, icon, bg }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${bg}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   ORDER ROW
========================================================= */

const OrderRow = ({ order, date, amount, status, color }) => {
  const colors = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-600",
  };

  return (
    <tr className="border-b border-slate-50 text-sm last:border-0">
      <td className="py-4 font-semibold text-slate-900">{order}</td>

      <td className="py-4 text-slate-500">{date}</td>

      <td className="py-4 font-medium text-slate-900">{amount}</td>

      <td className="py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            colors[color] || colors.blue
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({ icon, title, text, link }) => {
  return (
    <Link
      to={link}
      className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl transition group-hover:bg-blue-100">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </Link>
  );
};

export default UserDashboard;
