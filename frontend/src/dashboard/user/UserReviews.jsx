import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getMyOrders } from "../../service/order.api";

export default function UserReviews() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setOrders(await getMyOrders());
      } catch (e) {
        setError(e.response?.data?.message || "Could not load your products.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const seen = new Set();
  const purchased = [];
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = String(item.product || item.name);
      if (!seen.has(key)) {
        seen.add(key);
        purchased.push({ productId: item.product, name: item.name, orderId: String(order._id).slice(-6).toUpperCase() });
      }
    });
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">Review the products you purchased.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">{error}</p>
        ) : purchased.length === 0 ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Star size={22} />
            </span>
            <p className="mt-3 font-semibold text-slate-700">No products to review yet</p>
            <p className="mt-1 text-sm text-slate-500">Products from your orders will appear here.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Shop now</Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {purchased.map((item, i) => (
              <li key={`${item.productId}-${i}`} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Order #{item.orderId}</p>
                </div>
                {item.productId ? (
                  <Link to={`/product/${item.productId}`} className="shrink-0 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100">Write review</Link>
                ) : (
                  <span className="text-xs text-slate-400">Unavailable</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
