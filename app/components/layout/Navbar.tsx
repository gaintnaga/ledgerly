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

export default function Navbar() {
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
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <UserAvatar
              name={user.name}
              profileImage={user.profileImage}
              role={user.role}
              size="sm"
            />
            <div className="text-left hidden sm:block">
              <span className="block font-medium text-sm text-gray-900 dark:text-white">
                {user.name}
              </span>
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-600 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
