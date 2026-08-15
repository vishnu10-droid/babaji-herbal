import { useMemo, useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { API_ORIGIN } from "../config/config";
import { addToCart } from "../store/slice/cart.slice";
import { useAuth } from "../context/auth-context";

const fallbackImage = "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80";

const variationLabel = (variation) => variation.name || `${variation.pouches} pouches`;

export default function ProductCard({ item }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const activeVariations = useMemo(
    () => (item.variations || []).filter((variation) => variation.isActive !== false),
    [item.variations],
  );

  const selectedVariation = activeVariations.find(
    (variation) => variation._id === selectedVariationId,
  ) || activeVariations[0];

  const price = Number(selectedVariation?.price ?? item.sellingPrice ?? item.price ?? 0);
  const mrp = Number(selectedVariation?.mrp ?? item.mrp ?? price);
  const hasDiscount = mrp > price;
  const discount = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;
  const stock = Number(selectedVariation?.stock ?? item.stock ?? 0);
  const image = item.images?.[0] ? `${API_ORIGIN}${item.images[0]}` : fallbackImage;

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
      await dispatch(addToCart({ productId: item._id, variationId: selectedVariation?._id || undefined, quantity: 1 })).unwrap();
      setCartMessage("Added to cart");
      window.setTimeout(() => setCartMessage(""), 2000);
    } catch (requestError) {
      setCartMessage(requestError || "Could not add to cart");
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#dce8dc] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-[#edf4eb]">
        <Link to={`/product/${item._id}`} className="block">
          <img src={image} alt={item.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-[#f3bf5a] px-3 py-1 text-xs font-bold text-[#173b29]">Save {discount}%</span>}
        <button type="button" aria-label={`Add ${item.name} to wishlist`} className="absolute right-4 top-4 rounded-full bg-white p-2.5 text-[#276344] shadow-sm transition hover:bg-[#174d32] hover:text-white"><Heart size={17} /></button>
        <Link to={`/product/${item._id}`} className="absolute inset-x-4 bottom-4 translate-y-14 rounded-full bg-[#174d32] py-3 text-center text-sm font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">Quick view</Link>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#64826d]">
          <span className="truncate">{item.category || "Herbal care"}</span>
          <span className="flex shrink-0 items-center gap-1 normal-case tracking-normal text-[#d69721]"><Star size={14} fill="currentColor" /> 5.0</span>
        </div>
        <Link to={`/product/${item._id}`} className="mt-2 block truncate text-lg font-bold text-[#173b29] transition hover:text-[#28714a]">{item.name}</Link>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#174d32]">₹{price.toLocaleString("en-IN")}</span>
          {hasDiscount && <span className="text-sm text-slate-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>}
        </div>

        {activeVariations.length > 0 && (
          <label className="mt-4 block">
            <span className="sr-only">Select pouch variation</span>
            <select
              value={selectedVariation?._id || ""}
              onChange={(event) => setSelectedVariationId(event.target.value)}
              className="w-full rounded-md border border-[#cfe1d0] bg-white px-3 py-2 text-sm font-medium text-[#174d32] outline-none focus:border-[#28714a] focus:ring-2 focus:ring-[#28714a]/15"
            >
              {activeVariations.map((variation) => (
                <option key={variation._id} value={variation._id}>
                  {variationLabel(variation)} - ₹{Number(variation.price).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="button"
          onClick={addProductToCart}
          disabled={stock <= 0}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#3d219f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#321987] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <ShoppingBag size={17} /> {stock > 0 ? "Add To Cart" : "Out of Stock"}
        </button>
        {cartMessage && <p className="mt-2 text-center text-xs font-semibold text-[#28714a]">{cartMessage}</p>}
      </div>
    </article>
  );
}
