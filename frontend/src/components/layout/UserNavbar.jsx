import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Menu, Store } from "lucide-react";
import { useAuth } from "../../context/auth-context";

const titles = {
  "/account": { title: "Dashboard", sub: "Overview of your account" },
  "/account/profile": { title: "My Profile", sub: "Manage your personal information" },
  "/account/orders": { title: "My Orders", sub: "Track and manage your orders" },
  "/account/wishlist": { title: "Wishlist", sub: "Your saved products" },
  "/account/transactions": { title: "Transactions", sub: "All your payments in one place" },
  "/account/reviews": { title: "My Reviews", sub: "Rate products you purchased" },
  "/account/settings": { title: "Settings", sub: "Password, preferences & account" },
};

const UserNavbar = ({ onMenu }) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = titles[pathname] || { title: "My Account", sub: "Customer panel" };
  const userName = user?.name || "User";

  const handleLogout = () => {
    logout?.();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#0B6B3A]/10 bg-[#faf8f1]/95 px-4 py-3 backdrop-blur-md md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded-xl border border-[#0B6B3A]/15 bg-white p-2.5 text-[#0B6B3A] shadow-sm transition hover:bg-[#0B6B3A]/5 md:hidden"
            aria-label="Open account menu"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B6B3A]/70">
              {meta.sub}
            </p>
            <h2 className="truncate text-lg font-bold text-[#123d2a] md:text-xl">{meta.title}</h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 rounded-full border border-[#0B6B3A]/20 bg-white px-4 py-2 text-xs font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A]/5 sm:inline-flex"
          >
            <Store size={14} />
            Shop
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="hidden rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 sm:block"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="hidden items-center gap-2.5 rounded-full border border-[#0B6B3A]/15 bg-white py-1.5 pl-1.5 pr-4 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0B6B3A] to-[#128a4d] text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[110px] truncate text-sm font-bold text-[#123d2a]">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-red-200 bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
