"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar() {
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

  return (
    <aside className="min-h-screen w-64 bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6 text-2xl font-bold">
        Ledgerly
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 hover:bg-gray-700"
            >
              📊 Dashboard
            </Link>
          </li>

          {/* Purchases */}
          <li>
            <button
              onClick={() => setPurchaseOpen(!purchaseOpen)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-700"
            >
              <span>🛒 Purchases</span>
              <span>{purchaseOpen ? "▾" : "▸"}</span>
            </button>

            {purchaseOpen && (
              <ul className="mt-2 ml-5 space-y-1">
                <li>
                  <Link
                    href="/dashboard/purchases"
                    className="block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700"
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
              className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-700"
            >
              <span>📦 Inventory</span>
              <span>{inventoryOpen ? "▾" : "▸"}</span>
            </button>

            {inventoryOpen && (
              <ul className="mt-2 ml-5 space-y-1">
                <li>
                  <Link
                    href="/dashboard/inventory"
                    className="block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    Stock
                  </Link>
                </li>

                <li>
                  <Link
                    href="/dashboard/inventory/categories"
                    className="block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700"
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
                className="block rounded-md px-3 py-2 hover:bg-gray-700"
              >
                👥 Users
              </Link>
            </li>
          )}

          {/* Reports */}
          <li>
            <Link
              href="/dashboard/reports"
              className="block rounded-md px-3 py-2 hover:bg-gray-700"
            >
              📈 Reports
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              href="/dashboard/settings"
              className="block rounded-md px-3 py-2 hover:bg-gray-700"
            >
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}