import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import Button from "../components/Button";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/auth-context";
import { API_URL } from "../config/config";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      login(data.data, data.token);
      navigate(data.data.role === "admin" ? "/admin" : "/account", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10";

  return (
    <>
      <Breadcrumb items={[{ label: "Login" }]} />
      <section className="section-shell flex justify-center py-6 sm:py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B6B3A]/10 text-[#0B6B3A]">
              <Leaf size={20} />
            </span>
            <h1 className="mt-3 text-2xl font-bold text-[#0B6B3A] sm:text-3xl">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue shopping</p>
          </div>
          {error && <p className="mb-4 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-5">
            <label className="mb-3.5 block text-sm font-medium text-gray-700">
              Email
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" autoComplete="email" inputMode="email" className={inputCls} required />
            </label>
            <label className="mb-5 block text-sm font-medium text-gray-700">
              Password
              <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Your password" autoComplete="current-password" className={inputCls} required />
            </label>
            <Button type="submit" className="w-full rounded-xl py-3.5 text-base">{loading ? "Please Wait..." : "Sign In"}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">New here? <Link to="/register" className="font-semibold text-[#0B6B3A] hover:underline">Create Account</Link></p>
        </div>
      </section>
    </>
  );
}
