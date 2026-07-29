"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("THIS_MONTH");

  const monthlyBreakdown = [
    { category: "Groceries & Supplies", spent: 14500, percentage: "42%" },
    { category: "Inventory Restock", spent: 11200, percentage: "33%" },
    { category: "Utilities & Fuel", spent: 5400, percentage: "16%" },
    { category: "Miscellaneous", spent: 3100, percentage: "9%" },
  ];

  const userContributions = [
    { name: "Amit Kumar", paid: 18600, splitShare: 17100, balance: "+ ₹1,500" },
    { name: "Rahul Sharma", paid: 12800, splitShare: 14300, balance: "- ₹1,500" },
    { name: "Priya Patel", paid: 2800, splitShare: 2800, balance: "Settled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Financial Analytics</h1>
          <p className="text-sm text-gray-500">Insights into store expenses, inventory turnover, and balances.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="THIS_MONTH">This Month (July 2026)</option>
            <option value="LAST_MONTH">Last Month (June 2026)</option>
            <option value="THIS_QUARTER">Q3 2026</option>
            <option value="THIS_YEAR">Year 2026</option>
          </select>

          <button
            onClick={() => alert("Report exported successfully as PDF")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">₹34,200</div>
            <p className="text-xs text-emerald-600 mt-1">↓ 8% lower than last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">28 Logged</div>
            <p className="text-xs text-gray-500 mt-1">Average ₹1,221 per receipt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">₹48,900</div>
            <p className="text-xs text-gray-500 mt-1">Across 85 stock items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">₹1,500</div>
            <p className="text-xs text-gray-500 mt-1">Unsettled split balances</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown & Progress Bar Visualizer */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Wise Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyBreakdown.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>{item.category}</span>
                  <span>₹{item.spent.toLocaleString()} ({item.percentage})</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: item.percentage }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950/30">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">💡 Top Spend Store</h4>
              <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-400">
                DMart Mega Store accounts for 58% of all store purchases this month.
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">📦 Inventory Health</h4>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Stock replenishment efficiency improved by 14% over Q2.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">⚖️ Pending Reconciliations</h4>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Rahul Sharma has 1 pending split reimbursement of ₹1,500 due to Amit Kumar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Split Ledger Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Participant Balance Summary</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Member</TableHead>
              <TableHead>Total Paid Out</TableHead>
              <TableHead>Fair Share Owed</TableHead>
              <TableHead className="text-right">Net Settlement Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userContributions.map((u) => (
              <TableRow key={u.name}>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{u.name}</TableCell>
                <TableCell className="font-medium text-emerald-600">₹{u.paid.toLocaleString()}</TableCell>
                <TableCell className="font-medium text-gray-600 dark:text-gray-400">₹{u.splitShare.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                      u.balance.startsWith("+")
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : u.balance.startsWith("-")
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {u.balance}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
