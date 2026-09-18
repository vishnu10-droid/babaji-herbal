import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { getCustomers } from "../../../service/admin.api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [viewingCustomer, setViewingCustomer] = useState(null);

  useEffect(() => {
    getCustomers().then(setCustomers).catch((e) => setError(e.response?.data?.message || "Could not load customers."));
  }, []);

const columns = [
  {
    key: "name",
    label: "Customer",
    render: (row) => {
      const initials = (row.name || "C")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">
            {initials}
          </div>

          {/* Customer Info */}
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-slate-800">
              {row.name || "Customer"}
            </p>

            <p className="mt-0.5 truncate text-[8px] text-slate-400">
              {row.email || "No email"}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    key: "phone",
    label: "Phone",
    render: (row) => (
      <span className="whitespace-nowrap text-[9px] font-medium text-slate-600">
        {row.phone || "—"}
      </span>
    ),
  },

  {
    key: "orders",
    label: "Orders",
    render: (row) => {
      const orders = Number(row.orders) || 0;

      return (
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-blue-50 px-1.5 text-[9px] font-bold text-blue-600">
            {orders}
          </span>

          <span className="text-[8px] text-slate-400">
            {orders === 1 ? "order" : "orders"}
          </span>
        </div>
      );
    },
  },

  {
    key: "spent",
    label: "Spent",
    render: (row) => (
      <div>
        <p className="whitespace-nowrap text-[11px] font-bold text-slate-800">
          ₹{Number(row.spent || 0).toLocaleString("en-IN")}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">
          Total purchase
        </p>
      </div>
    ),
  },

  {
    key: "createdAt",
    label: "Joined",
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
    key: "segment",
    label: "Segment",
    render: (row) => {
      const orders = Number(row.orders) || 0;

      if (orders > 4) {
        return (
          <StatusBadge tone="blue">
            VIP
          </StatusBadge>
        );
      }

      if (orders > 0) {
        return (
          <StatusBadge tone="green">
            Customer
          </StatusBadge>
        );
      }

      return (
        <StatusBadge tone="amber">
          New
        </StatusBadge>
      );
    },
  },

  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <TableActions
        itemName={row.name}
        viewLabel="View customer"
        onView={() => setViewingCustomer(row)}
      />
    ),
  },
];

  return (
    <AdminSectionPage title="Customers" description="Customer accounts and real purchase history." badge="CRM">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      <AdminTable title="Customers" subtitle="Accounts and purchase history" entityPlural="customers" emptyMessage="No customer accounts yet." rows={customers} columns={columns} />

      {viewingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer details</h2>
                <p className="mt-1 text-sm text-slate-500">Purchase history for this account.</p>
              </div>
              <button type="button" onClick={() => setViewingCustomer(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close customer details">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-semibold text-slate-900">{viewingCustomer.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-semibold text-slate-900">{viewingCustomer.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-slate-900">{viewingCustomer.phone || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Orders</dt><dd className="font-semibold text-slate-900">{viewingCustomer.orders ?? 0}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Total spent</dt><dd className="font-semibold text-slate-900">₹{Number(viewingCustomer.spent || 0).toLocaleString("en-IN")}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Joined</dt><dd className="font-semibold text-slate-900">{viewingCustomer.createdAt ? new Date(viewingCustomer.createdAt).toLocaleString("en-IN") : "—"}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingCustomer(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
