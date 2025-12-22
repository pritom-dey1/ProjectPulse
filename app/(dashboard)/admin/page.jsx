"use client";

import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <AuthGuard role="ADMIN">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/admin/missing-checkins" className="bg-white p-4 shadow rounded">
            Missing Check-ins
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}
