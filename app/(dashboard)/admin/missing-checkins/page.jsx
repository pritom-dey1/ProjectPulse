"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/axios";

export default function MissingCheckinsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/api/admin/missing-checkins")
      .then(res => setProjects(res.data));
  }, []);

  return (
    <AuthGuard role="ADMIN">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          Projects Missing Weekly Check-ins
        </h1>

        {projects.length === 0 && <p>All projects updated ✅</p>}

        {projects.map(p => (
          <div key={p._id} className="bg-white p-3 rounded shadow mb-2">
            {p.name}
          </div>
        ))}
      </div>
    </AuthGuard>
  );
}
