import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User as UserIcon,
  Package,
  Heart,
  ShoppingCart,
  CreditCard,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/auth-context";

export const userMenuItems = [
  { name: "Dashboard", path: "/account", icon: LayoutDashboard },
  { name: "My Profile", path: "/account/profile", icon: UserIcon },
  { name: "My Orders", path: "/account/orders", icon: Package },
  { name: "Wishlist", path: "/account/wishlist", icon: Heart },
  { name: "Transactions", path: "/account/transactions", icon: CreditCard },
  { name: "My Reviews", path: "/account/reviews", icon: Star },
  { name: "My Cart", path: "/cart", icon: ShoppingCart },
  { name: "Settings", path: "/account/settings", icon: Settings },
];

const UserSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-gradient-to-b from-[#0B3B24] via-[#0E5C36] to-[#0B6B3A] px-2 py-2 text-white shadow-xl shadow-[#0B3B24]/30 lg:flex ${
        collapsed ? "w-20" : "w-[240px]"
      }`}
    >
      {/* Compact Header / Brand */}
      <div className="mb-2 flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="rounded-lg bg-[#f9cd73] p-1.5 text-[#0B3B24]">
            <Leaf size={16} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Babaji Herbals</p>
              <p className="truncate text-[10px] text-white/60">Customer Panel</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-full border border-white/20 bg-white/10 p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User card */}
      {!collapsed && user?.name && (
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/10 p-2.5 ring-1 ring-white/10">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f9cd73] text-sm font-bold text-[#0B3B24]">
            {(user.name || "U").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-white/60">{user.email}</p>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-2 pt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
              My Account
            </p>
          )}
          <nav className="space-y-0.5">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/account"}
                  title={item.name}
                >
                  {({ isActive }) => (
                    <span
                      className={`group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#f9cd73] text-[#0B3B24]"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className={`rounded-md p-1 transition ${
                          isActive ? "text-[#0B3B24]" : "group-hover:text-[#f9cd73]"
                        }`}
                      >
                        <Icon size={14} />
                      </span>
                      {!collapsed && <span className="flex-1">{item.name}</span>}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Compact Bottom Section */}
      <div className="mt-2 space-y-0.5 border-t border-white/20 pt-2">
        <button
          type="button"
          onClick={() => navigate("/shop")}
          title="Continue Shopping"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <span className="rounded-md bg-white/10 p-1">
            <Store size={14} />
          </span>
          {!collapsed && <span>Continue Shopping</span>}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/75 transition hover:bg-red-500/25 hover:text-white"
        >
          <span className="rounded-md bg-white/10 p-1">
            <LogOut size={14} />
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default UserSidebar;
