import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Save, CheckCircle2, AlertCircle } from "lucide-react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import { useAuth } from "../../../context/auth-context";
import { API_URL } from "../../../config/config";

const inputCls =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const initials = (formData.name || user?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setIsError(false);
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Profile update failed");
      updateUser(data.data);
      setStatus("Profile saved successfully.");
    } catch (error) {
      setStatus(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSectionPage
      title="Profile"
      description="Update the account details stored for your dashboard profile."
      badge="Account"
      action={
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={14} /> {user?.role === "admin" ? "Administrator" : "Account"}
        </div>
      }
    >
      {status && (
        <div
          className={`flex items-center gap-2 rounded-2xl border p-3.5 text-sm font-medium ${
            isError ? "border-rose-100 bg-rose-50 text-rose-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {status}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-[#123d2a] p-6 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
              {initials}
            </div>
            <h3 className="mt-4 truncate text-lg font-bold">{formData.name || "Admin"}</h3>
            <p className="mt-0.5 truncate text-xs text-emerald-100">{formData.email || "—"}</p>
            <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
              {user?.role || "admin"}
            </span>
          </div>
          <dl className="space-y-3 p-6 text-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-100 p-2 text-slate-500"><Mail size={14} /></span>
              <div className="min-w-0"><p className="text-[11px] text-slate-400">Email</p><p className="truncate font-semibold text-slate-800">{formData.email || "—"}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-100 p-2 text-slate-500"><Phone size={14} /></span>
              <div className="min-w-0"><p className="text-[11px] text-slate-400">Phone</p><p className="truncate font-semibold text-slate-800">{formData.phone || "—"}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-slate-100 p-2 text-slate-500"><User size={14} /></span>
              <div className="min-w-0"><p className="text-[11px] text-slate-400">Account ID</p><p className="truncate font-mono text-xs font-semibold text-slate-800">{user?.id || "-"}</p></div>
            </div>
          </dl>
        </aside>

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-sm font-bold text-slate-900">Edit details</h3>
          <p className="mt-1 text-xs text-slate-500">Keep your name, email and phone up to date.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:col-span-1">
              Full name
              <span className="relative block">
                <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${inputCls} pl-10`} placeholder="Your name" required
                />
              </span>
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:col-span-1">
              Phone
              <span className="relative block">
                <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="phone" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`${inputCls} pl-10`} placeholder="+91 …"
                />
              </span>
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:col-span-2">
              Email address
              <span className="relative block">
                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" name="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`${inputCls} pl-10`} placeholder="you@store.in" required
                />
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">Use an active email — order alerts go here.</p>
            <button
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save size={16} /> {loading ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </AdminSectionPage>
  );
}
