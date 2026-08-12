import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Login" }]} />
      <section className="section-shell py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-[#0B6B3A]">Login</h1>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="mb-4 block text-sm font-medium">Email<input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#0B6B3A]" required /></label>
            <label className="mb-6 block text-sm font-medium">Password<input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#0B6B3A]" required /></label>
            <Button type="submit" className="w-full rounded-full">{loading ? "Please Wait..." : "Sign In"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">New here? <Link to="/register" className="font-medium text-[#0B6B3A]">Create Account</Link></p>
        </div>
      </section>
    </>
  );
}
