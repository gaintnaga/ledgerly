"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface Category {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number | string;
  unit: string;
  unitPrice: number | string;
  minimumStock: number | string;
  notes?: string | null;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [formItem, setFormItem] = useState({
    name: "",
    categoryId: "",
    quantity: 0,
    unit: "pcs",
    unitPrice: 0,
    minimumStock: 1,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete State
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, catRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/categories"),
      ]);

      const invData = await invRes.json();
      const catData = await catRes.json();

      if (invData.success) {
        setItems(invData.data);
      }
      if (catData.success) {
        setCategories(catData.data);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormItem({
      name: "",
      categoryId: categories.length > 0 ? categories[0].id : "",
      quantity: 0,
      unit: "pcs",
      unitPrice: 0,
      minimumStock: 1,
      notes: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormItem({
      name: item.name,
      categoryId: item.categoryId || (item.category?.id ?? ""),
      quantity: Number(item.quantity) || 0,
      unit: item.unit || "pcs",
      unitPrice: Number(item.unitPrice) || 0,
      minimumStock: Number(item.minimumStock) || 1,
      notes: item.notes || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formItem.name.trim()) {
      setErrorMsg("Item name is required.");
      return;
    }
    if (!formItem.categoryId) {
      setErrorMsg("Category is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const isEditing = !!editingItem;
      const url = isEditing ? `/api/inventory/${editingItem.id}` : "/api/inventory";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formItem.name.trim(),
          categoryId: formItem.categoryId,
          quantity: Number(formItem.quantity) || 0,
          unit: formItem.unit.trim() || "pcs",
          unitPrice: Number(formItem.unitPrice) || 0,
          minimumStock: Number(formItem.minimumStock) || 1,
          notes: formItem.notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchData();
        setIsModalOpen(false);
      } else {
        setErrorMsg(data.message || "Failed to save inventory item.");
      }
    } catch (error) {
      console.error("Error saving inventory item:", error);
      setErrorMsg("An error occurred while saving item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${deletingItem.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        await fetchData();
        setDeletingItem(null);
      } else {
        alert(data.message || "Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "ALL" ||
      item.categoryId === categoryFilter ||
      item.category?.id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalValue = items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  const lowStockCount = items.filter((item) => {
    const qty = Number(item.quantity) || 0;
    const min = Number(item.minimumStock) || 0;
    return qty <= min;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Stock</h1>
          <p className="text-sm text-gray-500">
            Manage and track your product inventory levels.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          + Add Stock Item
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{items.length}</div>
            <p className="text-xs text-gray-500 mt-1">Unique stock items tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">At or below minimum threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              ₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on current quantity and price</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Search items by name or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:w-72"
        />

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Category Filter:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center bg-white rounded-xl border border-gray-200">
          <LoadingSpinner />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Min Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-8 text-gray-500" colSpan={7}>
                  No inventory items found matching search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const qty = Number(item.quantity) || 0;
                const min = Number(item.minimumStock) || 0;
                const price = Number(item.unitPrice) || 0;
                const isLowStock = qty <= min;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-gray-900">
                      {item.name}
                      {item.notes && (
                        <span className="block text-xs font-normal text-gray-400 truncate max-w-xs">
                          {item.notes}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.category?.name || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {qty} <span className="text-xs text-gray-500 font-normal">{item.unit}</span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">₹{price.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-500 text-xs">{min} {item.unit}</TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Stock Item" : "Add New Stock Item"}
            </h2>

            {errorMsg && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formItem.name}
                  onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Olive Oil 1L"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Category *</label>
                <select
                  required
                  value={formItem.categoryId}
                  onChange={(e) => setFormItem({ ...formItem, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formItem.quantity}
                    onChange={(e) => setFormItem({ ...formItem, quantity: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formItem.unitPrice}
                    onChange={(e) => setFormItem({ ...formItem, unitPrice: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Unit Type</label>
                  <input
                    type="text"
                    value={formItem.unit}
                    onChange={(e) => setFormItem({ ...formItem, unit: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="pcs / kg / L"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Minimum Stock Threshold</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formItem.minimumStock}
                    onChange={(e) => setFormItem({ ...formItem, minimumStock: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Notes (Optional)</label>
                  <input
                    type="text"
                    value={formItem.notes}
                    onChange={(e) => setFormItem({ ...formItem, notes: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Supplier contact / Shelf 3"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Delete Item?</h3>
            <p className="mt-2 text-xs text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingItem.name}</span> from inventory?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={submitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
