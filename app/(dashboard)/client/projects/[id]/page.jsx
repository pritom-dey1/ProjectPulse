"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

function Loading() {
  return (
    <div className="max-w-5xl mx-auto text-center py-24">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      <p className="mt-4 text-gray-400">Loading project details...</p>
    </div>
  );
}

function ProjectDetailContent() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/client/projects/${id}`);
        setProject(res.data.project);

        const feedbacksRes = await api.get(
          `/api/client/feedbacks?projectId=${id}`
        );

        const events = feedbacksRes.data.feedbacks
          .map(fb => ({
            type: "feedback",
            date: fb.createdAt,
            content: `Satisfaction ${fb.satisfaction}/5 · Communication ${fb.communication}/5`,
            summary: fb.comments || "No comments provided.",
            flagged: fb.issueFlag ? " · Issue Flagged" : ""
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

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
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <p className="text-center py-16 text-gray-400">Project not found</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-12 px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-400">
          Project overview & activity timeline
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Project Info */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 rounded-2xl">
          <h3 className="text-xl font-semibold mb-6">Project Details</h3>

          <p className="mb-5 text-gray-300">
            <span className="font-semibold text-white">Description:</span>{" "}
            {project.description || "N/A"}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="font-semibold">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">End Date</p>
              <p className="font-semibold">
                {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Health Score</p>
            <p
              className={`text-3xl font-bold ${
                project.healthScore >= 80
                  ? "text-green-400"
                  : project.healthScore >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {project.healthScore}/100
            </p>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-8 rounded-2xl shadow-lg h-fit">
          <h3 className="text-xl font-semibold mb-6 text-white">
            Actions
          </h3>

          <Link
            href="/client/feedbacks/submit"
            className="block text-center bg-white text-indigo-600 font-semibold px-6 py-4 rounded-xl hover:bg-gray-100 transition"
          >
            Submit Weekly Feedback
          </Link>

          <p className="text-indigo-100 text-sm mt-4 text-center">
            Share your experience and flag any issues.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-8">
          Activity Timeline (Your Feedbacks)
        </h2>

        {timeline.length === 0 ? (
          <p className="text-gray-400">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-8">
            {timeline.map((event, i) => (
              <div
                key={i}
                className="relative pl-10 border-l-4 border-green-500"
              >
                <span className="absolute -left-[10px] top-1 w-5 h-5 bg-green-500 rounded-full"></span>

                <p className="text-sm text-gray-400 mb-1">
                  {new Date(event.date).toLocaleString()}
                </p>

                <h4 className="font-semibold mb-2">
                  {event.content}
                  <span className="text-red-400">{event.flagged}</span>
                </h4>

                <p className="text-gray-300">{event.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectDetailContent />
    </Suspense>
  );
}
