"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Main loading fallback for Suspense (when params are resolving or initial render)
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      <p className="text-gray-400">Loading project details...</p>
    </div>
  );
}

// Actual content with data fetching
function ProjectDetailContent() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [projRes, timeRes] = await Promise.all([
          api.get(`/api/admin/projects/${id}`),
          api.get(`/api/projects/${id}`),
        ]);

        setProject(projRes.data.project || projRes.data);
        setTimeline(timeRes.data || []);
      } catch (err) {
        console.error("Error fetching project data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Inner loading state (while fetching data)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center mt-20 text-red-400 text-2xl">Project not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <a
          href={`/admin/projects/${id}/edit`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
        >
          Edit Project
        </a>
      </div>

      <p className="text-gray-400 mb-8 text-lg">{project.description || "No description available"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-2">Status</p>
          <p className="text-2xl font-bold">
            {project.status === "ON_TRACK" && <span className="text-green-400">On Track</span>}
            {project.status === "AT_RISK" && <span className="text-yellow-400">At Risk</span>}
            {project.status === "CRITICAL" && <span className="text-red-500">Critical</span>}
            {project.status === "COMPLETED" && <span className="text-blue-400">Completed</span>}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-2">Health Score</p>
          <p className="text-2xl font-bold text-white">{project.healthScore}%</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-2">Start Date</p>
          <p className="text-xl">{new Date(project.startDate).toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-2">End Date</p>
          <p className="text-xl">{new Date(project.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Activity Timeline</h2>
      <div className="space-y-4">
        {timeline.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-800/50 rounded-lg">
            No activities recorded yet.
          </p>
        ) : (
          timeline.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-gray-600 transition"
            >
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>{new Date(item.createdAt || item.data?.createdAt).toLocaleString()}</span>
                <span className="uppercase font-medium px-3 py-1 bg-gray-700 rounded-full">
                  {item.type || "Update"}
                </span>
              </div>
              <p className="text-gray-200">
                {item.data?.progressSummary ||
                  item.data?.feedbackSummary ||
                  item.data?.title ||
                  "Activity recorded"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProjectDetailContent />
    </Suspense>
  );
}