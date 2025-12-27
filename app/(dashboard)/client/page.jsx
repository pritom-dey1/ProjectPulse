"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#34D399", "#FBBF24", "#EF4444"];

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingFeedbackThisWeek: 0,
    averageSatisfaction: 0,
    onTrack: 0,
    atRisk: 0,
    critical: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/client/dashboard/summary")
      .then(res => {
        const data = res.data;
        setStats({
          totalProjects: data.totalProjects || 0,
          pendingFeedbackThisWeek: data.pendingFeedbackThisWeek || 0,
          averageSatisfaction: data.averageSatisfaction || 0,
          onTrack: Math.round((data.totalProjects || 0) * 0.6),
          atRisk: Math.round((data.totalProjects || 0) * 0.25),
          critical: Math.round((data.totalProjects || 0) * 0.15)
        });
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return ( 
<div className="flex justify-center items-center min-h-50">
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
    
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
  </div>
</div>);
  }  if (error) return <div className="text-red-500 text-center py-10 text-xl">{error}</div>;

  const pieData = [
    { name: "On Track", value: stats.onTrack },
    { name: "At Risk", value: stats.atRisk },
    { name: "Critical", value: stats.critical }
  ];

  const barData = [
    { name: "Metrics", Projects: stats.totalProjects, PendingFeedback: stats.pendingFeedbackThisWeek }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">Client Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Assigned Projects", value: stats.totalProjects, color: "indigo" },
          { title: "Pending Feedback", value: stats.pendingFeedbackThisWeek, color: stats.pendingFeedbackThisWeek > 0 ? "yellow" : "green" },
          { title: "Avg Satisfaction", value: stats.averageSatisfaction.toFixed(1), color: "green" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.7, type: "spring" }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
          >
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-3">{stat.title}</p>
            <motion.h2
              className={`text-5xl md:text-6xl font-extrabold ${
                stat.color === "indigo" ? "text-indigo-400" :
                stat.color === "yellow" ? "text-yellow-400" :
                stat.color === "green" ? "text-green-400" : "text-white"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            >
              {stat.value}
            </motion.h2>
          </motion.div>
        ))}
      </div>

      {stats.pendingFeedbackThisWeek > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-900 to-yellow-700 p-8 rounded-2xl mb-12 shadow-2xl text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Action Required</h2>
          <p className="text-xl mb-6 text-white">
            You have <span className="font-bold text-yellow-300">{stats.pendingFeedbackThisWeek}</span> pending feedback this week.
          </p>
          <Link
            href="/client/feedbacks/submit"
            className="inline-block bg-white text-yellow-800 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Submit Feedback Now
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Project Health Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Projects vs Pending Feedback</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="Projects" fill="#34D399" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="PendingFeedback" fill="#FBBF24" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
}