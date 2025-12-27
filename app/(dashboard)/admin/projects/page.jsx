"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  if (!projects.length) {
    return <p className="text-gray-400 text-center mt-10">No projects found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-center font-bold mb-6 text-white">Projects</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3 px-4 text-gray-400 text-sm uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-gray-400 text-sm uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-gray-400 text-sm uppercase tracking-wider">Start Date</th>
              <th className="py-3 px-4 text-gray-400 text-sm uppercase tracking-wider">End Date</th>
              <th className="py-3 px-4 text-gray-400 text-sm uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => (
              <motion.tr
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="border-b border-gray-700 hover:bg-white/5 transition-colors duration-200"
              >
                <td className="py-3 px-4 text-white font-medium">{project.name}</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{project.status.replace("_", " ")}</td>
                <td className="py-3 px-4 text-gray-300">{new Date(project.startDate).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-gray-300">{new Date(project.endDate).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/projects/${project._id}`}
                    className="text-indigo-400 hover:text-indigo-500 font-medium transition-colors duration-200"
                  >
                    View
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
