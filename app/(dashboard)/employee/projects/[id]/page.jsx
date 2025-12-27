"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

// Suspense fallback - প্রথমে এটা দেখাবে (params resolve হওয়া পর্যন্ত)
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

// Main content with data fetching
function ProjectDetailContent() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/employee/projects/${id}`);
        setProject(res.data.project);

        const [checkinsRes, risksRes] = await Promise.all([
          api.get(`/api/employee/checkins?projectId=${id}`),
          api.get(`/api/employee/risks?projectId=${id}`)
        ]);

        const events = [
          ...checkinsRes.data.checkIns.map(ci => ({
            type: "checkin",
            date: ci.createdAt,
            content: `Check-in: Confidence ${ci.confidence}/5, Completion ${ci.completion}%`,
            summary: ci.progressSummary || "No summary"
          })),
          ...risksRes.data.risks.map(r => ({
            type: "risk",
            date: r.createdAt,
            content: `Risk: ${r.title} (${r.severity}) - ${r.status}`,
            summary: r.mitigation || "No mitigation"
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTimeline(events);
      } catch (err) {
        setError("Failed to load project details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Inner loading (data fetching চলাকালীন)
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

  if (error) {
    return <div className="text-red-500 text-center py-20 text-xl">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-20 text-gray-400 text-xl">Project not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white">Project Info</h3>
          <p className="mb-4 text-gray-300"><strong>Description:</strong> {project.description || "N/A"}</p>
          <p className="mb-2 text-gray-300"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          <p className="mb-2 text-gray-300"><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
          <p className="mb-4">
            <strong>Status:</strong>{' '}
            <span className={`font-bold ${
              project.status === "ON_TRACK" ? "text-green-400" : 
              project.status === "AT_RISK" ? "text-yellow-400" : "text-red-400"
            }`}>
              {project.status.replace("_", " ")}
            </span>
          </p>
          <p>
            <strong>Health Score:</strong>{' '}
            <span className={`font-bold text-2xl ${
              project.healthScore >= 80 ? "text-green-400" : 
              project.healthScore >= 60 ? "text-yellow-400" : "text-red-400"
            }`}>
              {project.healthScore}/100
            </span>
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
          <div className="space-y-4">
            <Link 
              href="/employee/checkins/submit" 
              className="bg-green-600 hover:bg-green-500 block text-center px-6 py-4 rounded-lg font-medium transition"
            >
              Submit Weekly Check-in
            </Link>
            <Link 
              href="/employee/risks" 
              className="bg-yellow-600 hover:bg-yellow-500 block text-center px-6 py-4 rounded-lg font-medium transition"
            >
              Report a Risk / Blocker
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Activity Timeline</h2>
        {timeline.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent activity.</p>
        ) : (
          <div className="space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-6 relative">
                <div className="absolute -left-3 top-1 w-6 h-6 bg-indigo-600 rounded-full"></div>
                <p className="text-sm text-gray-400 mb-1">
                  {new Date(event.date).toLocaleString()} - {event.type.toUpperCase()}
                </p>
                <h4 className="font-semibold mb-2 text-white">{event.content}</h4>
                <p className="text-gray-300">{event.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main exported component
export default function ProjectDetail() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProjectDetailContent />
    </Suspense>
  );
}