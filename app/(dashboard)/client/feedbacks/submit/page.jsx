"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Loading fallback while search params are being resolved
function Loading() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      <p className="mt-4 text-gray-400">Loading form...</p>
    </div>
  );
}

function SubmitFeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillProjectId = searchParams.get("projectId");

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectId: prefillProjectId || "",
    satisfaction: 3,
    communication: 3,
    comments: "",
    issueFlag: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/client/projects")
      .then(res => setProjects(res.data.projects || []))
      .catch(err => console.error("Failed to load projects", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/api/client/feedbacks", formData);
      setSuccess(true);
      setTimeout(() => router.push("/client/feedbacks"), 2000);
    } catch (err) {
      setError("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl pt-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit Weekly Feedback</h1>

      {success && (
        <div className="bg-green-900 p-6 rounded-xl mb-8 text-center">
          Feedback submitted successfully! Redirecting...
        </div>
      )}

      {error && <div className="bg-red-900 p-6 rounded-xl mb-8 text-center">{error}</div>}

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
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Satisfaction (1-5)</label>
            <input
              type="number"
              name="satisfaction"
              min="1"
              max="5"
              value={formData.satisfaction}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Communication Clarity (1-5)</label>
            <input
              type="number"
              name="communication"
              min="1"
              max="5"
              value={formData.communication}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Comments (Optional)</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
            placeholder="Your thoughts or suggestions..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="issueFlag"
            checked={formData.issueFlag}
            onChange={handleChange}
            className="w-5 h-5 bg-gray-700 border-gray-600"
          />
          <label className="ml-3 text-gray-300">Flag as Issue (Notify Admin)</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg font-semibold text-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default function SubmitFeedback() {
  return (
    <Suspense fallback={<Loading />}>
      <SubmitFeedbackContent />
    </Suspense>
  );
}