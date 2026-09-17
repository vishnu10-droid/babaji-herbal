import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Package,
  ShoppingCart,
  Star,
  CreditCard,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { fetchWishlist } from "../../store/slice/wishlist.slice";
import { fetchCart } from "../../store/slice/cart.slice";
import { getMyOrders } from "../../service/order.api";

import UserSidebar from "../../components/layout/UserSidebar";
import UserNavbar from "../../components/layout/UserNavbar";

import UserProfile from "./UserProfile";
import UserOrders from "./UserOrders";
import UserWishlist from "./UserWishlist";
import UserTransactions from "./UserTransactions";
import UserReviews from "./UserReviews";
import UserSettings from "./UserSettings";

export const orderStatusTone = (status) => {
  if (status === "Delivered") return "bg-emerald-50 text-emerald-600";
  if (status === "Shipped") return "bg-blue-50 text-blue-600";
  if (status === "Processing") return "bg-violet-50 text-violet-600";
  if (status === "Cancelled") return "bg-red-50 text-red-600";
  return "bg-amber-50 text-amber-700";
};

const UserDashboard = () => {
  const pathname = useLocation().pathname;
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + Number(item.quantity || 1), 0);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const isDashboard = pathname === "/account" || pathname === "/account/";

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");
      setOrders(await getMyOrders());
    } catch (e) {
      setOrdersError(e.response?.data?.message || "Could not load your orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadOrders();
    dispatch(fetchWishlist());
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const pendingCount = orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-slate-900">
      <div className="flex min-h-screen">
        <UserSidebar />

        <div className="min-w-0 flex-1">
          <UserNavbar />

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-5 p-3 md:p-6"
          >
            {isDashboard ? (
              <>
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-blue-500 p-6 text-white shadow-xl shadow-blue-600/15">
                  <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <p className="text-sm text-blue-100">Welcome back</p>
                    <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                      {user?.name || "My Account"}
                    </h1>
                    <p className="mt-2 text-sm text-blue-100">
                      Manage your orders, wishlist and account information.
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Orders"
                    value={ordersLoading ? "…" : String(orders.length)}
                    icon={<Package size={20} className="text-blue-600" />}
                    bg="bg-blue-50"
                  />
                  <StatCard
                    title="Pending Orders"
                    value={ordersLoading ? "…" : String(pendingCount)}
                    icon={<ShoppingCart size={20} className="text-amber-600" />}
                    bg="bg-amber-50"
                  />
                  <StatCard
                    title="Wishlist Items"
                    value={String(wishlistItems.length)}
                    icon={<Heart size={20} className="text-pink-600" />}
                    bg="bg-pink-50"
                  />
                  <StatCard
                    title="Cart Items"
                    value={String(cartCount)}
                    icon={<ShoppingCart size={20} className="text-emerald-600" />}
                    bg="bg-emerald-50"
                  />
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Recent Orders</h2>
                      <p className="text-sm text-slate-500">Your latest orders</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={loadOrders}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        title="Refresh orders"
                        aria-label="Refresh orders"
                      >
                        <RefreshCw size={16} className={ordersLoading ? "animate-spin" : ""} />
                      </button>
                      <Link
                        to="/account/orders"
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        View all
                      </Link>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                      ))}
                    </div>
                  ) : ordersError ? (
                    <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">{ordersError}</p>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                        <Package size={22} />
                      </span>
                      <p className="mt-3 font-semibold text-slate-800">No orders yet</p>
                      <p className="mt-1 text-sm text-slate-500">Your orders will appear here after checkout.</p>
                      <Link
                        to="/shop"
                        className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Start shopping
                      </Link>
                    </div>
                  ) : (
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
                          {recentOrders.map((order) => (
                            <tr key={order._id} className="border-b border-slate-50 text-sm last:border-0">
                              <td className="py-4 font-semibold text-slate-900">
                                #{String(order._id).slice(-6).toUpperCase()}
                              </td>
                              <td className="py-4 text-slate-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
                              </td>
                              <td className="py-4 font-medium text-slate-900">
                                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusTone(order.status)}`}>
                                  {order.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div>
                  <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <QuickAction icon={<Package size={20} className="text-blue-600" />} title="My Orders" text="Track your orders" link="/account/orders" />
                    <QuickAction icon={<Heart size={20} className="text-pink-600" />} title="Wishlist" text="View saved products" link="/account/wishlist" />
                    <QuickAction icon={<ShoppingCart size={20} className="text-emerald-600" />} title="My Cart" text="View your cart" link="/cart" />
                    <QuickAction icon={<UserIcon size={20} className="text-violet-600" />} title="My Profile" text="Update your profile" link="/account/profile" />
                    <QuickAction icon={<CreditCard size={20} className="text-amber-600" />} title="Transactions" text="View your payments" link="/account/transactions" />
                    <QuickAction icon={<Star size={20} className="text-orange-500" />} title="My Reviews" text="Review your products" link="/account/reviews" />
                  </div>
                </div>

                {deliveredCount > 0 && (
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
                    <Package size={18} className="shrink-0" />
                    <p>
                      You have <strong>{deliveredCount} delivered order{deliveredCount > 1 ? "s" : ""}</strong>. Enjoying the products?{" "}
                      <Link to="/account/reviews" className="font-semibold underline">Leave a review</Link>
                    </p>
                  </div>
                )}
              </>
            ) : pathname === "/account/profile" ? (
              <UserProfile />
            ) : pathname === "/account/orders" ? (
              <UserOrders />
            ) : pathname === "/account/wishlist" ? (
              <UserWishlist />
            ) : pathname === "/account/transactions" ? (
              <UserTransactions />
            ) : pathname === "/account/reviews" ? (
              <UserReviews />
            ) : pathname === "/account/settings" ? (
              <UserSettings />
            ) : (
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
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const QuickAction = ({ icon, title, text, link }) => {
  return (
    <Link
      to={link}
      className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-100">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </Link>
  );
};

export default UserDashboard;
