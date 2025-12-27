"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/client/projects/${id}`);
        setProject(res.data.project);

        const [feedbacksRes] = await Promise.all([
          api.get(`/api/client/feedbacks?projectId=${id}`)
        ]);

        const events = [
          ...feedbacksRes.data.feedbacks.map(fb => ({
            type: "feedback",
            date: fb.createdAt,
            content: `Feedback: Satisfaction ${fb.satisfaction}/5, Communication ${fb.communication}/5`,
            summary: fb.comments || "No comments",
            flagged: fb.issueFlag ? " (Issue Flagged)" : ""
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTimeline(events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  if (loading) {
    return ( 
<div className="flex justify-center items-center min-h-50">
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
    
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
  </div>
</div>);
  }  if (!project) return <div className="text-center py-10 text-gray-400">Project not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Project Details</h3>
          <p className="mb-4"><strong>Description:</strong> {project.description || "N/A"}</p>
          <p className="mb-2"><strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          <p className="mb-4"><strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
          <p><strong>Health Score:</strong> <span className={`font-bold text-2xl ${
            project.healthScore >= 80 ? "text-green-400" : project.healthScore >= 60 ? "text-yellow-400" : "text-red-400"
          }`}>{project.healthScore}/100</span></p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Actions</h3>
          <Link 
            href="/client/feedbacks/submit"
            className="bg-green-600 hover:bg-green-500 block text-center px-6 py-4 rounded-lg mb-4"
          >
            Submit Feedback
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Activity Timeline (Your Feedbacks)</h2>
        {timeline.length === 0 ? (
          <p className="text-gray-400">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-6">
            {timeline.map((event, i) => (
              <div key={i} className="border-l-4 border-green-600 pl-6 relative">
                <div className="absolute -left-3 top-1 w-6 h-6 bg-green-600 rounded-full"></div>
                <p className="text-sm text-gray-400 mb-1">{new Date(event.date).toLocaleString()} - FEEDBACK</p>
                <h4 className="font-semibold mb-2">{event.content}{event.flagged}</h4>
                <p className="text-gray-300">{event.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}