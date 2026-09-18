import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, TrendingUp, Users, Package, IndianRupee } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import {
  getAdminOrders,
  getCustomers,
  getDashboardStats,
  getProductReport,
} from "../../../service/admin.api";

const TABS = [
  { key: "sales", label: "Sales Report", to: "/admin/reports/sales" },
  { key: "customers", label: "Customer Report", to: "/admin/reports/customers" },
  { key: "products", label: "Product Report", to: "/admin/reports/products" },
];

function resolveTab(pathname) {
  if (pathname.includes("/customers")) return "customers";
  if (pathname.includes("/products")) return "products";
  return "sales";
}

const formatMoney = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

export default function ReportsPage() {
  const { pathname } = useLocation();
  const activeTab = resolveTab(pathname);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingProduct, setViewingProduct] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    Promise.allSettled([
      getProductReport(),
      getCustomers(),
      getAdminOrders(),
      getDashboardStats(),
    ]).then(([p, c, o, s]) => {
      if (!alive) return;
      if (p.status === "fulfilled") setProducts(Array.isArray(p.value) ? p.value : []);
      if (c.status === "fulfilled") setCustomers(Array.isArray(c.value) ? c.value : []);
      if (o.status === "fulfilled") setOrders(Array.isArray(o.value) ? o.value : []);
      if (s.status === "fulfilled") setMonthly(Array.isArray(s.value?.monthly) ? s.value.monthly : []);
      const failed = [p, c, o].filter((r) => r.status === "rejected");
      if (failed.length === 3) setError("Could not load reports. Make sure backend is running.");
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const revenue = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.revenue || 0), 0),
    [products]
  );
  const units = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.unitsSold || 0), 0),
    [products]
  );
  const validOrders = useMemo(() => orders.filter((o) => o.status !== "Cancelled"), [orders]);
  const salesRevenue = useMemo(
    () => validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    [validOrders]
  );

  /* ---------- SALES TABLE (month-wise) ---------- */
  const salesColumns = [
    {
      key: "month", label: "Month",
      render: (row) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700">
            {String(row.month || "–").slice(0, 3).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-slate-800">{row.month}</p>
            <p className="mt-0.5 text-[8px] text-slate-400">Monthly sales</p>
          </div>
        </div>
      ),
    },
    {
      key: "sales", label: "Orders",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-blue-50 px-1.5 text-[9px] font-bold text-blue-600">{row.sales ?? 0}</span>
          <span className="text-[8px] text-slate-400">{Number(row.sales) === 1 ? "order" : "orders"}</span>
        </div>
      ),
    },
    {
      key: "revenue", label: "Revenue",
      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">{formatMoney(row.revenue)}</p>
          <p className="mt-0.5 text-[8px] text-slate-400">Collected</p>
        </div>
      ),
    },
    {
      key: "avg", label: "Avg. Order",
      render: (row) => (
        <span className="whitespace-nowrap text-[10px] font-semibold text-slate-600">
          {row.sales ? formatMoney(Number(row.revenue || 0) / Number(row.sales)) : "—"}
        </span>
      ),
    },
    {
      key: "status", label: "Trend",
      render: (row) => (
        <StatusBadge tone={Number(row.sales) > 0 ? "green" : "slate"}>
          {Number(row.sales) > 0 ? "Active" : "No sales"}
        </StatusBadge>
      ),
    },
    {
      key: "actions", label: "Actions",
      render: (row) => (
        <TableActions itemName={`${row.month} sales`} viewLabel="View month" onView={() => setViewingOrder({ monthView: row })} />
      ),
    },
  ];

  /* ---------- PRODUCT TABLE ---------- */
  const productColumns = [
    {
      key: "name", label: "Product",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-slate-800">{row.name}</p>
          <p className="mt-0.5 truncate text-[8px] text-slate-400">{row.category || "No category"}</p>
        </div>
      ),
    },
    {
      key: "stock", label: "Stock",
      render: (row) => {
        const stock = Number(row.stock) || 0;
        return (
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stock === 0 ? "bg-rose-500" : stock < 10 ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span className="text-[10px] font-bold text-slate-700">{stock}</span>
          </div>
        );
      },
    },
    {
      key: "unitsSold", label: "Units Sold",
      render: (row) => (
        <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700">{row.unitsSold ?? 0}</span>
      ),
    },
    {
      key: "revenue", label: "Revenue",
      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">{formatMoney(row.revenue)}</p>
          <p className="mt-0.5 text-[8px] text-slate-400">Lifetime</p>
        </div>
      ),
    },
    {
      key: "status", label: "Availability",
      render: (row) => (
        <StatusBadge tone={row.status === "Active" ? "green" : "rose"}>{row.status || "—"}</StatusBadge>
      ),
    },
    {
      key: "actions", label: "Actions",
      render: (row) => (
        <TableActions itemName={row.name} viewLabel="View report" onView={() => setViewingProduct(row)} />
      ),
    },
  ];

  /* ---------- CUSTOMER TABLE ---------- */
  const customerColumns = [
    {
      key: "name", label: "Customer",
      render: (row) => {
        const initials = (row.name || "C").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">{initials}</div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-slate-800">{row.name || "Customer"}</p>
              <p className="mt-0.5 truncate text-[8px] text-slate-400">{row.email || "No email"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone", label: "Phone",
      render: (row) => <span className="whitespace-nowrap text-[9px] font-medium text-slate-600">{row.phone || "—"}</span>,
    },
    {
      key: "orders", label: "Orders",
      render: (row) => (
        <span className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600">{Number(row.orders) || 0} orders</span>
      ),
    },
    {
      key: "spent", label: "Spent",
      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">{formatMoney(row.spent)}</p>
          <p className="mt-0.5 text-[8px] text-slate-400">Lifetime value</p>
        </div>
      ),
    },
    {
      key: "segment", label: "Segment",
      render: (row) => {
        const n = Number(row.orders) || 0;
        if (n > 4) return <StatusBadge tone="blue">VIP</StatusBadge>;
        if (n > 0) return <StatusBadge tone="green">Repeat</StatusBadge>;
        return <StatusBadge tone="amber">New</StatusBadge>;
      },
    },
    {
      key: "actions", label: "Actions",
      render: (row) => (
        <TableActions itemName={row.name} viewLabel="View customer" onView={() => setViewingCustomer(row)} />
      ),
    },
  ];

  return (
    <AdminSectionPage
      title="Reports"
      description="Live sales, customer and product performance generated from real orders."
      badge="Analytics"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.to}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: IndianRupee, label: "Sales revenue", value: formatMoney(salesRevenue), bg: "bg-emerald-600", sub: "excl. cancelled" },
          { icon: TrendingUp, label: "Total orders", value: orders.length, bg: "bg-blue-600", sub: `${validOrders.length} valid` },
          { icon: Package, label: "Units sold", value: units, bg: "bg-violet-600", sub: `${products.length} products` },
          { icon: Users, label: "Customers", value: customers.length, bg: "bg-amber-600", sub: "registered" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl ${c.bg} p-5 text-white shadow-sm`}>
            <div className="flex items-center gap-2 text-white/80"><c.icon size={15} /><p className="text-xs font-semibold">{c.label}</p></div>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
            <p className="mt-1 text-[11px] text-white/70">{c.sub}</p>
          </div>
        ))}
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="rounded-3xl border border-emerald-100 bg-white p-12 text-center text-sm font-medium text-emerald-700">Loading reports…</p>
      ) : activeTab === "sales" ? (
        <AdminTable
          title="Sales Report" subtitle="Month-wise orders and revenue" entityPlural="months"
          rows={monthly} columns={salesColumns}
          emptyMessage="No sales data yet. Reports will appear after orders are placed."
        />
      ) : activeTab === "customers" ? (
        <AdminTable
          title="Customer Report" subtitle="Purchase value per customer" entityPlural="customers"
          rows={customers} columns={customerColumns}
          emptyMessage="No customers yet."
        />
      ) : (
        <AdminTable
          title="Product Report" subtitle="Stock, units sold and revenue per product" entityPlural="products"
          rows={products} columns={productColumns}
          emptyMessage="No sales data yet. Reports will appear after orders are placed."
        />
      )}

      {/* Product modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sales report</h2>
                <p className="mt-1 text-sm text-slate-500">{viewingProduct.name}</p>
              </div>
              <button type="button" onClick={() => setViewingProduct(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close report details">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Category</dt><dd className="font-semibold text-slate-900">{viewingProduct.category || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Stock left</dt><dd className="font-semibold text-slate-900">{viewingProduct.stock ?? 0}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Units sold</dt><dd className="font-semibold text-slate-900">{viewingProduct.unitsSold ?? 0}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Revenue</dt><dd className="font-semibold text-slate-900">{formatMoney(viewingProduct.revenue)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Availability</dt><dd><StatusBadge tone={viewingProduct.status === "Active" ? "green" : "rose"}>{viewingProduct.status || "—"}</StatusBadge></dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingProduct(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer report</h2>
                <p className="mt-1 text-sm text-slate-500">{viewingCustomer.name}</p>
              </div>
              <button type="button" onClick={() => setViewingCustomer(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close customer report">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-semibold text-slate-900">{viewingCustomer.email || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-slate-900">{viewingCustomer.phone || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Orders</dt><dd className="font-semibold text-slate-900">{viewingCustomer.orders ?? 0}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Total spent</dt><dd className="font-semibold text-slate-900">{formatMoney(viewingCustomer.spent)}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingCustomer(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Month modal */}
      {viewingOrder?.monthView && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{viewingOrder.monthView.month} sales</h2>
                <p className="mt-1 text-sm text-slate-500">Month-wise performance</p>
              </div>
              <button type="button" onClick={() => setViewingOrder(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close month details">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Orders</dt><dd className="font-semibold text-slate-900">{viewingOrder.monthView.sales ?? 0}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Revenue</dt><dd className="font-semibold text-slate-900">{formatMoney(viewingOrder.monthView.revenue)}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingOrder(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
