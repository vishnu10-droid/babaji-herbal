import AdminSectionPage from "../../../components/admin/AdminSectionPage";

import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { getProducts } from "../../../store/slice/product.slice.js";

export default function ProductsPage() {

  // ==========================================
  // REDUX DISPATCH
  // ==========================================

  const dispatch = useDispatch();


  // ==========================================
  // GET DATA FROM REDUX
  // ==========================================

  const {
    products,
    loading,
    error,
  } = useSelector(
    (state) => state.product
  );


  // ==========================================
  // GET PRODUCTS FROM BACKEND
  // ==========================================

  useEffect(() => {

    dispatch(getProducts());

  }, [dispatch]);


  return (

    <AdminSectionPage
      title="All Products"
      description="Manage product inventory, pricing, and catalog visibility."
      badge="Catalog"
    >

      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-8 text-center">

          <p className="text-sm text-slate-400">
            Loading products...
          </p>

        </div>

      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (

        <div className="rounded-2xl border border-red-800 bg-red-950/30 p-8 text-center">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>

      )}


      {/* ======================================
          NO PRODUCTS
      ====================================== */}

      {!loading &&
        !error &&
        products.length === 0 && (

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-8 text-center">

            <p className="text-sm text-slate-400">
              No products found.
            </p>

          </div>

        )}


      {/* ======================================
          PRODUCTS
      ====================================== */}

      {!loading &&
        !error &&
        products.length > 0 && (

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

            {products.map((item) => (

              <div
                key={item._id}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >

                {/* PRODUCT IMAGE */}

                {item.images?.length > 0 ? (

                  <img
                    src={`http://localhost:3000${item.images[0]}`}
                    alt={item.name}
                    className="mb-4 h-48 w-full rounded-xl object-cover"
                  />

                ) : (

                  <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-slate-900">

                    <span className="text-sm text-slate-500">
                      No Image
                    </span>

                  </div>

                )}


                {/* PRODUCT NAME */}

                <p className="text-sm font-semibold text-white">
                  {item.name}
                </p>


                {/* CATEGORY */}

                <p className="mt-1 text-xs text-slate-400">
                  Category: {item.category}
                </p>


                {/* PRICE */}

                <p className="mt-1 text-xs text-slate-400">
                  Price: ₹{item.sellingPrice}
                </p>


                {/* STOCK */}

                <p className="mt-1 text-xs text-slate-400">
                  Stock: {item.stock} units
                </p>


                {/* STATUS */}

                <p className="mt-1 text-xs text-slate-400">
                  Status: {item.status}
                </p>


                {/* FEATURED */}

                <p className="mt-1 text-xs text-slate-400">
                  {item.featured
                    ? "Featured"
                    : "Not Featured"}
                </p>


                {/* DESCRIPTION */}

                {item.shortDescription && (

                  <p className="mt-3 line-clamp-2 text-xs text-slate-500">
                    {item.shortDescription}
                  </p>

                )}


                {/* BUTTONS */}

                <div className="mt-4 flex gap-2">

                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

    </AdminSectionPage>

  );
}