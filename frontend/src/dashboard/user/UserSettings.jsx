import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/auth-context";
import { changePassword, deleteAccount } from "../../service/auth.api";

const PREFS_KEY = "account_prefs";

const readPrefs = () => {
  try {
    return { email: true, order: true, promo: false, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return { email: true, order: true, promo: false };
  }
};

const UserSettings = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(readPrefs);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const togglePref = (key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError("New password and confirm password do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    try {
      setPwLoading(true);
      const res = await changePassword(
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        token,
      );
      setPwSuccess(res.message || "Password updated successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Could not update password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    if (!window.confirm("Final confirmation: delete your account, cart and wishlist permanently?")) return;
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteAccount(token);
      logout();
      navigate("/login");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#123d2a]">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account preferences.</p>
      </div>

      {/* Notifications */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#0B6B3A]/10">
        <h2 className="text-lg font-bold text-[#123d2a]">Account Settings</h2>
        <div className="mt-5 space-y-5">
          <SettingRow
            title="Email Notifications"
            description="Receive updates about your orders and account."
            checked={prefs.email}
            onChange={() => togglePref("email")}
          />
          <SettingRow
            title="Order Notifications"
            description="Get notifications when your order status changes."
            checked={prefs.order}
            onChange={() => togglePref("order")}
          />
          <SettingRow
            title="Promotional Emails"
            description="Receive offers, discounts and promotional emails."
            checked={prefs.promo}
            onChange={() => togglePref("promo")}
          />
        </div>
      </div>

      {/* Password */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#0B6B3A]/10">
        <h2 className="text-lg font-bold text-[#123d2a]">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
              required
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              required
              minLength={6}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
              required
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {pwError && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 md:col-span-2">{pwError}</p>}
          {pwSuccess && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 md:col-span-2">{pwSuccess}</p>}
          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="rounded-full bg-[#0B6B3A] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#0B6B3A]/25 hover:bg-[#0a5a31] disabled:opacity-60"
            >
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-500">
          Deleting your account permanently removes your profile, cart and wishlist.
        </p>
        {deleteError && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{deleteError}</p>}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete Account"}
        </button>
      </div>
    </motion.div>
  );
};

const SettingRow = ({ title, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[#0B6B3A] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
    </div>
  );
};

export default UserSettings;
