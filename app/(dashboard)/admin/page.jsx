"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#34D399", "#FBBF24", "#EF4444", "#F97316"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    onTrack: 0,
    atRisk: 0,
    critical: 0,
    openRisks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        const projects = res.data.projects;
        const risks = res.data.risks;

        setStats({
          total: projects.length,
          onTrack: projects.filter(p => p.status === "ON_TRACK").length,
          atRisk: projects.filter(p => p.status === "AT_RISK").length,
          critical: projects.filter(p => p.status === "CRITICAL").length,
          openRisks: risks.length,
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-gray-400">Loading dashboard...</p>;

  const pieData = [
    { name: "On Track", value: stats.onTrack },
    { name: "At Risk", value: stats.atRisk },
    { name: "Critical", value: stats.critical },
  ];

  const barData = [
    { name: "Projects", Total: stats.total, OpenRisks: stats.openRisks }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

      {/* Animated Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { title: "Total Projects", value: stats.total, color: "white" },
          { title: "On Track", value: stats.onTrack, color: "green" },
          { title: "At Risk", value: stats.atRisk, color: "yellow" },
          { title: "Critical", value: stats.critical, color: "red" },
          { title: "Open Risks", value: stats.openRisks, color: "orange" },
        ].map((stat, i) => (
          <AnimatedCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 h-80 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-white">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 h-80 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4 text-white">Total Projects vs Open Risks</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
              <Bar dataKey="Total" fill="#34D399" animationDuration={1000} />
              <Bar dataKey="OpenRisks" fill="#F97316" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Animated Card Component
function AnimatedCard({ title, value, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
      className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <motion.h2
        className={`text-4xl font-bold mt-2 text-${color}-500`}
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {value}
      </motion.h2>
    </motion.div>
  );
}
