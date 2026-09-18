import { useEffect, useMemo, useState } from "react";
import {
  Filter,
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] =
    useState(false);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const dispatch = useDispatch();

  // =====================================================
  // PRODUCTS
  // =====================================================

  const {
    data: products = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const {
    data: categories = [],
    loading: categoriesLoading,
  } = useSelector((state) => state.category);

  // =====================================================
  // SELECTED CATEGORY
  // =====================================================

  const selectedCategoryId =
    searchParams.get("category") || "";

  const searchQuery = (
    searchParams.get("search") || ""
  ).trim();

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(
        fetchproduct({
          categoryId: selectedCategoryId,
        })
      );
    } else {
      dispatch(fetchproduct());
    }
  }, [dispatch, selectedCategoryId]);

  // =====================================================
  // ACTIVE CATEGORIES
  // =====================================================

  const activeCategories = useMemo(() => {
    return categories.filter(
      (category) => category.isActive
    );
  }, [categories]);

  // =====================================================
  // SELECTED CATEGORY
  // =====================================================

  const selectedCategory = useMemo(() => {
    return activeCategories.find(
      (category) =>
        category._id === selectedCategoryId
    );
  }, [
    activeCategories,
    selectedCategoryId,
  ]);

  // =====================================================
  // VISIBLE CATEGORIES
  // =====================================================

  const visibleCategories =
    categoriesExpanded
      ? activeCategories
      : activeCategories.slice(0, 6);

  // =====================================================
  // TOTAL PRODUCT COUNT
  // =====================================================

  const totalProductCount =
    activeCategories.reduce(
      (total, category) =>
        total +
        Number(category.productCount || 0),
      0
    );

  // =====================================================
  // CATEGORY SELECT
  // =====================================================

  // =====================================================
  // FILTERED PRODUCTS (category + search)
  // =====================================================

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((product) => {
      const name = String(product?.name || "").toLowerCase();
      const description = String(
        product?.description || ""
      ).toLowerCase();
      const categoryName = String(
        product?.category ||
          product?.categoryName ||
          ""
      ).toLowerCase();
      return (
        name.includes(q) ||
        description.includes(q) ||
        categoryName.includes(q)
      );
    });
  }, [products, searchQuery]);

  const selectCategory = (categoryId) => {
    const next = {};
    if (categoryId) next.category = categoryId;
    if (searchQuery) next.search = searchQuery;
    setSearchParams(next);

    setFiltersOpen(false);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchParams({});
    setFiltersOpen(false);
  };

  const clearSearch = () => {
    const next = {};
    if (selectedCategoryId)
      next.category = selectedCategoryId;
    setSearchParams(next);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="w-full px-2 py-8 sm:px-3 md:px-4 lg:px-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mx-auto mb-8 max-w-3xl text-center">

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#28714a]">
          Our collection
        </p>

        <h1 className="mt-2 font-serif text-2xl font-semibold text-[#173b29] sm:text-3xl">
          Shop herbal products
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Find natural essentials selected for your
          everyday wellness ritual.
        </p>

      </div>


      {/* =================================================
          MOBILE FILTER BUTTON
      ================================================= */}

      <div className="mb-5 flex justify-end lg:hidden">

        <button
          type="button"
          onClick={() =>
            setFiltersOpen((open) => !open)
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#cfe1d0]
            bg-white
            px-4
            py-2.5
            text-sm
            font-bold
            text-[#174d32]
            transition
            hover:bg-[#edf4eb]
          "
        >

          <SlidersHorizontal size={16} />

          Categories

        </button>

      </div>


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">


        {/* =================================================
            FILTER SIDEBAR
        ================================================= */}

        <aside
          className={`
            ${
              filtersOpen
                ? "block"
                : "hidden"
            }
            rounded-xl
            border
            border-[#dce8dc]
            bg-white
            p-4
            shadow-sm
            lg:block
            lg:self-start
          `}
        >

          {/* FILTER HEADER */}

          <div className="flex items-center justify-between">

            <div>

              <h2 className="flex items-center gap-2 text-sm font-bold text-[#173b29]">

                <Filter
                  size={16}
                  className="text-[#28714a]"
                />

                Filter

              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                Filter by category
              </p>

            </div>


            {selectedCategoryId && (
              <button
                type="button"
                onClick={() =>
                  selectCategory("")
                }
                className="text-[11px] font-bold text-[#28714a] hover:underline"
              >
                Clear
              </button>
            )}

          </div>


          {/* CATEGORY FILTER */}

          <div className="mt-5 border-t border-[#e4eee4] pt-4">

            <button
              type="button"
              onClick={() =>
                setCategoriesExpanded(
                  (expanded) => !expanded
                )
              }
              className="flex w-full items-center justify-between text-left"
            >

              <h3 className="text-xs font-bold uppercase tracking-wide text-[#173b29]">
                Categories
              </h3>

              <ChevronDown
                size={17}
                className={`
                  text-[#28714a]
                  transition-transform
                  ${
                    categoriesExpanded
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            <div className="mt-3 space-y-2.5">

              {/* ALL CATEGORIES */}

              <label className="flex cursor-pointer items-center justify-between gap-2 text-xs text-slate-700">

                <span className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    checked={
                      !selectedCategoryId
                    }
                    onChange={() =>
                      selectCategory("")
                    }
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-[#28714a]"
                  />

                  All Categories

                </span>

                <span className="text-[10px] text-slate-400">
                  {totalProductCount}
                </span>

              </label>


              {/* LOADING */}

              {categoriesLoading && (
                <p className="text-xs text-slate-500">
                  Loading categories...
                </p>
              )}


              {/* CATEGORY LIST */}

              {!categoriesLoading &&
                visibleCategories.map(
                  (category) => {

                    const isSelected =
                      selectedCategoryId ===
                      category._id;

                    return (
                      <label
                        key={category._id}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          justify-between
                          gap-2
                          text-xs
                          text-slate-700
                        "
                      >

                        <span className="flex min-w-0 items-center gap-2">

                          <input
                            type="checkbox"
                            checked={
                              isSelected
                            }
                            onChange={() =>
                              selectCategory(
                                isSelected
                                  ? ""
                                  : category._id
                              )
                            }
                            className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 accent-[#28714a]"
                          />

                          <span className="truncate">
                            {category.name}
                          </span>

                        </span>

                        <span className="text-[10px] text-slate-400">
                          {category.productCount ||
                            0}
                        </span>

                      </label>
                    );
                  }
                )}

            </div>


            {/* SHOW MORE */}

            {activeCategories.length > 6 && (
              <button
                type="button"
                onClick={() =>
                  setCategoriesExpanded(
                    (expanded) => !expanded
                  )
                }
                className="mt-4 text-[10px] font-bold uppercase tracking-wide text-[#28714a] hover:underline"
              >
                {categoriesExpanded
                  ? "Show less"
                  : `+ ${
                      activeCategories.length -
                      6
                    } more`}
              </button>
            )}

          </div>


          {/* ACTIVE FILTER */}

          {selectedCategory && (
            <div className="mt-5 rounded-lg border border-[#dce8dc] bg-[#f7faf6] p-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active filter
              </p>

              <div className="mt-1.5 flex items-center justify-between gap-2">

                <span className="truncate text-xs font-bold text-[#174d32]">
                  {selectedCategory.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    selectCategory("")
                  }
                  className="rounded-full bg-white p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <X size={13} />
                </button>

              </div>

            </div>
          )}

        </aside>


        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="min-w-0">

          {/* PRODUCTS HEADER */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

            <p className="text-xs text-slate-500">

              {filteredProducts.length} product
              {filteredProducts.length === 1
                ? ""
                : "s"}

              {selectedCategory
                ? ` in ${selectedCategory.name}`
                : ""}

              {searchQuery
                ? ` for "${searchQuery}"`
                : ""}

            </p>


            {/* ACTIVE FILTERS */}

            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() =>
                    selectCategory("")
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#edf4eb]
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-[#28714a]
                    transition
                    hover:bg-[#dfeedd]
                  "
                >

                  {selectedCategory.name}

                  <X size={12} />

                </button>
              )}

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#174d32]
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-white
                    transition
                    hover:bg-[#28714a]
                  "
                >
                  Search: {searchQuery}
                  <X size={12} />
                </button>
              )}
            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

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


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}


          {/* =================================================
              PRODUCTS
          ================================================= */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-3
                  sm:gap-2
                  lg:grid-cols-4
                  lg:gap-2
                "
              >

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    item={product}
                  />
                ))}

              </div>

            )}


          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (

              <div className="rounded-2xl border border-dashed border-[#c8dec9] bg-[#f8faf7] px-6 py-14 text-center">

                <p className="font-semibold text-[#173b29]">
                  No products found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  No products are available
                  {selectedCategory
                    ? ` in ${selectedCategory.name}`
                    : ""}
                  {searchQuery
                    ? ` for "${searchQuery}"`
                    : ""}.
                </p>


                {(selectedCategoryId || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      rounded-full
                      bg-[#174d32]
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-[#28714a]
                    "
                  >
                    Clear filter
                  </button>
                )}

              </div>

            )}

        </div>

      </div>

    </section>
  );
}