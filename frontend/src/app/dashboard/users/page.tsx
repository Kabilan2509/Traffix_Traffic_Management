"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Mail,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type UserRole = "Super Admin" | "Traffic Engineer" | "Traffic Operator" | "Emergency Authority";
type UserStatus = "Active" | "Suspended";

interface AuthorityUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  zone: string;
  status: UserStatus;
  createdAt?: string;
}

const emptyForm = {
  name: "",
  email: "",
  role: "Traffic Operator" as UserRole,
  zone: "",
  status: "Active" as UserStatus,
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [users, setUsers] = useState<AuthorityUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (fetchError) {
        console.error("Failed to load users", fetchError);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = roleFilter === "All" || user.role === roleFilter;
      const query = search.toLowerCase();
      const textMatch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.userId.toLowerCase().includes(query) ||
        user.zone.toLowerCase().includes(query);

      return roleMatch && textMatch;
    });
  }, [users, roleFilter, search]);

  async function handleAddUser() {
    setMessage(null);
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.zone.trim()) {
      setError("Name, email, and zone are required.");
      return;
    }

    setSaving(true);

    try {
      const actor = localStorage.getItem("traffix_role") || "Super Admin";
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          actor: "Traffix Admin",
          actorRole: actor,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to create user.");
      }

      setUsers((current) => [data.user, ...current]);
      setForm(emptyForm);
      setShowForm(false);
      setMessage(`User ${data.user.name} added successfully with ID ${data.user.userId}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">User Access Management</h1>
            <p className="text-sm text-slate-400">Manage authority accounts, roles, and operational zones</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/20 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> {showForm ? "Close Form" : "Add User"}
        </button>
      </div>

      {message && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-slate-700/50 rounded-2xl p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              placeholder="Full name"
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              placeholder="Official email"
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              value={form.zone}
              onChange={(e) => setForm((current) => ({ ...current, zone: e.target.value }))}
              placeholder="Assigned zone"
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((current) => ({ ...current, role: e.target.value as UserRole }))}
              className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Traffic Engineer">Traffic Engineer</option>
              <option value="Traffic Operator">Traffic Operator</option>
              <option value="Emergency Authority">Emergency Authority</option>
            </select>
            <div className="flex gap-3">
              <select
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value as UserStatus }))}
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
              <button
                onClick={handleAddUser}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Total Accounts</p>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{users.filter((u) => u.status === "Active").length}</p>
        </div>
        <div className="glass-panel border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Privileged Roles</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{users.filter((u) => u.role === "Super Admin" || u.role === "Emergency Authority").length}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, ID, or zone"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Traffic Engineer">Traffic Engineer</option>
            <option value="Traffic Operator">Traffic Operator</option>
            <option value="Emergency Authority">Emergency Authority</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-3">Authority</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Zone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 bg-slate-900/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{user.userId}</p>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs">
                      <Shield className="w-3 h-3" /> {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> {user.zone}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-slate-400 font-mono">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Now"}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No accounts match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
