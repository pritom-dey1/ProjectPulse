"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    clientId: "",
    employeeIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, usersRes] = await Promise.all([
          api.get(`/api/admin/projects/${id}`),
          api.get("/api/users"),
        ]);
        const proj = projRes.data.project || projRes.data;
        setForm({
          name: proj.name || "",
          description: proj.description || "",
          startDate: proj.startDate ? proj.startDate.split("T")[0] : "",
          endDate: proj.endDate ? proj.endDate.split("T")[0] : "",
          clientId: proj.clientId || "",
          employeeIds: proj.employeeIds || [],
        });
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleEmployee = (empId) => {
    setForm((prev) => {
      if (prev.employeeIds.includes(empId)) {
        return {
          ...prev,
          employeeIds: prev.employeeIds.filter((id) => id !== empId),
        };
      }
      return {
        ...prev,
        employeeIds: [...prev.employeeIds, empId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date validation
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Invalid date format");
      return;
    }

    if (end <= start) {
      toast.error("End date must be after start date");
      return;
    }

    // ISO format-এ convert করে পাঠাও (timezone issue ফিক্স)
    const payload = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
    };

    try {
      const res = await api.patch(`/api/admin/projects/${id}`, payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("Project updated successfully");
        router.push(`/admin/projects/${id}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.response?.data?.error || "Failed to update project";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Loading project data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl text-center font-bold mb-8 text-white">
        Edit Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800"
      >
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">
            Project Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block mb-2 text-gray-400 font-medium">
              Start Date
            </label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]} // optional: আজকের পরে
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block mb-2 text-gray-400 font-medium">
              End Date
            </label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              min={form.startDate || new Date().toISOString().split("T")[0]} // startDate-এর পরে
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>
        </div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">
            Client
          </label>
          <select
            required
            value={form.clientId}
            onChange={(e) =>
              setForm({ ...form, clientId: e.target.value })
            }
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Client</option>
            {users
              .filter((u) => u.role === "CLIENT")
              .map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
          </select>
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block mb-2 text-gray-400 font-medium">
            Employees
          </label>
          <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            {users.filter((u) => u.role === "EMPLOYEE").map((u) => (
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
            ))}
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
          Save Changes
        </motion.button>
      </form>
    </motion.div>
  );
}