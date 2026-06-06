"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, PlusCircle, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function CohortUsersPage() {
  const params = useParams();
  const cohortId = params.id;

  const [user, setUser] = useState<any>(null);
  const [cohort, setCohort] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState("");
  const [roleInCohort, setRoleInCohort] = useState("participant");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadData();
  }, []);

  async function loadData() {
    try {
      const cohortData = await apiRequest(`/cohorts/${cohortId}`);
      const usersData = await apiRequest(`/cohorts/${cohortId}/users`);
      const availableUsersData = await apiRequest("/admin/users");

      setCohort(cohortData.cohort);
      setStudents(usersData.users || []);
      setAvailableUsers(availableUsersData.users || []);

    } catch (error) {
      console.error(error);
    }
  }

  async function enrollUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("Veuillez saisir l’ID de l’apprenant.");
      return;
    }

    try {
      await apiRequest(`/cohorts/${cohortId}/enroll`, {
        method: "POST",
        body: JSON.stringify({
          user_id: Number(userId),
          role_in_cohort: roleInCohort,
        }),
      });

      setMessage("Apprenant inscrit avec succès.");
      setUserId("");
      setRoleInCohort("participant");
      loadData();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de l’inscription.");
    }
  }

  function askRemoveUser(studentId: number) {
    setSelectedUserId(studentId);
    setDeleteModalOpen(true);
  }

  async function confirmRemoveUser() {
    if (!selectedUserId) return;

    try {
      await apiRequest(`/cohorts/${cohortId}/users/${selectedUserId}`, {
        method: "DELETE",
      });

      setStudents((prev) =>
        prev.filter((student) => student.id !== selectedUserId)
      );

      setDeleteModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du retrait de l’apprenant.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Apprenants de la cohorte
          </h1>

          <p className="mt-2 text-slate-500">
            {cohort ? cohort.name : "Gestion des inscrits de la cohorte."}
          </p>
        </div>

        <Link href="/admin/cohorts" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour aux cohortes
        </Link>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Users />
          </div>

          <p className="mt-5 text-3xl font-black text-slate-950">
            {students.length}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Apprenants inscrits
          </p>
        </div>

        <form onSubmit={enrollUser} className="card p-6 lg:col-span-2">
          <h2 className="text-xl font-black text-slate-950">
            Inscrire un apprenant
          </h2>

          {message && (
            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <select
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
>
  <option value="">Choisir un apprenant</option>
  {availableUsers.map((availableUser) => (
    <option key={availableUser.id} value={availableUser.id}>
      {availableUser.name} - {availableUser.email}
    </option>
  ))}
</select>

            <select
              value={roleInCohort}
              onChange={(e) => setRoleInCohort(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="participant">Participant</option>
              <option value="assistant">Assistant</option>
              <option value="coach">Coach</option>
            </select>

            <button className="btn-primary inline-flex items-center justify-center gap-2">
              <PlusCircle size={18} />
              Inscrire
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Téléphone</th>
              <th className="p-4 text-left">Rôle cohorte</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Aucun apprenant inscrit.
                </td>
              </tr>
            )}

            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-4 font-bold text-slate-900">
                  {student.name}
                </td>

                <td className="p-4 text-slate-600">
                  {student.email}
                </td>

                <td className="p-4 text-slate-600">
                  {student.phone || "-"}
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {student.pivot?.role_in_cohort || "participant"}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => askRemoveUser(student.id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Retirer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Retirer cet apprenant ?"
        message="Cette action retirera l’apprenant de la cohorte sélectionnée."
        confirmText="Oui, retirer"
        cancelText="Annuler"
        onConfirm={confirmRemoveUser}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </AdminLayout>
  );
}