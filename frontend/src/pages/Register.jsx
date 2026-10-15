import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { API_URL } from "../config/config";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      login(data.data, data.token);
      navigate(data.data.role === "admin" ? "/admin" : "/account", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-green-700 focus:ring-4 focus:ring-green-700/10";

  return (
    <section className="flex min-h-[calc(100dvh-140px)] items-center justify-center bg-gray-100 px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:rounded-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700/10 text-green-700">
            <Leaf size={20} />
          </span>
          <h2 className="mt-3 text-2xl font-bold text-green-700 sm:text-3xl">Create account</h2>
          <p className="mt-1 text-sm text-gray-500">Join Babaji Herbals for faster checkout</p>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
            <input name="name" value={formData.name} onChange={updateField} placeholder="Your full name" autoComplete="name" className={inputCls} required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input type="email" name="email" value={formData.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" inputMode="email" className={inputCls} required />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Phone
            <input name="phone" value={formData.phone} onChange={updateField} placeholder="10-digit mobile number" autoComplete="tel" inputMode="tel" className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input type="password" name="password" value={formData.password} onChange={updateField} minLength="6" placeholder="Minimum 6 characters" autoComplete="new-password" className={inputCls} required />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-green-700 py-3.5 text-base font-semibold text-white transition hover:bg-green-800 active:scale-[0.99] disabled:opacity-60">
            {loading ? "Please Wait..." : "Register"}
          </button>
          <p className="pt-1 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-semibold text-green-700 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
