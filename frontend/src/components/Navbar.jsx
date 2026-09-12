import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";

import logo from "../assets/babaji-logo.jpg";

import { useAuth } from "../context/auth-context";
import {
  fetchWishlist,
  resetWishlist,
} from "../store/slice/wishlist.slice";
import { fetchCategories } from "../store/slice/category.slice";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/category" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();

  const { data: categories = [] } = useSelector(
    (state) => state.category
  );

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    } else {
      dispatch(resetWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const activeCategories = categories.filter(
    (category) => category.isActive
  );

  const toggleMobileSubmenu = (label) => {
    setExpandedMobileMenu((prev) =>
      prev === label ? null : label
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-[#f4f7f2]/90 backdrop-blur-xl">
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <div className="section-shell flex items-center justify-between gap-2 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="flex shrink-0 items-center transition-transform duration-300 hover:scale-105"
        >
          <img
            src={logo}
            alt="Babaji Herbals"
            className="
              h-9
              w-9
              rounded-full
              object-cover
              shadow-md
              ring-2
              ring-[#0B6B3A]/20
              transition-all
              duration-300
              hover:shadow-lg
              hover:ring-[#0B6B3A]/40
              sm:h-10
              sm:w-10
            "
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="group relative"
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#1B1B1B] transition hover:text-[#0B6B3A]">
                  {link.label}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                <div className="invisible absolute left-0 top-full w-56 translate-y-2 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {link.children.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f4f7f2] hover:text-[#0B6B3A]"
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

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden max-w-xs flex-1 md:block lg:max-w-md">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search remedies, herbs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B6B3A] focus:ring-2 focus:ring-[#0B6B3A]/20"
            />
          </div>
        </div>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-2.5 sm:flex sm:gap-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] transition hover:bg-[#f0f8f3]"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] transition hover:bg-[#f0f8f3]"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
          </Link>

          {/* AUTH BUTTON */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-[#0B6B3A]/10 px-3 py-1.5 text-sm font-medium text-[#0B6B3A] transition hover:bg-[#0B6B3A]/20 sm:px-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B6B3A] text-xs font-bold text-white">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[80px] truncate sm:max-w-[120px]">
                  {user?.name || "User"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full border border-[#0B6B3A] p-2 text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white sm:px-3 sm:py-2"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="rounded-full border border-[#0B6B3A] px-4 py-1.5 text-sm font-medium text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white sm:px-5 sm:py-2">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full border border-[#0B6B3A]/10 p-2 text-[#0B6B3A] focus:outline-none lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE SEARCH BAR
      ====================================================== */}
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

      {/* =====================================================
          MOBILE DRAWER MENU
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-gray-100 bg-white px-6 py-6 shadow-2xl lg:hidden">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="border-b border-gray-50 pb-2"
                >
                  <button
                    onClick={() => toggleMobileSubmenu(link.label)}
                    className="flex w-full items-center justify-between text-base font-semibold text-gray-800"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${
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

            {/* MOBILE ACTIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-around border-b border-gray-100 pb-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0B6B3A]"
                >
                  <Heart size={16} className="text-[#0B6B3A]" />
                  Wishlist
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0B6B3A]"
                >
                  <ShoppingCart size={16} className="text-[#0B6B3A]" />
                  Cart
                </Link>
              </div>

              {/* MOBILE AUTH */}
              <div className="pt-1">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0B6B3A] py-2.5 text-xs font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B6B3A] text-[10px] font-bold text-white">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate max-w-[150px]">
                        {user?.name || "User"}
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full border border-red-500 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0B6B3A] py-2.5 text-xs font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white">
                      <LogIn size={14} />
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* =====================================================
          CATEGORY BAR
      ====================================================== */}
      {activeCategories.length > 0 && (
        <nav
          aria-label="Product categories"
          className="border-t border-white/10 bg-black text-white"
        >
          <div className="flex items-center gap-6 overflow-x-auto px-4 py-2 text-xs font-medium whitespace-nowrap scrollbar-none [scrollbar-width:none] sm:justify-center sm:gap-10 sm:px-8 sm:text-sm">
            {activeCategories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${encodeURIComponent(category._id)}`}
                className="transition hover:text-[#9ee6a3]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}