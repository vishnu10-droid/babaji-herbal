import { useEffect } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";

import { thumbnail } from "../utils/image";

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
      console.error(
        "Remove wishlist error:",
        error
      );

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

    return thumbnail(rawImage, 500);
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

    const price =
      getProductPrice(product);

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

        <section className="section-shell py-8">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-lg">

            <h1 className="font-display text-2xl md:text-3xl">
              Wishlist
            </h1>

            <div className="mt-6 flex justify-center py-12">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#2f6b3f] border-t-transparent" />
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

        <section className="section-shell py-8">
          <div className="rounded-[1.5rem] bg-white p-7 text-center shadow-lg">

            <Heart className="mx-auto h-12 w-12 text-slate-300" />

            <h1 className="mt-4 font-display text-2xl">
              Wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {typeof error === "string"
                ? error
                : "Failed to load wishlist"}
            </p>

            <button
              onClick={() =>
                dispatch(fetchWishlist())
              }
              className="mt-5 rounded-full bg-[#2f6b3f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245530]"
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

        <section className="section-shell py-8">

          <div className="rounded-[1.5rem] bg-white p-8 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ef]">

              <Heart className="h-8 w-8 text-[#2f6b3f]" />

            </div>

            <h1 className="mt-4 font-display text-2xl md:text-3xl">
              Your Wishlist is Empty
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              Save your favourite herbal products here
              and shop them whenever you want.
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

      <section className="section-shell py-8">

        <div className="rounded-[1.5rem] bg-white p-4 shadow-lg md:p-5">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between gap-3">

            <div>

              <h1 className="font-display text-2xl md:text-3xl">
                Wishlist
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "item"
                  : "items"}{" "}
                saved
              </p>

            </div>

            <Heart className="h-6 w-6 fill-red-500 text-red-500" />

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {wishlist.map((item) => {

              // =================================================
              // PRODUCT
              // =================================================

              const product = item?.product;

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
                    className="rounded-xl border border-red-100 bg-red-50 p-3"
                  >

                    <p className="text-xs font-semibold text-red-600">
                      Product details unavailable
                    </p>

                    <p className="mt-1 text-[11px] text-red-500">
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


              // =================================================
              // PRODUCT CARD
              // =================================================

              return (
                <div
                  key={item._id}
                  className="
                    group
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-100
                    bg-white
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative aspect-square overflow-hidden bg-[#f5f8f5] p-2">

                    <img
                      src={productImage}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="
                        h-full
                        w-full
                        object-contain
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
                        right-2
                        top-2
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        shadow-sm
                        transition
                        hover:bg-red-50
                      "
                      title="Remove from wishlist"
                    >

                      <Trash2 className="h-3.5 w-3.5 text-red-500" />

                    </button>

                  </div>


                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="p-2.5">

                    {/* PRODUCT NAME */}

                    <h2 className="line-clamp-1 text-xs font-semibold text-slate-900 sm:text-sm">
                      {product.name ||
                        "Unnamed Product"}
                    </h2>


                    {/* CATEGORY */}

                    {product.category && (
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500 sm:text-xs">

                        {typeof product.category ===
                        "object"
                          ? product.category.name
                          : product.category}

                      </p>
                    )}


                    {/* PRICE */}

                    <div className="mt-1.5">

                      <span className="text-sm font-bold text-[#2f6b3f]">
                        ₹
                        {Number(
                          productPrice
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>


                    {/* VARIATION */}

                    {product.variations?.length >
                      0 && (
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {
                          product.variations
                            .length
                        }{" "}
                        variations
                      </p>
                    )}


                    {/* ADD TO CART */}

                    <div className="mt-2.5">

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
                          gap-1
                          rounded-full
                          px-2
                          py-1.5
                          text-[11px]
                          sm:text-xs
                        "
                      >

                        <ShoppingBag className="h-3 w-3" />

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