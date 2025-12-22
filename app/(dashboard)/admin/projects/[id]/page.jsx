"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [risks, setRisks] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await api.get(`/api/admin/projects/${projectId}`);
        const { project, risks, checkIns } = res.data;

        setProject(project);
        setRisks(risks);
        setCheckIns(checkIns);
        setHealthScore(calculateHealthScore(project, risks, checkIns));
      } catch (err) {
        console.error("Failed to fetch project details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) return <p className="text-gray-400 text-center mt-10">Loading project details...</p>;
  if (!project) return <p className="text-red-500 text-center mt-10">Project not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-white">{project.name}</h1>
      <p className="text-gray-400 mb-4">{project.description}</p>

      <div className="flex gap-6 mb-6 flex-wrap">
        <p>Status: <span className={`font-semibold ${statusColor(project.status)}`}>{project.status.replace("_", " ")}</span></p>
        <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
        <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
      </div>

      {/* Health Score */}
      <div className="mb-8">
        <p className="font-semibold mb-1 text-white">Project Health Score:</p>
        <div className="w-full bg-white/10 rounded h-4 overflow-hidden">
          <motion.div
            className={`h-4 rounded ${healthScoreColor(healthScore)}`}
            style={{ width: `${healthScore}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-1">{healthScore}%</p>
      </div>

      {/* Risks Table */}
      <h2 className="text-2xl font-semibold mb-3 text-white">Risks</h2>
      {risks.length ? (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-3 text-gray-400 text-sm">Title</th>
                <th className="py-2 px-3 text-gray-400 text-sm">Severity</th>
                <th className="py-2 px-3 text-gray-400 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk, index) => (
                <motion.tr
                  key={risk._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-2 px-3 text-white">{risk.title}</td>
                  <td className={`py-2 px-3 font-semibold ${severityColor(risk.severity)}`}>{risk.severity}</td>
                  <td className={`py-2 px-3 font-medium ${risk.status === 'OPEN' ? 'text-red-400' : 'text-green-400'}`}>{risk.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-400">No risks for this project.</p>}

      {/* Check-ins Table */}
      <h2 className="text-2xl font-semibold mb-3 text-white">Weekly Check-ins</h2>
      {checkIns.length ? (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-3 text-gray-400 text-sm">Submitted By</th>
                <th className="py-2 px-3 text-gray-400 text-sm">Progress / Feedback</th>
                <th className="py-2 px-3 text-gray-400 text-sm">Confidence / Satisfaction</th>
                <th className="py-2 px-3 text-gray-400 text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((ci, index) => (
                <motion.tr
                  key={ci._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-2 px-3 text-white">{ci.employeeId || ci.clientId}</td>
                  <td className="py-2 px-3 text-gray-300">{ci.progressSummary || ci.feedbackSummary}</td>
                  <td className="py-2 px-3 text-gray-300">{ci.confidenceLevel || ci.satisfaction}</td>
                  <td className="py-2 px-3 text-gray-300">{new Date(ci.date).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-400">No check-ins submitted yet.</p>}
    </div>
  );
}

// Utility functions for colors
function statusColor(status) {
  if (status === "ON_TRACK") return "text-green-400";
  if (status === "AT_RISK") return "text-yellow-400";
  if (status === "CRITICAL") return "text-red-500";
  return "text-gray-300";
}

function healthScoreColor(score) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function severityColor(severity) {
  if (severity === "LOW") return "text-green-400";
  if (severity === "MEDIUM") return "text-yellow-400";
  if (severity === "HIGH") return "text-red-500";
  return "text-gray-300";
}

function calculateHealthScore(project, risks, checkIns) {
  let score = 100;
  if (project.status === "AT_RISK") score -= 20;
  if (project.status === "CRITICAL") score -= 40;
  const openRisks = risks.filter(r => r.status === "OPEN").length;
  score -= openRisks * 5;

  const employeeCheckIns = checkIns.filter(c => c.confidenceLevel);
  if (employeeCheckIns.length) {
    const avgConfidence = employeeCheckIns.reduce((a, b) => a + b.confidenceLevel, 0) / employeeCheckIns.length;
    score -= (5 - avgConfidence) * 5;
  }

  const clientCheckIns = checkIns.filter(c => c.satisfaction);
  if (clientCheckIns.length) {
    const avgSatisfaction = clientCheckIns.reduce((a, b) => a + b.satisfaction, 0) / clientCheckIns.length;
    score -= (5 - avgSatisfaction) * 5;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return Math.round(score);
}
