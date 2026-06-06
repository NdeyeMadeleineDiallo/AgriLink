"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Trash2, Users } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function AdminCohortsPage() {
  const [user, setUser] = useState<any>(null);
  const [cohorts, setCohorts] = useState<any[]>([]);
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

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Gestion des cohortes
          </h1>
          <p className="mt-2 text-slate-500">
            Gérez les promotions et groupes d’apprenants AgriAcademy.
          </p>
        </div>

        <Link
          href="/admin/cohorts/create"
          className="btn-primary inline-flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Créer une cohorte
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Début</th>
              <th className="p-4 text-left">Fin</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cohorts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Aucune cohorte disponible.
                </td>
              </tr>
            )}

            {cohorts.map((cohort) => (
              <tr key={cohort.id} className="border-t">
                <td className="p-4 font-bold text-slate-900">{cohort.name}</td>
                <td className="p-4">
                  {cohort.start_date
                    ? new Date(cohort.start_date).toLocaleDateString("fr-FR")
                    : "-"}
                </td>
                <td className="p-4">
                  {cohort.end_date
                    ? new Date(cohort.end_date).toLocaleDateString("fr-FR")
                    : "-"}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {cohort.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/cohorts/${cohort.id}/edit`}
                      className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                    >
                      Modifier
                    </Link>

                    <Link
                      href={`/admin/cohorts/${cohort.id}/users`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-green-100 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-200"
                    >
                      <Users size={16} />
                      Apprenants
                    </Link>

                    <button
                      onClick={() => askDeleteCohort(cohort.id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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