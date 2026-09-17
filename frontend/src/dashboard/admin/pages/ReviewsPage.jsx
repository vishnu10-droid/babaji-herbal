import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { getReviews, setReviewStatus } from "../../../service/admin.api";

const toneFor = (status) => (status === "Approved" ? "green" : status === "Rejected" ? "rose" : "amber");

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [viewingReview, setViewingReview] = useState(null);

  useEffect(() => {
    getReviews().then(setReviews).catch((e) => setError(e.response?.data?.message || "Could not load reviews."));
  }, []);

  const update = async (id, status) => {
    try {
      const review = await setReviewStatus(id, status);
      setReviews((all) => all.map((item) => (item._id === id ? { ...item, ...review } : item)));
      setViewingReview((current) => (current && current._id === id ? { ...current, ...review } : current));
    } catch {
      setError("Review status could not be saved.");
    }
  };

  return (
    <AdminSectionPage title="Reviews" description="Approve or reject real product feedback." badge="Feedback">
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      <AdminTable
        emptyMessage="No product reviews have been submitted yet."
        rows={reviews}
        columns={[
          { key: "customer", label: "Customer", render: (row) => <span className="font-semibold text-slate-900">{row.user?.name || "Deleted user"}</span> },
          { key: "product", label: "Product", render: (row) => <span className="text-slate-600">{row.product?.name || "Deleted product"}</span> },
          { key: "rating", label: "Rating", render: (row) => <span className="font-semibold text-amber-600">★ {row.rating}/5</span> },
          { key: "comment", label: "Review", render: (row) => <span className="block max-w-sm truncate text-slate-500">{row.comment || "—"}</span> },
          { key: "status", label: "Status", render: (row) => <StatusBadge tone={toneFor(row.status)}>{row.status || "Pending"}</StatusBadge> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <TableActions itemName="review" viewLabel="View review" onView={() => setViewingReview(row)} />
            ),
          },
        ]}
      />

      {viewingReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Review details</h2>
                <p className="mt-1 text-sm text-slate-500">Full feedback from the customer.</p>
              </div>
              <button type="button" onClick={() => setViewingReview(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close review details">
                <X size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Customer</dt><dd className="font-semibold text-slate-900">{viewingReview.user?.name || "Deleted user"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Product</dt><dd className="font-semibold text-slate-900">{viewingReview.product?.name || "Deleted product"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Rating</dt><dd className="font-semibold text-amber-600">★ {viewingReview.rating}/5</dd></div>
              <div><dt className="text-slate-500">Comment</dt><dd className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-700">{viewingReview.comment || "—"}</dd></div>
            </dl>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Update status
              <select value={viewingReview.status || "Pending"} onChange={(e) => update(viewingReview._id, e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500">
                <option>Pending</option><option>Approved</option><option>Rejected</option>
              </select>
            </label>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingReview(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
