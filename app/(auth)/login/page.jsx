"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const role = res.data.role;

      if (role === "ADMIN") router.push("/admin");
      if (role === "EMPLOYEE") router.push("/employee");
      if (role === "CLIENT") router.push("/client");

    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 w-96 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
