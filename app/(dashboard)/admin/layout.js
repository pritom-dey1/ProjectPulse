"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from '../../../public/logo.png';
import {
  FiGrid,
  FiFolder,
  FiAlertTriangle,
  FiClock,
  FiLogOut
} from "react-icons/fi";
import api from "@/lib/axios";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // <-- Add this

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FiGrid /> },
    { name: "Projects", path: "/admin/projects", icon: <FiFolder /> },
    { name: "Risks", path: "/admin/risks", icon: <FiAlertTriangle /> },
    { name: "Missing Check-ins", path: "/admin/missing-checkins", icon: <FiClock /> },
  ];

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      router.replace('/login'); // <-- use replace instead of push
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-black border-r border-white/10 p-6 fixed top-0 left-0 h-screen">
        <Image src={logo} alt="Logo" className="w-36 object-cover mb-2" />

        <nav className="space-y-2 mt-6">
          {menu.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${pathname === item.path ? "bg-indigo-600" : "hover:bg-white/10"}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <button onClick={logout} className='flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-white/10'>
          <FiLogOut />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 ml-64 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
