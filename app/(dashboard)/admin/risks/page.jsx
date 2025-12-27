"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function AdminRiskPage() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRisks = async () => {
    try {
      const res = await api.get("/api/risks");
      setRisks(res.data);
    } catch (err) {
      console.error("Failed to fetch risks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/api/risks/${id}/resolve`);
      setRisks(
        risks.map((r) =>
          r._id === id ? { ...r, status: "Resolved" } : r
        )
      );
    } catch (err) {
      console.error("Failed to resolve risk", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!risks.length) return <p className="text-gray-400">No risks found.</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Project Risks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {risks.map((risk, index) => (
          <motion.div
            key={risk._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-gray-900/70 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:scale-105 transition-transform"
          >
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{risk.title}</h2>
              <p className="text-gray-400 mb-2">
                Severity:{" "}
                <span
                  className={
                    risk.severity === "HIGH"
                      ? "text-red-500 font-semibold"
                      : risk.severity === "MEDIUM"
                      ? "text-yellow-400 font-semibold"
                      : "text-green-400 font-semibold"
                  }
                >
                  {risk.severity}
                </span>
              </p>
              <p className="text-gray-400 mb-2">
                Status:{" "}
                <span
                  className={
                    (risk.status || "").toLowerCase() === "open"
                      ? "text-red-400 font-semibold"
                      : "text-green-400 font-semibold"
                  }
                >
                  {risk.status || "Unknown"}
                </span>
              </p>
              <p className="text-gray-500 text-sm">Created By: {risk.createdBy}</p>
            </div>

            <button
              onClick={() => handleResolve(risk._id)}
              disabled={(risk.status || "").toLowerCase() === "resolved"}
              className={`mt-4 py-2 rounded-lg font-semibold shadow-lg transition ${
                (risk.status || "").toLowerCase() === "open"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-200 cursor-not-allowed"
              }`}
            >
              {(risk.status || "").toLowerCase() === "open" ? "Resolve" : "Resolved"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}