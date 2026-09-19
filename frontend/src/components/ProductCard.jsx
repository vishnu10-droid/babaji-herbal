import { useMemo, useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { thumbnail } from "../utils/image";
import { addToCart } from "../store/slice/cart.slice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slice/wishlist.slice";
import { useAuth } from "../context/auth-context";

// =====================================================
// FALLBACK IMAGE
// =====================================================

const fallbackImage =
  "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80";

// =====================================================
// VARIATION LABEL
// =====================================================

const variationLabel = (variation) =>
  variation.name || `${variation.pouches} pouches`;

// =====================================================
// PRODUCT CARD
// =====================================================

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { isAuthenticated } = useAuth();

  const [selectedVariationId, setSelectedVariationId] = useState("");

  const [cartMessage, setCartMessage] = useState("");

  // =====================================================
  // ACTIVE VARIATIONS
  // =====================================================

  const activeVariations = useMemo(
    () =>
      (item.variations || []).filter(
        (variation) => variation.isActive !== false,
      ),
    [item.variations],
  );

  // =====================================================
  // SELECTED VARIATION
  // =====================================================

  const selectedVariation =
    activeVariations.find(
      (variation) => String(variation._id) === String(selectedVariationId),
    ) || activeVariations[0];

  // =====================================================
  // PRICE
  // =====================================================

  const price =
    Number(selectedVariation?.price ?? item.sellingPrice ?? item.price ?? 0) ||
    0;

  // =====================================================
  // MRP
  // =====================================================

  const mrp = Number(selectedVariation?.mrp ?? item.mrp ?? price) || price;

  // =====================================================
  // DISCOUNT
  // =====================================================

  const hasDiscount = mrp > price;

  const discount = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // =====================================================
  // STOCK
  // =====================================================

  const stock = Number(selectedVariation?.stock ?? item.stock ?? 0) || 0;

  // =====================================================
  // WISHLIST STATUS
  // =====================================================

  const isWishlisted = wishlistItems.some((wishlistItem) => {
    const wishlistProductId = wishlistItem.product?._id || wishlistItem.product;

    return String(wishlistProductId) === String(item._id);
  });

  // =====================================================
  // IMAGE
  // =====================================================

  const image = item.images?.[0]
    ? thumbnail(item.images[0], 400)
    : fallbackImage;

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addProductToCart = async () => {
    if (stock <= 0) {
      setCartMessage("Out of stock");
      return;
    }

    if (!isAuthenticated) {
      setCartMessage("Please login to add products");
      return;
    }

    try {
      setCartMessage("");

      await dispatch(
        addToCart({
          productId: item._id,
          variationId: selectedVariation?._id || undefined,
          quantity: 1,
        }),
      ).unwrap();

      navigate("/cart");
    } catch (requestError) {
      setCartMessage(requestError || "Could not add to cart");
    }
  };

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      setCartMessage("Please login to use your wishlist");
      return;
    }

    try {
      setCartMessage("");

      if (isWishlisted) {
        await dispatch(removeFromWishlist(item._id)).unwrap();
      } else {
        await dispatch(addToWishlist(item._id)).unwrap();
      }
    } catch (requestError) {
      setCartMessage(requestError || "Could not update wishlist");
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-[#dce8dc]
        bg-white
        transition
        duration-300
        hover:-translate-y-0.5
        hover:shadow-lg
      "
    >
      {/* =================================================
          IMAGE SECTION
      ================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-white
        "
      >
        <Link to={`/product/${item._id}`} className="block h-40 w-full bg-white p-2">
          <img
            src={image}
            alt={item.name}
            loading="lazy"
            className="
              h-full
              w-full
              object-contain
              transition
              duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* =================================================
            DISCOUNT BADGE
        ================================================== */}

        {discount > 0 && (
          <span
            className="
              absolute
              left-2
              top-2
              rounded-full
              bg-[#f3bf5a]
              px-2
              py-0.5
              text-[9px]
              font-bold
              leading-3
              text-[#173b29]
            "
          >
            Save {discount}%
          </span>
        )}

        {/* =================================================
            WISHLIST
        ================================================== */}

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${item.name} ${
            isWishlisted ? "from" : "to"
          } wishlist`}
          className={`
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
            ${isWishlisted ? "text-red-500" : "text-[#276344]"}
            shadow-sm
            transition
            hover:bg-[#174d32]
            hover:text-white
          `}
        >
          <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* =================================================
            QUICK VIEW
        ================================================== */}

        <Link
          to={`/product/${item._id}`}
          className="
            absolute
            inset-x-2
            bottom-2
            translate-y-10
            rounded-full
            bg-[#174d32]
            py-1.5
            text-center
            text-[10px]
            font-bold
            text-white
            opacity-0
            transition
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          Quick view
        </Link>
      </div>

      {/* =================================================
          PRODUCT CONTENT
      ================================================== */}

      <div className="p-3">
        {/* =================================================
            CATEGORY + RATING
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#64826d]
          "
        >
          {/* CATEGORY */}

          <span className="min-w-0 truncate">
            {item.category || "Herbal care"}
          </span>

          {/* RATING */}

          <span
            className="
              flex
              shrink-0
              items-center
              gap-0.5
              normal-case
              tracking-normal
              text-[#d69721]
            "
          >
            <Star size={10} fill="currentColor" />
            5.0
          </span>
        </div>

        {/* =================================================
            PRODUCT NAME
        ================================================== */}

        <Link
          to={`/product/${item._id}`}
          className="
            mt-1.5
            block
            truncate
            text-sm
            font-bold
            leading-5
            text-[#173b29]
            transition
            hover:text-[#28714a]
          "
        >
          {item.name}
        </Link>

        {/* =================================================
            PRICE
        ================================================== */}

        <div
          className="
            mt-2
            flex
            items-baseline
            gap-1.5
          "
        >
          {/* SELLING PRICE */}

          <span
            className="
              text-sm
              font-bold
              text-[#174d32]
            "
          >
            ₹{price.toLocaleString("en-IN")}
          </span>

          {/* MRP */}

          {hasDiscount && (
            <span
              className="
                text-[10px]
                text-slate-400
                line-through
              "
            >
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* =================================================
            VARIATIONS
        ================================================== */}

        {activeVariations.length > 0 && (
          <label className="mt-2.5 block">
            <span className="sr-only">Select pouch variation</span>

            <select
              value={selectedVariation?._id || ""}
              onChange={(event) => setSelectedVariationId(event.target.value)}
              className="
                h-8
                w-full
                rounded-md
                border
                border-[#cfe1d0]
                bg-white
                px-2
                text-[10px]
                font-medium
                text-[#174d32]
                outline-none
                transition
                focus:border-[#28714a]
                focus:ring-2
                focus:ring-[#28714a]/15
              "
            >
              {activeVariations.map((variation) => (
                <option key={variation._id} value={variation._id}>
                  {variationLabel(variation)} - ₹
                  {Number(variation.price).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* =================================================
            ADD TO CART
        ================================================== */}

        <button
          type="button"
          onClick={addProductToCart}
          disabled={stock <= 0}
          className="
            mt-2
            flex
            h-8
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-md
            bg-[#3d219f]
            px-3
            text-[10px]
            font-bold
            text-white
            transition
            hover:bg-[#321987]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:bg-slate-400
          "
        >
          <ShoppingBag size={13} />

          {stock > 0 ? "Add To Cart" : "Out of Stock"}
        </button>

        {/* =================================================
            CART MESSAGE
        ================================================== */}

        {cartMessage && (
          <p
            className="
              mt-1.5
              text-center
              text-[9px]
              font-semibold
              leading-3
              text-[#28714a]
            "
          >
            {cartMessage}
          </p>
        )}
      </div>
    </article>
  );
}
