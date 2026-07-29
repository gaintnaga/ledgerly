"use client";

import { useEffect, useState } from "react";
import PurchaseHeader from "@/app/components/purchases/PurchaseHeader";
import PurchaseTable, {
  Purchase,
} from "@/app/components/purchases/PurchaseTable";
import PurchaseModal from "@/app/components/purchases/PurchaseModal";
import PurchaseForm from "@/app/components/purchases/PurchaseForm";

export default function PurchasesPage() {
  const [open, setOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/purchases");
      const data = await response.json();

      if (data.success) {
        setPurchases(data.purchases || []);
      } else {
        console.error("Failed to load purchases:", data.message);
      }
    } catch (error) {
      console.error("Failed to load purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPurchase(null);
    setOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setOpen(true);
  };

  const handleDelete = async (purchase: Purchase) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${purchase.title}"?`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/purchases/${purchase.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPurchases((prev) => prev.filter((item) => item.id !== purchase.id));
      } else {
        alert("Failed to delete purchase");
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      alert("Error deleting purchase");
    }
  };

  return (
    <div className="space-y-6">
      <PurchaseHeader onAdd={handleAdd} />

      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          Loading purchases...
        </div>
      ) : (
        <PurchaseTable
          purchases={purchases}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PurchaseModal
        open={open}
        title={selectedPurchase ? "Edit Purchase" : "Add Purchase"}
        onClose={() => {
          setOpen(false);
          setSelectedPurchase(null);
        }}
      >
        <PurchaseForm
          purchase={selectedPurchase}
          onCancel={() => {
            setOpen(false);
            setSelectedPurchase(null);
            fetchPurchases();
          }}
        />
      </PurchaseModal>
    </div>
  );
}