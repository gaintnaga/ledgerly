"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
}

export default function InventoryCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "CAT-001", name: "Dairy & Eggs", slug: "dairy-eggs", description: "Fresh milk, cheese, butter, and farm eggs", itemCount: 14 },
    { id: "CAT-002", name: "Grains & Pulses", slug: "grains-pulses", description: "Rice, wheat, lentils, and flours", itemCount: 28 },
    { id: "CAT-003", name: "Pantry Essentials", slug: "pantry-essentials", description: "Oils, spices, sugar, salt, and condiments", itemCount: 32 },
    { id: "CAT-004", name: "Cleaning Supplies", slug: "cleaning-supplies", description: "Detergents, soaps, and sanitation items", itemCount: 9 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "" });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;

    const slug = newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryToAdd: Category = {
      id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
      name: newCat.name,
      slug,
      description: newCat.description || "General category",
      itemCount: 0,
    };

    setCategories([...categories, categoryToAdd]);
    setIsModalOpen(false);
    setNewCat({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Categories</h1>
          <p className="text-sm text-gray-500">Organize inventory items by custom product categories.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle>{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 mb-3">{cat.description}</p>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>{cat.itemCount} items listed</span>
                <span className="font-mono text-gray-400">/{cat.slug}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category ID</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Product Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-mono text-xs text-gray-500">{cat.id}</TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-white">{cat.name}</TableCell>
              <TableCell className="font-mono text-xs text-indigo-600">{cat.slug}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{cat.description}</TableCell>
              <TableCell className="text-right font-medium">{cat.itemCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="e.g. Frozen Foods"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={3}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Brief description of items in this category..."
                />
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
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
