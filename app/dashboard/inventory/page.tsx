"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockLevel: number;
  minStock: number;
  unitPrice: number;
  unit: string;
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [items, setItems] = useState<InventoryItem[]>([
    { id: "INV-001", name: "Whole Milk 1L", sku: "DRY-001", category: "Dairy", stockLevel: 45, minStock: 10, unitPrice: 65, unit: "bottle" },
    { id: "INV-002", name: "Basmati Rice 5kg", sku: "GRN-002", category: "Grains", stockLevel: 8, minStock: 15, unitPrice: 450, unit: "bag" },
    { id: "INV-003", name: "Sunflower Oil 1L", sku: "OIL-003", category: "Pantry", stockLevel: 24, minStock: 5, unitPrice: 180, unit: "pouch" },
    { id: "INV-004", name: "Whole Wheat Atta 10kg", sku: "GRN-004", category: "Grains", stockLevel: 4, minStock: 10, unitPrice: 380, unit: "bag" },
    { id: "INV-005", name: "Dishwashing Gel 500ml", sku: "CLN-005", category: "Cleaning", stockLevel: 18, minStock: 5, unitPrice: 110, unit: "bottle" },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "Grains",
    stockLevel: 0,
    minStock: 5,
    unitPrice: 0,
    unit: "pcs",
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const itemToAdd: InventoryItem = {
      id: `INV-${String(items.length + 1).padStart(3, "0")}`,
      name: newItem.name,
      sku: newItem.sku || `SKU-${Date.now().toString().slice(-4)}`,
      category: newItem.category,
      stockLevel: Number(newItem.stockLevel),
      minStock: Number(newItem.minStock),
      unitPrice: Number(newItem.unitPrice),
      unit: newItem.unit,
    };

    setItems([itemToAdd, ...items]);
    setIsModalOpen(false);
    setNewItem({ name: "", sku: "", category: "Grains", stockLevel: 0, minStock: 5, unitPrice: 0, unit: "pcs" });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = items.reduce((acc, curr) => acc + curr.stockLevel * curr.unitPrice, 0);
  const lowStockCount = items.filter((item) => item.stockLevel <= item.minStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Stock</h1>
          <p className="text-sm text-gray-500">Manage and track your warehouse and store inventory levels.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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
            <p className="text-xs text-gray-500 mt-1">Unique products tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">Items at or below minimum threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Based on current unit prices</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:w-72 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Grains">Grains</option>
            <option value="Pantry">Pantry</option>
            <option value="Cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU / ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell className="text-center py-6 text-gray-500" colSpan={6}>
                No inventory items found matching filter.
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => {
              const isLowStock = item.stockLevel <= item.minStock;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{item.sku}</TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{item.name}</TableCell>
                  <TableCell>
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.stockLevel} {item.unit}s
                  </TableCell>
                  <TableCell className="font-medium">₹{item.unitPrice}</TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        In Stock
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Stock Item</h2>
            <form onSubmit={handleAddItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="e.g. Olive Oil 1L"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">SKU Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="OIL-009"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.stockLevel}
                    onChange={(e) => setNewItem({ ...newItem, stockLevel: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Unit Type</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="pcs / bag"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
