"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PurchaseDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const purchaseId = resolvedParams.id;

  // Mock detail data for purchase
  const purchase = {
    id: purchaseId,
    title: "Weekly Grocery & Supplies",
    store: "DMart Mega Store",
    paidBy: "Amit Kumar",
    createdBy: "Amit Kumar",
    date: "2026-07-28",
    totalAmount: 2450.0,
    receiptImage: null,
    items: [
      { id: "1", itemName: "Basmati Rice 5kg", quantity: 1, unit: "bag", price: 450, total: 450 },
      { id: "2", itemName: "Sunflower Oil 1L", quantity: 2, unit: "pouch", price: 180, total: 360 },
      { id: "3", itemName: "Whole Wheat Atta 10kg", quantity: 1, unit: "bag", price: 380, total: 380 },
      { id: "4", itemName: "Dairy Milk & Butter", quantity: 4, unit: "pack", price: 120, total: 480 },
      { id: "5", itemName: "Assorted Vegetables", quantity: 1, unit: "crate", price: 780, total: 780 },
    ],
    participants: [
      { id: "p1", name: "Amit Kumar", shareAmount: 1225.0, status: "Paid" },
      { id: "p2", name: "Rahul Sharma", shareAmount: 1225.0, status: "Pending" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/purchases"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
        >
          &larr; Back to All Purchases
        </Link>
        <span className="font-mono text-xs text-gray-500">ID: {purchaseId}</span>
      </div>

      {/* Header Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{purchase.title}</h1>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Completed
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Purchased from <span className="font-medium text-gray-900 dark:text-white">{purchase.store}</span> on {purchase.date}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase text-gray-400">Total Purchase Value</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ₹{purchase.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Paid By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{purchase.paidBy}</div>
            <p className="text-xs text-gray-500">Full amount paid up front</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{purchase.createdBy}</div>
            <p className="text-xs text-gray-500">Entry logged on system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Split Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {purchase.participants.length} Participants
            </div>
            <p className="text-xs text-gray-500">₹{(purchase.totalAmount / purchase.participants.length).toFixed(2)} per person</p>
          </CardContent>
        </Card>
      </div>

      {/* Item Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Item Breakdown</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchase.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{item.itemName}</TableCell>
                <TableCell>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell className="text-right font-medium">₹{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Participants Split */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Participant Shares</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Share Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchase.participants.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{p.name}</TableCell>
                <TableCell className="font-medium">₹{p.shareAmount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.status === "Paid"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {p.status}
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
