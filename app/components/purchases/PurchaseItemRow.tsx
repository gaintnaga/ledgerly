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
  quantity: number | string;
  unit?: string;
  unitPrice?: number | string;
  price?: number | string;
  total?: number;
}

interface PurchaseItemRowProps {
  item: PurchaseItem;
  onChange: (item: PurchaseItem) => void;
  onRemove: () => void;
}

const sanitizeNumericInput = (value: string): string => {
  // Strip out any non-digit and non-decimal point characters
  let clean = value.replace(/[^0-9.]/g, "");
  // Ensure only one decimal point exists
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return clean;
};

export default function PurchaseItemRow({
  item,
  onChange,
  onRemove,
}: PurchaseItemRowProps) {
  const numQty = Math.max(0, parseFloat(String(item.quantity)) || 0);
  const numPrice = Math.max(0, parseFloat(String(item.unitPrice ?? item.price)) || 0);
  const currentUnit = item.unit || "pcs";
  const subtotal = numQty * numPrice;

  return (
    <div className="grid grid-cols-12 gap-3 items-end rounded-lg border p-4 dark:border-gray-800 dark:bg-gray-800/40">
      {/* Item Name */}
      <div className="col-span-3">
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

      {/* Quantity */}
      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Qty
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={item.quantity === undefined || item.quantity === null ? "" : item.quantity}
          onChange={(e) => {
            const cleanVal = sanitizeNumericInput(e.target.value);
            const calcQty = parseFloat(cleanVal) || 0;
            onChange({
              ...item,
              quantity: cleanVal,
              total: calcQty * numPrice,
            });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="1"
        />
      </div>

      {/* Unit Type */}
      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Unit
        </label>
        <select
          value={currentUnit}
          onChange={(e) =>
            onChange({
              ...item,
              unit: e.target.value,
            })
          }
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="pcs">pcs (pieces)</option>
          <option value="bag">bag</option>
          <option value="crate">crate</option>
          <option value="pouch">pouch</option>
          <option value="kg">kg (kilogram)</option>
          <option value="gm">gm (gram)</option>
          <option value="liter">liter</option>
          <option value="bottle">bottle</option>
          <option value="pack">pack</option>
          <option value="box">box</option>
        </select>
      </div>

      {/* Unit Price */}
      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Unit Price (₹)
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={
            item.unitPrice !== undefined && item.unitPrice !== null
              ? item.unitPrice
              : item.price !== undefined && item.price !== null
              ? item.price
              : ""
          }
          onChange={(e) => {
            const cleanVal = sanitizeNumericInput(e.target.value);
            const calcPrice = parseFloat(cleanVal) || 0;
            onChange({
              ...item,
              unitPrice: cleanVal,
              price: cleanVal,
              total: numQty * calcPrice,
            });
          }}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="0.00"
        />
      </div>

      {/* Subtotal */}
      <div className="col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Total
        </label>
        <div className="rounded-lg border bg-gray-100 px-3 py-2 font-semibold text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          ₹{subtotal.toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="col-span-1">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 transition flex items-center justify-center w-full"
          title="Remove Item"
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  );
}