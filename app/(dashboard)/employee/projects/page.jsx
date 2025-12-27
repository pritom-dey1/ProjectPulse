"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/employee/projects")
      .then(res => setProjects(res.data.projects || []))
      .catch(() => setError("Failed to load projects"))
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
  }  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Assigned Projects</h1>

      {projects.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-xl text-center text-gray-400">
          No projects assigned to you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{project.description || "No description provided"}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-300">Health Score: </span>
                    <span className={`font-bold text-lg ${
                      project.healthScore >= 80 ? "text-green-400" :
                      project.healthScore >= 60 ? "text-yellow-400" : "text-red-400"
                    }`}>{project.healthScore}</span>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    project.status === "ON_TRACK" ? "bg-green-900 text-green-300" :
                    project.status === "AT_RISK" ? "bg-yellow-900 text-yellow-300" :
                    project.status === "CRITICAL" ? "bg-red-900 text-red-300" : "bg-gray-700"
                  }`}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <Link 
                  href={`/employee/projects/${project._id}`}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg block text-center transition"
                >
                  View Details & Timeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}