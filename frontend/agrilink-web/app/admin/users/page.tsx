"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserCheck, UserX } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await apiRequest("/admin/users");
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateRole(userId: number, role: string) {
    setMessage("");

    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      setMessage("Rôle utilisateur mis à jour avec succès.");
      loadUsers();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors du changement de rôle.");
    }
  }

  async function updateStatus(userId: number, status: string) {
    setMessage("");

    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setMessage("Statut utilisateur mis à jour avec succès.");
      loadUsers();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors du changement de statut.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950">
          Gestion des utilisateurs
        </h1>
        <p className="mt-2 text-slate-500">
          Gérez les comptes, les rôles et les statuts des utilisateurs AgriLink.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
          {message}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Utilisateur</th>
              <th className="p-4 text-left">Téléphone</th>
              <th className="p-4 text-left">Rôle actuel</th>
              <th className="p-4 text-left">Changer rôle</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Changer statut</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Aucun utilisateur disponible.
                </td>
              </tr>
            )}

            {users.map((item) => {
              const currentRole = item.roles?.[0]?.name || "apprenant";
              const currentStatus = item.status || "active";

              return (
                <tr key={item.id} className="border-t">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.email}</p>
                  </td>

                  <td className="p-4 text-slate-600">
                    {item.phone || "-"}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      <ShieldCheck size={14} />
                      {currentRole}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={currentRole}
                      onChange={(e) => updateRole(item.id, e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                    >
                      <option value="apprenant">Apprenant</option>
                      <option value="vendeur">Vendeur</option>
                      <option value="expert">Expert</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                        currentStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : currentStatus === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {currentStatus === "active" ? (
                        <UserCheck size={14} />
                      ) : (
                        <UserX size={14} />
                      )}
                      {currentStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={currentStatus}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}