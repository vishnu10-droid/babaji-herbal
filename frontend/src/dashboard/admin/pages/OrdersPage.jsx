import { useCallback, useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { getAdminOrders, setOrderStatus } from "../../../service/admin.api";

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusTone = (status) => {
  if (status === "Delivered") return "green";
  if (status === "Cancelled") return "rose";
  if (status === "Shipped") return "blue";
  return "amber";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminOrders();
      setOrders(Array.isArray(response) ? response : []);
    } catch (requestError) {
      setOrders([]);
      setError(requestError.response?.data?.message || "Could not load orders. Make sure the backend is running and you are signed in as an admin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (id, status) => {
    try {
      const updatedOrder = await setOrderStatus(id, status);
      if (!updatedOrder) throw new Error("Order update failed");
      setOrders((current) => current.map((order) => order._id === id ? { ...order, ...updatedOrder } : order));
      setViewingOrder((current) => (current && current._id === id ? { ...current, ...updatedOrder } : current));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order status could not be saved.");
    }
  };
const columns = [
  {
    key: "id",
    label: "Order",
    render: (row) => {
      const orderId = String(row._id || "")
        .slice(-6)
        .toUpperCase();

      return (
        <div className="min-w-0">
          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
            #{orderId}
          </span>

          <p className="mt-1 text-[8px] text-slate-400">
            Order ID
          </p>
        </div>
      );
    },
  },

  {
    key: "customer",
    label: "Customer",
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold text-slate-800">
          {row.user?.name ||
            row.shippingAddress?.name ||
            "Customer"}
        </p>

        <p className="mt-0.5 truncate text-[8px] text-slate-400">
          {row.user?.email || "No email"}
        </p>
      </div>
    ),
  },

  {
    key: "items",
    label: "Items",
    render: (row) => {
      const items = Array.isArray(row.items)
        ? row.items
        : [];

      const totalItems = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      return (
        <div className="min-w-0">
          <span className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>

          {items.length > 0 && (
            <p
              title={items
                .map(
                  (item) =>
                    `${item.name} × ${item.quantity}`
                )
                .join(", ")}
              className="mt-1 max-w-[150px] truncate text-[8px] text-slate-400"
            >
              {items
                .map(
                  (item) =>
                    `${item.name} × ${item.quantity}`
                )
                .join(", ")}
            </p>
          )}
        </div>
      );
    },
  },

  {
    key: "totalAmount",
    label: "Total",
    render: (row) => (
      <div>
        <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">
          {formatMoney(row.totalAmount)}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">
          Order total
        </p>
      </div>
    ),
  },

  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge tone={statusTone(row.status)}>
        {row.status || "Pending"}
      </StatusBadge>
    ),
  },

  {
    key: "date",
    label: "Placed",
    render: (row) => (
      <div>
        <p className="whitespace-nowrap text-[9px] font-semibold text-slate-600">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : "—"}
        </p>

        {row.createdAt && (
          <p className="mt-0.5 whitespace-nowrap text-[8px] text-slate-400">
            {new Date(row.createdAt).toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
        )}
      </div>
    ),
  },

  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <TableActions
        itemName={`order #${String(row._id || "")
          .slice(-6)
          .toUpperCase()}`}
        viewLabel="View order"
        onView={() => setViewingOrder(row)}
      />
    ),
  },
];

  return (
    <AdminSectionPage title="Orders" description="Live customer orders and fulfillment status." badge="Operations" action={<button type="button" onClick={loadOrders} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>}>
      {error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><p>{error}</p><button type="button" onClick={loadOrders} className="mt-2 font-semibold underline">Try again</button></div>}
      {loading ? <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center text-sm font-medium text-emerald-700">Loading orders…</div> : <AdminTable title="Orders" subtitle="Live customer orders and fulfillment" entityPlural="orders" emptyMessage="No orders have been placed yet. Orders will appear here after customers complete checkout." rows={orders} columns={columns} />}

      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Order #{String(viewingOrder._id || "").slice(-6).toUpperCase()}</h2>
                <p className="mt-1 text-sm text-slate-500">Complete order information and fulfillment.</p>
              </div>
              <button type="button" onClick={() => setViewingOrder(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close order details">
                <X size={20} />
              </button>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Customer</dt><dd className="font-semibold text-slate-900">{viewingOrder.user?.name || viewingOrder.shippingAddress?.name || "Customer"}</dd></div>
              <div><dt className="text-slate-500">Email</dt><dd className="font-semibold text-slate-900">{viewingOrder.user?.email || "—"}</dd></div>
              <div><dt className="text-slate-500">Total</dt><dd className="font-semibold text-slate-900">{formatMoney(viewingOrder.totalAmount)}</dd></div>
              <div><dt className="text-slate-500">Placed</dt><dd className="font-semibold text-slate-900">{viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString("en-IN") : "—"}</dd></div>
            </dl>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-700">Items</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                {(viewingOrder.items || []).map((item, i) => (
                  <li key={i}>{item.name} × {item.quantity} — {formatMoney((item.price || 0) * (item.quantity || 1))}</li>
                ))}
                {(!viewingOrder.items || viewingOrder.items.length === 0) && <li>No items found.</li>}
              </ul>
            </div>
            {viewingOrder.shippingAddress && (
              <p className="mt-3 text-sm text-slate-600">
                Ship to: {[viewingOrder.shippingAddress.address, viewingOrder.shippingAddress.city, viewingOrder.shippingAddress.pincode].filter(Boolean).join(", ")}
              </p>
            )}
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Update status
              <select value={viewingOrder.status || "Pending"} onChange={(event) => updateStatus(viewingOrder._id, event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500">
                <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
              </select>
            </label>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingOrder(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
