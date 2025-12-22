"use client"
import { getUser, logout } from "@/lib/auth"
import { useEffect } from "react"

export default function AdminLayout({ children }) {
  useEffect(() => {
    const user = getUser()
    if (!user || user.role !== "ADMIN") {
      window.location.href = "/login"
    }
  }, [])

  return (
    <div>
      <nav className="bg-black text-white p-4 flex justify-between">
        <span>ProjectPulse Admin</span>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  )
}
