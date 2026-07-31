"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/app/components/ui/UserAvatar";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string | null;
}

interface NavbarProps {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ isSidebarVisible, onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile in Navbar:", error);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        router.replace("/login");
        router.refresh();
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout Failed");
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      {/* Left: Sidebar Toggle Button & Welcome */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition focus:outline-none"
          title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>{isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}</span>
        </button>

        <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate hidden sm:block">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
      </div>

      {/* Right: User Profile & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={user.name}
              profileImage={user.profileImage}
              role={user.role}
              size="sm"
            />
            <div className="text-left hidden md:block">
              <span className="block font-medium text-xs sm:text-sm text-gray-900">
                {user.name}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-gray-500">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-600 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
