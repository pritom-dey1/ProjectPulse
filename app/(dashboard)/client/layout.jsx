"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiFolder,
  FiMessageSquare,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/client", icon: <FiGrid /> },
    { name: "My Projects", path: "/client/projects", icon: <FiFolder /> },
    { name: "My Feedbacks", path: "/client/feedbacks", icon: <FiMessageSquare /> },
  ];

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications);
      setUnread(res.data.unreadCount);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await api.patch("/api/notifications", { id });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnread(prev => prev - 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white flex-col">
      {/* Mobile Header */}
      <header className="md:hidden bg-black border-b border-white/10 p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="ProjectPulse Logo" width={40} height={40} />
          <span className="text-xl font-bold text-indigo-400">Digital Fighters</span>
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-white text-2xl"
        >
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-[68px] left-0 right-0 bg-black border-b border-white/10 z-40 max-h-[calc(100vh-68px)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  pathname === item.path ? "bg-indigo-600 text-white" : "hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-white/10 w-full text-left text-red-400 hover:text-red-300"
            >
              <FiLogOut />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-black border-r border-white/10 p-6 fixed h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <Image src={logo} alt="ProjectPulse Logo" width={40} height={40} />
          <span className="text-xl font-bold text-indigo-400">Digital Fighters</span>
        </div>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.path ? "bg-indigo-600 text-white" : "hover:bg-white/10"
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

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-[68px] md:pt-0 p-6 md:p-8 overflow-y-auto relative">
        {children}

        {/* Fixed Notification Bell */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            >
              <FiBell className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute bottom-full right-0 mb-4 w-80 bg-gray-800 rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto border border-gray-700">
                <div className="p-4 border-b border-gray-700 text-lg font-semibold text-white">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <p className="p-6 text-gray-400 text-center">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id}
                      className={`p-4 border-b border-gray-700 ${
                        n.read ? "bg-gray-900/50 text-gray-400" : "bg-indigo-900/30 text-white"
                      } hover:bg-gray-700/50 transition`}
                    >
                      <p className="font-medium">{n.message}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        {n.link && (
                          <Link
                            href={n.link}
                            className="text-indigo-400 hover:text-indigo-300"
                            onClick={() => !n.read && markAsRead(n._id)}
                          >
                            View
                          </Link>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Mark Read
                          </button>
                        )}
                        <span className="ml-auto text-gray-500">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}