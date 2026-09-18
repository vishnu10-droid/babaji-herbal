import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Navigate, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Package,
  ShoppingCart,
  Star,
  CreditCard,
  User as UserIcon,
  RefreshCw,
  X,
  Leaf,
  Truck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { fetchWishlist } from "../../store/slice/wishlist.slice";
import { fetchCart } from "../../store/slice/cart.slice";
import { getMyOrders } from "../../service/order.api";

import UserSidebar, { userMenuItems } from "../../components/layout/UserSidebar";
import UserNavbar from "../../components/layout/UserNavbar";

import UserProfile from "./UserProfile";
import UserOrders from "./UserOrders";
import UserWishlist from "./UserWishlist";
import UserTransactions from "./UserTransactions";
import UserReviews from "./UserReviews";
import UserSettings from "./UserSettings";

export const orderStatusTone = (status) => {
  if (status === "Delivered") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "Shipped") return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  if (status === "Processing") return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
  if (status === "Cancelled") return "bg-red-50 text-red-600 ring-1 ring-red-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
};

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

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
  const [mobileMenu, setMobileMenu] = useState(false);

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

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "Cancelled");
    const totalSpent = active.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const pending = orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    return { totalSpent, pending, delivered, total: orders.length };
  }, [orders]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8f1] text-slate-900">
      <div className="flex min-h-screen">
        <UserSidebar />

        <div className="min-w-0 flex-1">
          <UserNavbar onMenu={() => setMobileMenu(true)} />

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative space-y-6 overflow-hidden p-4 md:p-6 lg:p-8"
          >
            {isDashboard ? (
              <>
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B3B24] via-[#0E5C36] to-[#128a4d] p-6 text-white shadow-xl shadow-[#0B6B3A]/20 md:p-8">
                  <Leaf size={180} className="absolute -right-8 -top-10 text-white/10" />
                  <div className="relative">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f9cd73]">
                      <BadgeCheck size={13} /> Verified Customer
                    </p>
                    <h1 className="mt-3 text-2xl font-bold md:text-3xl">
                      Welcome back, {user?.name?.split(" ")[0] || "Friend"}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                      Track orders, manage wishlist and keep your Ayurvedic routine on schedule.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f9cd73] px-5 py-2.5 text-sm font-bold text-[#0B3B24] transition hover:brightness-105"
                      >
                        Shop Herbals <ArrowRight size={15} />
                      </Link>
                      <Link
                        to="/account/orders"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/25"
                      >
                        <Package size={15} /> Track Orders
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                  <StatCard title="Total Spent" value={ordersLoading ? "…" : inr(stats.totalSpent)} icon={<CreditCard size={20} />} tone="bg-[#0B6B3A]/10 text-[#0B6B3A]" />
                  <StatCard title="Total Orders" value={ordersLoading ? "…" : String(stats.total)} icon={<Package size={20} />} tone="bg-amber-50 text-amber-600" />
                  <StatCard title="Pending" value={ordersLoading ? "…" : String(stats.pending)} icon={<Truck size={20} />} tone="bg-sky-50 text-sky-600" />
                  <StatCard title="Wishlist" value={String(wishlistItems.length)} icon={<Heart size={20} />} tone="bg-pink-50 text-pink-600" />
                </div>

                {ordersError && (
                  <p className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-100">
                    {ordersError}
                  </p>
                )}

                {/* Recent orders */}
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#123d2a]">Recent Orders</h2>
                      <p className="text-sm text-slate-500">Your latest purchases</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadOrders}
                        className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0B6B3A]"
                        title="Refresh orders"
                        aria-label="Refresh orders"
                      >
                        <RefreshCw size={16} className={ordersLoading ? "animate-spin" : ""} />
                      </button>
                      <Link to="/account/orders" className="text-sm font-bold text-[#0B6B3A] hover:underline">
                        View all
                      </Link>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
                      ))}
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
                        <Package size={24} />
                      </span>
                      <p className="mt-3 font-bold text-slate-800">No orders yet</p>
                      <p className="mt-1 text-sm text-slate-500">Your orders will appear here after checkout.</p>
                      <Link to="/shop" className="mt-4 inline-block rounded-full bg-[#0B6B3A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a5a31]">
                        Start shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <Link
                          key={order._id}
                          to="/account/orders"
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-[#0B6B3A]/25 hover:bg-[#faf8f1]"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
                              <Package size={19} />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">
                                #{String(order._id).slice(-6).toUpperCase()} · {(order.items || []).length} items
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"} · {inr(order.totalAmount)}
                              </p>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${orderStatusTone(order.status)}`}>
                            {order.status || "Pending"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div>
                  <h2 className="mb-3 text-lg font-bold text-[#123d2a]">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 md:gap-4">
                    <QuickAction icon={<Package size={20} />} title="My Orders" text="Track orders" link="/account/orders" />
                    <QuickAction icon={<Heart size={20} />} title="Wishlist" text={`${wishlistItems.length} saved`} link="/account/wishlist" />
                    <QuickAction icon={<ShoppingCart size={20} />} title="My Cart" text={`${cartCount} items`} link="/cart" />
                    <QuickAction icon={<UserIcon size={20} />} title="My Profile" text="Edit details" link="/account/profile" />
                    <QuickAction icon={<CreditCard size={20} />} title="Payments" text="Transactions" link="/account/transactions" />
                    <QuickAction icon={<Star size={20} />} title="Reviews" text="Rate products" link="/account/reviews" />
                  </div>
                </div>

                {stats.delivered > 0 && (
                  <div className="flex items-center gap-3 rounded-3xl bg-[#0B6B3A]/8 p-4 text-sm text-[#123d2a] ring-1 ring-[#0B6B3A]/15">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B6B3A] text-white">
                      <Leaf size={18} />
                    </span>
                    <p>
                      You have <strong>{stats.delivered} delivered order{stats.delivered > 1 ? "s" : ""}</strong>. Enjoying the products?{" "}
                      <Link to="/account/reviews" className="font-bold text-[#0B6B3A] underline">Leave a review</Link>
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
              <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#0B6B3A]/10">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
                <p className="mt-2 text-sm text-slate-500">The account page you are looking for does not exist.</p>
                <Link to="/account" className="mt-5 inline-block rounded-full bg-[#0B6B3A] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a5a31]">
                  Back to Dashboard
                </Link>
              </div>
            )}
          </motion.main>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[84%] max-w-xs flex-col bg-gradient-to-b from-[#0B3B24] to-[#0E5C36] text-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f9cd73] text-[#0B3B24]">
                    <Leaf size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold">My Account</p>
                    <p className="max-w-[140px] truncate text-xs text-white/70">{user?.name}</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenu(false)} className="rounded-lg bg-white/10 p-2" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/account"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                          isActive ? "bg-[#f9cd73] text-[#0B3B24]" : "text-white/85 hover:bg-white/10"
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="border-t border-white/10 p-3">
                <Link to="/shop" className="block rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-bold">
                  Continue Shopping
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon, tone }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-5"
  >
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500 md:text-sm">{title}</p>
        <h3 className="mt-1 truncate text-xl font-bold text-[#123d2a] md:text-2xl">{value}</h3>
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>{icon}</div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon, title, text, link }) => (
  <Link
    to={link}
    className="group rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B6B3A]/10 transition duration-200 hover:-translate-y-1 hover:shadow-md md:p-5"
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A] transition group-hover:bg-[#0B6B3A] group-hover:text-white">
      {icon}
    </div>
    <h3 className="mt-3 text-sm font-bold text-[#123d2a]">{title}</h3>
    <p className="mt-0.5 text-xs text-slate-500">{text}</p>
  </Link>
);

export default UserDashboard;
