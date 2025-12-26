"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function MyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/client/feedbacks")
      .then(res => setFeedbacks(res.data.feedbacks || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Feedback History</h1>

      {feedbacks.length === 0 ? (
        <p className="text-gray-400">No feedback submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map(fb => (
            <div key={fb._id} className="bg-gray-800 p-6 rounded-xl">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold">Project Feedback</h3>
                <span className="text-sm text-gray-400">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mb-2"><strong>Satisfaction:</strong> {fb.satisfaction}/5</p>
              <p className="mb-4"><strong>Communication:</strong> {fb.communication}/5</p>
              <p className="mb-4"><strong>Comments:</strong> {fb.comments || "None"}</p>
              {fb.issueFlag && (
                <p className="text-red-400 font-semibold">⚠️ Issue Flagged</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}