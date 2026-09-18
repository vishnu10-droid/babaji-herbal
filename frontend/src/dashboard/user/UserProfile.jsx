import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User as UserIcon, CalendarDays, BadgeCheck, Save } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { getProfile, updateProfile } from "../../service/auth.api";

const UserProfile = () => {
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProfile(token);
        const data = res.data || {};
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
        updateUser(data);
      } catch (e) {
        setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
        setError(e.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
    else {
      setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const res = await updateProfile(form, token);
      updateUser(res.data || {});
      setSuccess(res.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const initial = (form.name || user?.name || "U").charAt(0).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#123d2a]">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Keep your details updated for faster checkout.</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#0B6B3A]/10">
        <div className="bg-gradient-to-r from-[#0B3B24] via-[#0E5C36] to-[#128a4d] px-6 py-6 text-white">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#f9cd73] text-3xl font-bold text-[#0B3B24] ring-4 ring-white/25">
              {initial}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="flex flex-wrap items-center justify-center gap-2 text-xl font-bold sm:justify-start">
                {form.name || user?.name || "User"}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-[#f9cd73]">
                  <BadgeCheck size={12} /> Customer
                </span>
              </h2>
              <p className="mt-1 text-sm text-white/80">{form.email || user?.email || ""}</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-white/70 sm:justify-start">
                <CalendarDays size={13} />
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 p-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#123d2a]">
                  <UserIcon size={14} className="text-[#0B6B3A]" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#123d2a]">
                  <Mail size={14} className="text-[#0B6B3A]" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#123d2a]">
                  <Phone size={14} className="text-[#0B6B3A]" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  pattern="[0-9+ -]{7,15}"
                  title="Enter a valid phone number"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#123d2a]">Account Role</label>
                <input
                  type="text"
                  value={user?.role === "admin" ? "Admin" : "Customer"}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>
            </div>

            {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-100">{error}</p>}
            {success && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">{success}</p>}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B6B3A] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#0B6B3A]/25 transition hover:bg-[#0a5a31] disabled:opacity-60"
              >
                <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
