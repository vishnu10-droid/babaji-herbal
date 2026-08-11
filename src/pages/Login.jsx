import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");

        // Save full user data + token to localStorage and context
        login(data.data, data.data.token);

        // Redirect to dashboard after login
        navigate("/admin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Login" }]} />

      <section className="section-shell py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-[#0B6B3A]">
            Login
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#0B6B3A]"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#0B6B3A]"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
            >
              {loading ? "Please Wait..." : "Sign In"}
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{" "}
            <Link
              to="/register"
              className="font-medium text-[#0B6B3A]"
            >
              Create Account
            </Link>
          </p>

        </div>
      </section>
    </>
  );
}