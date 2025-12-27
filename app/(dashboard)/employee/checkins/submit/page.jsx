"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

export default function SubmitCheckin() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillProjectId = searchParams.get("projectId");

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectId: prefillProjectId || "",
    progressSummary: "",
    blockers: "",
    confidence: 3,
    completion: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/api/employee/projects")
      .then((res) => setProjects(res.data.projects || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load projects");
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = api.post("/api/employee/checkins", formData);

    toast.promise(promise, {
      loading: "Submitting check-in...",
      success: "Check-in submitted successfully! 🎉",
      error: (err) =>
        err?.response?.data?.message || "Failed to submit check-in",
    });

    try {
      await promise; // wait for success

      setFormData({
        projectId: prefillProjectId || "",
        progressSummary: "",
        blockers: "",
        confidence: 3,
        completion: 0,
      });

      // Optional: reset form completely if needed
      setTimeout(() => {
        router.push("/employee/checkins");
      }, 1800); // toast দেখার পর redirect
    } catch (err) {
      // toast.promise নিজেই error toast দেখাবে
      // এখানে extra কিছু করার দরকার নেই
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toaster — এটা থাকলে সব toast দেখা যাবে */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#1f2937", // gray-800 এর কাছাকাছি
            color: "#fff",
            border: "1px solid #4b5563",
          },
          success: {
            iconTheme: {
              primary: "#10b981", // emerald-500
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red-500
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6", // blue-500
              secondary: "#fff",
            },
          },
        }}
      />

      <h1 className="text-3xl font-bold mb-8">Submit Weekly Check-in</h1>

      {/* success/error div সরিয়ে দিয়েছি — toast দেখাবে */}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Project</label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
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
          <label className="block text-gray-300 mb-2">Progress Summary</label>
          <textarea
            name="progressSummary"
            value={formData.progressSummary}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            placeholder="Describe what was accomplished this week..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Blockers / Challenges</label>
          <textarea
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            placeholder="Any obstacles or issues..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Confidence Level (1-5)</label>
            <input
              type="number"
              name="confidence"
              min="1"
              max="5"
              value={formData.confidence}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Estimated Completion (%)</label>
            <input
              type="number"
              name="completion"
              min="0"
              max="100"
              value={formData.completion}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg font-semibold text-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Check-in"}
        </button>
      </form>
    </div>
  );
}