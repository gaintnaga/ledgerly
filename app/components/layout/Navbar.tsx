"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST"
      });
      const data = await response.json();

      if (response.ok && data.success) {
        router.replace("/login");
        router.refresh();
      } else {
        alert(data.message);
      }
    } catch(error) {
      console.error(error);
      alert("Logout Failed");
    }
  }
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="rounded-md border border-red-600 px-4 py-2 text-red-600 transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:text-white">
          Logout
        </button>
      </div>
    </header>
  );
}
