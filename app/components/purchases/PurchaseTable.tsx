"use client";

import Link from "next/link";

export interface Purchase {
  id: number;
  title: string;
  store: string;
  paidBy: string;
  amount: number;
  date: string;
}

interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
}

export default function PurchaseTable({
  purchases,
  onEdit,
  onDelete,
}: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No purchases found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Title
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Store
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Paid By
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-4 py-3 text-right text-sm font-semibold">
                Amount
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  {purchase.title}
                </td>

                <td className="px-4 py-4">
                  {purchase.store}
                </td>

                <td className="px-4 py-4">
                  {purchase.paidBy}
                </td>

                <td className="px-4 py-4">
                  {purchase.date}
                </td>

                <td className="px-4 py-4 text-right font-medium">
                  ₹{purchase.amount.toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/dashboard/purchases/${purchase.id}`}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => onEdit(purchase)}
                      className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(purchase)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}