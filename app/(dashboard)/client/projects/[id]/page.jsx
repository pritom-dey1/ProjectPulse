"use client";

import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/axios";
import { useState } from "react";

export default function ClientFeedbackPage({ params }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await api.post(`/api/projects/${params.id}/feedback`, {
      rating,
      comment,
    });
    alert("Feedback submitted");
  };

  return (
    <AuthGuard role="CLIENT">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Submit Feedback</h1>

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
          className="border p-2 mb-3"
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Comment"
          onChange={e => setComment(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-black text-white px-4 py-2"
        >
          Submit
        </button>
      </div>
    </AuthGuard>
  );
}
