"use client";

interface PurchaseHeaderProps {
  onAdd: () => void;
}

export default function PurchaseHeader({
  onAdd,
}: PurchaseHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Purchases
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track all purchase records.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-blue-700"
        >
          + Add Purchase
        </button>
      </div>
    </div>
  );
}