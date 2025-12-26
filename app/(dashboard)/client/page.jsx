"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingFeedbackThisWeek: 0,
    averageSatisfaction: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/client/dashboard/summary")
      .then(res => setStats(res.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Client Dashboard</h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h3 className="text-gray-300 mb-3">Assigned Projects</h3>
          <p className="text-5xl font-bold text-indigo-400">{stats.totalProjects}</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h3 className="text-gray-300 mb-3">Pending Feedback</h3>
          <p className={`text-5xl font-bold ${stats.pendingFeedbackThisWeek > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
            {stats.pendingFeedbackThisWeek}
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h3 className="text-gray-300 mb-3">Avg Satisfaction</h3>
          <p className="text-5xl font-bold text-green-400">{stats.averageSatisfaction}/5</p>
        </div>
      </motion.div>

      {stats.pendingFeedbackThisWeek > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-yellow-900 to-yellow-700 p-8 rounded-2xl mb-12 text-center shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Submit Feedback Now</h2>
          <p className="text-xl mb-6">You have {stats.pendingFeedbackThisWeek} pending feedback this week.</p>
          <Link 
            href="/client/feedbacks/submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-lg inline-block transition"
          >
            Submit Feedback
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/client/projects" className="bg-indigo-900 hover:bg-indigo-800 p-10 rounded-2xl text-center transition shadow-xl">
          <h3 className="text-3xl font-bold mb-3">My Projects</h3>
          <p className="text-gray-300 text-lg">View assigned projects and health status</p>
        </Link>

        <Link href="/client/feedbacks" className="bg-indigo-900 hover:bg-indigo-800 p-10 rounded-2xl text-center transition shadow-xl">
          <h3 className="text-3xl font-bold mb-3">My Feedbacks</h3>
          <p className="text-gray-300 text-lg">History of your submissions</p>
        </Link>
      </div>
    </div>
  );
}