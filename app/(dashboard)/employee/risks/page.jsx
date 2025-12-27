"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function MyRisks() {
  const [risks, setRisks] = useState([]);
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    severity: "Medium",
    mitigation: "",
  });
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [risksRes, projectsRes] = await Promise.all([
          api.get("/api/employee/risks"),
          api.get("/api/employee/projects"),
        ]);
        setRisks(risksRes.data.risks || []);
        setProjects(projectsRes.data.projects || []);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = api.post("/api/employee/risks", formData);

    toast.promise(promise, {
      loading: "Reporting risk...",
      success: "Risk reported successfully! 🎉",
      error: (err) =>
        err?.response?.data?.message || "Failed to report risk",
    });

    try {
      await promise;

      setFormData({
        projectId: "",
        title: "",
        severity: "Medium",
        mitigation: "",
      });
      setShowForm(false);

      const res = await api.get("/api/employee/risks");
      setRisks(res.data.risks || []);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            border: "1px solid #444",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Risks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold"
        >
          {showForm ? "Cancel" : "Report New Risk"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl mb-10 space-y-6"
        >
          <div>
            <label className="block text-gray-300 mb-2">Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Risk Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600"
              placeholder="e.g., Dependency delay from vendor"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Severity</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Mitigation Plan</label>
            <textarea
              name="mitigation"
              value={formData.mitigation}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600"
              placeholder="How do you plan to address this risk?"
            />
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className={`w-full bg-yellow-600 hover:bg-yellow-500 px-8 py-4 rounded-lg font-semibold text-lg ${
              submitLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitLoading ? "Reporting..." : "Report Risk"}
          </button>
        </form>
      )}

      <h2 className="text-2xl font-bold mb-6">Reported Risks</h2>

      {risks.length === 0 ? (
        <p className="text-gray-400">No open risks reported yet.</p>
      ) : (
        <div className="space-y-6">
          {risks.map((r) => (
            <div key={r._id} className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">{r.title}</h3>
              <div className="flex gap-4 mb-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    r.severity === "High"
                      ? "bg-red-900 text-red-300"
                      : r.severity === "Medium"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-green-900 text-green-300"
                  }`}
                >
                  {r.severity}
                </span>
                <span className="px-4 py-1 rounded-full text-sm bg-gray-700">
                  {r.status}
                </span>
              </div>
              <p className="mb-4">{r.mitigation || "No mitigation plan"}</p>
              <p className="text-sm text-gray-400">
                Reported on {new Date(r.createdAt).toLocaleDateString()}
              </p>

              <Link
                href={`/employee/risks/${r._id}`}
                className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white"
              >
                View Details & Update
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}