import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge, TableActions } from "../../../components/admin/AdminTable";
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from "../../../service/coupon.api";

const emptyForm = {
  code: "",
  campaign: "",
  discountType: "percent",
  discountValue: "",
  minOrder: "",
  maxUses: "",
  isActive: true,
  expiry: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setCoupons(await getCoupons());
    } catch (e) {
      setError(e.response?.data?.message || "Could not load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      code: row.code || "",
      campaign: row.campaign || "",
      discountType: row.discountType || "percent",
      discountValue: row.discountValue ?? "",
      minOrder: row.minOrder ?? "",
      maxUses: row.maxUses ?? "",
      isActive: row.isActive ?? true,
      expiry: row.expiry ? new Date(row.expiry).toISOString().slice(0, 10) : "",
    });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrder: Number(form.minOrder) || 0,
        maxUses: Number(form.maxUses) || 0,
        expiry: form.expiry || null,
      };
      if (editingId) await updateCoupon(editingId, payload);
      else await createCoupon(payload);
      setModal(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete coupon.");
    }
  };

  const discountLabel = (row) =>
    row.discountType === "flat" ? `₹${row.discountValue}` : `${row.discountValue}%`;

  return (
    <AdminSectionPage
      title="Coupons"
      description="Launch promotional discounts with campaign tracking."
      badge="Promotions"
      action={
        <button
          onClick={openAdd}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Coupon
        </button>
      }
    >
      {error && <p className="mb-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No coupons yet</p>
          <p className="mt-1 text-xs text-slate-500">Create your first discount coupon.</p>
          <button onClick={openAdd} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Add Coupon
          </button>
        </div>
      ) : (
        <AdminTable
          rows={coupons}
          columns={[
            { key: "code", label: "Coupon", render: (row) => <span className="font-bold text-blue-600">{row.code}</span> },
            { key: "campaign", label: "Campaign", render: (row) => row.campaign || "-" },
            { key: "discount", label: "Discount", render: (row) => discountLabel(row) },
            { key: "minOrder", label: "Min Order", render: (row) => `₹${Number(row.minOrder || 0).toLocaleString("en-IN")}` },
            {
              key: "status",
              label: "Status",
              render: (row) => <StatusBadge tone={row.isActive ? "green" : "rose"}>{row.isActive ? "Active" : "Inactive"}</StatusBadge>,
            },
            { key: "expiry", label: "Expiry", render: (row) => (row.expiry ? new Date(row.expiry).toLocaleDateString("en-IN") : "No expiry") },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <TableActions
                  itemName={row.code}
                  viewLabel="View coupon"
                  editLabel="Edit coupon"
                  deleteLabel="Delete coupon"
                  onView={() => setViewingCoupon(row)}
                  onEdit={() => openEdit(row)}
                  onDelete={() => handleDelete(row._id)}
                />
              ),
            },
          ]}
        />
      )}

      {viewingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div><h2 className="text-base font-bold">Coupon details</h2><p className="mt-1 text-sm text-slate-500">Full information for <span className="font-bold text-blue-600">{viewingCoupon.code}</span></p></div>
              <button type="button" onClick={() => setViewingCoupon(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close coupon details"><X size={18} /></button>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Campaign</dt><dd className="font-semibold text-slate-900">{viewingCoupon.campaign || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Discount</dt><dd className="font-semibold text-slate-900">{discountLabel(viewingCoupon)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Min order</dt><dd className="font-semibold text-slate-900">₹{Number(viewingCoupon.minOrder || 0).toLocaleString("en-IN")}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Max uses</dt><dd className="font-semibold text-slate-900">{viewingCoupon.maxUses || "Unlimited"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd><StatusBadge tone={viewingCoupon.isActive ? "green" : "rose"}>{viewingCoupon.isActive ? "Active" : "Inactive"}</StatusBadge></dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Expiry</dt><dd className="font-semibold text-slate-900">{viewingCoupon.expiry ? new Date(viewingCoupon.expiry).toLocaleDateString("en-IN") : "No expiry"}</dd></div>
            </dl>
            <div className="mt-5 flex justify-end"><button type="button" onClick={() => setViewingCoupon(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Close</button></div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-base font-bold">{editingId ? "Edit Coupon" : "Add Coupon"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input name="code" value={form.code} onChange={handleChange} placeholder="Coupon code (e.g. SAVE10)" required className="w-full rounded-xl border px-3 py-2 text-sm uppercase outline-none focus:border-blue-500" />
              <input name="campaign" value={form.campaign} onChange={handleChange} placeholder="Campaign name" className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <select name="discountType" value={form.discountType} onChange={handleChange} className="rounded-xl border bg-white px-3 py-2 text-sm outline-none">
                  <option value="percent">Percent %</option>
                  <option value="flat">Flat ₹</option>
                </select>
                <input name="discountValue" type="number" min="0" value={form.discountValue} onChange={handleChange} placeholder="Value" required className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="minOrder" type="number" min="0" value={form.minOrder} onChange={handleChange} placeholder="Min order ₹" className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500" />
                <input name="maxUses" type="number" min="0" value={form.maxUses} onChange={handleChange} placeholder="Max uses (0 = unlimited)" className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <input name="expiry" type="date" value={form.expiry} onChange={handleChange} className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 accent-blue-600" />
                Active
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="rounded-xl border px-4 py-2 text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
