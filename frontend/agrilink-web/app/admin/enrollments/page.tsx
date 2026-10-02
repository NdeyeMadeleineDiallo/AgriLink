"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
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

export default function AdminEnrollmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

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

  const filteredEnrollments = enrollments.filter((enrollment) =>
    `${enrollment.user?.name || ""} ${enrollment.user?.email || ""} ${
      enrollment.course?.title || ""
    } ${enrollment.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = enrollments.filter(
    (enrollment) => enrollment.status === "active"
  ).length;

  return (
    <AdminLayout user={user}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-700">
            AgriAcademy
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Inscriptions aux cours
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Inscrivez les apprenants aux formations et suivez les accès aux cours.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatBox
          icon={<Users size={22} />}
          label="Total inscriptions"
          value={enrollments.length}
          color="green"
        />
        <StatBox
          icon={<UserCheck size={22} />}
          label="Inscriptions actives"
          value={activeCount}
          color="orange"
        />
        <StatBox
          icon={<BookOpen size={22} />}
          label="Cours disponibles"
          value={courses.length}
          color="slate"
        />
      </div>

      <form
        onSubmit={handleEnroll}
        className="mb-7 rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Nouvelle inscription
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Associez rapidement un apprenant à un cours.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-black text-white shadow-md shadow-green-200 transition hover:bg-green-700">
            <PlusCircle size={18} />
            Inscrire
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <select
            value={form.user_id}
            onChange={(e) => updateField("user_id", e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500"
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
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500"
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
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-green-500"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </form>

      <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Liste des inscriptions
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {filteredEnrollments.length} inscription(s) affichée(s)
            </p>
          </div>

          <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
            <Search size={20} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Apprenant
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Cours
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Statut
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Date inscription
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Aucune inscription disponible.
                  </td>
                </tr>
              )}

              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="transition hover:bg-slate-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                        <GraduationCap size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {enrollment.user?.name || "-"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {enrollment.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    {enrollment.course?.title || "-"}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      {enrollment.status}
                    </span>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-600">
                    {enrollment.enrolled_at
                      ? new Date(enrollment.enrolled_at).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => askDeleteEnrollment(enrollment)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-200"
                    >
                      <Trash2 size={15} />
                      Désinscrire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
