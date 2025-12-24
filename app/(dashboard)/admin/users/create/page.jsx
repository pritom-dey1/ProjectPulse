"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

export default function CreateUser() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/admin/users", form);
      toast.success("User created successfully!");
      router.push("/admin"); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl text-center font-bold mb-8 text-white">Create New User</h1>
      <form className="space-y-3 bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800" onSubmit={handleSubmit}>
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Role</label>
          <select
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="CLIENT">Client</option>
          </select>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating..." : "Create User"}
        </motion.button>
      </form>
    </motion.div>
  );
}
