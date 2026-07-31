"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    inventory: number;
  };
}

export default function InventoryCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formCat, setFormCat] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormCat({ name: "", description: "" });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormCat({ name: cat.name, description: cat.description || "" });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCat.name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const isEditing = !!editingCategory;
      const url = isEditing ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formCat.name.trim(),
          description: formCat.description.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchCategories();
        setIsModalOpen(false);
        setFormCat({ name: "", description: "" });
      } else {
        setErrorMsg(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        await fetchCategories();
        setDeletingCategory(null);
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProductsCount = categories.reduce(
    (acc, cat) => acc + (cat._count?.inventory ?? 0),
    0
  );

  const categoriesWithItems = categories.filter(
    (cat) => (cat._count?.inventory ?? 0) > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Categories</h1>
          <p className="text-sm text-gray-500">
            Manage and organize your product inventory categories.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{categories.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active category classifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories with Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{categoriesWithItems}</div>
            <p className="text-xs text-gray-500 mt-1">Containing 1 or more products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Linked Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalProductsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Across all inventory categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex h-48 items-center justify-center bg-white rounded-xl border border-gray-200">
          <LoadingSpinner />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
          <p className="text-sm font-medium text-gray-900">No categories found</p>
          <p className="mt-1 text-xs text-gray-500">
            {searchQuery ? "Try matching a different name or description." : "Use the button above to add a new category."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Products Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((cat) => {
              const count = cat._count?.inventory ?? 0;
              return (
                <TableRow key={cat.id}>
                  <TableCell className="font-semibold text-gray-900">{cat.name}</TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                    {cat.description || <span className="text-gray-400 italic">No description</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            {errorMsg && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formCat.name}
                  onChange={(e) => setFormCat({ ...formCat, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Dairy & Eggs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={formCat.description}
                  onChange={(e) => setFormCat({ ...formCat, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Brief description of products in this category..."
                />
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
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Delete Category?</h3>
            <p className="mt-2 text-xs text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingCategory.name}</span>?
              {(deletingCategory._count?.inventory ?? 0) > 0 && (
                <span className="mt-1 block text-amber-600 font-medium">
                  Warning: This category currently has {deletingCategory._count?.inventory} inventory item(s) attached.
                </span>
              )}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
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
