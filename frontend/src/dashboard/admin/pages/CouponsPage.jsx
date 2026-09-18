import { useEffect, useState } from "react";
import { X, TicketPercent } from "lucide-react";

import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, {
  StatusBadge,
  TableActions,
} from "../../../components/admin/AdminTable";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../../../service/coupon.api";

/* =========================================================
   EMPTY FORM
========================================================= */

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

/* =========================================================
   MONEY FORMAT
========================================================= */

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

/* =========================================================
   COUPONS PAGE
========================================================= */

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  /* =========================================================
     LOAD COUPONS
  ========================================================= */

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCoupons();

      setCoupons(Array.isArray(response) ? response : []);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not load coupons."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    load();
  }, []);

  /* =========================================================
     ADD COUPON
  ========================================================= */

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setModal(true);
    setError("");
  };

  /* =========================================================
     EDIT COUPON
  ========================================================= */

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
      expiry: row.expiry
        ? new Date(row.expiry)
            .toISOString()
            .slice(0, 10)
        : "",
    });

    setModal(true);
    setError("");
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,

        code: form.code.trim().toUpperCase(),

        campaign: form.campaign.trim(),

        discountValue: Number(
          form.discountValue
        ),

        minOrder:
          Number(form.minOrder) || 0,

        maxUses:
          Number(form.maxUses) || 0,

        expiry: form.expiry || null,
      };

      if (editingId) {
        await updateCoupon(
          editingId,
          payload
        );
      } else {
        await createCoupon(payload);
      }

      setModal(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save coupon."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE COUPON
  ========================================================= */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this coupon?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await deleteCoupon(id);

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete coupon."
      );
    }
  };

  /* =========================================================
     DISCOUNT LABEL
  ========================================================= */

  const discountLabel = (row) => {
    if (row.discountType === "flat") {
      return formatMoney(
        row.discountValue
      );
    }

    return `${row.discountValue || 0}%`;
  };

  /* =========================================================
     EXPIRY STATUS
  ========================================================= */

  const getExpiryInfo = (expiry) => {
    if (!expiry) {
      return {
        label: "No expiry",
        subLabel: "Unlimited",
        expired: false,
      };
    }

    const expiryDate = new Date(expiry);

    const today = new Date();

    expiryDate.setHours(
      23,
      59,
      59,
      999
    );

    const expired =
      expiryDate.getTime() <
      today.getTime();

    return {
      label: expiryDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
      subLabel: expired
        ? "Expired"
        : "Valid",
      expired,
    };
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    /* -------------------------------------------------------
       COUPON
    ------------------------------------------------------- */

    {
      key: "code",
      label: "Coupon",

      render: (row) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <TicketPercent
              size={15}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <span className="block max-w-full truncate text-[10px] font-bold tracking-wide text-blue-600">
              {row.code || "—"}
            </span>

            <p className="mt-0.5 truncate text-[8px] text-slate-400">
              Coupon code
            </p>
          </div>
        </div>
      ),
    },

    /* -------------------------------------------------------
       CAMPAIGN
    ------------------------------------------------------- */

    {
      key: "campaign",
      label: "Campaign",

      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-slate-700">
            {row.campaign ||
              "No campaign"}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-slate-400">
            Promotion
          </p>
        </div>
      ),
    },

    /* -------------------------------------------------------
       DISCOUNT
    ------------------------------------------------------- */

    {
      key: "discount",
      label: "Discount",

      render: (row) => {
        const isFlat =
          row.discountType === "flat";

        return (
          <div>
            <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
              {isFlat
                ? formatMoney(
                    row.discountValue
                  )
                : `${row.discountValue || 0}%`}
            </span>

            <p className="mt-1 text-[8px] text-slate-400">
              {isFlat
                ? "Flat discount"
                : "Percentage"}
            </p>
          </div>
        );
      },
    },

    /* -------------------------------------------------------
       MIN ORDER
    ------------------------------------------------------- */

    {
      key: "minOrder",
      label: "Min Order",

      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-[10px] font-bold text-slate-700">
            {formatMoney(
              row.minOrder
            )}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Minimum value
          </p>
        </div>
      ),
    },

    /* -------------------------------------------------------
       STATUS
    ------------------------------------------------------- */

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <StatusBadge
          tone={
            row.isActive
              ? "green"
              : "rose"
          }
        >
          {row.isActive
            ? "Active"
            : "Inactive"}
        </StatusBadge>
      ),
    },

    /* -------------------------------------------------------
       EXPIRY
    ------------------------------------------------------- */

    {
      key: "expiry",
      label: "Expiry",

      render: (row) => {
        const expiry = getExpiryInfo(
          row.expiry
        );

        return (
          <div className="min-w-0">
            <span
              className={`inline-flex max-w-full truncate rounded-md px-2 py-1 text-[9px] font-semibold ${
                expiry.expired
                  ? "bg-rose-50 text-rose-600"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              {expiry.label}
            </span>

            <p
              className={`mt-1 text-[8px] ${
                expiry.expired
                  ? "text-rose-500"
                  : "text-slate-400"
              }`}
            >
              {expiry.subLabel}
            </p>
          </div>
        );
      },
    },

    /* -------------------------------------------------------
       ACTIONS
    ------------------------------------------------------- */

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <TableActions
          itemName={row.code}
          viewLabel="View coupon"
          editLabel="Edit coupon"
          deleteLabel="Delete coupon"
          onView={() =>
            setViewingCoupon(row)
          }
          onEdit={() =>
            openEdit(row)
          }
          onDelete={() =>
            handleDelete(row._id)
          }
        />
      ),
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <AdminSectionPage
      title="Coupons"
      description="Launch promotional discounts with campaign tracking."
      badge="Promotions"

      action={
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <span className="text-base">
            +
          </span>

          Add Coupon
        </button>
      }
    >
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5">
          <p className="text-[11px] font-medium text-rose-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="rounded-md p-1 text-rose-400 hover:bg-rose-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-[10px] font-medium text-slate-500">
            Loading coupons...
          </p>
        </div>
      ) : coupons.length === 0 ? (
        /* ===================================================
           EMPTY STATE
        =================================================== */

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <TicketPercent size={18} />
          </div>

          <p className="mt-3 text-sm font-bold text-slate-700">
            No coupons yet
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Create your first discount
            coupon.
          </p>

          <button
            type="button"
            onClick={openAdd}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700"
          >
            Add Coupon
          </button>
        </div>
      ) : (
        /* ===================================================
           COUPONS TABLE
        =================================================== */

        <AdminTable
          title="Coupons"
          subtitle="Promotional discounts and campaigns"
          entityPlural="coupons"
          rows={coupons}
          columns={columns}
          emptyMessage="No coupons found. Create your first discount coupon."
        />
      )}

      {/* =====================================================
          VIEW COUPON MODAL
      ===================================================== */}

      {viewingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            {/* HEADER */}

            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <TicketPercent
                    size={16}
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-slate-900">
                    Coupon details
                  </h2>

                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    Information for{" "}
                    <span className="font-bold text-blue-600">
                      {viewingCoupon.code}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewingCoupon(null)
                }
                className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close coupon details"
              >
                <X size={17} />
              </button>
            </div>

            {/* DETAILS */}

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <dl className="space-y-2.5 text-[11px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Campaign
                  </dt>

                  <dd className="max-w-[220px] truncate font-semibold text-slate-900">
                    {viewingCoupon.campaign ||
                      "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Discount
                  </dt>

                  <dd className="font-semibold text-emerald-600">
                    {discountLabel(
                      viewingCoupon
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Min order
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {formatMoney(
                      viewingCoupon.minOrder
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Max uses
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {viewingCoupon.maxUses ||
                      "Unlimited"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Status
                  </dt>

                  <dd>
                    <StatusBadge
                      tone={
                        viewingCoupon.isActive
                          ? "green"
                          : "rose"
                      }
                    >
                      {viewingCoupon.isActive
                        ? "Active"
                        : "Inactive"}
                    </StatusBadge>
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Expiry
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {viewingCoupon.expiry
                      ? new Date(
                          viewingCoupon.expiry
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "No expiry"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* CLOSE */}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setViewingCoupon(null)
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingId
                    ? "Edit Coupon"
                    : "Add Coupon"}
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  {editingId
                    ? "Update coupon details."
                    : "Create a new promotional coupon."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModal(false)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close coupon form"
              >
                <X size={17} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {/* CODE */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                  Coupon Code
                </label>

                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="SAVE10"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* CAMPAIGN */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                  Campaign
                </label>

                <input
                  name="campaign"
                  value={form.campaign}
                  onChange={handleChange}
                  placeholder="Festival Sale"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DISCOUNT */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Discount Type
                  </label>

                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] outline-none focus:border-blue-500"
                  >
                    <option value="percent">
                      Percent %
                    </option>

                    <option value="flat">
                      Flat ₹
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Value
                  </label>

                  <input
                    name="discountValue"
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={handleChange}
                    placeholder="10"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* MIN + MAX */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Min Order
                  </label>

                  <input
                    name="minOrder"
                    type="number"
                    min="0"
                    value={form.minOrder}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Max Uses
                  </label>

                  <input
                    name="maxUses"
                    type="number"
                    min="0"
                    value={form.maxUses}
                    onChange={handleChange}
                    placeholder="0 = unlimited"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* EXPIRY */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                  Expiry Date
                </label>

                <input
                  name="expiry"
                  type="date"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] outline-none focus:border-blue-500"
                />
              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[10px] font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 accent-blue-600"
                />

                Active coupon
              </label>

              {/* ERROR */}

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-medium text-rose-600">
                  {error}
                </p>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setModal(false)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}