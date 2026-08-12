import { useState } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import { useAuth } from "../../../context/auth-context";
import { API_URL } from "../../../config/config";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSectionPage title="Profile" description="Update the account details stored for your dashboard profile." badge="Account">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
        {status && <p className="rounded-xl bg-slate-900 p-3 text-sm text-emerald-300">{status}</p>}
        <label className="block text-sm text-slate-300">Name<input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" required /></label>
        <label className="block text-sm text-slate-300">Email<input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" required /></label>
        <label className="block text-sm text-slate-300">Phone<input name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /></label>
        <div className="flex items-center justify-between gap-4"><p className="text-xs text-slate-500">Account ID: {user?.id || "-"}</p><button disabled={loading} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Saving..." : "Save Profile"}</button></div>
      </form>
    </AdminSectionPage>
  );
}
