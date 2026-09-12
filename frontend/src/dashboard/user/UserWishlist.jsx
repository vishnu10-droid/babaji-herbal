import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserWishlist = () => {

  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      price: "₹4,999",
      oldPrice: "₹6,999",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
    {
      id: 2,
      name: "Premium T-Shirt",
      price: "₹1,999",
      oldPrice: "₹2,499",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: "₹2,499",
      oldPrice: "₹3,499",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
    {
      id: 4,
      name: "Casual Shirt",
      price: "₹999",
      oldPrice: "₹1,499",
      image:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            My Wishlist
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Products you have saved for later.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          {products.length} Items
        </span>

      </div>

      {/* Products */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
          >

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-slate-100">

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />

              <button
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50"
                title="Remove from wishlist"
              >
                ❤️
              </button>

            </div>

            {/* Content */}
            <div className="p-4">

              <h3 className="font-semibold text-slate-900">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center gap-2">

                <span className="font-bold text-blue-600">
                  {product.price}
                </span>

                <span className="text-sm text-slate-400 line-through">
                  {product.oldPrice}
                </span>

              </div>

              <div className="mt-4 flex gap-2">

                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  View
                </Link>

                <button className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Add to Cart
                </button>

              </div>

            </div>

          </motion.div>
        ))}

      </div>

    </motion.div>
  );
};

export default UserWishlist;