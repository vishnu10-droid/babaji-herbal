import { useEffect, useMemo, useState } from "react";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchproduct } from "../store/slice/product.Slice";
import { fetchCategories } from "../store/slice/category.slice";

export default function Shop() {
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const {
    data: products = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  const { data: categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.category,
  );

  // Selected category from URL
  const selectedCategoryId = searchParams.get("category") || "";

  // ============================
  // FETCH CATEGORIES
  // ============================
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ============================
  // FETCH PRODUCTS
  // ============================
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(
        fetchproduct({
          categoryId: selectedCategoryId,
        }),
      );
    } else {
      dispatch(fetchproduct());
    }
  }, [dispatch, selectedCategoryId]);

  // ============================
  // ACTIVE CATEGORIES
  // ============================
  const activeCategories = useMemo(() => {
    return categories.filter((category) => category.isActive);
  }, [categories]);

  // ============================
  // SELECTED CATEGORY
  // ============================
  const selectedCategory = useMemo(() => {
    return activeCategories.find(
      (category) => category._id === selectedCategoryId,
    );
  }, [activeCategories, selectedCategoryId]);

  const visibleCategories = categoriesExpanded
    ? activeCategories
    : activeCategories.slice(0, 6);
  const totalProductCount = activeCategories.reduce(
    (total, category) => total + Number(category.productCount || 0),
    0,
  );

  // ============================
  // SEARCH FILTER
  // ============================
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.brand || ""}
      `.toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [products, query]);

  // ============================
  // CATEGORY SELECT
  // ============================
  const selectCategory = (categoryId) => {
    if (categoryId) {
      setSearchParams({
        category: categoryId,
      });
    } else {
      setSearchParams({});
    }

    setFiltersOpen(false);
  };

  // ============================
  // CLEAR FILTERS
  // ============================
  const clearFilters = () => {
    setQuery("");
    setSearchParams({});
    setFiltersOpen(false);
  };

  return (
    <section className="section-shell py-12">
      {/* ================= HEADER ================= */}
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-[#28714a]">
          Our collection
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#173b29] sm:text-5xl">
          Shop herbal products
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          Find natural essentials selected for your everyday wellness ritual.
        </p>
      </div>

      {/* ================= SEARCH + MOBILE FILTER ================= */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b8767]"
            size={18}
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-[#cfe1d0] bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#28714a] focus:ring-2 focus:ring-[#28714a]/10"
          />
        </div>

        {/* Mobile category button */}
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cfe1d0] bg-white px-5 py-3 text-sm font-bold text-[#174d32] transition hover:bg-[#edf4eb] lg:hidden"
        >
          <SlidersHorizontal size={17} />
          Categories
        </button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* ================= FILTER SIDEBAR ================= */}
        {/* ================= CATEGORY FILTER ================= */}
        <aside
          className={`${
            filtersOpen ? "block" : "hidden"
          } rounded-2xl border border-[#dce8dc] bg-white p-5 shadow-sm lg:block lg:self-start`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-[#173b29]">
                <Filter size={17} className="text-[#28714a]" />
                Filter
              </h2>

              <p className="mt-1 text-xs text-slate-400">Filter by category</p>
            </div>

            {selectedCategoryId && (
              <button
                type="button"
                onClick={() => selectCategory("")}
                className="text-xs font-bold text-[#28714a] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Flipkart-style category filter: one category can be applied at a time. */}
          <div className="mt-6 border-t border-[#e4eee4] pt-5">
            <button type="button" onClick={() => setCategoriesExpanded((expanded) => !expanded)} className="flex w-full items-center justify-between text-left">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#173b29]">Categories</h3>
              <ChevronDown size={18} className={`text-[#28714a] transition-transform ${categoriesExpanded ? "rotate-180" : ""}`} />
            </button>

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700">
                <span className="flex items-center gap-3"><input type="checkbox" checked={!selectedCategoryId} onChange={() => selectCategory("")} className="h-4 w-4 rounded border-slate-300 accent-[#28714a]" /> All Categories</span>
                <span className="text-xs text-slate-400">{totalProductCount}</span>
              </label>

              {categoriesLoading && <p className="text-sm text-slate-500">Loading categories...</p>}
              {!categoriesLoading && visibleCategories.map((category) => {
                const isSelected = selectedCategoryId === category._id;
                return <label key={category._id} className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700">
                  <span className="flex min-w-0 items-center gap-3"><input type="checkbox" checked={isSelected} onChange={() => selectCategory(isSelected ? "" : category._id)} className="h-4 w-4 shrink-0 rounded border-slate-300 accent-[#28714a]" /> <span className="truncate">{category.name}</span></span>
                  <span className="text-xs text-slate-400">{category.productCount || 0}</span>
                </label>;
              })}
            </div>

            {activeCategories.length > 6 && <button type="button" onClick={() => setCategoriesExpanded((expanded) => !expanded)} className="mt-5 text-xs font-bold uppercase tracking-wide text-[#28714a] hover:underline">{categoriesExpanded ? "Show less" : `+ ${activeCategories.length - 6} more`}</button>}
          </div>

          {/* ACTIVE FILTER */}
          {selectedCategory && (
            <div className="mt-6 rounded-xl border border-[#dce8dc] bg-[#f7faf6] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active filter
              </p>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-[#174d32]">
                  {selectedCategory.name}
                </span>

                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  className="rounded-full bg-white p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* ================= PRODUCTS ================= */}
        <div>
          {/* Products header */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"}
                {selectedCategory ? ` in ${selectedCategory.name}` : ""}
              </p>
            </div>

            {/* Active category chip */}
            {selectedCategory && (
              <button
                type="button"
                onClick={() => selectCategory("")}
                className="inline-flex items-center gap-1 rounded-full bg-[#edf4eb] px-3 py-1.5 text-xs font-bold text-[#28714a] transition hover:bg-[#dfeedd]"
              >
                {selectedCategory.name}
                <X size={14} />
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-60 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#dce8dc] border-t-[#28714a]" />

                <p className="mt-3 text-sm text-[#28714a]">
                  Loading products...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Products */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          )}

          {/* No products */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#c8dec9] bg-[#f8faf7] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf4eb] text-[#28714a]">
                <Search size={24} />
              </div>

              <p className="mt-4 font-semibold text-[#173b29]">
                No products found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {selectedCategory
                  ? `No products are available in ${selectedCategory.name}.`
                  : "Try another search or category."}
              </p>

              {(selectedCategoryId || query) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-full bg-[#174d32] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#28714a]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
