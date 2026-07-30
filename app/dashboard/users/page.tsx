"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table";
import UserAvatar from "@/app/components/ui/UserAvatar";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface UserMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  provider: "CREDENTIALS" | "GOOGLE";
  profileImage?: string | null;
  isActive: boolean;
  approvedAt?: string | null;
  lastLogin?: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "USER" as "ADMIN" | "USER",
    isActive: true,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentRole(data.user.role);
          if (data.user.role === "ADMIN") {
            fetchUsers();
          }
        }
      }
    } catch (error) {
      console.error("Error checking user access:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setActionLoadingId(userId);
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update user status");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                isActive: data.user.isActive,
                approvedAt: data.user.approvedAt ?? u.approvedAt,
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Something went wrong while updating user status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(userId);
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete user.");
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      alert(`User "${userName}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Something went wrong while deleting the user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: UserMember = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      provider: "CREDENTIALS",
      isActive: newUser.isActive,
      createdAt: new Date().toISOString(),
    };

    setUsers([userToAdd, ...users]);
    setIsModalOpen(false);
    setNewUser({ name: "", email: "", role: "USER", isActive: true });
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Never";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loadingProfile) {
    return <LoadingSpinner label="Checking permissions & loading users..." fullPage size="lg" />;
  }

  if (currentRole !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 mb-4">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Only administrators have permission to view team member management and authorization access.
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team & Users</h1>
          <p className="text-sm text-gray-500">
            Manage ledger members, activate/deactivate accounts, and control system access.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          + Add Team Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{users.length}</div>
            <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {users.filter((u) => u.isActive).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Authorized & active</p>
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
            <div className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "USER").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Standard purchase access</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Auth Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Loading users...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                {/* User Name & Profile Image */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={user.name}
                      profileImage={user.profileImage}
                      role={user.role}
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="font-mono text-[10px] text-gray-400">
                        {user.id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                  {user.email}
                </TableCell>

                {/* Role */}
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

                {/* Auth Provider */}
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {user.provider === "GOOGLE" ? (
                      <span className="rounded bg-rose-100 px-2 py-0.5 font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                        Google
                      </span>
                    ) : (
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Credentials
                      </span>
                    )}
                  </span>
                </TableCell>

                {/* Status (isActive) */}
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.isActive ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {user.isActive ? "Active" : "Pending"}
                  </span>
                </TableCell>

                {/* Last Login */}
                <TableCell className="text-sm text-gray-500">
                  {formatDate(user.lastLogin)}
                </TableCell>

                {/* Joined Date */}
                <TableCell className="text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle Active Status */}
                    <button
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      disabled={actionLoadingId === user.id}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        user.isActive
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                      }`}
                    >
                      {actionLoadingId === user.id
                        ? "Updating..."
                        : user.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    {/* Delete User */}
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={actionLoadingId === user.id}
                      className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition"
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
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

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Account Status</label>
                <select
                  value={newUser.isActive ? "active" : "pending"}
                  onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value === "active" })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending Approval</option>
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
