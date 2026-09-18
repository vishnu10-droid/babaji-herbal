import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, X, Mail, MessageSquare } from "lucide-react";
import { API_URL } from "../../../config/config";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { deleteContact } from "../../../service/admin.api";

const authHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingContact, setViewingContact] = useState(null);

  const getContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/contact`, { headers: authHeaders() });
      setContacts(response.data.contacts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleDelete = async (contact) => {
    if (!window.confirm(`Delete message from "${contact.name}"?`)) return;
    try {
      await deleteContact(contact._id);
      setContacts((prev) => prev.filter((c) => c._id !== contact._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete message");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Sender",
      render: (row) => {
        const initials = (row.name || "C").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-slate-800">{row.name}</p>
              <p className="mt-0.5 truncate text-[8px] text-slate-400">{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-[10px] font-semibold text-slate-700">
            <Mail size={11} className="shrink-0 text-slate-400" />
            <span className="truncate">{row.email}</span>
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[8px] text-slate-400">{row.phone || "No phone"}</p>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <div className="min-w-0">
          <p title={row.message} className="max-w-[260px] truncate text-[10px] text-slate-600">
            {row.message}
          </p>
          <p className="mt-0.5 text-[8px] text-slate-400">{row.message?.length || 0} chars</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Received",
      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-[9px] font-semibold text-slate-600">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "—"}
          </p>
          {row.createdAt && (
            <p className="mt-0.5 whitespace-nowrap text-[8px] text-slate-400">
              {new Date(row.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => <StatusBadge tone="blue">New</StatusBadge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TableActions
          itemName={row.name}
          viewLabel="View message"
          deleteLabel="Delete message"
          onView={() => setViewingContact(row)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <AdminSectionPage
      title="Contact Messages"
      description="Messages submitted from the contact page."
      badge="Inbox"
      action={
        <button type="button" onClick={getContacts} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><MessageSquare size={18} /></span>
          <div><p className="text-xs text-slate-500">Total messages</p><p className="text-xl font-bold text-slate-900">{contacts.length}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Mail size={18} /></span>
          <div><p className="text-xs text-slate-500">Needs reply</p><p className="text-xl font-bold text-slate-900">{contacts.length}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><RefreshCw size={18} /></span>
          <div><p className="text-xs text-slate-500">Inbox status</p><p className="text-sm font-bold text-emerald-600">Live</p></div>
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      {loading ? (
        <p className="rounded-3xl border border-emerald-100 bg-white p-12 text-center text-sm font-medium text-emerald-700">Loading messages…</p>
      ) : (
        <AdminTable
          title="Contact Messages"
          subtitle="Inbox from the contact page"
          entityPlural="messages"
          rows={contacts}
          columns={columns}
          emptyMessage="No contact messages found."
          emptyHint="New enquiries will appear here."
        />
      )}

      {viewingContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Message details</h2>
                <p className="mt-1 text-sm text-slate-500">From {viewingContact.name}</p>
              </div>
              <button type="button" onClick={() => setViewingContact(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close message details">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-semibold text-slate-900">{viewingContact.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="max-w-[240px] truncate font-semibold text-slate-900">{viewingContact.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-slate-900">{viewingContact.phone || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Date</dt><dd className="font-semibold text-slate-900">{viewingContact.createdAt ? new Date(viewingContact.createdAt).toLocaleString("en-IN") : "—"}</dd></div>
              <div><dt className="text-slate-500">Message</dt><dd className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-700">{viewingContact.message}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end gap-2">
              <a href={`mailto:${viewingContact.email}`} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Reply</a>
              <button type="button" onClick={() => setViewingContact(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
