import { useEffect, useMemo, useRef, useState } from "react";
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
  User,
  Package,
  Settings,
} from "lucide-react";

import logo from "../assets/babaji-logo.jpg";

import { useAuth } from "../context/auth-context";
import { fetchWishlist, resetWishlist } from "../store/slice/wishlist.slice";
import { fetchCart, resetCart } from "../store/slice/cart.slice";
import { fetchCategories } from "../store/slice/category.slice";
import { fetchproduct } from "../store/slice/product.Slice";
import { thumbnail } from "../utils/image";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const { data: categories = [] } = useSelector((state) => state.category);

  const wishlistCount = wishlistItems.length;
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

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

  // Fetch categories for category bar below navbar
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Products pehle se loaded nahi hain to suggestions ke liye load karo
  const { data: products = [] } = useSelector((state) => state.product);
  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchproduct());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search suggestions: naam / category / description me match
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 1) return [];
    return (products || [])
      .filter((p) => {
        const name = String(p?.name || "").toLowerCase();
        const desc = String(p?.description || "").toLowerCase();
        const cat = String(
          p?.category?.name || p?.category || p?.categoryName || ""
        ).toLowerCase();
        return name.includes(q) || cat.includes(q) || desc.includes(q);
      })
      .slice(0, 6);
  }, [products, searchQuery]);

  // Bahar click / route change par dropdown band karo
  useEffect(() => {
    const onPointerDown = (e) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    setShowSuggestions(false);
    setHighlightIndex(-1);
  }, [location.pathname]);

  const activeCategories = (categories || []).filter(
    (category) => category.isActive !== false
  );

  // Navbar category bar ka fixed order (user defined)
  // pain relief, weight gain, female wellness, supplement nutrition,
  // de-addiction, weight loss, diabetes care, general wellness
  const normalizeName = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getCategoryOrder = (name) => {
    const n = normalizeName(name);
    if (n.includes("pain") && n.includes("relief")) return 0;
    if (n.includes("weight") && n.includes("gain")) return 1;
    if (n.includes("female")) return 2;
    if (
      n.includes("supplement") ||
      n.includes("suplement") ||
      n.includes("nutrition")
    )
      return 3;
    if (
      n.includes("addiction") ||
      n.includes("diction") ||
      n.includes("de add") ||
      n.includes("d ad") ||
      n.includes("nasha")
    )
      return 4;
    if (n.includes("weight") && n.includes("loss")) return 5;
    if (n.includes("diabet")) return 6;
    if (n.includes("general")) return 7;
    return 99;
  };

  const orderedCategories = [...activeCategories].sort(
    (a, b) =>
      getCategoryOrder(a.name) - getCategoryOrder(b.name) ||
      (a.name || "").localeCompare(b.name || "")
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToSearch = (value) => {
    const q = String(value || "").trim();
    if (!q) return;
    setShowSuggestions(false);
    setHighlightIndex(-1);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const goToProduct = (id) => {
    if (!id) return;
    setShowSuggestions(false);
    setHighlightIndex(-1);
    setSearchQuery("");
    navigate(`/product/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goToSearch(searchQuery);
  };

  const handleSuggestionKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault();
      goToProduct(suggestions[highlightIndex]._id);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  const suggestionPrice = (p) => {
    const v = (p?.variations || []).find((x) => x.isActive !== false) || p?.variations?.[0];
    return Number(v?.price ?? p?.sellingPrice ?? p?.price ?? 0) || 0;
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
            {navLinks.map((link) => (
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
            ))}
          </nav>

          {/* DESKTOP SEARCH BAR */}
          <div
            ref={desktopSearchRef}
            className="hidden max-w-xs flex-1 md:block lg:max-w-xs xl:max-w-sm"
          >
          <form onSubmit={handleSearch} className="relative" autoComplete="off">
            <div className="group relative w-full">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#0B6B3A]"
              />
              <input
                type="text"
                placeholder="Search remedies, herbs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setHighlightIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSuggestionKeyDown}
                className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2.5 pl-11 pr-20 text-sm text-gray-800 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#0B6B3A] focus:shadow-lg focus:shadow-[#0B6B3A]/10 focus:ring-4 focus:ring-[#0B6B3A]/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#128a4d] px-4 py-1.5 text-xs font-bold text-white shadow transition hover:shadow-md hover:brightness-110 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#0B6B3A]/10 bg-white shadow-2xl shadow-[#0B6B3A]/15">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((p, idx) => {
                      const img = p?.images?.[0]
                        ? thumbnail(p.images[0], 100)
                        : "";
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => goToProduct(p._id)}
                          onMouseEnter={() => setHighlightIndex(idx)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                            idx === highlightIndex
                              ? "bg-[#f0f8f3]"
                              : "hover:bg-[#f0f8f3]"
                          }`}
                        >
                          {img ? (
                            <img
                              src={img}
                              alt={p.name}
                              className="h-9 w-9 shrink-0 rounded-xl border border-[#0B6B3A]/10 object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f8f3] text-[#0B6B3A]">
                              <Search size={14} />
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-[#123d2a]">
                              {p.name}
                            </span>
                            <span className="block truncate text-[11px] text-gray-500">
                              {String(
                                p?.category?.name ||
                                  p?.category ||
                                  p?.categoryName ||
                                  "Herbal care"
                              )}{" "}
                              {suggestionPrice(p)
                                ? `· ₹${suggestionPrice(p).toLocaleString("en-IN")}`
                                : ""}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToSearch(searchQuery)}
                      className="block w-full border-t border-[#0B6B3A]/10 bg-[#f7faf6] px-3 py-2.5 text-center text-xs font-bold text-[#0B6B3A] transition hover:bg-[#edf4eb]"
                    >
                      See all results for “{searchQuery.trim()}”
                    </button>
                  </>
                ) : (
                  <p className="px-4 py-3 text-center text-xs text-gray-500">
                    No match for “{searchQuery.trim()}” — press Enter to search anyway
                  </p>
                )}
              </div>
            )}
          </form>
          </div>

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

            {/* AUTH BUTTON — admin navbar jaisa hover dropdown */}
            {isAuthenticated ? (
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all duration-300 hover:border-[#0B6B3A]/40 hover:shadow-md sm:pr-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B6B3A] to-[#128a4d] text-xs font-bold text-white shadow">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[80px] truncate text-sm font-semibold text-[#123d2a] sm:max-w-[110px]">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown
                    size={15}
                    className="text-gray-400 transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                <div className="invisible absolute right-0 top-full w-52 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-[#0B6B3A]/10 bg-white p-2 shadow-2xl shadow-[#0B6B3A]/15">
                    <div className="truncate px-3 py-2 text-xs text-gray-500">
                      {user?.email || user?.name || "My Account"}
                    </div>
                    <Link
                      to={user?.role === "admin" ? "/admin" : "/account"}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#f0f8f3] hover:text-[#0B6B3A]"
                    >
                      <User size={15} />{" "}
                      {user?.role === "admin" ? "Admin Panel" : "My Account"}
                    </Link>
                    {user?.role !== "admin" && (
                      <>
                        <Link
                          to="/account/orders"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#f0f8f3] hover:text-[#0B6B3A]"
                        >
                          <Package size={15} /> My Orders
                        </Link>
                        <Link
                          to="/account/settings"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#f0f8f3] hover:text-[#0B6B3A]"
                        >
                          <Settings size={15} /> Settings
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
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
        <div className="px-4 pb-3 md:hidden" ref={mobileSearchRef}>
          <form onSubmit={handleSearch} className="relative w-full" autoComplete="off">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search herbal products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setHighlightIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSuggestionKeyDown}
              className="w-full rounded-full border border-[#0B6B3A]/20 bg-white py-2.5 pl-10 pr-20 text-xs text-gray-800 shadow-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#0B6B3A] px-3.5 py-1.5 text-[11px] font-bold text-white active:scale-95"
            >
              Search
            </button>

            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#0B6B3A]/10 bg-white shadow-2xl">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToProduct(p._id)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-[#f0f8f3]"
                      >
                        {p?.images?.[0] ? (
                          <img
                            src={thumbnail(p.images[0], 100)}
                            alt={p.name}
                            className="h-8 w-8 shrink-0 rounded-lg border border-[#0B6B3A]/10 object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f8f3] text-[#0B6B3A]">
                            <Search size={13} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-[#123d2a]">
                            {p.name}
                          </span>
                          <span className="block truncate text-[10px] text-gray-500">
                            {suggestionPrice(p)
                              ? `₹${suggestionPrice(p).toLocaleString("en-IN")}`
                              : ""}
                          </span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToSearch(searchQuery)}
                      className="block w-full border-t border-[#0B6B3A]/10 bg-[#f7faf6] px-3 py-2 text-center text-[11px] font-bold text-[#0B6B3A]"
                    >
                      See all results
                    </button>
                  </>
                ) : (
                  <p className="px-4 py-3 text-center text-[11px] text-gray-500">
                    No match — press Search
                  </p>
                )}
              </div>
            )}
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
          CATEGORY BAR (navbar ke niche) - fixed order me
      ====================================================== */}
      {orderedCategories.length > 0 && (
        <nav
          aria-label="Product categories"
          className="bg-gradient-to-r from-[#123d2a] via-[#0e5c36] to-[#123d2a] text-white shadow-md"
        >
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 whitespace-nowrap scrollbar-none [scrollbar-width:none] sm:justify-center sm:gap-3 sm:px-8 [&::-webkit-scrollbar]:hidden">
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f9cd73] sm:flex">
              <Leaf size={12} />
              Shop by
            </span>
            {orderedCategories.map((category) => (
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
