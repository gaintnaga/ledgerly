"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PurchaseParticipant {
  id: string;
  userId: string;
  shareAmount: number | string;
  user?: User;
}

interface Purchase {
  id: string;
  title: string;
  storeName?: string | null;
  totalAmount: number | string;
  purchaseDate: string;
  paidById: string;
  paidBy?: User;
  participants?: PurchaseParticipant[];
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number | string;
  unitPrice: number | string;
}

interface ParticipantBalance {
  id: string;
  name: string;
  email: string;
  totalPaid: number;
  shareOwed: number;
  netBalance: number;
}

export default function ReportsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [purRes, invRes, userRes] = await Promise.all([
        fetch("/api/purchases"),
        fetch("/api/inventory"),
        fetch("/api/users"),
      ]);

      const purData = await purRes.json();
      const invData = await invRes.json();
      const userData = await userRes.json();

      if (purData.success && Array.isArray(purData.purchases)) {
        setPurchases(purData.purchases);
      }
      if (invData.success && Array.isArray(invData.data)) {
        setInventory(invData.data);
      }

      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (userData.success && Array.isArray(userData.users)) {
        setUsers(userData.users);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Total Purchases Expense
  const totalPurchaseExpense = purchases.reduce(
    (sum, p) => sum + (Number(p.totalAmount) || 0),
    0
  );

  // 2. Total Inventory Valuation
  const totalInventoryValue = inventory.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  // 3. Store Breakdown
  const storeMap: Record<string, number> = {};
  purchases.forEach((p) => {
    const store = p.storeName?.trim() || "General / Unspecified";
    const amount = Number(p.totalAmount) || 0;
    storeMap[store] = (storeMap[store] || 0) + amount;
  });

  const storeBreakdown = Object.entries(storeMap)
    .map(([store, spent]) => ({
      store,
      spent,
      percentage: totalPurchaseExpense > 0 ? ((spent / totalPurchaseExpense) * 100).toFixed(1) : "0",
    }))
    .sort((a, b) => b.spent - a.spent);

  // 4. Participant Balance Calculations
  const userBalanceMap: Record<string, ParticipantBalance> = {};

  users.forEach((u) => {
    userBalanceMap[u.id] = {
      id: u.id,
      name: u.name,
      email: u.email,
      totalPaid: 0,
      shareOwed: 0,
      netBalance: 0,
    };
  });

  purchases.forEach((p) => {
    const amount = Number(p.totalAmount) || 0;
    if (p.paidById && userBalanceMap[p.paidById]) {
      userBalanceMap[p.paidById].totalPaid += amount;
    }

    if (Array.isArray(p.participants)) {
      p.participants.forEach((part) => {
        const share = Number(part.shareAmount) || 0;
        if (part.userId && userBalanceMap[part.userId]) {
          userBalanceMap[part.userId].shareOwed += share;
        }
      });
    }
  });

  const participantBalances = Object.values(userBalanceMap).map((bal) => ({
    ...bal,
    netBalance: bal.totalPaid - bal.shareOwed,
  }));

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports & Analytics</h1>
          <p className="text-sm text-gray-500">
            Real-time overview of purchases, inventory values, and participant balances.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition print:hidden"
        >
          Print / Export Report
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center bg-white rounded-xl border border-gray-200">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ₹{totalPurchaseExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{purchases.length} total receipt logs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  ₹{totalInventoryValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Across {inventory.length} stock items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Receipt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">
                  ₹
                  {purchases.length > 0
                    ? (totalPurchaseExpense / purchases.length).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </div>
                <p className="text-xs text-gray-500 mt-1">Average per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registered Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                <p className="text-xs text-gray-500 mt-1">Active ledger participants</p>
              </CardContent>
            </Card>
          </div>

          {/* Store Wise Expense Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Store Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {storeBreakdown.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No purchase data available.</p>
                ) : (
                  storeBreakdown.map((item) => (
                    <div key={item.store} className="space-y-1">
                      <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>{item.store}</span>
                        <span>
                          ₹{item.spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-indigo-50 p-4">
                  <h4 className="text-sm font-bold text-indigo-900">💡 Top Spending Vendor</h4>
                  <p className="mt-1 text-xs text-indigo-700">
                    {storeBreakdown.length > 0
                      ? `${storeBreakdown[0].store} represents ${storeBreakdown[0].percentage}% of total expenses.`
                      : "No vendor transactions recorded yet."}
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-4">
                  <h4 className="text-sm font-bold text-emerald-900">📦 Inventory Total</h4>
                  <p className="mt-1 text-xs text-emerald-700">
                    Current stock holding value is ₹
                    {totalInventoryValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}.
                  </p>
                </div>

                <div className="rounded-lg bg-amber-50 p-4">
                  <h4 className="text-sm font-bold text-amber-900">⚖️ Settlement Status</h4>
                  <p className="mt-1 text-xs text-amber-700">
                    {participantBalances.filter((b) => Math.abs(b.netBalance) > 0.01).length} member(s) have
                    pending reimbursement balances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participant Split Ledger Table */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Participant Balance Ledger</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Paid Out</TableHead>
                  <TableHead>Fair Share Owed</TableHead>
                  <TableHead className="text-right">Net Settlement Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participantBalances.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-6 text-gray-500" colSpan={5}>
                      No participants recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  participantBalances.map((u) => {
                    const isPositive = u.netBalance > 0.01;
                    const isNegative = u.netBalance < -0.01;

                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-semibold text-gray-900">{u.name}</TableCell>
                        <TableCell className="text-gray-500 text-xs">{u.email}</TableCell>
                        <TableCell className="font-medium text-emerald-600">
                          ₹{u.totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="font-medium text-gray-600">
                          ₹{u.shareOwed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                              isPositive
                                ? "bg-emerald-100 text-emerald-800"
                                : isNegative
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isPositive
                              ? `+ ₹${u.netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (Gets Back)`
                              : isNegative
                              ? `- ₹${Math.abs(u.netBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} (Owes)`
                              : "Settled"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
