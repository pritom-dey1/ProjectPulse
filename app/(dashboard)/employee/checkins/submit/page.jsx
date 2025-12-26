"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

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
    completion: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/employee/projects")
      .then(res => setProjects(res.data.projects || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/api/employee/checkins", formData);
      setSuccess(true);
      setTimeout(() => router.push("/employee/checkins"), 2000);
    } catch (err) {
      setError("Failed to submit check-in. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit Weekly Check-in</h1>

      {success && (
        <div className="bg-green-900 p-6 rounded-xl mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Success!</h2>
          <p>Check-in submitted. Redirecting...</p>
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
          className={`w-full bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg font-semibold text-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Submitting..." : "Submit Check-in"}
        </button>
      </form>
    </div>
  );
}