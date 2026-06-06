"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function AdminEnrollmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    user_id: "",
    course_id: "",
    status: "active",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);

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
      const enrollmentsData = await apiRequest("/enrollments");
      const usersData = await apiRequest("/admin/users");
      const coursesData = await apiRequest("/courses");

      setEnrollments(enrollmentsData.data || []);
      setUsers(usersData.users || []);
      setCourses(coursesData.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.user_id || !form.course_id) {
      setMessage("Veuillez choisir un apprenant et un cours.");
      return;
    }

    try {
      await apiRequest("/enrollments", {
        method: "POST",
        body: JSON.stringify({
          user_id: Number(form.user_id),
          course_id: Number(form.course_id),
          status: form.status,
        }),
      });

      setMessage("Apprenant inscrit au cours avec succès.");
      setForm({
        user_id: "",
        course_id: "",
        status: "active",
      });

      loadData();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de l’inscription.");
    }
  }

  function askDeleteEnrollment(enrollment: any) {
    setSelectedEnrollment(enrollment);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteEnrollment() {
    if (!selectedEnrollment) return;

    try {
      await apiRequest(
        `/courses/${selectedEnrollment.course_id}/users/${selectedEnrollment.user_id}`,
        {
          method: "DELETE",
        }
      );

      setEnrollments((prev) =>
        prev.filter((item) => item.id !== selectedEnrollment.id)
      );

      setDeleteModalOpen(false);
      setSelectedEnrollment(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la désinscription.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950">
          Inscriptions aux cours
        </h1>
        <p className="mt-2 text-slate-500">
          Inscrivez les apprenants aux formations AgriAcademy.
        </p>
      </div>

      <form onSubmit={handleEnroll} className="card mb-8 p-6">
        <h2 className="text-xl font-black text-slate-950">
          Nouvelle inscription
        </h2>

        {message && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <select
            value={form.user_id}
            onChange={(e) => updateField("user_id", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="">Choisir un apprenant</option>
            {users.map((availableUser) => (
              <option key={availableUser.id} value={availableUser.id}>
                {availableUser.name} - {availableUser.email}
              </option>
            ))}
          </select>

          <select
            value={form.course_id}
            onChange={(e) => updateField("course_id", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="">Choisir un cours</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <button className="btn-primary inline-flex items-center justify-center gap-2">
            <PlusCircle size={18} />
            Inscrire
          </button>
        </div>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Apprenant</th>
              <th className="p-4 text-left">Cours</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Date inscription</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Aucune inscription disponible.
                </td>
              </tr>
            )}

            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="border-t">
                <td className="p-4 font-bold text-slate-900">
                  {enrollment.user?.name || "-"}
                  <p className="text-sm font-normal text-slate-500">
                    {enrollment.user?.email}
                  </p>
                </td>

                <td className="p-4 text-slate-700">
                  {enrollment.course?.title || "-"}
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {enrollment.status}
                  </span>
                </td>

                <td className="p-4 text-slate-600">
                  {enrollment.enrolled_at
                    ? new Date(enrollment.enrolled_at).toLocaleDateString("fr-FR")
                    : "-"}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => askDeleteEnrollment(enrollment)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Désinscrire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Désinscrire cet apprenant ?"
        message="Cette action retirera l’apprenant du cours sélectionné."
        confirmText="Oui, désinscrire"
        cancelText="Annuler"
        onConfirm={confirmDeleteEnrollment}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedEnrollment(null);
        }}
      />
    </AdminLayout>
  );
}