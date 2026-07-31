"use client";

import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans overflow-x-hidden">
      {/* Sidebar (Can be toggled/hidden on desktop and mobile) */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        />

        <main className="flex-1 p-3 sm:p-6 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
