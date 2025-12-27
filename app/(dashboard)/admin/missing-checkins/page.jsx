"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function MissingCheckInsPage() {
  const [missingCheckIns, setMissingCheckIns] = useState([]);
  const [flaggedFeedbacks, setFlaggedFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkRes, flagRes] = await Promise.all([
          api.get("/api/checkins"),
          api.get("/api/admin/flagged-feedback")
        ]);
        setMissingCheckIns(checkRes.data || []);
        setFlaggedFeedbacks(flagRes.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return ( 
<div className="flex justify-center items-center min-h-50">
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
    
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
  </div>
</div>);
  }
  return (
    <div className="min-h-screen text-white px-4 py-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Admin Monitoring</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Client Flagged Issues</h2>
        {flaggedFeedbacks.length === 0 ? (
          <p className="text-gray-400">No flagged issues from clients.</p>
        ) : (
          <div className="grid gap-4">
            {flaggedFeedbacks.map((fb) => (
              <motion.div
                key={fb._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-600/50 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition"
              >
                <div className="mb-3 md:mb-0">
                  <p className="font-semibold text-red-300">{fb.projectName || "Project"}</p>
                  <p className="text-gray-300 text-sm">Client: {fb.clientName || "Unknown"}</p>
                  <p className="text-gray-400 text-sm">
                    Satisfaction: {fb.satisfaction}/5 | Communication: {fb.communication}/5
                  </p>
                  <p className="text-gray-300 mt-2">{fb.comments || "No comments provided"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Flagged on {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/admin/projects/${fb.projectId}`}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
                >
                  View Project
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Missing Weekly Check-Ins</h2>
        {missingCheckIns.length === 0 ? (
          <p className="text-gray-400">No missing check-ins.</p>
        ) : (
          <div className="grid gap-4">
            {missingCheckIns.map((ci) => (
              <div
                key={ci._id}
                className="bg-white/5 border border-white/20 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition"
              >
                <div className="mb-3 md:mb-0">
                  <p className="font-semibold">{ci.employeeName || "Employee"}</p>
                  <p className="text-gray-400 text-sm">
                    Project: {ci.projectName || "Project"} | Week of: {new Date(ci.weekStart).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold transition ${
                    ci.resolved ? "bg-green-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
                  }`}
                  disabled={ci.resolved}
                  onClick={async () => {
                    try {
                      await api.patch(`/api/admin/missing-checkins/${ci._id}/resolve`);
                      toast.success("Marked as resolved");
                      setMissingCheckIns((prev) =>
                        prev.map((c) => (c._id === ci._id ? { ...c, resolved: true } : c))
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
        )}
      </section>
    </div>
  );
}