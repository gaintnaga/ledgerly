"use client";

import { useEffect, useState } from "react";
import ReceiptUploader from "./ReceiptUploader";
import PurchaseItemRow, { PurchaseItem } from "./PurchaseItemRow";
import ParticipantSelector, { User } from "./ParticipantSelector";

export interface PurchaseParticipant {
  id?: string;
  userId: string;
  shareAmount?: number;
  user?: User;
}

export interface Purchase {
  id?: number | string;
  title?: string;
  storeName?: string;
  purchaseDate?: string;
  paidById?: string;
  paidBy?: string | { id: string; name: string; email: string };
  description?: string;
  receiptImage?: string;
  items?: any[];
  participants?: PurchaseParticipant[];
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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const formatItems = (rawItems?: any[]): PurchaseItem[] => {
    if (!rawItems || rawItems.length === 0) {
      return [
        {
          id: Date.now(),
          itemName: "",
          quantity: 1,
          unitPrice: 0,
        },
      ];
    }
    return rawItems.map((item: any, index: number) => {
      const qty = Number(item.quantity || 1);
      const priceVal = Number(item.unitPrice ?? item.price ?? 0);
      return {
        id: item.id || Date.now() + index,
        itemName: item.itemName || "",
        quantity: qty,
        unitPrice: priceVal,
        price: priceVal,
        total: Number(item.total ?? qty * priceVal),
      };
    });
  };

  const getPayerId = (p?: Purchase | null): string => {
    if (!p) return "";
    if (p.paidById) return p.paidById;
    if (typeof p.paidBy === "object" && p.paidBy?.id) return p.paidBy.id;
    return "";
  };

  const [participantIds, setParticipantIds] = useState<string[]>(
    purchase?.participants?.map((p) => p.userId) ?? []
  );

  const [items, setItems] = useState<PurchaseItem[]>(formatItems(purchase?.items));

  const [formData, setFormData] = useState({
    title: purchase?.title ?? "",
    storeName: purchase?.storeName ?? "",
    purchaseDate: purchase?.purchaseDate
      ? new Date(purchase.purchaseDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    paidById: getPayerId(purchase),
    description: purchase?.description ?? "",
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        title: purchase.title ?? "",
        storeName: purchase.storeName ?? "",
        purchaseDate: purchase.purchaseDate
          ? new Date(purchase.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        paidById: getPayerId(purchase),
        description: purchase.description ?? "",
      });

      setItems(formatItems(purchase.items));

      if (purchase.participants) {
        setParticipantIds(purchase.participants.map((p) => p.userId));
      }
    }
  }, [purchase]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const data = await res.json();
      const userList: User[] = Array.isArray(data) ? data : data.users || [];
      setUsers(userList);

      // Default all users as participants if creating new purchase and none selected
      if (!purchase?.participants && userList.length > 0 && participantIds.length === 0) {
        setParticipantIds(userList.map((u) => u.id));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
      {
        id: Date.now(),
        itemName: "",
        quantity: 1,
        unitPrice: 0,
      },
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
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * Number(item.unitPrice ?? item.price ?? 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.paidById) {
      alert("Please select the user who paid for this purchase.");
      return;
    }

    if (participantIds.length === 0) {
      alert("Please select at least one participant to divide the bill.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        purchaseDate: formData.purchaseDate,
        storeName: formData.storeName,
        totalAmount,
        paidById: formData.paidById,
        participantIds,
        items: items.map((item) => {
          const priceVal = Number(item.unitPrice ?? item.price ?? 0);
          const qty = Number(item.quantity || 1);
          return {
            itemName: item.itemName,
            quantity: qty,
            unitPrice: priceVal,
            price: priceVal,
            total: qty * priceVal,
          };
        }),
      };

      const response = await fetch("/api/purchases", {
        method: purchase ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save purchase");
      }

      const result = await response.json();
      console.log("Purchase saved:", result);

      alert(
        purchase
          ? "Purchase updated successfully!"
          : "Purchase created successfully!"
      );
      onCancel?.();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong while saving purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Purchase Details */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          Purchase Details
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Weekly Grocery"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="DMart"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Date *
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paid By *
            </label>
            <select
              name="paidById"
              value={formData.paidById}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Purchase Items */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Items
          </h2>

          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <PurchaseItemRow
              key={item.id}
              item={item}
              onChange={(updated) => handleItemChange(index, updated)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t pt-4 dark:border-gray-800">
          <div className="text-right">
            <p className="text-sm text-gray-500">Grand Total</p>
            <h3 className="text-2xl font-bold text-blue-600">
              ₹{totalAmount.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Bill Division / Participants Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ParticipantSelector
          users={users}
          value={participantIds}
          onChange={setParticipantIds}
          totalAmount={totalAmount}
        />
      </div>

      {/* Description */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Additional notes..."
        />
      </div>

      {/* Receipt Uploader */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ReceiptUploader value={receipt} onChange={setReceipt} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Saving..."
            : purchase
            ? "Update Purchase"
            : "Save Purchase"}
        </button>
      </div>
    </form>
  );
}