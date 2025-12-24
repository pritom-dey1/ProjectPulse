"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import toast from 'react-hot-toast';
export default function EditProject() {
  const { id } = useParams();
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
      }
    };
    fetchData();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.patch(`/api/admin/projects/${id}`, form);
    if (res.status === 200 || res.status === 201) {
      toast.success("Project updated successfully");
      router.push(`/admin/projects/${id}`);
    }
  } catch (err) {
    console.error(err);
    const errorMsg = err.response?.data?.error || "Failed to update project";
    toast.error(errorMsg);
  }
};

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-300">Project Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded h-32 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">Start Date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">End Date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Client</label>
          <select
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select Client</option>
            {users.filter((u) => u.role === "CLIENT").map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Employees (multi-select)</label>
          <select
            multiple
            value={form.employeeIds}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
              setForm({ ...form, employeeIds: selected });
            }}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded h-40 focus:outline-none focus:border-indigo-500"
          >
            {users.filter((u) => u.role === "EMPLOYEE").map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded font-medium transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}