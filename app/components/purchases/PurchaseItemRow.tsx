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
  id: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
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
  const subtotal = item.quantity * item.unitPrice;

  return (
    <div className="grid grid-cols-12 gap-3 items-end rounded-lg border p-4">

      <div className="col-span-4">
        <label className="mb-1 block text-sm font-medium">
          Item
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
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Rice"
        />
      </div>

      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium">
          Qty
        </label>

        <input
          type="number"
          step="any"
          min={0}
          value={item.quantity}
          onChange={(e) =>
            onChange({
              ...item,
              quantity: Number(e.target.value),
            })
          }
          className="w-full rounded-lg border px-3 py-2"
          placeholder="e.g. 2.5"
        />
      </div>

      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium">
          Unit Price
        </label>

        <input
          type="number"
          step="any"
          min={0}
          value={item.unitPrice}
          onChange={(e) =>
            onChange({
              ...item,
              unitPrice: Number(e.target.value),
            })
          }
          className="w-full rounded-lg border px-3 py-2"
          placeholder="0.00"
        />
      </div>

      <div className="col-span-3">
        <label className="mb-1 block text-sm font-medium">
          Total
        </label>

        <div className="rounded-lg border bg-gray-100 px-3 py-2 font-semibold">
          ₹{subtotal.toFixed(2)}
        </div>
      </div>

      <div className="col-span-1">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 flex items-center justify-center"
          title="Remove Item"
        >
          <TrashIcon size={18} />
        </button>
      </div>

    </div>
  );
}