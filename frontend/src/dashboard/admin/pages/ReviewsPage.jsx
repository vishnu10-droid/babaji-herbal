import { useEffect, useState } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable from "../../../components/admin/AdminTable";
import { getReviews, setReviewStatus } from "../../../service/admin.api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getReviews().then(setReviews).catch((e) => setError(e.response?.data?.message || "Could not load reviews.")); }, []);
  const update = async (id, status) => { try { const review = await setReviewStatus(id, status); setReviews((all) => all.map((item) => item._id === id ? { ...item, ...review } : item)); } catch { setError("Review status could not be saved."); } };
  return <AdminSectionPage title="Reviews" description="Approve or reject real product feedback." badge="Feedback">{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<AdminTable emptyMessage="No product reviews have been submitted yet." rows={reviews} columns={[{ key: "customer", label: "Customer", render: (row) => row.user?.name || "Deleted user" }, { key: "product", label: "Product", render: (row) => row.product?.name || "Deleted product" }, { key: "rating", label: "Rating", render: (row) => <span className="font-semibold text-amber-600">★ {row.rating}/5</span> }, { key: "comment", label: "Review", render: (row) => row.comment || "—" }, { key: "status", label: "Status", render: (row) => <select value={row.status} onChange={(e) => update(row._id, e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs"><option>Pending</option><option>Approved</option><option>Rejected</option></select> }]} /></AdminSectionPage>;
}
