"use client";

import { useState } from "react";
import ReceiptUploader from "./ReceiptUploader";
import PurchaseItemRow, { PurchaseItem } from "./PurchaseItemRow";

interface Purchase {
  id?: number;
  title?: string;
  store?: string;
  purchaseDate?: string;
  paidBy?: string;
  description?: string;
  items?: PurchaseItem[];
}

interface PurchaseFormProps {
  purchase?: Purchase | null;
  onCancel?: () => void;
}

export default function PurchaseForm({
  purchase,
  onCancel,
}: PurchaseFormProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [items, setItems] = useState<PurchaseItem[]>(
    purchase?.items && purchase.items.length > 0
      ? purchase.items
      : [{ id: Date.now(), itemName: "", quantity: 1, unitPrice: 0 }]
  );
  const [formData, setFormData] = useState({
    title: purchase?.title ?? "",
    store: purchase?.store ?? "",
    purchaseDate: purchase?.purchaseDate ?? "",
    paidBy: purchase?.paidBy ?? "",
    description: purchase?.description ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), itemName: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleItemChange = (index: number, updatedItem: PurchaseItem) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = updatedItem;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ ...formData, items, totalAmount, receipt });

    // Later:
    // POST /api/purchases
    // PUT /api/purchases/:id
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Purchase Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
            placeholder="Weekly Grocery"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Store
          </label>

          <input
            type="text"
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
            placeholder="DMart"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Purchase Date
          </label>

          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Paid By
          </label>

          <select
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select User</option>
            <option value="Amit">Amit</option>
            <option value="Rahul">Rahul</option>
          </select>
        </div>

      </div>

      {/* Items & Prices Section */}
      <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Items & Prices</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No items added yet. Click &quot;+ Add Item&quot; above to add items and prices.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <PurchaseItemRow
                key={item.id}
                item={item}
                onChange={(updatedItem) => handleItemChange(index, updatedItem)}
                onRemove={() => handleRemoveItem(index)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end border-t pt-3 text-lg font-semibold">
          <span>Grand Total:&nbsp;</span>
          <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-2"
          placeholder="Purchase description..."
        />
      </div>

      <ReceiptUploader
        value={receipt}
        onChange={setReceipt}
      />

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-5 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          {purchase ? "Update Purchase" : "Save Purchase"}
        </button>

      </div>
    </form>
  );
}