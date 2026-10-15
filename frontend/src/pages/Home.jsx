import { useEffect } from "react";
import {
  Award,
  ArrowRight,
  Headphones,
  Leaf,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Hero from "../components/Hero";
import FAQ from "../components/FAQ";
import ProductCard from "../components/ProductCard";
import CategoryShowcase from "../components/CategoryShowcase";

import { fetchproduct } from "../store/slice/product.Slice";

// =====================================================
// ASSURANCE DATA
// =====================================================

const assurances = [
  {
    icon: Leaf,
    title: "Natural ingredients",
    text: "Thoughtfully sourced herbal care",
  },
  {
    icon: Award,
    title: "Quality checked",
    text: "Made with care, batch by batch",
  },
  {
    icon: Truck,
    title: "Easy delivery",
    text: "Wellness delivered to your door",
  },
  {
    icon: Headphones,
    title: "Here to help",
    text: "Friendly support when you need it",
  },
];

// =====================================================
// ASSURANCE STRIP
// =====================================================

function AssuranceStrip() {
  return (
    <section className="border-y border-[#dce8dc] bg-white">

      <div className="section-shell grid grid-cols-2 divide-[#dce8dc] max-sm:gap-x-2 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">

        {assurances.map(
          ({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-2.5 py-4 sm:gap-3 sm:px-5 sm:py-5 lg:px-7"
            >

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf4eb] text-[#28714a] sm:h-10 sm:w-10">
                <Icon size={17} />
              </span>

              <div className="min-w-0">

                <p className="truncate text-[13px] font-bold text-[#173b29] sm:text-sm">
                  {title}
                </p>

                <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500 sm:text-xs">
                  {text}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </section>
  );
}

// =====================================================
// PRODUCT SKELETON
// =====================================================

function ProductSkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#dce8dc] bg-white p-2.5">

      <div className="h-32 animate-pulse rounded-lg bg-[#edf4eb] sm:h-36" />

      <div className="mt-3 h-2.5 w-16 animate-pulse rounded bg-slate-100" />

      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />

      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-100" />

      <div className="mt-3 h-7 w-full animate-pulse rounded-md bg-slate-100" />

    </div>
  );
}

// =====================================================
// HOME
// =====================================================

export default function Home() {
  const dispatch = useDispatch();

  const {
    data: products = [],
    loading,
    error,
  } = useSelector(
    (state) => state.product
  );

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchproduct());
  }, [dispatch]);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {/* =================================================
          HERO
      ================================================= */}

      <Hero />


      {/* =================================================
          ASSURANCE
      ================================================= */}

      <AssuranceStrip />


      {/* =================================================
          CATEGORY SHOWCASE
      ================================================= */}

      <CategoryShowcase limit={8} />


      {/* =================================================
          PRODUCTS SECTION
      ================================================= */}

      <section className="bg-[#f8faf7] py-8 sm:py-12 md:py-14">

        {/* =================================================
            FULL WIDTH PRODUCT CONTAINER

            section-shell removed here so that the
            product grid gets more width.
        ================================================= */}

        <div className="w-full px-3 sm:px-3 md:px-4 lg:px-5 xl:px-6">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-5 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-3">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#28714a]">
                Customer favourites
              </p>

              <h2 className="mt-1.5 font-serif text-2xl font-semibold leading-tight text-[#173b29] sm:mt-2 sm:text-4xl">
                Wellness, chosen by you
              </h2>

              <p className="mt-1.5 max-w-xl text-[13px] leading-5 text-slate-500 sm:mt-2 sm:text-sm">
                Shop everyday herbal essentials loved
                for their purity, simplicity and
                feel-good results.
              </p>

            </div>


            {/* VIEW ALL */}

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#28714a] transition hover:gap-3"
            >
              View all products

              <ArrowRight size={17} />

            </Link>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <p className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              We couldn’t load the product collection
              right now. Please try again shortly.
            </p>
          )}


          {/* =================================================
              PRODUCT GRID

              MOBILE  = 2
              SM      = 3
              MD      = 4
              XL      = 5
              
              SIDE GAP = LOW
              CARD GAP = LOW
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-3
              sm:gap-2.5
              md:grid-cols-4
              md:gap-3
              xl:grid-cols-5
              xl:gap-3
            "
          >

            {/* =================================================
                LOADING
            ================================================= */}

            {loading &&
              Array.from({
                length: 5,
              }).map((_, index) => (
                <ProductSkeleton
                  key={index}
                />
              ))}


            {/* =================================================
                PRODUCTS - ALL PRODUCTS
            ================================================= */}

            {!loading &&
              products.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}

          </div>


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            products.length === 0 && (

              <div className="mt-4 rounded-2xl border border-dashed border-[#c8dec9] bg-white p-8 text-center text-sm text-slate-500">

                Our first collection is being
                prepared. Please check back soon.

              </div>

            )}

        </div>

      </section>


      {/* =================================================
          FAQ
      ================================================= */}

      <FAQ />

    </>
  );
}
