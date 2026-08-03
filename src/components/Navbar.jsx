import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Leaf,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/category" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileSubmenu = (label) => {
    setExpandedMobileMenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-[#f4f7f2]/80 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-3 sm:gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="rounded-full bg-[#0B6B3A] p-2 text-white">
            <Leaf size={18} />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#0B6B3A]">
              Babaji Herbals
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <button className="flex items-center gap-1 text-sm font-medium text-[#1B1B1B] transition hover:text-[#0B6B3A]">
                  {link.label}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                <div className="invisible absolute left-0 top-10 w-56 translate-y-3 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {link.children.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-[#f4f7f2] hover:text-[#0B6B3A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-[#1B1B1B] transition hover:text-[#0B6B3A]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Big Prominent Search Bar (Desktop) */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search herbal products, remedies, teas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B6B3A] focus:ring-2 focus:ring-[#0B6B3A]/20"
            />
          </div>
        </div>

        {/* Right Action Icons & Login Button */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/wishlist"
            className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] transition hover:bg-[#f0f8f3]"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>

          <Link
            to="/cart"
            className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] transition hover:bg-[#f0f8f3]"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
          </Link>

{/* Auth Button: Login or User + Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-[#0B6B3A]/10 px-4 py-1.5 text-sm font-medium text-[#0B6B3A] transition hover:bg-[#0B6B3A]/20"
              >
                <span className="h-6 w-6 rounded-full bg-[#0B6B3A] text-white flex items-center justify-center text-xs font-bold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate">{user?.name || "User"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-[#0B6B3A] px-4 py-2 text-sm font-medium text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="rounded-full border border-[#0B6B3A] px-5 py-2 text-sm font-medium text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Search Bar (Directly below header on mobile screen) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search herbal products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2 pl-9 pr-4 text-xs text-gray-800 outline-none transition focus:border-[#0B6B3A]"
          />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-6 shadow-2xl lg:hidden">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="border-b border-gray-50 pb-2">
                  <button
                    onClick={() => toggleMobileSubmenu(link.label)}
                    className="flex w-full items-center justify-between text-base font-semibold text-gray-800"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        expandedMobileMenu === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMobileMenu === link.label && (
                    <div className="mt-2 space-y-2 pl-4">
                      {link.children.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-gray-600 hover:text-[#0B6B3A]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-gray-50 pb-2 text-base font-semibold text-gray-800 hover:text-[#0B6B3A]"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Quick Action Icons & Mobile Auth Button */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-around border-b border-gray-100 pb-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0B6B3A]"
                >
                  <Heart size={16} className="text-[#0B6B3A]" /> Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0B6B3A]"
                >
                  <ShoppingCart size={16} className="text-[#0B6B3A]" /> Cart
                </Link>
              </div>

<div className="pt-1">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0B6B3A] py-2.5 text-xs font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white"
                    >
                      <span className="h-5 w-5 rounded-full bg-[#0B6B3A] text-white flex items-center justify-center text-[10px] font-bold">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                      {user?.name || "User"}
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full border border-red-500 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0B6B3A] py-2.5 text-xs font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white">
                      <LogIn size={14} /> Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}