"use client";

import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function EmployeeProjectPage({ params }) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/api/projects/${params.id}`)
      .then(res => setProject(res.data));
  }, []);

  if (!project) return null;

  return (
    <AuthGuard role="EMPLOYEE">
      <div className="p-6">
        <h1 className="text-xl font-bold">{project.name}</h1>
        <p>{project.description}</p>
      </div>
    </AuthGuard>
  );
}
