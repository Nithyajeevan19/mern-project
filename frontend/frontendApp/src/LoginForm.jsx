import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:7000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.jwt_token) {
      Cookies.set('jwt_token', data.jwt_token, { expires: (1 / 24) }); // 1/24 days = 1 hour
      setMessage("Login successful!");
      setTimeout(() => navigate("/todos"), 1000);
    } else {
      setMessage(data.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-2xl font-bold">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Login</h2>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
          required
        />
        <button
          className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 shadow hover:from-blue-600 hover:to-purple-700 transition"
        >
          Login
        </button>
        {message && (
          <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
        )}
        <div className="text-center mt-4">
          <span className="text-gray-500">Don't have an account? </span>
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}
