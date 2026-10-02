"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

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

  const filteredUsers = users.filter((item) => {
    const role = item.roles?.[0]?.name || "apprenant";

    return `${item.name || ""} ${item.email || ""} ${item.phone || ""} ${role} ${
      item.status || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const activeCount = users.filter((item) => item.status === "active").length;
  const adminCount = users.filter((item) =>
    ["admin", "super_admin"].includes(item.roles?.[0]?.name)
  ).length;

  return (
    <AdminLayout user={user}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-700">
            Utilisateurs
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Gestion des utilisateurs
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Gérez les comptes, les rôles et les statuts des utilisateurs AgriLink.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatBox
          icon={<Users size={22} />}
          label="Total utilisateurs"
          value={users.length}
          color="green"
        />
        <StatBox
          icon={<UserCheck size={22} />}
          label="Comptes actifs"
          value={activeCount}
          color="orange"
        />
        <StatBox
          icon={<ShieldCheck size={22} />}
          label="Administrateurs"
          value={adminCount}
          color="slate"
        />
      </div>

      {message && (
        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Liste des utilisateurs
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {filteredUsers.length} utilisateur(s) affiché(s)
            </p>
          </div>

          <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-[24px] border border-slate-100">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Utilisateur
                </th>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Téléphone
                </th>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Rôle actuel
                </th>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Changer rôle
                </th>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Statut
                </th>
                <th className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Changer statut
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Aucun utilisateur disponible.
                  </td>
                </tr>
              )}

              {filteredUsers.map((item) => {
                const currentRole = item.roles?.[0]?.name || "apprenant";
                const currentStatus = item.status || "active";

                return (
                  <tr key={item.id} className="transition hover:bg-slate-50/80">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-lg font-black text-green-700">
                          {item.name?.charAt(0) || "U"}
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-sm font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-slate-500" />
                        {item.phone || "-"}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <RoleBadge role={currentRole} />
                    </td>

                    <td className="px-3 py-3">
                      <select
                        value={currentRole}
                        onChange={(e) => updateRole(item.id, e.target.value)}
                        className="h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold outline-none focus:border-green-500"
                      >
                        <option value="apprenant">Apprenant</option>
                        <option value="vendeur">Vendeur</option>
                        <option value="expert">Expert</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>

                    <td className="px-3 py-3">
                      <StatusBadge status={currentStatus} />
                    </td>

                    <td className="px-3 py-3">
                      <select
                        value={currentStatus}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-green-500"
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
      </div>
    </AdminLayout>
  );
}

function RoleBadge({ role }: { role: string }) {
  const labels: any = {
    apprenant: "Apprenant",
    vendeur: "Vendeur",
    expert: "Expert",
    admin: "Admin",
    super_admin: "Super Admin",
  };

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
      <ShieldCheck size={14} />
      {labels[role] || role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-slate-100 text-slate-600",
    suspended: "bg-red-100 text-red-700",
  };

  const labels: any = {
    active: "Actif",
    inactive: "Inactif",
    suspended: "Suspendu",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status === "active" ? <UserCheck size={14} /> : <UserX size={14} />}
      {labels[status] || status}
    </span>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "green" | "orange" | "slate";
}) {
  const styles = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };

 return (
  <div className="flex min-h-[105px] items-center gap-4 rounded-[20px] border border-slate-100 bg-white p-4 shadow-md shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles[color]}`}
    >
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-2xl font-bold leading-none text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  </div>
);
}
