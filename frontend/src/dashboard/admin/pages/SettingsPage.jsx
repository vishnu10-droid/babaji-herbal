import { useEffect, useState } from "react";
import { Store, Truck, Bell, Save, CheckCircle2, AlertCircle } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import { getSettings, saveSettings } from "../../../service/admin.api";

const inputCls =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setForm)
      .catch(() => {
        setMessage("Could not load settings.");
        setIsError(true);
      });
  }, []);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      setForm(
        await saveSettings({
          ...form,
          shippingFee: Number(form.shippingFee),
          freeShippingAbove: Number(form.freeShippingAbove),
          taxRate: Number(form.taxRate),
        })
      );
      setMessage("Settings saved successfully.");
      setIsError(false);
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not save settings.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <AdminSectionPage title="Settings" description="Manage store-wide shopping rules." badge="Config">
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl border border-emerald-100 bg-white" />
          ))}
        </div>
        {message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{message}</p>}
      </AdminSectionPage>
    );
  }

  return (
    <AdminSectionPage
      title="Settings"
      description="Manage store-wide shopping rules, shipping and alerts."
      badge="Config"
      action={
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live store config
        </div>
      }
    >
      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl border p-3.5 text-sm font-medium ${
            isError ? "border-rose-100 bg-rose-50 text-rose-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {message}
        </div>
      )}

      <form onSubmit={submit} className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Store info */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><Store size={18} /></span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Store information</h3>
                <p className="text-xs text-slate-500">Shown on invoices and support emails</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Store name
                <input name="storeName" value={form.storeName || ""} onChange={change} placeholder="Babaji Herbal" className={inputCls} />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Support email
                <input name="supportEmail" type="email" value={form.supportEmail || ""} onChange={change} placeholder="support@store.in" className={inputCls} />
              </label>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Truck size={18} /></span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Shipping &amp; tax</h3>
                <p className="text-xs text-slate-500">Applied automatically at checkout</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Shipping fee (₹)
                <input name="shippingFee" type="number" min="0" value={form.shippingFee ?? 0} onChange={change} className={inputCls} />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Free shipping above (₹)
                <input name="freeShippingAbove" type="number" min="0" value={form.freeShippingAbove ?? 0} onChange={change} className={inputCls} />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Tax rate (%)
                <input name="taxRate" type="number" min="0" value={form.taxRate ?? 0} onChange={change} className={inputCls} />
              </label>
            </div>
          </section>

          {/* Alerts */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Bell size={18} /></span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Low-stock alerts</h3>
                  <p className="text-xs text-slate-500">Get notified when inventory runs low</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(form.inventoryAlerts)}
                onClick={() => setForm((c) => ({ ...c, inventoryAlerts: !c.inventoryAlerts }))}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${form.inventoryAlerts ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${form.inventoryAlerts ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className="h-fit space-y-4 rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-6 shadow-sm xl:sticky xl:top-4">
          <h3 className="text-sm font-bold text-slate-900">Summary</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Shipping</dt><dd className="font-bold text-slate-900">₹{Number(form.shippingFee || 0)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Free above</dt><dd className="font-bold text-slate-900">₹{Number(form.freeShippingAbove || 0)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Tax</dt><dd className="font-bold text-slate-900">{Number(form.taxRate || 0)}%</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Alerts</dt><dd className={`font-bold ${form.inventoryAlerts ? "text-emerald-600" : "text-slate-400"}`}>{form.inventoryAlerts ? "On" : "Off"}</dd></div>
          </dl>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving…" : "Save settings"}
          </button>
          <p className="text-center text-[11px] text-slate-400">Changes apply instantly to checkout.</p>
        </aside>
      </form>
    </AdminSectionPage>
  );
}
