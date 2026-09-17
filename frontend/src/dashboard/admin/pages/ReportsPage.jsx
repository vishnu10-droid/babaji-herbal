import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { getProductReport } from "../../../service/admin.api";

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [viewingProduct, setViewingProduct] = useState(null);

  useEffect(() => {
    getProductReport().then(setProducts).catch((e) => setError(e.response?.data?.message || "Could not load product report."));
  }, []);

  const revenue = products.reduce((sum, product) => sum + Number(product.revenue || 0), 0);
  const units = products.reduce((sum, product) => sum + Number(product.unitsSold || 0), 0);

  return (
    <AdminSectionPage title="Product Reports" description="Live inventory and sales results generated from placed orders." badge="Analytics">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-600 p-5 text-white"><p className="text-sm text-blue-100">Products</p><p className="mt-1 text-3xl font-bold">{products.length}</p></div>
        <div className="rounded-2xl bg-emerald-600 p-5 text-white"><p className="text-sm text-emerald-100">Units sold</p><p className="mt-1 text-3xl font-bold">{units}</p></div>
        <div className="rounded-2xl bg-violet-600 p-5 text-white"><p className="text-sm text-violet-100">Order revenue</p><p className="mt-1 text-3xl font-bold">₹{revenue.toLocaleString("en-IN")}</p></div>
      </div>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      <AdminTable
        rows={products}
        emptyMessage="No sales data yet. Reports will appear after orders are placed."
        columns={[
          { key: "name", label: "Product", render: (row) => <span className="font-semibold text-slate-900">{row.name}</span> },
          { key: "category", label: "Category", render: (row) => row.category || "—" },
          { key: "stock", label: "Stock", render: (row) => <span className="font-semibold text-slate-700">{row.stock ?? 0}</span> },
          { key: "unitsSold", label: "Units sold", render: (row) => <span className="font-semibold text-slate-700">{row.unitsSold ?? 0}</span> },
          { key: "revenue", label: "Revenue", render: (row) => <span className="font-semibold text-slate-900">₹{Number(row.revenue || 0).toLocaleString("en-IN")}</span> },
          { key: "status", label: "Availability", render: (row) => <StatusBadge tone={row.status === "Active" ? "green" : "rose"}>{row.status || "—"}</StatusBadge> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <TableActions itemName={row.name} viewLabel="View report" onView={() => setViewingProduct(row)} />
            ),
          },
        ]}
      />

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
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Revenue</dt><dd className="font-semibold text-slate-900">₹{Number(viewingProduct.revenue || 0).toLocaleString("en-IN")}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Availability</dt><dd><StatusBadge tone={viewingProduct.status === "Active" ? "green" : "rose"}>{viewingProduct.status || "—"}</StatusBadge></dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingProduct(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
