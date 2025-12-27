"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function MyCheckins() {
  const [checkins, setCheckins] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkinsRes, pendingRes] = await Promise.all([
          api.get("/api/employee/checkins"),
          api.get("/api/employee/checkins/pending")
        ]);
        setCheckins(checkinsRes.data.checkIns || []);
        setPending(pendingRes.data.pending || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Check-ins</h1>

      {pending.length > 0 && (
        <div className="bg-yellow-900/50 border border-yellow-600 p-6 rounded-xl mb-10">
          <h2 className="text-2xl font-bold mb-4">Pending Check-ins ({pending.length})</h2>
          <p className="mb-4">You need to submit check-ins for these projects this week.</p>
          <Link href="/employee/checkins/submit" className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg">
            Submit Now
          </Link>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Previous Check-ins</h2>

      {checkins.length === 0 ? (
        <p className="text-gray-400">No check-ins submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-4">Date</th>
                <th className="p-4">Project</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Completion %</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((ci) => (
                <tr key={ci._id} className="border-t border-gray-700">
                  <td className="p-4">{new Date(ci.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">{ci.projectId?.name || "Project"}</td>
                  <td className="p-4">{ci.confidence}/5</td>
                  <td className="p-4">{ci.completion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}