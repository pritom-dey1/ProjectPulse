"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RiskDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [risk, setRisk] = useState(null);
  const [formData, setFormData] = useState({
    mitigation: "",
    status: "Open"
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        // যেহেতু single risk-এর জন্য আলাদা API নেই, আমরা risks লিস্ট থেকে ফিল্টার করছি
        // (বা পরে আলাদা GET /api/employee/risks/[id] বানাতে পারো)
        const res = await api.get("/api/employee/risks");
        const foundRisk = res.data.risks.find(r => r._id === id);
        if (foundRisk) {
          setRisk(foundRisk);
          setFormData({
            mitigation: foundRisk.mitigation || "",
            status: foundRisk.status || "Open"
          });
        } else {
          setError("Risk not found");
        }
      } catch (err) {
        setError("Failed to load risk details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put(`/api/employee/risks/${id}`, formData);
      setSuccess(true);

      // আপডেটেড ডেটা রিফ্রেশ
      const res = await api.get("/api/employee/risks");
      const updated = res.data.risks.find(r => r._id === id);
      setRisk(updated);

      setTimeout(() => router.push("/employee/risks"), 2000);
    } catch (err) {
      setError("Failed to update risk");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading risk details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!risk) return <div className="text-center py-10 text-gray-400">Risk not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Risk Details</h1>

      {success && (
        <div className="bg-green-900 p-6 rounded-xl mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Updated Successfully!</h2>
          <p>Redirecting to risks list...</p>
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-bold mb-6">{risk.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-300 mb-1">Severity</p>
            <p className={`text-xl font-bold ${
              risk.severity === "High" ? "text-red-400" :
              risk.severity === "Medium" ? "text-yellow-400" : "text-green-400"
            }`}>{risk.severity}</p>
          </div>

          <div>
            <p className="text-gray-300 mb-1">Status</p>
            <p className="text-xl font-bold">{risk.status}</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-300 mb-1">Reported On</p>
            <p className="text-lg">{new Date(risk.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Mitigation Plan</h3>
          <p className="text-gray-300 whitespace-pre-line">{risk.mitigation || "No mitigation plan added yet."}</p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold mb-4">Update Risk</h3>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Update Mitigation Plan</label>
              <textarea
                name="mitigation"
                value={formData.mitigation}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-700 p-4 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
                placeholder="Add or update mitigation steps..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Change Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-700 p-4 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-lg font-semibold text-lg transition ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Update Risk"}
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
      >
        Back to Risks List
      </button>
    </div>
  );
}