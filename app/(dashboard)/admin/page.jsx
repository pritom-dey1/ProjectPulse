"use client"

import AuthGuard from "@/components/AuthGuard"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST'
    })
    router.replace('/login')
  }

  return (
    <AuthGuard role="ADMIN">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/admin/missing-checkins" className="bg-white p-4 shadow rounded">
            Missing Check-ins
          </Link>
        </div>
      </div>
    </AuthGuard>
  )
}
