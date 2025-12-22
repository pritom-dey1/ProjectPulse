"use client"

import Link from "next/link"

export default function HeroSection({ isLoggedIn, role }) {
  const dashboardRoute =
    role === "ADMIN"
      ? "/admin"
      : role === "EMPLOYEE"
      ? "/employee"
      : "/client"

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f1a] text-white">
      
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 animate-gradient" />

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-float-delay" />

      <div className="relative z-10 text-center max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Build Smarter.
          <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Manage Faster.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10">
          A modern dashboard experience with secure authentication, role-based
          access, and blazing fast performance.
        </p>

        <div className="flex justify-center gap-4">
          {isLoggedIn ? (
            <Link
              href={dashboardRoute}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 font-semibold shadow-lg hover:scale-105 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg bg-white text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
