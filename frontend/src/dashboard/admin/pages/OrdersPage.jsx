import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable from "../../../components/admin/AdminTable";
import { getAdminOrders, setOrderStatus } from "../../../service/admin.api";

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order status could not be saved.");
    }
  };

  const columns = [
    { key: "id", label: "Order", render: (row) => <span className="font-semibold text-emerald-700">#{String(row._id || "").slice(-6).toUpperCase()}</span> },
    { key: "customer", label: "Customer", render: (row) => <div><p className="font-semibold text-slate-800">{row.user?.name || row.shippingAddress?.name || "Customer"}</p><p className="text-xs text-slate-500">{row.user?.email || "No email"}</p></div> },
    { key: "items", label: "Items", render: (row) => <span className="text-xs leading-5">{Array.isArray(row.items) ? row.items.map((item) => `${item.name} × ${item.quantity}`).join(", ") : "—"}</span> },
    { key: "totalAmount", label: "Total", render: (row) => <span className="font-semibold">{formatMoney(row.totalAmount)}</span> },
    { key: "status", label: "Status", render: (row) => <select value={row.status || "Pending"} onChange={(event) => updateStatus(row._id, event.target.value)} className="rounded-lg border border-emerald-100 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500"><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select> },
    { key: "date", label: "Placed", render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "—" },
  ];

  return <AdminSectionPage title="Orders" description="Live customer orders and fulfillment status." badge="Operations" action={<button type="button" onClick={loadOrders} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>}>
    {error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><p>{error}</p><button type="button" onClick={loadOrders} className="mt-2 font-semibold underline">Try again</button></div>}
    {loading ? <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center text-sm font-medium text-emerald-700">Loading orders…</div> : <AdminTable emptyMessage="No orders have been placed yet. Orders will appear here after customers complete checkout." rows={orders} columns={columns} />}
  </AdminSectionPage>;
}
