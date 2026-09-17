import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Package, RefreshCw, X } from "lucide-react";
import { getMyOrders } from "../../service/order.api";
import { orderStatusTone } from "./UserDashboard";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await getMyOrders());
    } catch (e) {
      setError(e.response?.data?.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pending = orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="mt-1 text-sm text-slate-500">View and track all your orders.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <OrderStat title="Total Orders" value={loading ? "…" : String(orders.length)} />
        <OrderStat title="Pending" value={loading ? "…" : String(pending)} />
        <OrderStat title="Delivered" value={loading ? "…" : String(delivered)} />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-5 text-lg font-bold">Order History</h2>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
            <p>{error}</p>
            <button onClick={load} className="mt-2 font-semibold underline">Try again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <Package size={22} />
            </span>
            <p className="mt-3 font-semibold text-slate-800">No orders yet</p>
            <p className="mt-1 text-sm text-slate-500">Your order history will appear here.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Shop now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Items</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-50 text-sm last:border-0">
                    <td className="py-4 font-semibold">#{String(order._id).slice(-6).toUpperCase()}</td>
                    <td className="max-w-[220px] truncate py-4 text-slate-500">
                      {(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}
                    </td>
                    <td className="py-4 text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="py-4 font-semibold">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusTone(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => setViewingOrder(order)}
                        title="View order details"
                        aria-label={`View order ${String(order._id).slice(-6).toUpperCase()}`}
                        className="group relative rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                      >
                        <Eye size={17} />
                        <span className="pointer-events-none absolute -top-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg group-hover:block">
                          View
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Order #{String(viewingOrder._id).slice(-6).toUpperCase()}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Placed {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString("en-IN") : "—"}
                </p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close order details">
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-700">Items</p>
              <ul className="mt-2 space-y-2 text-slate-600">
                {(viewingOrder.items || []).map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span>{item.name}{item.variationName ? ` (${item.variationName})` : ""} × {item.quantity}</span>
                    <span className="font-semibold text-slate-800">₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">
                <p className="flex justify-between"><span>Subtotal</span><span>₹{Number(viewingOrder.subtotal || 0).toLocaleString("en-IN")}</span></p>
                <p className="flex justify-between"><span>Shipping</span><span>₹{Number(viewingOrder.shipping || 0).toLocaleString("en-IN")}</span></p>
                <p className="flex justify-between font-bold text-slate-900"><span>Total</span><span>₹{Number(viewingOrder.totalAmount || 0).toLocaleString("en-IN")}</span></p>
              </div>
            </div>

            {viewingOrder.shippingAddress && (
              <p className="mt-3 text-sm text-slate-600">
                Deliver to: <strong>{viewingOrder.shippingAddress.name}</strong>, {viewingOrder.shippingAddress.address}, {viewingOrder.shippingAddress.city}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusTone(viewingOrder.status)}`}>
                {viewingOrder.status || "Pending"}
              </span>
              <button onClick={() => setViewingOrder(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const OrderStat = ({ title, value }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
};

export default UserOrders;
