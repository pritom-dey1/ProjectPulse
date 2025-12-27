"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

// Suspense fallback
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      <p className="text-gray-400">Loading risk details...</p>
    </div>
  );
}

// Main content component
function RiskDetailContent() {
  const { id } = useParams();
  const router = useRouter();

  const [risk, setRisk] = useState(null);
  const [formData, setFormData] = useState({
    mitigation: "",
    status: "Open",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRisk = async () => {
      try {
        // Direct fetch by ID — much better than fetching all and filtering
        const res = await api.get(`/api/employee/risks/${id}`);
        const fetchedRisk = res.data.risk || res.data;

        setRisk(fetchedRisk);
        setFormData({
          mitigation: fetchedRisk.mitigation || "",
          status: fetchedRisk.status || "Open",
        });
      } catch (err) {
        toast.error("Failed to load risk details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const promise = api.put(`/api/employee/risks/${id}`, formData);

    toast.promise(promise, {
      loading: "Updating risk...",
      success: "Risk updated successfully!",
      error: (err) => err?.response?.data?.message || "Failed to update risk",
    });

    try {
      const res = await promise;
      const updatedRisk = res.data.risk || res.data;

      setRisk(updatedRisk);
      setFormData({
        mitigation: updatedRisk.mitigation || "",
        status: updatedRisk.status || "Open",
      });

      // Redirect after a short delay so toast is visible
      setTimeout(() => {
        router.push("/employee/risks");
      }, 1800);
    } catch (err) {
      // Error already handled by toast.promise
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="text-center py-20 text-gray-400 text-xl">
        Risk not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #4b5563",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          loading: { iconTheme: { primary: "#3b82f6", secondary: "#fff" } },
        }}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Risk Details</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition"
        >
          ← Back to List
        </button>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-8 text-white">{risk.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-700/50 p-5 rounded-lg">
            <p className="text-gray-400 mb-2">Severity</p>
            <p
              className={`text-2xl font-bold ${
                risk.severity === "High"
                  ? "text-red-400"
                  : risk.severity === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {risk.severity}
            </p>
          </div>

          <div className="bg-gray-700/50 p-5 rounded-lg">
            <p className="text-gray-400 mb-2">Current Status</p>
            <p className="text-2xl font-bold text-white">{risk.status}</p>
          </div>

          <div className="bg-gray-700/50 p-5 rounded-lg">
            <p className="text-gray-400 mb-2">Reported On</p>
            <p className="text-lg text-gray-300">
              {new Date(risk.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-white">Current Mitigation Plan</h3>
          <div className="bg-gray-700/30 p-5 rounded-lg border border-gray-600">
            <p className="text-gray-300 whitespace-pre-line">
              {risk.mitigation || "No mitigation plan has been added yet."}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8">
          <h3 className="text-xl font-bold mb-6 text-white">Update This Risk</h3>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Mitigation Plan (Optional Update)
              </label>
              <textarea
                name="mitigation"
                value={formData.mitigation}
                onChange={handleChange}
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
                placeholder="Describe steps to mitigate this risk..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Update Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                updating
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-indigo-600 hover:bg-indigo-500 active:scale-98"
              }`}
            >
              {updating ? "Updating Risk..." : "Update Risk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main exported component with Suspense
export default function RiskDetail() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RiskDetailContent />
    </Suspense>
  );
}