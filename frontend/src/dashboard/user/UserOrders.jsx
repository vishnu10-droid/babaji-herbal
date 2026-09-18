import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Eye, Package, RefreshCw, X, Search, Ban, ShoppingCart, Printer } from "lucide-react";
import { cancelMyOrder, getMyOrders } from "../../service/order.api";
import { addToCart } from "../../store/slice/cart.slice";
import { inr, orderStatusTone } from "./UserDashboard";

const filters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const UserOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [actionMsg, setActionMsg] = useState("");
  const [cancelling, setCancelling] = useState("");

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

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchStatus = status === "All" || o.status === status;
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          String(o._id).toLowerCase().includes(q) ||
          (o.items || []).some((i) => String(i.name || "").toLowerCase().includes(q));
        return matchStatus && matchQuery;
      }),
    [orders, query, status],
  );

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders],
  );

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel order #${String(order._id).slice(-6).toUpperCase()}?`)) return;
    try {
      setCancelling(order._id);
      setActionMsg("");
      const res = await cancelMyOrder(order._id);
      const updated = res.order || { ...order, status: "Cancelled" };
      setOrders((prev) => prev.map((o) => (o._id === order._id ? updated : o)));
      if (viewingOrder?._id === order._id) setViewingOrder(updated);
      setActionMsg("Order cancelled successfully.");
    } catch (e) {
      setActionMsg(e.response?.data?.message || "Could not cancel this order.");
    } finally {
      setCancelling("");
    }
  };

  const handleReorder = (order) => {
    (order.items || []).forEach((item) => {
      if (!item.product) return;
      dispatch(
        addToCart({
          productId: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          variation: item.variationName ? { name: item.variationName } : null,
        }),
      );
    });
    setActionMsg("Items added to cart. Review your cart to checkout again.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#123d2a]">My Orders</h1>
          <p className="mt-1 text-sm text-slate-500">View, track, cancel or reorder.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#0B6B3A]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#0B6B3A] transition hover:bg-[#0B6B3A]/5 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <OrderStat title="Total" value={loading ? "…" : String(counts.total)} />
        <OrderStat title="Active" value={loading ? "…" : String(counts.pending)} />
        <OrderStat title="Delivered" value={loading ? "…" : String(counts.delivered)} />
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B6B3A]/10 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or product name…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#0B6B3A] focus:bg-white focus:ring-4 focus:ring-[#0B6B3A]/10"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                status === f ? "bg-[#0B6B3A] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {actionMsg && (
        <p className="rounded-2xl bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          {actionMsg}
        </p>
      )}

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-5">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            <p>{error}</p>
            <button onClick={load} className="mt-2 font-bold underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
              <Package size={22} />
            </span>
            <p className="mt-3 font-bold text-slate-800">{orders.length === 0 ? "No orders yet" : "No matching orders"}</p>
            <p className="mt-1 text-sm text-slate-500">
              {orders.length === 0 ? "Your order history will appear here." : "Try a different search or filter."}
            </p>
            {orders.length === 0 && (
              <Link to="/shop" className="mt-4 inline-block rounded-full bg-[#0B6B3A] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a5a31]">
                Shop now
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cancellable = ["Pending", "Processing"].includes(order.status);
              return (
                <div
                  key={order._id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-[#0B6B3A]/25 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B6B3A]/10 text-[#0B6B3A]">
                      <Package size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">#{String(order._id).slice(-6).toUpperCase()}</p>
                      <p className="max-w-[280px] truncate text-xs text-slate-500">
                        {(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(", ") || "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"} ·{" "}
                        <span className="font-bold text-[#123d2a]">{inr(order.totalAmount)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${orderStatusTone(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="rounded-xl bg-[#0B6B3A]/10 p-2.5 text-[#0B6B3A] transition hover:bg-[#0B6B3A] hover:text-white"
                      title="View details"
                      aria-label="View order details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200"
                      title="Buy again"
                      aria-label="Reorder"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    {cancellable && (
                      <button
                        onClick={() => handleCancel(order)}
                        disabled={cancelling === order._id}
                        className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                        title="Cancel order"
                        aria-label="Cancel order"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4" onClick={() => setViewingOrder(null)}>
          <div
            className="mx-auto my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#123d2a]">
                  Order #{String(viewingOrder._id).slice(-6).toUpperCase()}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Placed {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString("en-IN") : "—"}
                </p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="rounded-2xl bg-[#faf8f1] p-4 text-sm ring-1 ring-[#0B6B3A]/10">
              <p className="font-bold text-[#123d2a]">Items</p>
              <ul className="mt-2 space-y-2 text-slate-600">
                {(viewingOrder.items || []).map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span>{item.name}{item.variationName ? ` (${item.variationName})` : ""} × {item.quantity}</span>
                    <span className="font-bold text-slate-800">{inr((item.price || 0) * (item.quantity || 1))}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-[#0B6B3A]/10 pt-3">
                <p className="flex justify-between"><span>Subtotal</span><span>{inr(viewingOrder.subtotal)}</span></p>
                <p className="flex justify-between"><span>Shipping</span><span>{Number(viewingOrder.shipping) === 0 ? "FREE" : inr(viewingOrder.shipping)}</span></p>
                <p className="flex justify-between font-bold text-[#123d2a]"><span>Total</span><span>{inr(viewingOrder.totalAmount)}</span></p>
              </div>
            </div>

            {viewingOrder.shippingAddress && (
              <p className="mt-3 text-sm text-slate-600">
                Deliver to: <strong>{viewingOrder.shippingAddress.name}</strong>, {viewingOrder.shippingAddress.address},{" "}
                {viewingOrder.shippingAddress.city}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${orderStatusTone(viewingOrder.status)}`}>
                {viewingOrder.status || "Pending"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  <Printer size={15} /> Invoice
                </button>
                {["Pending", "Processing"].includes(viewingOrder.status) && (
                  <button
                    onClick={() => handleCancel(viewingOrder)}
                    disabled={cancelling === viewingOrder._id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    <Ban size={15} /> {cancelling ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const OrderStat = ({ title, value }) => (
  <div className="rounded-3xl bg-white p-4 text-center shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-5">
    <p className="text-xs font-medium text-slate-500 md:text-sm">{title}</p>
    <h3 className="mt-1 text-xl font-bold text-[#123d2a] md:text-2xl">{value}</h3>
  </div>
);

export default UserOrders;
