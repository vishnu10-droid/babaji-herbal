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
  Leaf,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";

export const userMenuItems = [
  { name: "Dashboard", path: "/account", icon: LayoutDashboard },
  { name: "My Profile", path: "/account/profile", icon: UserIcon },
  { name: "My Orders", path: "/account/orders", icon: Package },
  { name: "Wishlist", path: "/account/wishlist", icon: Heart },
  { name: "Transactions", path: "/account/transactions", icon: CreditCard },
  { name: "My Reviews", path: "/account/reviews", icon: Star },
  { name: "Settings", path: "/account/settings", icon: Settings },
];

const UserSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <aside className="hidden w-68 shrink-0 md:block lg:w-72">
      <div className="sticky top-0 flex h-screen flex-col bg-gradient-to-b from-[#0B3B24] via-[#0E5C36] to-[#0B6B3A] text-white">
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f9cd73] text-[#0B3B24]">
              <Leaf size={20} />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight">My Account</h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f9cd73]">
                Babaji Herbals
              </p>
            </div>
          </div>
          {user?.name && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f9cd73] text-sm font-bold text-[#0B3B24]">
                {(user.name || "U").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <p className="truncate text-xs text-white/70">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/account"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#f9cd73] text-[#0B3B24] shadow-lg shadow-black/20"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}

          <NavLink
            to="/cart"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ShoppingCart size={18} />
            My Cart
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="space-y-2 border-t border-white/10 p-3">
          <button
            onClick={() => navigate("/shop")}
            className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white/85 transition hover:bg-red-500/25 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
