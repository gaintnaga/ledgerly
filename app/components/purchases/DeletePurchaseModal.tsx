"use client";

import { Purchase } from "./PurchaseTable";

interface DeletePurchaseModalProps {
  open: boolean;
  purchase: Purchase | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePurchaseModal({
  open,
  purchase,
  onClose,
  onConfirm,
}: DeletePurchaseModalProps) {
  if (!open || !purchase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Delete Purchase
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete &quot;<span className="font-semibold">{purchase.title}</span>&quot;? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
