import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, {
  StatusBadge,
  TableActions,
} from "../../../components/admin/AdminTable";

import { getReviews, setReviewStatus } from "../../../service/admin.api";

const toneFor = (status) => {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "rose";
  return "amber";
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [viewingReview, setViewingReview] = useState(null);

  // Load Reviews
  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch((e) =>
        setError(
          e.response?.data?.message || "Could not load reviews."
        )
      );
  }, []);

  // Update Review Status
  const update = async (id, status) => {
    try {
      const review = await setReviewStatus(id, status);

      setReviews((all) =>
        all.map((item) =>
          item._id === id ? { ...item, ...review } : item
        )
      );

      setViewingReview((current) =>
        current && current._id === id
          ? { ...current, ...review }
          : current
      );
    } catch {
      setError("Review status could not be saved.");
    }
  };

  return (
    <AdminSectionPage
      title="Reviews"
      description="Approve or reject real product feedback."
      badge="Feedback"
    >
      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* Reviews Table */}
      <AdminTable
        title="Reviews"
        subtitle="Customer feedback and approval"
        entityPlural="reviews"
        emptyMessage="No product reviews have been submitted yet."
        rows={reviews}
        columns={[
          // Customer
          {
            key: "customer",
            label: "Customer",
            render: (row) => (
              <div className="flex min-w-0 items-center gap-2">
                {/* Avatar */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold uppercase text-emerald-700">
                  {(row.user?.name || "D").charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {row.user?.name || "Deleted user"}
                  </p>

                  {row.user?.email && (
                    <p className="truncate text-[10px] text-slate-400">
                      {row.user.email}
                    </p>
                  )}
                </div>
              </div>
            ),
          },

          // Product
          {
            key: "product",
            label: "Product",
            render: (row) => (
              <span className="block truncate text-xs font-medium text-slate-600">
                {row.product?.name || "Deleted product"}
              </span>
            ),
          },

          // Rating
          {
            key: "rating",
            label: "Rating",
            render: (row) => (
              <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1">
                <Star
                  size={12}
                  className="fill-amber-400 text-amber-400"
                />

                <span className="text-[11px] font-bold text-amber-600">
                  {row.rating || 0}/5
                </span>
              </div>
            ),
          },

          // Review
          {
            key: "comment",
            label: "Review",
            render: (row) => (
              <span
                title={row.comment || ""}
                className="block truncate text-xs text-slate-500"
              >
                {row.comment || "—"}
              </span>
            ),
          },

          // Status
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <StatusBadge tone={toneFor(row.status)}>
                {row.status || "Pending"}
              </StatusBadge>
            ),
          },

          // Actions
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <TableActions
                itemName="review"
                viewLabel="View review"
                onView={() => setViewingReview(row)}
              />
            ),
          },
        ]}
      />

      {/* ================= VIEW REVIEW MODAL ================= */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3">
          <div className="my-6 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Review Details
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Full feedback from the customer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingReview(null)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close review details"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 px-5 py-4">
              {/* Customer */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Customer
                </span>

                <span className="max-w-[230px] truncate text-right text-xs font-semibold text-slate-900">
                  {viewingReview.user?.name || "Deleted user"}
                </span>
              </div>

              {/* Product */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Product
                </span>

                <span className="max-w-[230px] truncate text-right text-xs font-semibold text-slate-900">
                  {viewingReview.product?.name || "Deleted product"}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Rating
                </span>

                <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1">
                  <Star
                    size={12}
                    className="fill-amber-400 text-amber-400"
                  />

                  <span className="text-[11px] font-bold text-amber-600">
                    {viewingReview.rating || 0}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-500">
                  Comment
                </p>

                <div className="max-h-32 overflow-y-auto rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-700">
                  {viewingReview.comment || "—"}
                </div>
              </div>

              {/* Status */}
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">
                  Update Status
                </span>

                <select
                  value={viewingReview.status || "Pending"}
                  onChange={(e) =>
                    update(
                      viewingReview._id,
                      e.target.value
                    )
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setViewingReview(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}