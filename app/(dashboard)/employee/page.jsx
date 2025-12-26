"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#34D399", "#FBBF24", "#EF4444", "#F97316"];

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingCheckInsThisWeek: 0,
    openRisks: 0,
    averageHealth: 0,
    onTrack: 0,
    atRisk: 0,
    critical: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/api/employee/dashboard/summary");
        const data = res.data;

    
        setStats({
          totalProjects: data.totalProjects || 0,
          pendingCheckInsThisWeek: data.pendingCheckInsThisWeek || 0,
          openRisks: data.openRisks || 0,
          averageHealth: data.averageHealth || 0,
          onTrack: Math.round((data.totalProjects || 0) * 0.6),
          atRisk: Math.round((data.totalProjects || 0) * 0.25),
          critical: Math.round((data.totalProjects || 0) * 0.15),
        });
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl text-gray-300">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-10 text-xl">{error}</div>;

  const pieData = [
    { name: "On Track", value: stats.onTrack },
    { name: "At Risk", value: stats.atRisk },
    { name: "Critical", value: stats.critical },
  ];

  const barData = [
    { name: "Metrics", TotalProjects: stats.totalProjects, OpenRisks: stats.openRisks },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">Employee Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { title: "Total Projects", value: stats.totalProjects, color: "white" },
          { title: "Pending Check-ins", value: stats.pendingCheckInsThisWeek, color: stats.pendingCheckInsThisWeek > 0 ? "yellow" : "green" },
          { title: "Open Risks", value: stats.openRisks, color: stats.openRisks > 0 ? "red" : "green" },
          { title: "Avg Health Score", value: stats.averageHealth, color: "indigo" },
        ].map((stat, i) => (
          <AnimatedCard key={i} {...stat} index={i} />
        ))}
      </div>

      {stats.pendingCheckInsThisWeek > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-900 to-red-700 p-8 rounded-2xl mb-12 shadow-2xl text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Action Required!</h2>
          <p className="text-lg md:text-xl mb-6">
            You have <span className="font-bold text-yellow-300">{stats.pendingCheckInsThisWeek}</span> pending check-in(s) this week.
          </p>
          <a
            href="/employee/checkins/submit"
            className="inline-block bg-white text-red-800 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Submit Check-in Now
          </a>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">My Project Health Distribution</h2>
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
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Projects vs Open Risks</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                />
                <Bar dataKey="TotalProjects" fill="#34D399" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="OpenRisks" fill="#F97316" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
}

function AnimatedCard({ title, value, color, index }) {
  const colorClasses = {
    white: "text-white",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    indigo: "text-indigo-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.7, type: "spring" }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
    >
      <p className="text-gray-400 text-sm uppercase tracking-wide mb-3">{title}</p>
      <motion.h2
        className={`text-5xl md:text-6xl font-extrabold ${colorClasses[color] || "text-white"}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
      >
        {value}
      </motion.h2>
    </motion.div>
  );
}

