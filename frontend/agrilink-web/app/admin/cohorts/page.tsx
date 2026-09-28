"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Edit,
  Layers,
  PlusCircle,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function AdminCohortsPage() {
  const [user, setUser] = useState<any>(null);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCohorts();
  }, []);

  async function loadCohorts() {
    try {
      const data = await apiRequest("/cohorts");
      setCohorts(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function askDeleteCohort(cohortId: number) {
    setSelectedCohortId(cohortId);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteCohort() {
    if (!selectedCohortId) return;

    try {
      await apiRequest(`/cohorts/${selectedCohortId}`, {
        method: "DELETE",
      });

      setCohorts((prev) =>
        prev.filter((cohort) => cohort.id !== selectedCohortId)
      );

      setDeleteModalOpen(false);
      setSelectedCohortId(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression de la cohorte.");
    }
  }

  if (!user) return null;

  const filteredCohorts = cohorts.filter((cohort) =>
    `${cohort.name || ""} ${cohort.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = cohorts.filter((cohort) => cohort.status === "active").length;

  return (
    <AdminLayout user={user}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            AgriAcademy
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Gestion des cohortes
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Gérez les promotions, les groupes d’apprenants et les sessions de formation.
          </p>
        </div>

        <Link
          href="/admin/cohorts/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
        >
          <PlusCircle size={20} />
          Créer une cohorte
        </Link>
      </div>

      <div className="mb-7 grid gap-5 md:grid-cols-3">
        <StatBox
          icon={<Layers size={22} />}
          label="Total cohortes"
          value={cohorts.length}
          color="green"
        />
        <StatBox
          icon={<UserCheck size={22} />}
          label="Cohortes actives"
          value={activeCount}
          color="orange"
        />
        <StatBox
          icon={<CalendarDays size={22} />}
          label="Sessions planifiées"
          value={cohorts.length}
          color="slate"
        />
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Liste des cohortes
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {filteredCohorts.length} cohorte(s) affichée(s)
            </p>
          </div>

          <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
            <Search size={20} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une cohorte..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Cohorte
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Début
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Fin
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
              {filteredCohorts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Aucune cohorte disponible.
                  </td>
                </tr>
              )}

              {filteredCohorts.map((cohort) => (
                <tr key={cohort.id} className="transition hover:bg-slate-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                        <Layers size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {cohort.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Groupe de formation
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    {cohort.start_date
                      ? new Date(cohort.start_date).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    {cohort.end_date
                      ? new Date(cohort.end_date).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      {cohort.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex min-w-[330px] items-center gap-2">
                      <Link
                        href={`/admin/cohorts/${cohort.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        <Edit size={15} />
                        Modifier
                      </Link>

                      <Link
                        href={`/admin/cohorts/${cohort.id}/users`}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-200"
                      >
                        <Users size={15} />
                        Apprenants
                      </Link>

                      <button
                        onClick={() => askDeleteCohort(cohort.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-200"
                      >
                        <Trash2 size={15} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Supprimer cette cohorte ?"
        message="Cette action supprimera la cohorte sélectionnée. Cette opération est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteCohort}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCohortId(null);
        }}
      />
    </AdminLayout>
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