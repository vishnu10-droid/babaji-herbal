import { useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";

import { API_ORIGIN } from "../config/config";

import { addToCart } from "../store/slice/cart.slice";

import {
  fetchWishlist,
  removeFromWishlist,
} from "../store/slice/wishlist.slice";

export default function Wishlist() {
  const dispatch = useDispatch();

  const {
    items: wishlist = [],
    loading,
    error,
  } = useSelector((state) => state.wishlist);

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(
        removeFromWishlist(productId)
      ).unwrap();
    } catch (error) {
      console.error("Remove wishlist error:", error);

      alert(
        error?.message ||
          error ||
          "Failed to remove product"
      );
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getProductImage = (product) => {
    if (!product) {
      return "";
    }

    const rawImage =
      product.image ||
      product.images?.[0] ||
      product.thumbnail ||
      "";

    if (!rawImage) {
      return "https://via.placeholder.com/500x500?text=No+Image";
    }

    // Already a complete URL
    if (
      rawImage.startsWith("http://") ||
      rawImage.startsWith("https://")
    ) {
      return rawImage;
    }

    // Backend image path
    return `${API_ORIGIN}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
  };

  // =====================================================
  // PRODUCT PRICE
  // =====================================================

  const getProductPrice = (product) => {
    if (!product) return 0;

    return (
      product.sellingPrice ??
      product.price ??
      product.mrp ??
      0
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {
    if (!product?._id) {
      console.error(
        "Product ID missing:",
        product
      );
      return;
    }

    const price = getProductPrice(product);

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name || "Product",
        price,
        image: getProductImage(product),
        quantity: 1,

        variation:
          product.variation || null,
      })
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[{ label: "Wishlist" }]}
        />

        <section className="section-shell py-10">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <h1 className="font-display text-3xl">
              Wishlist
            </h1>

            <div className="mt-8 flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2f6b3f] border-t-transparent" />
            </div>
          </div>
        </section>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <>
        <Breadcrumb
          items={[{ label: "Wishlist" }]}
        />

        <section className="section-shell py-10">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-lg">
            <Heart className="mx-auto h-14 w-14 text-slate-300" />

            <h1 className="mt-4 font-display text-2xl">
              Wishlist
            </h1>

            <p className="mt-2 text-slate-600">
              {typeof error === "string"
                ? error
                : "Failed to load wishlist"}
            </p>

            <button
              onClick={() =>
                dispatch(fetchWishlist())
              }
              className="mt-6 rounded-full bg-[#2f6b3f] px-6 py-3 font-semibold text-white transition hover:bg-[#245530]"
            >
              Try Again
            </button>
          </div>
        </section>
      </>
    );
  }

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlist.length === 0) {
    return (
      <>
        <Breadcrumb
          items={[{ label: "Wishlist" }]}
        />

        <section className="section-shell py-10">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef6ef]">
              <Heart className="h-10 w-10 text-[#2f6b3f]" />
            </div>

            <h1 className="mt-5 font-display text-3xl">
              Your Wishlist is Empty
            </h1>

            <p className="mt-2 text-slate-600">
              Save your favourite herbal products
              here and shop them whenever you want.
            </p>
          </div>
        </section>
      </>
    );
  }

  // =====================================================
  // WISHLIST
  // =====================================================

  return (
    <>
      <Breadcrumb
        items={[{ label: "Wishlist" }]}
      />

      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-6 shadow-lg">

          {/* HEADER */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl">
                Wishlist
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "item"
                  : "items"}{" "}
                saved
              </p>
            </div>

            <Heart
              className="h-7 w-7 fill-red-500 text-red-500"
            />
          </div>

          {/* PRODUCTS */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => {

              // =================================================
              // POPULATED PRODUCT
              // =================================================

              const product = item?.product;

              // If backend didn't populate product
              if (
                !product ||
                typeof product !== "object"
              ) {
                console.warn(
                  "Wishlist product not populated:",
                  item
                );

                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-red-100 bg-red-50 p-5"
                  >
                    <p className="text-sm font-semibold text-red-600">
                      Product details unavailable
                    </p>

                    <p className="mt-1 text-xs text-red-500">
                      Product ID:{" "}
                      {String(product || "")}
                    </p>
                  </div>
                );
              }

              const productImage =
                getProductImage(product);

              const productPrice =
                getProductPrice(product);

              return (
                <div
                  key={item._id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                    bg-white
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative aspect-square overflow-hidden bg-[#f5f8f5]">

                    <img
                      src={productImage}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://via.placeholder.com/500x500?text=No+Image";
                      }}
                    />

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFromWishlist(
                          product._id
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        shadow-md
                        transition
                        hover:bg-red-50
                      "
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-5">

                    {/* PRODUCT NAME */}

                    <h2 className="line-clamp-2 font-semibold text-slate-900">
                      {product.name ||
                        "Unnamed Product"}
                    </h2>

                    {/* CATEGORY */}

                    {product.category && (
                      <p className="mt-1 text-sm text-slate-500">
                        {typeof product.category ===
                        "object"
                          ? product.category.name
                          : product.category}
                      </p>
                    )}

                    {/* PRICE */}

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-xl font-bold text-[#2f6b3f]">
                        ₹
                        {Number(
                          productPrice
                        ).toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* VARIATION */}

                    {product.variations?.length >
                      0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        {product.variations.length}{" "}
                        variations available
                      </p>
                    )}

                    {/* ADD TO CART */}

                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                        "
                      >
                        <ShoppingBag className="h-4 w-4" />

                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}