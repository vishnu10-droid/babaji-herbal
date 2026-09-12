import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  Image,
  Images,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuGroups = [
  {
    title: "Management",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutGrid },
      { label: "Products", to: "/admin/products", icon: Package },

      { label: "All Categories", to: "/admin/categories", icon: Boxes },

      { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", to: "/admin/customers", icon: Users },
      { label: "Coupons", to: "/admin/coupons", icon: Ticket },
      { label: "Reviews", to: "/admin/reviews", icon: Star },
      { label: "Banner Manager", to: "/admin/banner", icon: Image },
      { label: "Media Gallery", to: "/admin/media", icon: Images },
      {
        label: "Reports",
        icon: BarChart3,
        children: [
          { label: "Sales Report", to: "/admin/reports/sales" },
          { label: "Customer Report", to: "/admin/reports/customers" },
          { label: "Product Report", to: "/admin/reports/products" },
          
        ],
        
      },
      { label: "Contact", to: "/admin/contact", icon: LayoutGrid },
    ],
  },
];

const bottomItems = [
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Profile", to: "/admin/profile", icon: User },
  { label: "Logout", to: "/admin/logout", icon: LogOut },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const groupedItems = useMemo(() => menuGroups, []);

  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const initialState = {};
    menuGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) =>
              currentPath === child.to ||
              currentPath.startsWith(`${child.to}/`),
          );
          if (isChildActive) {
            initialState[item.label] = true;
          }
        }
      });
    });
    return initialState;
  });

  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-emerald-950/30 bg-[#123d2a] px-2 py-2 text-white shadow-xl shadow-emerald-950/20 lg:flex ${
        collapsed ? "w-20" : "w-[240px]"
      }`}
    >
      {/* Compact Header / Brand */}
      <div className="mb-2 flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="rounded-lg bg-white/15 p-1.5 text-white">
            <Leaf size={16} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Babaji Herbals
              </p>
              <p className="truncate text-[10px] text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-full border border-white/20 bg-white/10 p-1 text-blue-100 transition hover:bg-white/20 hover:text-white"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Main Navigation - High Density */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
        {groupedItems.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <p className="px-2 pt-1 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                {group.title}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children?.length);
                const isChildActive =
                  hasChildren &&
                  item.children?.some(
                    (child) =>
                      currentPath === child.to ||
                      currentPath.startsWith(`${child.to}/`),
                  );
                const active =
                  (item.to &&
                    (currentPath === item.to ||
                      currentPath.startsWith(`${item.to}/`))) ||
                  isChildActive;

                const isOpen = openDropdowns[item.label];

                return (
                  <div
                    key={item.label}
                    className="relative space-y-0.5"
                    onMouseEnter={() => collapsed && setHoveredItem(item.label)}
                    onMouseLeave={() => collapsed && setHoveredItem(null)}
                  >
                    {/* Item Button / Link */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => !collapsed && toggleDropdown(item.label)}
                        className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                          active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                        }`}
                      >
                        <span
                          className={`rounded-md ${
                            active
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-900/80 text-slate-400"
                          } p-1 transition group-hover:text-emerald-300`}
                        >
                          <Icon size={14} />
                        </span>
                        {!collapsed && (
                          <span className="flex-1 text-left">{item.label}</span>
                        )}
                        {!collapsed && (
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-slate-400"
                          >
                            <ChevronDown size={13} />
                          </motion.span>
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.to ?? "/admin"}
                        className={`group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                          active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                        }`}
                      >
                        <span
                          className={`rounded-md ${
                            active
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-900/80 text-slate-400"
                          } p-1 transition group-hover:text-emerald-300`}
                        >
                          <Icon size={14} />
                        </span>
                        {!collapsed && (
                          <span className="flex-1">{item.label}</span>
                        )}
                      </Link>
                    )}

                    {/* Dropdown for Expanded State */}
                    {hasChildren && !collapsed && (
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 space-y-0.5 border-l border-slate-800/80 py-0.5 pl-2">
                              {item.children?.map((child) => {
                                const isChildLinkActive =
                                  currentPath === child.to;
                                return (
                                  <Link
                                    key={child.label}
                                    to={child.to}
                                    className={`block rounded-md px-2 py-1 text-xs transition ${
                                      isChildLinkActive
                                        ? "font-medium text-emerald-300 bg-emerald-500/10"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                                    }`}
                                  >
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Hover Flyout Dropdown for Collapsed Sidebar */}
                    {hasChildren && collapsed && hoveredItem === item.label && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="absolute left-full top-0 z-50 ml-2 w-44 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl backdrop-blur-xl"
                      >
                        <p className="border-b border-slate-800/80 px-2 py-1 text-[11px] font-semibold text-emerald-400">
                          {item.label}
                        </p>
                        <div className="mt-1 space-y-0.5">
                          {item.children?.map((child) => (
                            <Link
                              key={child.label}
                              to={child.to}
                              className={`block rounded-md px-2 py-1 text-xs transition ${
                                currentPath === child.to
                                  ? "bg-emerald-500/15 text-emerald-300 font-medium"
                                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Compact Bottom Section */}
      <div className="mt-2 space-y-0.5 border-t border-white/20 pt-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <span
                className={`rounded-md ${active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-900/80 text-slate-400"} p-1`}
              >
                <Icon size={14} />
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
