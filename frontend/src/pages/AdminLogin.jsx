import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";
import axios from "axios";
export default function AdminLogin() {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = {
      email: formData.email,
      password: formData.password,
    };
    const response = await axios.post(`${API_URL}/auth/admin/login`, data);
    console.log(response.data);
    navigate("/admin");
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eff6ef] px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-[#d5e5d4] bg-white shadow-2xl shadow-[#174d32]/10">
        <div className="bg-[#174d32] px-8 py-9 text-center text-white">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#f5bd56]">
            <ShieldCheck size={29} />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f5bd56]">
            Babaji Herbals
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin portal</h1>
          <p className="mt-2 text-sm text-white/75">
            Sign in to manage your store.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}
          <label className="mb-5 block text-sm font-semibold text-[#173b29]">
            Admin email
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="mt-2 w-full rounded-xl border border-[#cfdfd0] px-4 py-3 text-slate-800 outline-none transition focus:border-[#28714a] focus:ring-2 focus:ring-[#28714a]/10"
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#173b29]">
            Password
            <input
              type="password"
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
              className="mt-2 w-full rounded-xl border border-[#cfdfd0] px-4 py-3 text-slate-800 outline-none transition focus:border-[#28714a] focus:ring-2 focus:ring-[#28714a]/10"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#174d32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#28714a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LockKeyhole size={17} />{" "}
            {loading ? "Signing in..." : "Sign in to admin"}
          </button>
        </form>
      </section>
    </main>
  );
}
