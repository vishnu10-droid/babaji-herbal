import { useEffect } from "react";
import {
  ArrowRight,
  Leaf,
  Package,
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

  const sourceCategories =
    categoryList || categories || [];

  const activeCategories =
    sourceCategories.filter(
      (category) => category.isActive
    );

  const visibleCategories =
    activeCategories.slice(
      0,
      limit || activeCategories.length
    );

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getCategoryImage = (image) => {
    if (!image) return "";

    return thumbnail(image, 600);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="w-full px-3 py-10 sm:px-4 md:px-6 md:py-12 lg:px-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mx-auto mb-7 max-w-3xl text-center">

        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">

          <Leaf size={13} />

          Shop by category

        </span>

        <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 md:text-4xl">
          Find Your Wellness Solution
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Explore herbal products organised around your
          health needs.
        </p>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <p className="text-center text-sm text-emerald-700">
          Loading categories...
        </p>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <p className="text-center text-sm text-rose-600">
          {error}
        </p>
      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        visibleCategories.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            No active categories are available yet.
          </p>
        )}


      {/* =================================================
          CATEGORY GRID
          
          Mobile  : 2
          Small   : 3
          Large   : 4
          XL      : 5
      ================================================= */}

      {!loading &&
        !error &&
        visibleCategories.length > 0 && (

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {visibleCategories.map(
              (category) => {

                const imageUrl =
                  getCategoryImage(
                    category.image
                  );

                return (
                  <div
                    key={category._id}
                    className="
                      group
                      relative
                      flex
                      min-h-[220px]
                      flex-col
                      overflow-hidden
                      rounded-xl
                      border
                      border-emerald-100
                      bg-white
                      p-3
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-emerald-300
                      hover:shadow-lg
                    "
                  >

                    {/* =================================================
                        BACKGROUND IMAGE
                    ================================================= */}

                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt=""
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          opacity-[0.06]
                          transition
                          duration-500
                          group-hover:scale-105
                          group-hover:opacity-[0.10]
                        "
                      />
                    )}


                    {/* =================================================
                        TOP SECTION
                    ================================================= */}

                    <div className="relative flex items-start justify-between gap-2">

                      {/* CATEGORY IMAGE */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              category.name || ""
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Leaf size={19} />
                        )}

                      </div>


                      {/* PRODUCT COUNT */}

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800">
                        {category.productCount ||
                          0}
                      </span>

                    </div>


                    {/* =================================================
                        CATEGORY CONTENT
                    ================================================= */}

                    <div className="relative mt-2.5">

                      {/* NAME */}

                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                        {category.name}
                      </h3>


                      {/* DESCRIPTION */}

                      <p className="mt-1 line-clamp-2 min-h-[30px] text-[11px] leading-4 text-slate-500">
                        {category.description ||
                          "Natural herbal products for your wellness."}
                      </p>


                      {/* PRODUCT LIST */}

                      <ul className="mt-2.5 space-y-1 text-[11px] text-slate-700">

                        {category.productNames?.length ? (

                          category.productNames
                            .slice(0, 2)
                            .map((name) => (

                              <li
                                key={name}
                                className="flex items-center gap-1.5"
                              >

                                <Leaf
                                  size={10}
                                  className="shrink-0 text-emerald-600"
                                />

                                <span className="truncate">
                                  {name}
                                </span>

                              </li>

                            ))

                        ) : (

                          <li className="flex items-center gap-1.5 text-slate-500">

                            <Package
                              size={11}
                              className="shrink-0 text-emerald-600"
                            />

                            <span className="truncate">
                              Products coming soon
                            </span>

                          </li>

                        )}

                      </ul>

                    </div>


                    {/* =================================================
                        EXPLORE BUTTON
                    ================================================= */}

                    <Link
                      to={`/shop?category=${encodeURIComponent(
                        category._id
                      )}`}
                      className="
                        relative
                        mt-auto
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-1
                        rounded-lg
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-2
                        py-1.5
                        text-[11px]
                        font-bold
                        text-emerald-700
                        transition-all
                        duration-300
                        hover:bg-emerald-600
                        hover:text-white
                        hover:shadow-md
                      "
                    >

                      Explore products

                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />

                    </Link>

                  </div>
                );
              }
            )}

          </div>
        )}


      {/* =================================================
          VIEW ALL CATEGORIES
      ================================================= */}

      {limit &&
        activeCategories.length > limit && (

          <div className="mt-7 text-center">

            <Link
              to="/category"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-200
                px-5
                py-2.5
                text-sm
                font-bold
                text-emerald-700
                transition
                hover:bg-emerald-50
              "
            >

              View all categories

              <ArrowRight size={15} />

            </Link>

          </div>

        )}

    </section>
  );
}