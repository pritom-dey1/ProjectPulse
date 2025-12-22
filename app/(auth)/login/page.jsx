"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      const role = res.data.role;

      toast.success("Login successful! Redirecting...", {
        duration: 2000,
      });

      setTimeout(() => {
        if (role === "ADMIN") router.push("/admin");
        if (role === "EMPLOYEE") router.push("/employee");
        if (role === "CLIENT") router.push("/client");
      }, 1200);

    } catch {
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Digital Fighter</h1>
          <p className="text-gray-400 text-sm mt-2">
            ProjectPulse – Secure Login
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Email Address</label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 mt-1">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              placeholder="you@digitalfighter.com"
              className="w-full bg-transparent text-white px-3 py-2 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm">Password</label>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 mt-1">
            <FiLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent text-white px-3 py-2 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition
            ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"}
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Authorized users only • Digital Fighter © 2025
        </p>
      </motion.div>
    </div>
  );
}
