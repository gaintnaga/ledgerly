"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface PurchaseItem {
  id: string;
  itemName: string;
  quantity: number;
  unit?: string;
  price: number;
  total: number;
}

interface Purchase {
  id: string;
  title: string;
  storeName?: string;
  totalAmount: number;
  purchaseDate?: string;
  createdAt?: string;
  paidBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  items?: PurchaseItem[];
}

interface PayerStat {
  name: string;
  email?: string;
  totalPaid: number;
  count: number;
  percentage: number;
}

interface StockAdditionLog {
  id: string;
  itemName: string;
  quantity: number;
  unit?: string;
  price: number;
  total: number;
  purchaseTitle: string;
  paidBy: string;
  addedAt: string;
}

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/purchases");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Calculate Payer Breakdown ("Who Paid What & How Much")
  const payerMap: Record<string, PayerStat> = {};
  let globalTotalSpent = 0;

  purchases.forEach((p) => {
    const amount = Number(p.totalAmount || 0);
    globalTotalSpent += amount;

    const payerName = p.paidBy?.name || "Unknown Payer";
    const payerEmail = p.paidBy?.email;

    if (!payerMap[payerName]) {
      payerMap[payerName] = {
        name: payerName,
        email: payerEmail,
        totalPaid: 0,
        count: 0,
        percentage: 0,
      };
    }

    payerMap[payerName].totalPaid += amount;
    payerMap[payerName].count += 1;
  });

  const payerStats: PayerStat[] = Object.values(payerMap).map((p) => ({
    ...p,
    percentage: globalTotalSpent > 0 ? Math.round((p.totalPaid / globalTotalSpent) * 100) : 0,
  })).sort((a, b) => b.totalPaid - a.totalPaid);

  // 2. Extract Item Addition & Stock Taken Logs ("When Items Were Added & How Much Stock")
  const stockLogs: StockAdditionLog[] = [];
  let totalStockUnitsAdded = 0;

  purchases.forEach((p) => {
    const addedAt = p.purchaseDate || p.createdAt || new Date().toISOString();
    const paidBy = p.paidBy?.name || "Unknown";

    if (p.items && p.items.length > 0) {
      p.items.forEach((item) => {
        const qty = Number(item.quantity || 1);
        totalStockUnitsAdded += qty;

        stockLogs.push({
          id: `${p.id}-${item.id || item.itemName}`,
          itemName: item.itemName,
          quantity: qty,
          unit: item.unit || "pcs",
          price: Number(item.price || 0),
          total: Number(item.total || qty * Number(item.price || 0)),
          purchaseTitle: p.title,
          paidBy,
          addedAt,
        });
      });
    }
  });

  // 3. Stock Timeline Data (Grouped by Date)
  const timelineMap: Record<string, { date: string; units: number; cost: number }> = {};

  stockLogs.forEach((item) => {
    const formattedDate = new Date(item.addedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!timelineMap[formattedDate]) {
      timelineMap[formattedDate] = { date: formattedDate, units: 0, cost: 0 };
    }

    timelineMap[formattedDate].units += item.quantity;
    timelineMap[formattedDate].cost += item.total;
  });

  const timelineData = Object.values(timelineMap).slice(0, 7);
  const maxUnitsInTimeline = Math.max(...timelineData.map((d) => d.units), 10);

  const topPayer = payerStats.length > 0 ? payerStats[0] : null;

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner & Title */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Executive Analytics & Financial Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time breakdown of payment contributions, stock intake, and purchase activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/purchases"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            🛒 + New Purchase
          </Link>
        </div>
      </div>

      {/* KPI Cards Header */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <Card className="border-l-4 border-l-indigo-600 bg-gradient-to-br from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              Total Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              ₹{globalTotalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-gray-500">Across {purchases.length} total logged bills</p>
          </CardContent>
        </Card>

        {/* Top Payer */}
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/40 to-white dark:from-emerald-950/20 dark:to-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Top Payment Contributor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {topPayer ? topPayer.name : "N/A"}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {topPayer ? `Paid ₹${topPayer.totalPaid.toLocaleString()} (${topPayer.percentage}% of total)` : "No payments logged"}
            </p>
          </CardContent>
        </Card>

        {/* Stock Items Intake */}
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/40 to-white dark:from-purple-950/20 dark:to-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
              Stock Items Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {stockLogs.length} <span className="text-sm font-normal text-gray-500">Items</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{totalStockUnitsAdded} total units added to inventory</p>
          </CardContent>
        </Card>

        {/* Active Members */}
        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/40 to-white dark:from-amber-950/20 dark:to-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Contributing Payers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {payerStats.length} <span className="text-sm font-normal text-gray-500">Payers</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Members funding ledger purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GRAPH 1: Who Paid What & How Much (Payer Payment Breakdown) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                💳 Payment Breakdown (Who Paid What)
              </h2>
              <p className="text-xs text-gray-500">
                Total amount and percentage paid upfront by each team member.
              </p>
            </div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              {payerStats.length} Active Payers
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading payment stats...</div>
          ) : payerStats.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No payment records found.</div>
          ) : (
            <div className="space-y-5">
              {payerStats.map((payer, idx) => (
                <div key={payer.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {payer.name}
                      </span>
                      <span className="text-xs text-gray-400">({payer.count} bills)</span>
                    </div>

                    <div className="text-right font-bold text-gray-900 dark:text-white">
                      ₹{payer.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        ({payer.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Indicator */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-indigo-600"
                          : idx === 1
                          ? "bg-emerald-500"
                          : idx === 2
                          ? "bg-purple-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.max(payer.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GRAPH 2: Stock Activity & When Items Were Added */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                📦 Stock Addition & Activity Timeline
              </h2>
              <p className="text-xs text-gray-500">
                Number of stock items added and taken over recent dates.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {totalStockUnitsAdded} Units Added
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading stock activity...</div>
          ) : timelineData.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No stock intake recorded yet.</div>
          ) : (
            <div className="space-y-6">
              {/* Visual SVG / Bar Chart */}
              <div className="flex h-44 items-end justify-between gap-3 pt-6 border-b border-gray-100 pb-2 dark:border-gray-800">
                {timelineData.map((d) => {
                  const barHeightPercent = Math.round((d.units / maxUnitsInTimeline) * 100);
                  return (
                    <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {d.units} units
                      </span>
                      <div className="relative w-full rounded-t-lg bg-indigo-100 dark:bg-gray-800 flex items-end h-32">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500"
                          style={{ height: `${Math.max(barHeightPercent, 12)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-gray-500">
                        {d.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-indigo-600" />
                  <span>Stock Units Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-emerald-500" />
                  <span>Purchased & Logged Stock</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Addition History & Stock Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📋 Detailed Item Addition & Stock History
            </h2>
            <p className="text-sm text-gray-500">
              When items were added, who paid for them, quantity added, and total price.
            </p>
          </div>
          <Link
            href="/dashboard/purchases"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            View All Purchases &rarr;
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Purchase Title</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Quantity Added</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading stock addition history...
                </TableCell>
              </TableRow>
            ) : stockLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No individual stock items added yet. Add a purchase with items to see detailed stock logs.
                </TableCell>
              </TableRow>
            ) : (
              stockLogs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    {log.itemName}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                    {log.purchaseTitle}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {log.paidBy}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(log.addedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      +{log.quantity} {log.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-gray-600 dark:text-gray-400">
                    ₹{log.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                    ₹{log.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
