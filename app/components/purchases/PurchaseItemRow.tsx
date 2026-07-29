"use client";

function TrashIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export interface PurchaseItem {
  id: number | string;
  itemName: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  total?: number;
}

interface PurchaseItemRowProps {
  item: PurchaseItem;
  onChange: (item: PurchaseItem) => void;
  onRemove: () => void;
}

export default function PurchaseItemRow({
  item,
  onChange,
  onRemove,
}: PurchaseItemRowProps) {
  const currentPrice = Number(item.unitPrice ?? item.price ?? 0);
  const currentQty = Number(item.quantity ?? 1);
  const subtotal = currentQty * currentPrice;

  return (
    <div className="grid grid-cols-12 gap-3 items-end rounded-lg border p-4 dark:border-gray-800 dark:bg-gray-800/40">
      <div className="col-span-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Item Name
        </label>
        <input
          type="text"
          value={item.itemName}
          onChange={(e) =>
            onChange({
              ...item,
              itemName: e.target.value,
            })
          }
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="e.g. Rice"
        />
      </div>

      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Qty
        </label>
        <input
          type="number"
          step="any"
          min={0}
          value={currentQty}
          onChange={(e) => {
            const newQty = Number(e.target.value);
            onChange({
              ...item,
              quantity: newQty,
              unitPrice: currentPrice,
              total: newQty * currentPrice,
            });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="1"
        />
      </div>

      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Unit Price
        </label>
        <input
          type="number"
          step="any"
          min={0}
          value={currentPrice}
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            onChange({
              ...item,
              unitPrice: newPrice,
              price: newPrice,
              total: currentQty * newPrice,
            });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="0.00"
        />
      </div>

      <div className="col-span-3">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Total
        </label>
        <div className="rounded-lg border bg-gray-100 px-3 py-2 font-semibold text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          ₹{subtotal.toFixed(2)}
        </div>
      </div>

      <div className="col-span-1">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 transition flex items-center justify-center"
          title="Remove Item"
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  );
}