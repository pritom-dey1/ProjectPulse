"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE", // default EMPLOYEE
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/admin/users", form);
      alert("User created successfully");
      router.push("/admin/projects"); // অথবা /admin/users লিস্টে যেতে পারো
    } catch (err) {
      console.error(err);
      alert("Failed to create user: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-300">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Role</label>
          <select
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-medium transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}