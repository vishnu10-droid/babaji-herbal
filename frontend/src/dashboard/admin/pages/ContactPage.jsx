import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw, X } from "lucide-react";
import { API_URL } from "../../../config/config";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { TableActions } from "../../../components/admin/AdminTable";
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
    { key: "name", label: "Name", render: (row) => <span className="font-semibold text-slate-900">{row.name}</span> },
    { key: "email", label: "Email", render: (row) => <span className="text-slate-600">{row.email}</span> },
    { key: "phone", label: "Phone", render: (row) => <span className="text-slate-600">{row.phone || "—"}</span> },
    { key: "message", label: "Message", render: (row) => <span className="block max-w-sm truncate text-slate-500">{row.message}</span> },
    { key: "createdAt", label: "Date", render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "—") },
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
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      {loading ? (
        <p className="rounded-3xl border border-emerald-100 bg-white p-12 text-center text-sm font-medium text-emerald-700">Loading messages…</p>
      ) : (
        <AdminTable rows={contacts} columns={columns} emptyMessage="No contact messages found." />
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
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-semibold text-slate-900">{viewingContact.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-slate-900">{viewingContact.phone || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Date</dt><dd className="font-semibold text-slate-900">{viewingContact.createdAt ? new Date(viewingContact.createdAt).toLocaleString("en-IN") : "—"}</dd></div>
              <div><dt className="text-slate-500">Message</dt><dd className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-700">{viewingContact.message}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingContact(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
