import { useEffect } from "react";
import {
  ArrowRight,
  Leaf,
  Package,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../store/slice/category.slice";
import { thumbnail } from "../utils/image";

export default function CategoryShowcase({
  limit,
  categoryList,
}) {
  const dispatch = useDispatch();

  const {
    data: categories = [],
    loading,
    error,
  } = useSelector((state) => state.category);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const sourceCategories = categoryList || categories || [];

  const activeCategories = sourceCategories.filter(
    (category) => category.isActive
  );

  const visibleCategories = activeCategories.slice(
    0,
    limit || activeCategories.length
  );

  // =====================================================
  // IMAGE
  // =====================================================

  const getCategoryImage = (image) => {
    if (!image) return "";
    return thumbnail(image, 700);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="w-full bg-gradient-to-b from-white via-emerald-50/20 to-white px-3 py-12 sm:px-5 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {/* Small Badge */}

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            <Sparkles size={12} />
            Explore Categories
          </div>

          {/* Heading */}

          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[42px]">
            Find Your{" "}
            <span className="text-emerald-600">
              Wellness Solution
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Discover thoughtfully selected herbal products
            organised around your everyday health and
            wellness needs.
          </p>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="aspect-[1/0.82] animate-pulse bg-slate-100" />

                <div className="space-y-2.5 p-3.5">
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-100" />

                  <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-2.5 w-4/5 animate-pulse rounded bg-slate-100" />

                  <div className="mt-3 h-8 w-full animate-pulse rounded-lg bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          visibleCategories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Leaf size={20} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No categories available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                New wellness categories will appear here.
              </p>
            </div>
          )}

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        {!loading &&
          !error &&
          visibleCategories.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleCategories.map((category) => {
                const imageUrl = getCategoryImage(
                  category.image
                );

                return (
                  <Link
                    key={category._id}
                    to={`/shop?category=${encodeURIComponent(
                      category._id
                    )}`}
                    className="group relative block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_15px_40px_rgba(16,185,129,0.13)]"
                  >
                    {/* =================================================
                        IMAGE AREA
                    ================================================= */}

                    <div className="relative aspect-[1/0.88] overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={category.name || "Category"}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                            <Leaf
                              size={24}
                              className="text-emerald-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Image Gradient */}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-70" />

                      {/* Top Glow */}

                      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/20 blur-2xl" />

                      {/* =================================================
                          PRODUCT COUNT
                      ================================================= */}

                      <div className="absolute right-2.5 top-2.5">
                        <div className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
                          <Package
                            size={10}
                            className="text-emerald-600"
                          />

                          <span className="text-[9px] font-extrabold text-slate-700">
                            {category.productCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                          CATEGORY ICON
                      ================================================= */}

                      <div className="absolute bottom-2.5 left-2.5">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-emerald-50 shadow-md">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Leaf
                              size={14}
                              className="text-emerald-600"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="p-3.5">
                      {/* Category Name */}

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            title={category.name}
                            className="truncate text-sm font-extrabold text-slate-900 transition-colors group-hover:text-emerald-700"
                          >
                            {category.name}
                          </h3>

                          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                            Wellness category
                          </p>
                        </div>

                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                          <ChevronRight size={13} />
                        </span>
                      </div>

                      {/* Description */}

                      <p className="mt-2 line-clamp-2 min-h-[30px] text-[10px] leading-[15px] text-slate-500">
                        {category.description ||
                          "Natural herbal products for your everyday wellness."}
                      </p>

                      {/* Product Names */}

                      <div className="mt-2.5 min-h-[30px]">
                        {category.productNames?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {category.productNames
                              .slice(0, 2)
                              .map((name) => (
                                <span
                                  key={name}
                                  className="max-w-full truncate rounded-md bg-slate-50 px-1.5 py-1 text-[8px] font-semibold text-slate-500"
                                >
                                  {name}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                            <Leaf
                              size={10}
                              className="shrink-0 text-emerald-500"
                            />

                            <span>
                              Products coming soon
                            </span>
                          </div>
                        )}
                      </div>

                      {/* =================================================
                          EXPLORE
                      ================================================= */}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <span className="text-[9px] font-bold text-slate-400">
                          Explore collection
                        </span>

                        <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 transition-all group-hover:gap-1.5">
                          Shop
                          <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        {/* =================================================
            VIEW ALL
        ================================================= */}

        {limit &&
          activeCategories.length > limit && (
            <div className="mt-8 flex justify-center">
              <Link
                to="/category"
                className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-xs font-extrabold text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
              >
                View all categories

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}