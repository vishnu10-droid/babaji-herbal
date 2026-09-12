import { useEffect, useState } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge } from "../../../components/admin/AdminTable";
import { getCustomers } from "../../../service/admin.api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getCustomers().then(setCustomers).catch((e) => setError(e.response?.data?.message || "Could not load customers.")); }, []);
  return <AdminSectionPage title="Customers" description="Customer accounts and real purchase history." badge="CRM">{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<AdminTable emptyMessage="No customer accounts yet." rows={customers} columns={[{ key: "name", label: "Customer", render: (row) => <div><p className="font-semibold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.email}</p></div> }, { key: "phone", label: "Phone", render: (row) => row.phone || "—" }, { key: "orders", label: "Orders" }, { key: "spent", label: "Spent", render: (row) => `₹${Number(row.spent || 0).toLocaleString("en-IN")}` }, { key: "createdAt", label: "Joined", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") }, { key: "segment", label: "Segment", render: (row) => <StatusBadge tone={row.orders > 4 ? "blue" : row.orders ? "green" : "amber"}>{row.orders > 4 ? "VIP" : row.orders ? "Customer" : "New"}</StatusBadge> }]} /></AdminSectionPage>;
}
