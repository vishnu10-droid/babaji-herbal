import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";

import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";

import { API_URL } from "../config/config";
import { detailImage } from "../utils/image";

import { addToCart } from "../store/slice/cart.slice";
import { useAuth } from "../context/auth-context";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setError("");
        setProduct(null);
        setCartMessage("");

        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (cancelled) return;

        setProduct(data);
        setActiveImageIndex(0);

        const firstVariation = data?.variations?.find(
          (variation) => variation.isActive !== false,
        );

        if (firstVariation) {
          setSelectedVariationId(firstVariation._id);
        } else {
          setSelectedVariationId("");
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError?.message || "Unable to load product.");
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const productImages = useMemo(
    () =>
      product?.images?.map((productImage) => detailImage(productImage, 1000)) ||
      [],
    [product],
  );

  useEffect(() => {
    if (productImages.length < 2) return undefined;

    const slider = window.setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % productImages.length);
    }, 3000);

    return () => window.clearInterval(slider);
  }, [productImages.length]);

  // =====================================================
  // SELECTED VARIATION
  // =====================================================

  const selectedVariation = useMemo(() => {
    if (!product?.variations?.length) {
      return null;
    }

    return (
      product.variations.find(
        (variation) => variation._id === selectedVariationId,
      ) ||
      product.variations.find((variation) => variation.isActive !== false) ||
      product.variations[0]
    );
  }, [product, selectedVariationId]);

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const image = productImages[activeImageIndex]
    ? productImages[activeImageIndex]
    : "https://placehold.co/500x450/ffffff/2563eb?text=Babaji+Herbals";

  const showPreviousImage = () => {
    setActiveImageIndex(
      (index) => (index - 1 + productImages.length) % productImages.length,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((index) => (index + 1) % productImages.length);
  };

  // =====================================================
  // PRICE
  // =====================================================

  const currentPrice = selectedVariation?.price ?? product?.sellingPrice ?? 0;

  const currentMrp = selectedVariation?.mrp ?? product?.mrp ?? currentPrice;

  const currentStock = selectedVariation?.stock ?? product?.stock ?? 0;

  // =====================================================
  // DISCOUNT
  // =====================================================

  const discount =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) {
      return;
    }

    if (!isAuthenticated) {
      setCartMessage("Please login to add products to cart.");
      return;
    }

    if (Number(currentStock) <= 0) {
      setCartMessage("This product is out of stock.");
      return;
    }

    try {
      setIsAddingToCart(true);
      setCartMessage("");

      const payload = {
        productId: product._id,
        quantity: 1,
      };

      if (selectedVariation?._id) {
        payload.variationId = selectedVariation._id;
      }

      await dispatch(addToCart(payload)).unwrap();

      setCartMessage(
        selectedVariation
          ? `${selectedVariation.name} added to cart`
          : `${product.name} added to cart`,
      );

      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    } catch (requestError) {
      const message =
        typeof requestError === "string"
          ? requestError
          : requestError?.message || "Product could not be added to cart.";

      setCartMessage(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!product && !error) {
    return (
      <section className="section-shell py-10 text-center">
        <p className="text-sm text-blue-600">Loading product...</p>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="section-shell py-10 text-center">
        <p className="text-sm text-rose-600">{error}</p>
      </section>
    );
  }

  // =====================================================
  // PRODUCT DETAILS
  // =====================================================

  return (
    <>
      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <Breadcrumb
        items={[
          {
            label: "Shop",
            to: "/shop",
          },
          {
            label: product.name,
          },
        ]}
      />

      {/* =================================================
          COMPACT PRODUCT SECTION
      ================================================= */}

      <section className="section-shell px-3 py-2 sm:px-4 sm:py-3">
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-6xl
            grid-cols-1
            gap-3
            rounded-xl
            bg-white
            p-3
            shadow-md
            sm:grid-cols-[420px_minmax(0,1fr)]
            sm:gap-5
            sm:p-5
            lg:grid-cols-[520px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            className="
              relative
              flex
              h-[360px]
              items-center
              justify-center
              overflow-hidden
              rounded-lg
              bg-slate-50
              p-3
              sm:h-[500px]
              lg:h-[560px]
            "
          >
            <img
              key={image}
              src={image}
              alt={product.name}
              className="
                h-full
                w-full
                object-contain
              "
            />
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Show previous product image"
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="Show next product image"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-900/50 px-2 py-1.5">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Show product image ${index + 1}`}
                      className={`h-2 w-2 rounded-full transition ${activeImageIndex === index ? "bg-white" : "bg-white/45 hover:bg-white/75"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="min-w-0">
            {/* CATEGORY */}

            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-blue-600
              "
            >
              {product.category || "Herbal Care"}
            </p>

            {/* NAME */}

            <h1
              className="
                mt-1
                text-xl
                font-bold
                leading-6
                text-slate-900
                sm:text-2xl
                sm:leading-7
              "
            >
              {product.name}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-1.5
                line-clamp-2
                text-[11px]
                leading-4
                text-slate-500
              "
            >
              {product.description ||
                product.shortDescription ||
                "Natural herbal care for your daily wellness routine."}
            </p>

            {/* =================================================
                VARIATIONS
            ================================================= */}

            {product.variations?.length > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Variations
                  </h2>

                  {selectedVariation && (
                    <span className="text-[10px] text-slate-500">
                      Selected:{" "}
                      <span className="font-bold text-blue-600">
                        {selectedVariation.name}
                      </span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {product.variations
                    .filter((variation) => variation.isActive !== false)
                    .map((variation) => {
                      const isSelected =
                        selectedVariation?._id === variation._id;

                      const variationStock = Number(variation.stock) || 0;

                      const variationDiscount =
                        variation.mrp > variation.price
                          ? Math.round(
                              ((variation.mrp - variation.price) /
                                variation.mrp) *
                                100,
                            )
                          : 0;

                      return (
                        <button
                          key={variation._id}
                          type="button"
                          disabled={variationStock <= 0}
                          onClick={() => setSelectedVariationId(variation._id)}
                          className={`
                            relative
                            rounded-md
                            border
                            p-2
                            text-left
                            transition
                            ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-blue-300"
                            }
                            ${
                              variationStock <= 0
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }
                          `}
                        >
                          {/* CHECK */}

                          {isSelected && (
                            <span
                              className="
                                absolute
                                right-1.5
                                top-1.5
                                flex
                                h-4
                                w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-600
                                text-white
                              "
                            >
                              <Check size={10} />
                            </span>
                          )}

                          {/* NAME */}

                          <p
                            className={`
                              pr-5
                              text-[11px]
                              font-bold
                              ${isSelected ? "text-blue-700" : "text-slate-800"}
                            `}
                          >
                            {variation.name || `${variation.pouches} pouches`}
                          </p>

                          {/* PRICE */}

                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900">
                              ₹{Number(variation.price).toLocaleString("en-IN")}
                            </span>

                            {variation.mrp > variation.price && (
                              <span className="text-[9px] text-slate-400 line-through">
                                ₹{Number(variation.mrp).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          {/* POUCHES + STOCK */}

                          <div className="mt-0.5 flex items-center justify-between">
                            <span className="text-[9px] text-slate-500">
                              {variation.pouches ?? 0} pouches
                            </span>

                            <span
                              className={`
                                text-[9px]
                                font-semibold
                                ${
                                  variationStock > 0
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }
                              `}
                            >
                              {variationStock > 0 ? "In Stock" : "Out"}
                            </span>
                          </div>

                          {/* DISCOUNT */}

                          {variationDiscount > 0 && (
                            <span
                              className="
                                mt-1
                                inline-block
                                rounded
                                bg-blue-100
                                px-1.5
                                py-0.5
                                text-[8px]
                                font-bold
                                text-blue-700
                              "
                            >
                              {variationDiscount}% OFF
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* =================================================
                PRICE SECTION
            ================================================= */}

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-end
                gap-x-4
                gap-y-1
                border-t
                border-slate-100
                pt-2.5
              "
            >
              {/* MRP */}

              <div>
                <p className="text-[9px] text-slate-400">Product MRP</p>

                <p className="text-xs font-semibold text-slate-400 line-through">
                  ₹{Number(currentMrp).toLocaleString("en-IN")}
                </p>
              </div>

              {/* SELLING PRICE */}

              <div>
                <p className="text-[9px] text-slate-500">Selling Price</p>

                <p className="text-xl font-bold text-slate-900">
                  ₹{Number(currentPrice).toLocaleString("en-IN")}
                </p>
              </div>

              {/* DISCOUNT */}

              {discount > 0 && (
                <span
                  className="
                    mb-0.5
                    rounded
                    bg-blue-600
                    px-1.5
                    py-0.5
                    text-[8px]
                    font-bold
                    text-white
                  "
                >
                  {discount}% OFF
                </span>
              )}

              <p className="mb-1 text-[9px] text-slate-400">
                Inclusive of all taxes
              </p>
            </div>

            {/* =================================================
                STOCK + RATING
            ================================================= */}

            <div className="mt-2 flex items-center justify-between">
              {/* STOCK */}

              {Number(currentStock) > 0 ? (
                <span
                  className="
                    text-[10px]
                    font-bold
                    text-emerald-600
                  "
                >
                  ✓ In Stock
                </span>
              ) : (
                <span
                  className="
                    text-[10px]
                    font-bold
                    text-rose-600
                  "
                >
                  Out of Stock
                </span>
              )}

              {/* RATING */}

              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} fill="currentColor" />
                ))}

                <span className="ml-1 text-[9px] text-slate-500">5.0</span>
              </div>
            </div>

            {/* =================================================
                ADD TO CART
            ================================================= */}

            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={!product || Number(currentStock) <= 0 || isAddingToCart}
              className="
                mt-3
                flex
                h-9
                w-full
                items-center
                justify-center
                rounded-md
                bg-blue-600
                px-4
                text-xs
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:bg-slate-400
              "
            >
              <ShoppingCart className="mr-1.5" size={15} />

              {isAddingToCart
                ? "Adding..."
                : Number(currentStock) <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
            </Button>

            {/* =================================================
                CART MESSAGE
            ================================================= */}

            {cartMessage && (
              <div
                className={`
                  mt-2
                  rounded-md
                  border
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  ${
                    cartMessage.toLowerCase().includes("added")
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-rose-100 bg-rose-50 text-rose-700"
                  }
                `}
              >
                {cartMessage}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
