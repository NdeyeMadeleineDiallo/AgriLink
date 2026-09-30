"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  CheckCircle,
  MapPin,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

export default function ExpertsPage() {
  const [user, setUser] = useState<any>(null);
  const [experts, setExperts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadExperts();
  }, []);

  async function loadExperts() {
    try {
      const data = await apiRequest("/experts");
      setExperts(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateExpertStatus(id: number, status: string) {
    try {
      await apiRequest(`/experts/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          is_verified: status === "approved",
        }),
      });

      loadExperts();
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  const filteredExperts = experts.filter((expert) =>
    `${expert.user?.name || ""} ${expert.email_contact || ""} ${
      expert.speciality || ""
    } ${expert.region || ""} ${expert.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const approvedCount = experts.filter(
    (expert) => expert.status === "approved"
  ).length;

  const pendingCount = experts.filter(
    (expert) => expert.status === "pending"
  ).length;

  return (
    <AdminLayout user={user}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            AgriExpert
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Gestion des experts
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Validez, suivez et administrez les profils experts de la plateforme.
          </p>
        </div>
      </div>

      <div className="mb-7 grid gap-5 md:grid-cols-3">
        <StatBox
          icon={<Briefcase size={22} />}
          label="Total experts"
          value={experts.length}
          color="green"
        />
        <StatBox
          icon={<ShieldCheck size={22} />}
          label="Experts approuvés"
          value={approvedCount}
          color="orange"
        />
        <StatBox
          icon={<UserCheck size={22} />}
          label="En attente"
          value={pendingCount}
          color="slate"
        />
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Liste des experts
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {filteredExperts.length} expert(s) affiché(s)
            </p>
          </div>

          <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Rechercher un expert..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Expert
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Spécialité
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Région
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Expérience
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Statut
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredExperts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Aucun expert disponible.
                  </td>
                </tr>
              )}

              {filteredExperts.map((expert) => (
                <tr key={expert.id} className="transition hover:bg-slate-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <ExpertPhoto expert={expert} />

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {expert.user?.name || "Expert"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {expert.email_contact || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Award size={15} className="text-orange-600" />
                      {expert.speciality || "-"}
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-green-700" />
                      {expert.region || "-"}
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    {expert.experience_years
                      ? `${expert.experience_years} ans`
                      : "-"}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={expert.status} />
                  </td>

                  <td className="p-4">
                    <div className="flex min-w-[310px] items-center gap-2">
                      <button
                        onClick={() =>
                          updateExpertStatus(expert.id, "approved")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-200"
                      >
                        <CheckCircle size={15} />
                        Approuver
                      </button>

                      <button
                        onClick={() =>
                          updateExpertStatus(expert.id, "rejected")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-200"
                      >
                        <XCircle size={15} />
                        Rejeter
                      </button>

                      <button
                        onClick={() =>
                          updateExpertStatus(expert.id, "suspended")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        <UserX size={15} />
                        Suspendre
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function ExpertPhoto({ expert }: { expert: any }) {
  if (expert.photo) {
    return (
      <img
        src={`${API_BASE_URL}/storage/${expert.photo}`}
        alt={expert.user?.name || "Expert"}
        className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-lg font-black text-green-700">
      {expert.user?.name?.charAt(0) || "E"}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-orange-100 text-orange-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-slate-200 text-slate-700",
  };

  const labels: any = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    suspended: "Suspendu",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status || "-"}
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
    <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[color]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-black text-slate-500">{label}</p>
    </div>
  );
}