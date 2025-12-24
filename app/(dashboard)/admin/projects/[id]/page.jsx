"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, timeRes] = await Promise.all([
          api.get(`/api/admin/projects/${id}`),
          api.get(`/api/projects/${id}`),
        ]);
        setProject(projRes.data.project || projRes.data);
        setTimeline(timeRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!project) return <div className="text-center mt-20 text-red-400">Project not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <a
          href={`/admin/projects/${id}/edit`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
        >
          Edit Project
        </a>
      </div>

      <p className="text-gray-400 mb-8">{project.description || "No description available"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-5 rounded-lg">
          <p className="text-gray-400 mb-1">Status</p>
          <p className="text-2xl font-bold">
            {project.status === "ON_TRACK" && <span className="text-green-400">On Track</span>}
            {project.status === "AT_RISK" && <span className="text-yellow-400">At Risk</span>}
            {project.status === "CRITICAL" && <span className="text-red-500">Critical</span>}
            {project.status === "COMPLETED" && <span className="text-blue-400">Completed</span>}
          </p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg">
          <p className="text-gray-400 mb-1">Health Score</p>
          <p className="text-2xl font-bold">{project.healthScore}%</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg">
          <p className="text-gray-400 mb-1">Start Date</p>
          <p className="text-xl">{new Date(project.startDate).toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg">
          <p className="text-gray-400 mb-1">End Date</p>
          <p className="text-xl">{new Date(project.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Activity Timeline</h2>
      <div className="space-y-4">
        {timeline.length === 0 ? (
          <p className="text-gray-500">No activities recorded yet.</p>
        ) : (
          timeline.map((item, index) => (
            <div key={index} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{new Date(item.createdAt || item.data?.createdAt).toLocaleString()}</span>
                <span className="uppercase font-medium px-2 py-1 bg-gray-700 rounded">
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