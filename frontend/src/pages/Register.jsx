import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-green-700">Register</h2>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Full Name<input name="name" value={formData.name} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" required /></label>
          <label className="block text-sm font-medium">Email<input type="email" name="email" value={formData.email} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" required /></label>
          <label className="block text-sm font-medium">Phone<input name="phone" value={formData.phone} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" /></label>
          <label className="block text-sm font-medium">Password<input type="password" name="password" value={formData.password} onChange={updateField} minLength="6" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" required /></label>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Please Wait..." : "Register"}</button>
          <p className="text-center text-sm">Already have an account? <Link to="/login" className="font-semibold text-green-700">Login</Link></p>
        </form>
      </div>
    </section>
  );
}
