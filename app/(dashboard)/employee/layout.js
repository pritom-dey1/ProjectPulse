"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiFolder, FiAlertTriangle, FiClock, FiLogOut } from "react-icons/fi";
import api from "@/lib/axios";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Dashboard", path: "/employee", icon: <FiGrid /> },
    { name: "My Projects", path: "/employee/projects", icon: <FiFolder /> },
    { name: "My Check-ins", path: "/employee/checkins", icon: <FiClock /> },
    { name: "My Risks", path: "/employee/risks", icon: <FiAlertTriangle /> },
  ];

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-black border-r border-white/10 p-6 fixed h-screen overflow-y-auto">
        <div className="text-2xl font-bold mb-10 text-indigo-400">ProjectPulse</div>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname.startsWith(item.path) ? "bg-indigo-600 text-white" : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-white/10 mt-8 w-full text-left text-red-400 hover:text-red-300"
        >
          <FiLogOut />
          Logout
        </button>
      </aside>
      <main className="flex-1 ml-64 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}