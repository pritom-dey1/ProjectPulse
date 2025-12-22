"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

export default function MissingCheckInsPage() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const res = await api.get("/api/checkins"); // admin GET route
        setCheckIns(res.data);
      } catch (err) {
        console.error("Failed to fetch check-ins", err);
        toast.error("Failed to load check-ins");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  if (loading) return <p className="text-gray-400 text-center mt-10">Loading check-ins...</p>;
  if (!checkIns.length)
    return <p className="text-gray-400 text-center mt-10">No missing check-ins.</p>;

  return (
    <div className="min-h-screen text-white px-4 py-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Missing Weekly Check-Ins</h1>

      <div className="grid gap-4">
        {checkIns.map((ci) => (
          <div
            key={ci._id}
            className="bg-white/5 border border-white/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition"
          >
            <div className="mb-2 md:mb-0">
              <p className="font-semibold">{ci.employeeName}</p>
              <p className="text-gray-400 text-sm">
                Project: {ci.projectName} | Week of:{" "}
                {new Date(ci.weekStart).toLocaleDateString()}
              </p>
            </div>

            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                ci.resolved
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500"
              }`}
              disabled={ci.resolved}
              onClick={async () => {
                try {
                  await api.patch(`/api/admin/missing-checkings/${ci._id}/resolve`);
                  toast.success("Marked as resolved");
                  setCheckIns((prev) =>
                    prev.map((c) =>
                      c._id === ci._id ? { ...c, resolved: true } : c
                    )
                  );
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to mark resolved");
                }
              }}
            >
              {ci.resolved ? "Resolved" : "Mark Resolved"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
