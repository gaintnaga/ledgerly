"use client";

import Link from "next/link";

export interface Purchase {
  id: number | string;
  title: string;
  storeName?: string;
  store?: string;
  paidBy?: string | { id: string; name: string; email: string };
  paidById?: string;
  createdById?: string;
  createdBy?: string | { id: string; name: string; email: string };
  totalAmount?: number;
  amount?: number;
  purchaseDate?: string;
  date?: string;
}

interface PurchaseTableProps {
  purchases: Purchase[];
  currentUser?: { id: string; role: string } | null;
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
}

export default function PurchaseTable({
  purchases,
  currentUser,
  onEdit,
  onDelete,
}: PurchaseTableProps) {
  if (!purchases || purchases.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        No purchases found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Store</th>
              <th className="px-4 py-3 text-left font-semibold">Paid By</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Amount</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {purchases.map((purchase) => {
              const rawAmount = purchase.totalAmount ?? purchase.amount ?? 0;
              const amountVal = typeof rawAmount === "number" ? rawAmount : Number(rawAmount) || 0;

              const storeVal = purchase.storeName || purchase.store || "—";
              const paidByVal =
                typeof purchase.paidBy === "object"
                  ? purchase.paidBy?.name
                  : purchase.paidBy || "—";

              const rawDate = purchase.purchaseDate || purchase.date;
              const dateVal = rawDate
                ? new Date(rawDate).toLocaleDateString()
                : "—";

              const creatorId =
                purchase.createdById ||
                (typeof purchase.createdBy === "object" ? purchase.createdBy?.id : undefined);

              // ADMIN can edit/delete all; USER can only edit/delete their own purchases
              const canModify =
                !currentUser ||
                currentUser.role === "ADMIN" ||
                (creatorId && currentUser.id === creatorId);

              return (
                <tr key={purchase.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                    {purchase.title}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {storeVal}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {paidByVal}
                  </td>

                  <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                    {dateVal}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹{amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/purchases/${purchase.id}`}
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 transition"
                      >
                        View
                      </Link>

                      {canModify ? (
                        <>
                          <button
                            onClick={() => onEdit(purchase)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => onDelete(purchase)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span
                          className="self-center px-1 text-xs italic text-gray-400"
                          title="Only the creator or admin can edit or delete this purchase"
                        >
                          View Only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}