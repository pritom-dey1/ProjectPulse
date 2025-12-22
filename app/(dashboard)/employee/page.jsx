"use client";

import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/api/projects")
      .then(res => setProjects(res.data));
  }, []);

  return (
    <AuthGuard role="EMPLOYEE">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">My Projects</h1>

        {projects.map(p => (
          <Link
            key={p._id}
            href={`/employee/projects/${p._id}`}
            className="block bg-white p-3 shadow rounded mb-2"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </AuthGuard>
  );
}
