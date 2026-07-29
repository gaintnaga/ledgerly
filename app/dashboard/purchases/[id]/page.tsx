"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface PurchaseDetail {
  id: string;
  title: string;
  description?: string;
  storeName?: string;
  receiptImage?: string | null;
  totalAmount: number;
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
  items?: {
    id: string;
    itemName: string;
    quantity: number;
    unit?: string;
    price: number;
    total: number;
  }[];
  participants?: {
    id: string;
    shareAmount: number;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export default function PurchaseDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const purchaseId = resolvedParams.id;
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchase();
  }, [purchaseId]);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/purchases/${purchaseId}`);
      const data = await response.json();

      if (data.success) {
        setPurchase(data.purchase);
      } else {
        console.error("Failed to load purchase:", data.message);
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/purchases"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            &larr; Back to All Purchases
          </Link>
          <span className="font-mono text-xs text-gray-500">ID: {purchaseId}</span>
        </div>
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          Loading purchase details...
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/purchases"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            &larr; Back to All Purchases
          </Link>
          <span className="font-mono text-xs text-gray-500">ID: {purchaseId}</span>
        </div>
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          Purchase record not found.
        </div>
      </div>
    );
  }

  const itemsList = purchase.items || [];
  const participantsList = purchase.participants || [];
  const totalVal = Number(purchase.totalAmount || 0);

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
              Purchased from{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {purchase.storeName || "N/A"}
              </span>
              {purchase.createdAt && (
                <> on {new Date(purchase.createdAt).toLocaleDateString()}</>
              )}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase text-gray-400">Total Purchase Value</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ₹{totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {purchase.paidBy?.name || "N/A"}
            </div>
            <p className="text-xs text-gray-500">
              {purchase.paidBy?.email || "Full amount paid up front"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Created By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {purchase.createdBy?.name || "N/A"}
            </div>
            <p className="text-xs text-gray-500">
              {purchase.createdBy?.email || "Entry logged on system"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {participantsList.length} {participantsList.length === 1 ? "Participant" : "Participants"}
            </div>
            <p className="text-xs text-gray-500">
              Members included in this purchase
            </p>
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
            {itemsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                  No line items attached to this purchase.
                </TableCell>
              </TableRow>
            ) : (
              itemsList.map((item) => {
                const itemPrice = Number(item.price || 0);
                const itemTotal = Number(item.total || item.quantity * itemPrice);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {item.itemName}
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit || "pcs"}
                    </TableCell>
                    <TableCell>₹{itemPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">₹{itemTotal.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Participants Included */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Participants Included</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participantsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                  No participants recorded for this purchase.
                </TableCell>
              </TableRow>
            ) : (
              participantsList.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    {p.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    {p.user?.email || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      Included
                    </span>
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
