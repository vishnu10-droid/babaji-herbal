import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart } from "lucide-react";
import { fetchWishlist, removeFromWishlist } from "../../store/slice/wishlist.slice";
import { addToCart } from "../../store/slice/cart.slice";
import { thumbnail } from "../../utils/image";

const getPrice = (product) => product?.sellingPrice ?? product?.price ?? product?.mrp ?? 0;

const UserWishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    if (productId) dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    if (!product?._id) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name || "Product",
        price: getPrice(product),
        image: product.images?.[0] || "",
        quantity: 1,
        variation: null,
      }),
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <p className="mt-1 text-sm text-slate-500">Products you have saved for later.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          {items.length} Items
        </span>
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <Heart size={22} />
          </span>
          <p className="mt-3 font-semibold text-slate-800">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-slate-500">Save products you love and find them here.</p>
          <Link to="/shop" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item.product;
            return (
              <motion.div
                key={item._id}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Link to={product._id ? `/product/${product._id}` : "#"}>
                    <img
                      src={product.images?.[0] ? thumbnail(product.images[0], 500) : "https://placehold.co/500x500/eaf2ff/2563eb?text=P"}
                      alt={product.name || "Product"}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(productId)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50"
                    title="Remove from wishlist"
                    aria-label={`Remove ${product.name || "product"} from wishlist`}
                  >
                    <Heart size={17} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="truncate font-semibold text-slate-900">{product.name || "Product"}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-blue-600">₹{Number(getPrice(product)).toLocaleString("en-IN")}</span>
                    {product.mrp && Number(product.mrp) > Number(getPrice(product)) && (
                      <span className="text-sm text-slate-400 line-through">₹{Number(product.mrp).toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {product._id ? (
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        View
                      </Link>
                    ) : null}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default UserWishlist;
