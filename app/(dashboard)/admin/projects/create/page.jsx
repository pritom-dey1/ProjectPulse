"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';  // ← এই লাইন যোগ করো

export default function CreateProject() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    clientId: "",
    employeeIds: [],
  });

  useEffect(() => {
    api.get("/api/users").then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/projects", form);
      toast.success("Project created successfully!");  // ← সাকসেস টোস্ট
      router.push("/admin/projects");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");  // ← এরর টোস্টও যোগ করলাম
    }
  };

  const toggleEmployee = (empId) => {
    setForm((prev) => {
      if (prev.employeeIds.includes(empId)) {
        return {
          ...prev,
          employeeIds: prev.employeeIds.filter((id) => id !== empId),
        };
      } else {
        return {
          ...prev,
          employeeIds: [...prev.employeeIds, empId],
        };
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl text-center font-bold mb-8 text-white">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Project Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block mb-2 text-gray-400 font-medium">Start Date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block mb-2 text-gray-400 font-medium">End Date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
        </div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Client</label>
          <select
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Client</option>
            {users.filter((u) => u.role === "CLIENT").map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">Employees</label>
          <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            {users.filter((u) => u.role === "EMPLOYEE").length === 0 ? (
              <p className="text-gray-500">No employees available</p>
            ) : (
              users.filter((u) => u.role === "EMPLOYEE").map((u) => (
                <label
                  key={u._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                    form.employeeIds.includes(u._id)
                      ? "bg-indigo-600/20 border border-indigo-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.employeeIds.includes(u._id)}
                    onChange={() => toggleEmployee(u._id)}
                    className="mr-3 w-5 h-5 accent-indigo-500"
                  />
                  <span className="text-white">{u.name}</span>
                </label>
              ))
            )}
          </div>
          {form.employeeIds.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {form.employeeIds.length} employees
            </p>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition-all duration-200"
        >
          Create Project
        </motion.button>
      </form>
    </motion.div>
  );
}