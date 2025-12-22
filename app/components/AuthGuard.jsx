"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AuthGuard({ children, role }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/auth/me")
      .then(res => {
        if (role && res.data.role !== role) {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return children;
}
