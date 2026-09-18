import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  Truck,
  Leaf,
  BadgeCheck,
  LayoutGrid,
} from "lucide-react";

import logo from "../assets/babaji-logo.jpg";

import { useAuth } from "../context/auth-context";
import {
  fetchWishlist,
  resetWishlist,
} from "../store/slice/wishlist.slice";
import { fetchCart, resetCart } from "../store/slice/cart.slice";
import { fetchCategories } from "../store/slice/category.slice";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/category", hasDropdown: true },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: categories = [] } = useSelector(
    (state) => state.category
  );

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const cartItems = useSelector((state) => state.cart.items || []);

  const wishlistCount = wishlistItems.length;
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch wishlist + cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    } else {
      dispatch(resetWishlist());
      dispatch(resetCart());
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* =====================================================
          ANNOUNCEMENT BAR
      ====================================================== */}
      <div className="bg-gradient-to-r from-[#0B6B3A] via-[#128a4d] to-[#0B6B3A] text-white">
        <div className="section-shell flex items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-semibold tracking-wide sm:justify-between sm:text-xs">
          <p className="hidden items-center gap-1.5 sm:flex">
            <Leaf size={13} className="text-[#f9cd73]" />
            100% Pure & Natural Ayurveda
          </p>
          <p className="flex items-center gap-1.5">
            <Truck size={13} className="text-[#f9cd73]" />
            Free shipping on orders over ₹999
          </p>
          <p className="hidden items-center gap-1.5 md:flex">
            <BadgeCheck size={13} className="text-[#f9cd73]" />
            Trusted by 50,000+ customers
          </p>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <div
        className={`border-b border-[#0B6B3A]/10 bg-[#f4f7f2]/90 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(11,107,58,0.12)]" : ""
        }`}
      >
        <div className="section-shell flex items-center justify-between gap-2 px-4 py-3 sm:gap-5 sm:px-6 lg:px-8">
          {/* LOGO + BRAND */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="relative">
              <img
                src={logo}
                alt="Babaji Herbals"
                className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-[#0B6B3A]/25 transition-all duration-300 group-hover:rotate-6 group-hover:shadow-lg group-hover:ring-[#0B6B3A]/50 sm:h-11 sm:w-11"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B6B3A] ring-2 ring-[#f4f7f2]">
                <Leaf size={9} className="text-white" />
              </span>
            </span>
            <span className="hidden flex-col leading-tight min-[400px]:flex">
              <span className="font-serif text-base font-bold tracking-tight text-[#123d2a] sm:text-lg">
                Babaji <span className="text-[#0B6B3A]">Herbals</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0B6B3A]/70">
                Rooted in Ayurveda
              </span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.label} className="group relative">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-[#0B6B3A] text-white shadow-md shadow-[#0B6B3A]/30"
                          : "text-[#1B1B1B] hover:bg-[#0B6B3A]/10 hover:text-[#0B6B3A]"
                      }`
                    }
                  >
                    <LayoutGrid size={15} />
                    {link.label}
                    <ChevronDown
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </NavLink>

                  {/* CATEGORIES DROPDOWN */}
                  <div className="invisible absolute left-0 top-full w-64 translate-y-3 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-[#0B6B3A]/10 bg-white p-2 shadow-2xl shadow-[#0B6B3A]/15">
                      <Link
                        to="/category"
                        className="mb-1 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                      >
                        All Categories
                        <ChevronDown size={15} className="-rotate-90" />
                      </Link>
                      {activeCategories.slice(0, 6).map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/shop?category=${encodeURIComponent(cat._id)}`}
                          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#f0f8f3] hover:text-[#0B6B3A]"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B6B3A]/10 text-[#0B6B3A]">
                            <Leaf size={13} />
                          </span>
                          {cat.name}
                        </Link>
                      ))}
                      {activeCategories.length === 0 && (
                        <p className="px-4 py-3 text-xs text-gray-400">
                          No categories yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[#0B6B3A] text-white shadow-md shadow-[#0B6B3A]/30"
                        : "text-[#1B1B1B] hover:bg-[#0B6B3A]/10 hover:text-[#0B6B3A]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* DESKTOP SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            className="hidden max-w-xs flex-1 md:block lg:max-w-xs xl:max-w-sm"
          >
            <div className="group relative w-full">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#0B6B3A]"
              />
              <input
                type="text"
                placeholder="Search remedies, herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2.5 pl-11 pr-20 text-sm text-gray-800 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#0B6B3A] focus:shadow-lg focus:shadow-[#0B6B3A]/10 focus:ring-4 focus:ring-[#0B6B3A]/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] px-4 py-1.5 text-xs font-bold text-white shadow transition hover:shadow-md hover:brightness-110 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* DESKTOP RIGHT ACTIONS */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="group relative rounded-full border border-[#0B6B3A]/15 bg-white p-2.5 text-[#0B6B3A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B6B3A]/30 hover:shadow-md"
            >
              <Heart
                size={18}
                className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
              />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white shadow"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="group relative rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] p-2.5 text-white shadow-md shadow-[#0B6B3A]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0B6B3A]/35"
            >
              <ShoppingCart
                size={18}
                className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
              />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f5bd56] px-1 text-[10px] font-bold text-[#173b29] shadow ring-2 ring-white"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <span className="mx-1 hidden h-6 w-px bg-[#0B6B3A]/15 lg:block" />

            {/* AUTH BUTTON */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user?.role === "admin" ? "/admin" : "/account"}
                  className="group flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all duration-300 hover:border-[#0B6B3A]/40 hover:shadow-md sm:pr-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B6B3A] to-[#128a4d] text-xs font-bold text-white shadow">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[80px] truncate text-sm font-semibold text-[#123d2a] sm:max-w-[110px]">
                    {user?.name || "User"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  className="rounded-full border border-red-200 bg-red-50 p-2.5 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-md active:scale-95"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0B6B3A]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#0B6B3A]/40 hover:brightness-110 active:scale-95"
              >
                <LogIn
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full border border-[#0B6B3A]/15 bg-white p-2.5 text-[#0B6B3A] shadow-sm transition active:scale-95 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search herbal products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2.5 pl-10 pr-20 text-xs text-gray-800 shadow-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#0B6B3A] px-3.5 py-1.5 text-[11px] font-bold text-white active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* =====================================================
          MOBILE DRAWER MENU
      ====================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={logo}
                    alt="Babaji Herbals"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <div className="leading-tight">
                    <p className="font-serif text-base font-bold text-white">
                      Babaji Herbals
                    </p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
                      Rooted in Ayurveda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 active:scale-95"
                  aria-label="Close Menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {link.hasDropdown ? (
                      <div className="overflow-hidden rounded-2xl">
                        <button
                          onClick={() => toggleMobileSubmenu(link.label)}
                          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${
                            expandedMobileMenu === link.label
                              ? "bg-[#0B6B3A]/10 text-[#0B6B3A]"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
                              <LayoutGrid size={15} />
                            </span>
                            {link.label}
                          </span>
                          <ChevronDown
                            size={17}
                            className={`transition-transform duration-300 ${
                              expandedMobileMenu === link.label
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedMobileMenu === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-1 px-2 py-2">
                                <Link
                                  to="/category"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block rounded-xl bg-[#0B6B3A] px-4 py-2.5 text-xs font-bold text-white"
                                >
                                  All Categories
                                </Link>
                                {activeCategories.map((cat) => (
                                  <Link
                                    key={cat._id}
                                    to={`/shop?category=${encodeURIComponent(cat._id)}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-[#f0f8f3] hover:text-[#0B6B3A]"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl px-4 py-3 text-sm font-bold transition ${
                            isActive
                              ? "bg-[#0B6B3A] text-white shadow-md shadow-[#0B6B3A]/25"
                              : "text-gray-800 hover:bg-gray-50"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </motion.div>
                ))}

                {/* Drawer quick actions */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center justify-center gap-2 rounded-2xl border border-[#0B6B3A]/15 bg-[#f0f8f3] py-3 text-xs font-bold text-[#0B6B3A]"
                  >
                    <Heart size={16} />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] py-3 text-xs font-bold text-white shadow-md"
                  >
                    <ShoppingCart size={16} />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f5bd56] px-1 text-[10px] font-bold text-[#173b29] ring-2 ring-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* Drawer footer auth */}
              <div className="border-t border-gray-100 p-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to={user?.role === "admin" ? "/admin" : "/account"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-[#f0f8f3] py-3 text-xs font-bold text-[#0B6B3A]"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B6B3A] text-[11px] font-bold text-white">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                      <span className="max-w-[150px] truncate">
                        {user?.name || "User"}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-xs font-bold text-white transition active:scale-95"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] py-3 text-xs font-bold text-white shadow-md"
                  >
                    <LogIn size={14} />
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          CATEGORY BAR
      ====================================================== */}
      {activeCategories.length > 0 && (
        <nav
          aria-label="Product categories"
          className="bg-gradient-to-r from-[#123d2a] via-[#0e5c36] to-[#123d2a] text-white shadow-md"
        >
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 whitespace-nowrap scrollbar-none [scrollbar-width:none] sm:justify-center sm:gap-3 sm:px-8">
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f9cd73] sm:flex">
              <Leaf size={12} />
              Shop by
            </span>
            {activeCategories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${encodeURIComponent(category._id)}`}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/85 transition-all duration-300 hover:bg-white/15 hover:text-[#f9cd73] hover:shadow sm:text-[13px]"
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
