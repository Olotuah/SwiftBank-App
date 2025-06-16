import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { toast, Toaster } from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",  // ✅ Changed from name → fullName
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful, please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-manrope">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-xl space-y-4 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold font-inter">Register for SwiftBank</h2>

        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 rounded bg-white/20 text-white"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 rounded bg-white/20 text-white"
          required
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 rounded bg-white/20 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-inter"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
        </p>
      </form>
    </div>
  );
}
