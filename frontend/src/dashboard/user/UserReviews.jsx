import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Trash2, Send, ShoppingBag } from "lucide-react";
import { getMyOrders } from "../../service/order.api";
import { createReview, deleteMyReview, getMyReviews } from "../../service/review.api";

const Stars = ({ value, onRate, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type={onRate ? "button" : undefined}
        onClick={onRate ? () => onRate(s) : undefined}
        className={onRate ? "transition hover:scale-110" : ""}
        aria-label={`${s} star`}
      >
        <Star
          size={size}
          className={s <= value ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      </button>
    ))}
  </div>
);

export default function UserReviews() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState(null); // { productId, name }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [o, r] = await Promise.all([getMyOrders(), getMyReviews().catch(() => [])]);
      setOrders(o);
      setReviews(r);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const purchased = useMemo(() => {
    const seen = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!item.product) return;
        const key = String(item.product);
        if (!seen.has(key)) seen.set(key, { productId: key, name: item.name });
      });
    });
    return [...seen.values()];
  }, [orders]);

  const reviewedIds = useMemo(() => new Set(reviews.map((r) => String(r.product?._id || r.product))), [reviews]);
  const pending = purchased.filter((p) => !reviewedIds.has(String(p.productId)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      setSubmitting(true);
      setMsg("");
      const res = await createReview({ productId: selected.productId, rating, comment });
      setMsg(res.message || "Review submitted for approval.");
      setReviews(await getMyReviews().catch(() => reviews));
      setSelected(null);
      setComment("");
      setRating(5);
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteMyReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setMsg("Review deleted.");
    } catch {
      setMsg("Could not delete review.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#123d2a]">My Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">Rate products you purchased — reviews go live after approval.</p>
      </div>

      {msg && (
        <p className="rounded-2xl bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">{msg}</p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-3xl bg-white ring-1 ring-slate-100" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>
      ) : (
        <>
          {/* Write a review */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#123d2a]">
              <ShoppingBag size={19} className="text-[#0B6B3A]" /> Products awaiting your review ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                {purchased.length === 0 ? (
                  <>No purchased products yet. <Link to="/shop" className="font-bold text-[#0B6B3A]">Shop now</Link></>
                ) : (
                  "All purchased products reviewed. Thank you!"
                )}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {pending.map((item) => (
                  <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4">
                    <p className="text-sm font-bold">{item.name}</p>
                    <button
                      onClick={() => { setSelected(item); setRating(5); setComment(""); }}
                      className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                        selected?.productId === item.productId
                          ? "bg-[#0B6B3A] text-white"
                          : "bg-[#0B6B3A]/10 text-[#0B6B3A] hover:bg-[#0B6B3A] hover:text-white"
                      }`}
                    >
                      {selected?.productId === item.productId ? "Selected" : "Write review"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selected && (
              <form onSubmit={handleSubmit} className="mt-5 rounded-2xl bg-[#faf8f1] p-4 ring-1 ring-[#0B6B3A]/15 md:p-5">
                <p className="text-sm font-bold text-[#123d2a]">Reviewing: {selected.name}</p>
                <div className="mt-3"><Stars value={rating} onRate={setRating} /></div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Share quality, packaging, results… (optional)"
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setSelected(null)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0B6B3A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a5a31] disabled:opacity-60"
                  >
                    <Send size={14} /> {submitting ? "Submitting…" : "Submit review"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* My submitted reviews */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B6B3A]/10 md:p-6">
            <h2 className="text-lg font-bold text-[#123d2a]">Submitted reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">You have not submitted any reviews yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <li key={r._id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{r.product?.name || "Product"}</p>
                        <div className="mt-1.5"><Stars value={r.rating} size={16} /></div>
                        {r.comment && <p className="mt-2 text-sm text-slate-600">“{r.comment}”</p>}
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider">
                          <span className={r.status === "Approved" ? "text-emerald-600" : r.status === "Rejected" ? "text-red-500" : "text-amber-600"}>
                            {r.status}
                          </span>
                          <span className="ml-2 font-medium normal-case tracking-normal text-slate-400">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : ""}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
                        title="Delete review"
                        aria-label="Delete review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
