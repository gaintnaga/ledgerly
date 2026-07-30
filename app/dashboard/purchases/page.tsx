"use client";

import { useEffect, useState } from "react";
import PurchaseHeader from "@/app/components/purchases/PurchaseHeader";
import PurchaseTable, {
  Purchase,
} from "@/app/components/purchases/PurchaseTable";
import PurchaseModal from "@/app/components/purchases/PurchaseModal";
import PurchaseForm from "@/app/components/purchases/PurchaseForm";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PurchasesPage() {
  const [open, setOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchPurchases();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error);
    }
  };

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

      const data = await res.json();

      if (res.ok && data.success) {
        setPurchases((prev) => prev.filter((item) => item.id !== purchase.id));
      } else {
        alert(data.message || "Failed to delete purchase. You can only delete purchases created by you.");
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
        <LoadingSpinner label="Loading purchases..." size="lg" />
      ) : (
        <PurchaseTable
          purchases={purchases}
          currentUser={currentUser}
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