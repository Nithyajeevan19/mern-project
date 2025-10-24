import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("https://taskmanager-9yu0.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setMessage(data.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-2xl font-bold">✍️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Register</h2>
          <p className="text-gray-500 text-sm">Create your new account</p>
        </div>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-3 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
          required
        />
        <button
          className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-pink-400 to-blue-500 shadow hover:from-pink-500 hover:to-blue-700 transition"
        >
          Register
        </button>
        {message && (
          <p className="mt-4 text-center text-green-600 text-sm">{message}</p>
        )}
        <div className="text-center mt-4">
          <span className="text-gray-500">Already have an account? </span>
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
