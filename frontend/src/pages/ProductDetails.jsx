import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";

import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";

import {
  API_ORIGIN,
  API_URL,
} from "../config/config";
import { addToCart } from "../store/slice/cart.slice";
import { useAuth } from "../context/auth-context";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);

  const [error, setError] = useState("");

  const [selectedVariationId, setSelectedVariationId] =
    useState("");

  const [cartMessage, setCartMessage] =
    useState("");

  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setError("");
        setProduct(null);

        const response = await fetch(
          `${API_URL}/products/${id}`,
        );

        if (!response.ok) {
          throw new Error(
            "Product not found",
          );
        }

        const data =
          await response.json();

        if (cancelled) return;

        setProduct(data);

        // Automatically select first active variation
        const firstVariation =
          data.variations?.find(
            (variation) =>
              variation.isActive !== false,
          );

        if (firstVariation) {
          setSelectedVariationId(
            firstVariation._id,
          );
        } else {
          setSelectedVariationId("");
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.message,
          );
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ========================================
  // SELECTED VARIATION
  // ========================================

  const selectedVariation =
    useMemo(() => {
      if (
        !product?.variations?.length
      ) {
        return null;
      }

      return (
        product.variations.find(
          (variation) =>
            variation._id ===
            selectedVariationId,
        ) ||
        product.variations.find(
          (variation) =>
            variation.isActive !== false,
        ) ||
        product.variations[0]
      );
    }, [
      product,
      selectedVariationId,
    ]);

  // ========================================
  // IMAGE
  // ========================================

  const image = product?.images?.[0]
    ? `${API_ORIGIN}${product.images[0]}`
    : "https://placehold.co/700x600/eaf2ff/2563eb?text=Babaji+Herbals";

  // ========================================
  // CURRENT PRICE
  // ========================================

  const currentPrice =
    selectedVariation?.price ??
    product?.sellingPrice ??
    0;

  const currentMrp =
    selectedVariation?.mrp ??
    product?.mrp ??
    currentPrice;

  const currentPouches =
    selectedVariation?.pouches ??
    null;

  const currentStock =
    selectedVariation?.stock ??
    product?.stock ??
    0;

  // ========================================
  // DISCOUNT
  // ========================================

  const discount =
    currentMrp > currentPrice
      ? Math.round(
          ((currentMrp - currentPrice) /
            currentMrp) *
            100,
        )
      : 0;

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = async () => {
    if (
      selectedVariation &&
      currentStock <= 0
    ) {
      setCartMessage(
        "This variation is out of stock.",
      );

      return;
    }

    if (!isAuthenticated) {
      setCartMessage("Please login to add products to cart.");
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        variationId: selectedVariation?._id || undefined,
        quantity: 1,
      })).unwrap();

      setCartMessage(selectedVariation ? `${selectedVariation.name} added to cart` : `${product.name} added to cart`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (requestError) {
      setCartMessage(requestError || "Product could not be added to cart.");
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (!product && !error) {
    return (
      <section className="section-shell py-20 text-center">
        <p className="text-blue-600">
          Loading product...
        </p>
      </section>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <section className="section-shell py-20 text-center">
        <p className="text-rose-600">
          {error}
        </p>
      </section>
    );
  }

  return (
    <>
      {/* ========================================
          BREADCRUMB
      ======================================== */}

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

      <section className="section-shell py-10">
        <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-lg lg:grid-cols-2">

          {/* ========================================
              PRODUCT IMAGE
          ======================================== */}

          <div className="flex min-h-[500px] items-center justify-center rounded-[1.5rem] bg-blue-50 p-8">
            <img
              src={image}
              alt={product.name}
              className="h-[420px] w-full rounded-[1.5rem] object-contain"
            />
          </div>

          {/* ========================================
              PRODUCT INFORMATION
          ======================================== */}

          <div className="py-2">

            {/* CATEGORY */}

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              {product.category}
            </p>

            {/* PRODUCT NAME */}

            <h1 className="mt-3 font-display text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-3 leading-7 text-slate-600">
              {product.description ||
                product.shortDescription ||
                "Natural herbal care for your daily wellness routine."}
            </p>

            {/* ========================================
                VARIATIONS
            ======================================== */}

            {product.variations?.length >
              0 && (
              <div className="mt-7">

                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Variations
                  </h2>

                  {selectedVariation && (
                    <span className="text-sm text-slate-500">
                      Selected:{" "}
                      <span className="font-bold text-blue-600">
                        {
                          selectedVariation.name
                        }
                      </span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {product.variations
                    .filter(
                      (variation) =>
                        variation.isActive !==
                        false,
                    )
                    .map(
                      (variation) => {
                        const isSelected =
                          selectedVariation?._id ===
                          variation._id;

                        const variationDiscount =
                          variation.mrp >
                          variation.price
                            ? Math.round(
                                ((variation.mrp -
                                  variation.price) /
                                  variation.mrp) *
                                  100,
                              )
                            : 0;

                        return (
                          <button
                            key={
                              variation._id
                            }
                            type="button"
                            onClick={() =>
                              setSelectedVariationId(
                                variation._id,
                              )
                            }
                            className={`relative rounded-xl border-2 p-4 text-left transition ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-md"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                            }`}
                          >
                            {/* CHECK ICON */}

                            {isSelected && (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                                <Check
                                  size={
                                    12
                                  }
                                />
                              </span>
                            )}

                            {/* VARIATION NAME */}

                            <p
                              className={`pr-5 text-sm font-bold ${
                                isSelected
                                  ? "text-blue-700"
                                  : "text-slate-800"
                              }`}
                            >
                              {
                                variation.name
                              }
                            </p>

                            {/* PRICE */}

                            <p className="mt-2 text-lg font-bold text-slate-900">
                              ₹
                              {Number(
                                variation.price,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </p>

                            {/* POUCHES */}

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                variation.pouches
                              }{" "}
                              pouches
                            </p>

                            {/* DISCOUNT */}

                            {variationDiscount >
                              0 && (
                              <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                                {
                                  variationDiscount
                                }
                                % OFF
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                </div>
              </div>
            )}

            {/* ========================================
                PRICE
            ======================================== */}

            <div className="mt-7 border-t border-slate-100 pt-6">

              {/* DISCOUNT */}

              {discount > 0 && (
                <span className="inline-flex rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              )}

              {/* MRP */}

              <p className="mt-4 text-sm text-slate-400">
                Product MRP:
              </p>

              <p className="text-sm font-semibold text-slate-400 line-through">
                ₹
                {Number(
                  currentMrp,
                ).toLocaleString(
                  "en-IN",
                )}
              </p>

              {/* SELLING PRICE */}

              <p className="mt-4 text-sm text-slate-600">
                Selling Price:
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                ₹
                {Number(
                  currentPrice,
                ).toLocaleString(
                  "en-IN",
                )}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                (Inclusive of all taxes)
              </p>

              {/* ========================================
                  SELECTED POUCHES
              ======================================== */}

              {currentPouches && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                    Selected Variation
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-blue-800">
                      {
                        selectedVariation?.name
                      }
                    </span>

                    <span className="text-lg font-bold text-blue-800">
                      {
                        currentPouches
                      }{" "}
                      pouches
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-blue-600">
                    Price: ₹
                    {Number(
                      currentPrice,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* ========================================
                STOCK
            ======================================== */}

            <div className="mt-4">
              {selectedVariation ? (
                currentStock > 0 ? (
                  <p className="text-sm font-semibold text-emerald-600">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-rose-600">
                    Out of Stock
                  </p>
                )
              ) : product.stock > 0 ? (
                <p className="text-sm font-semibold text-emerald-600">
                  ✓ In Stock
                </p>
              ) : (
                <p className="text-sm font-semibold text-rose-600">
                  Out of Stock
                </p>
              )}
            </div>

            {/* ========================================
                RATING
            ======================================== */}

            <div className="mt-5 flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                  />
                ),
              )}

              <span className="ml-1 text-sm text-slate-500">
                Customer favourite
              </span>
            </div>

            {/* ========================================
                ADD TO CART
            ======================================== */}

            <Button
              type="button" onClick={handleAddToCart} disabled={
                selectedVariation
                  ? currentStock <= 0
                  : product.stock <= 0}
        className="mt-8 rounded-full bg-blue-600 px-7 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <ShoppingCart
                className="mr-2"
                size={17}
              />

              Add to Cart
            </Button>

            {/* ========================================
                CART SUCCESS MESSAGE
            ======================================== */}

            {cartMessage && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                ✓ {cartMessage}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
