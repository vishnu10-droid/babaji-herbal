import { useEffect, useState } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge } from "../../../components/admin/AdminTable";
import { getProductReport } from "../../../service/admin.api";

export default function ReportsPage() {
  const [products, setProducts] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getProductReport().then(setProducts).catch((e) => setError(e.response?.data?.message || "Could not load product report.")); }, []);
  const revenue = products.reduce((sum, product) => sum + Number(product.revenue || 0), 0); const units = products.reduce((sum, product) => sum + Number(product.unitsSold || 0), 0);
  return <AdminSectionPage title="Product Reports" description="Live inventory and sales results generated from placed orders." badge="Analytics"><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-blue-600 p-5 text-white"><p className="text-sm text-blue-100">Products</p><p className="mt-1 text-3xl font-bold">{products.length}</p></div><div className="rounded-2xl bg-emerald-600 p-5 text-white"><p className="text-sm text-emerald-100">Units sold</p><p className="mt-1 text-3xl font-bold">{units}</p></div><div className="rounded-2xl bg-violet-600 p-5 text-white"><p className="text-sm text-violet-100">Order revenue</p><p className="mt-1 text-3xl font-bold">₹{revenue.toLocaleString("en-IN")}</p></div></div>{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<AdminTable rows={products} columns={[{ key: "name", label: "Product", render: (row) => <span className="font-semibold">{row.name}</span> }, { key: "category", label: "Category" }, { key: "stock", label: "Stock" }, { key: "unitsSold", label: "Units sold" }, { key: "revenue", label: "Revenue", render: (row) => `₹${Number(row.revenue).toLocaleString("en-IN")}` }, { key: "status", label: "Availability", render: (row) => <StatusBadge tone={row.status === "Active" ? "green" : "rose"}>{row.status}</StatusBadge> }]} /></AdminSectionPage>;
}
