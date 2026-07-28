"use client";

import { useState } from "react";

import PurchaseHeader from "@/app/components/purchases/PurchaseHeader";
import PurchaseTable, {
  Purchase,
} from "@/app/components/purchases/PurchaseTable";
import PurchaseModal from "@/app/components/purchases/PurchaseModal";
import PurchaseForm from "@/app/components/purchases/PurchaseForm";

export default function PurchasesPage() {
  const [open, setOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<Purchase | null>(null);

  // Dummy data (Replace with API later)
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: 1,
      title: "Weekly Grocery",
      store: "DMart",
      paidBy: "Amit",
      amount: 2450,
      date: "2026-07-28",
    },
    {
      id: 2,
      title: "Vegetables",
      store: "Reliance Fresh",
      paidBy: "Rahul",
      amount: 890,
      date: "2026-07-27",
    },
  ]);

  const handleAdd = () => {
    setSelectedPurchase(null);
    setOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setOpen(true);
  };

  const handleDelete = (purchase: Purchase) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${purchase.title}"?`
    );

    if (!confirmDelete) return;

    setPurchases((prev) =>
      prev.filter((item) => item.id !== purchase.id)
    );
  };

  return (
    <div className="space-y-6">
      <PurchaseHeader onAdd={handleAdd} />

      <PurchaseTable
        purchases={purchases}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PurchaseModal
        open={open}
        title={
          selectedPurchase ? "Edit Purchase" : "Add Purchase"
        }
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
          }}
        />
      </PurchaseModal>
    </div>
  );
}