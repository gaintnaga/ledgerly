"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUserRole(data.user.role);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile in sidebar:", error);
    }
  };

  // Only close sidebar on link click if screen width is mobile (< 768px)
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isVisible && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-300 ease-in-out md:static ${
          isVisible ? "translate-x-0 md:translate-x-0" : "-translate-x-full md:-translate-x-full md:w-0"
        }`}
      >
        {isVisible && (
          <div className="w-64 flex flex-col h-full">
            <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6 text-xl font-bold">
              <Link href="/dashboard" onClick={handleLinkClick}>
                Ledgerly
              </Link>
              <button
                onClick={onClose}
                className="rounded p-1 text-gray-400 hover:text-white md:hidden"
              >
                ✕
              </button>
            </div>

            <nav className="p-4 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {/* Dashboard */}
                <li>
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    📊 Dashboard
                  </Link>
                </li>

                {/* Purchases */}
                <li>
                  <button
                    onClick={() => setPurchaseOpen(!purchaseOpen)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    <span>🛒 Purchases</span>
                    <span>{purchaseOpen ? "▾" : "▸"}</span>
                  </button>

                  {purchaseOpen && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-3">
                      <li>
                        <Link
                          href="/dashboard/purchases"
                          onClick={handleLinkClick}
                          className="block rounded-md px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                        >
                          All Purchases
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Inventory */}
                <li>
                  <button
                    onClick={() => setInventoryOpen(!inventoryOpen)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    <span>📦 Inventory</span>
                    <span>{inventoryOpen ? "▾" : "▸"}</span>
                  </button>

                  {inventoryOpen && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-3">
                      <li>
                        <Link
                          href="/dashboard/inventory"
                          onClick={handleLinkClick}
                          className="block rounded-md px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                        >
                          Stock
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/dashboard/inventory/categories"
                          onClick={handleLinkClick}
                          className="block rounded-md px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                        >
                          Categories
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Users - Only visible to ADMIN */}
                {userRole === "ADMIN" && (
                  <li>
                    <Link
                      href="/dashboard/users"
                      onClick={handleLinkClick}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                    >
                      👥 Users
                    </Link>
                  </li>
                )}

                {/* Reports */}
                <li>
                  <Link
                    href="/dashboard/reports"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    📈 Reports
                  </Link>
                </li>

                {/* Settings */}
                <li>
                  <Link
                    href="/dashboard/settings"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    ⚙️ Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </aside>
    </>
  );
}