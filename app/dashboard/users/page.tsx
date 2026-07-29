"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";

interface UserMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  provider: "CREDENTIALS" | "GOOGLE";
  joinedDate: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserMember[]>([
    { id: "USR-001", name: "Amit Kumar", email: "amit@ledgerly.com", role: "ADMIN", provider: "CREDENTIALS", joinedDate: "2026-01-15" },
    { id: "USR-002", name: "Rahul Sharma", email: "rahul@ledgerly.com", role: "USER", provider: "GOOGLE", joinedDate: "2026-02-10" },
    { id: "USR-003", name: "Priya Patel", email: "priya@ledgerly.com", role: "USER", provider: "CREDENTIALS", joinedDate: "2026-03-04" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "USER" as "ADMIN" | "USER" });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: UserMember = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      provider: "CREDENTIALS",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, userToAdd]);
    setIsModalOpen(false);
    setNewUser({ name: "", email: "", role: "USER" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team & Users</h1>
          <p className="text-sm text-gray-500">Manage system members, roles, and authorization access.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          + Add Team Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{users.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active ledger accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role === "ADMIN").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Full management access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standard Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {users.filter((u) => u.role === "USER").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Standard purchase & split logging</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Auth Provider</TableHead>
            <TableHead>Joined Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-white">{user.name}</TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-xs font-mono text-gray-500">{user.provider}</TableCell>
              <TableCell className="text-sm text-gray-500">{user.joinedDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Team Member</h2>
            <form onSubmit={handleAddUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="e.g. Sanya Verma"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="sanya@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "ADMIN" | "USER" })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="USER">USER - Standard Access</option>
                  <option value="ADMIN">ADMIN - Full Access</option>
                </select>
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
