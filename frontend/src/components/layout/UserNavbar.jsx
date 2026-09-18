import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, LogOut, User as UserIcon, Settings, Store } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/auth-context";

const UserNavbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const initials = (user?.name || "User").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout?.();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[#0B6B3A]/15 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-2xl border border-[#0B6B3A] bg-[#0B6B3A] p-2 text-white transition hover:bg-[#0a5a31] lg:hidden"
          aria-label="Open account menu"
        >
          <span className="block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
        </button>

        <form
          onSubmit={handleSearch}
          className="hidden items-center gap-3 rounded-2xl border border-[#0B6B3A]/15 bg-[#0B6B3A]/5 px-3 py-2 md:flex"
        >
          <Search size={16} className="shrink-0 text-[#0B6B3A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search herbal products"
            className="w-56 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 xl:w-64"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/shop"
          title="Continue shopping"
          className="rounded-2xl border border-[#0B6B3A]/15 bg-white p-2.5 text-[#0B6B3A] transition hover:bg-[#0B6B3A]/5"
        >
          <Store size={18} />
        </Link>
        <Link
          to="/account/orders"
          title="My orders"
          className="relative rounded-2xl border border-[#0B6B3A]/15 bg-white p-2.5 text-[#0B6B3A] transition hover:bg-[#0B6B3A]/5"
        >
          <Bell size={18} />
        </Link>

        <div className="group relative hidden md:block">
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-[#0B6B3A]/15 bg-white px-3 py-2 text-left transition hover:border-[#0B6B3A]/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B6B3A]/10 font-semibold text-[#0B6B3A]">
              {initials}
            </div>
            <div className="hidden xl:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
              <p className="max-w-[140px] truncate text-xs text-slate-500">{user?.email || ""}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          <div className="absolute right-0 top-12 hidden w-48 rounded-2xl border border-[#0B3B24] bg-[#0B3B24] p-2 shadow-xl group-hover:block">
            <Link
              to="/account/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <UserIcon size={15} /> My Profile
            </Link>
            <Link
              to="/account/settings"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={15} /> Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-white/10 hover:text-red-200"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="rounded-2xl border border-red-200 bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white md:hidden"
        >
          <LogOut size={18} />
        </button>
      </div>
    </motion.header>
  );
};

export default UserNavbar;
