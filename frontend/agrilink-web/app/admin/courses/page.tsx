"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Edit,
  GraduationCap,
  PlusCircle,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] =
    useState<number | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const data = await apiRequest("/courses");

      const loadedCourses =
        data.data?.data ||
        data.data ||
        data.courses ||
        [];

      setCourses(
        Array.isArray(loadedCourses) ? loadedCourses : []
      );
    } catch (error) {
      console.error("Erreur chargement des cours :", error);
    }
  }

  function askDeleteCourse(courseId: number) {
    setSelectedCourseId(courseId);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteCourse() {
    if (!selectedCourseId) return;

    try {
      await apiRequest(`/courses/${selectedCourseId}`, {
        method: "DELETE",
      });

      setCourses((previous) =>
        previous.filter(
          (course) => course.id !== selectedCourseId
        )
      );

      setDeleteModalOpen(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.error(
        "Erreur suppression du cours :",
        error
      );

      alert("Erreur lors de la suppression du cours.");
    }
  }

  if (!user) return null;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCourses = courses.filter((course) =>
    `${course.title || ""} ${course.level || ""} ${
      course.status || ""
    }`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const publishedCount = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "draft"
  ).length;

  return (
    <AdminLayout user={user}>
      <div className="w-full min-w-0 overflow-x-hidden">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Gestion des cours
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Créez, organisez et administrez toutes les
              formations disponibles sur AgriLink.
            </p>
          </div>

          <Link
            href="/admin/courses/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:bg-green-700 xl:self-auto"
          >
            <PlusCircle size={18} />
            Créer un cours
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatBox
            icon={<BookOpen size={20} />}
            label="Total cours"
            value={courses.length}
            color="green"
          />

          <StatBox
            icon={<GraduationCap size={20} />}
            label="Cours publiés"
            value={publishedCount}
            color="orange"
          />

          <StatBox
            icon={<Clock size={20} />}
            label="Brouillons"
            value={draftCount}
            color="slate"
          />
        </div>

        <div className="min-w-0 rounded-[24px] border border-slate-100 bg-white p-4 shadow-md shadow-slate-200/60 md:p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Liste des formations
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {filteredCourses.length} cours affiché
                {filteredCourses.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 lg:w-72">
              <Search
                size={18}
                className="shrink-0 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Rechercher un cours..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Seul ce conteneur peut défiler horizontalement */}
          <div className="w-full min-w-0 overflow-hidden rounded-[20px] border border-slate-100">
  <table className="w-full table-fixed">
              <colgroup>
  <col className="w-[27%]" />
  <col className="w-[14%]" />
  <col className="w-[11%]" />
  <col className="w-[15%]" />
  <col className="w-[13%]" />
  <col className="w-[20%]" />
</colgroup>

              <thead className="bg-slate-50">
                <tr>
                  <TableHead>Formation</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCourses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-500"
                    >
                      Aucun cours disponible.
                    </td>
                  </tr>
                )}

                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-3 py-4 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        {course.thumbnail ? (
                          <div className="h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                            <img
                              src={getCourseThumbnailUrl(
                                course.thumbnail
                              )}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                            <BookOpen size={19} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {course.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            Formation AgriAcademy
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 align-middle">
                      <span className="inline-flex max-w-full truncate rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {course.level || "-"}
                      </span>
                    </td>

                    <td className="p-4 align-middle text-sm font-semibold text-slate-700">
                      {formatDuration(course.duration)}
                    </td>

                    <td className="px-3 py-4 align-middle text-sm font-semibold text-slate-700">
  <span className="block">
    {Number(course.price || 0).toLocaleString("fr-FR")}
  </span>
  <span className="text-xs font-medium text-slate-400">
    FCFA
  </span>
</td>

                    <td className="px-3 py-4 align-middle">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {course.status === "published"
                          ? "Publié"
                          : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-3 py-4 align-middle">
  <div className="flex items-center gap-2">
    <Link
      href={`/admin/courses/${course.id}/edit`}
      title="Modifier le cours"
      aria-label={`Modifier ${course.title}`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
    >
      <Edit size={16} />
    </Link>

    <Link
      href={`/admin/courses/${course.id}/lessons/create`}
      title="Ajouter une leçon"
      aria-label={`Ajouter une leçon à ${course.title}`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200"
    >
      <Video size={16} />
    </Link>

    <button
      type="button"
      onClick={() => askDeleteCourse(course.id)}
      title="Supprimer le cours"
      aria-label={`Supprimer ${course.title}`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
    >
      <Trash2 size={16} />
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Supprimer ce cours ?"
        message="Cette action supprimera le cours sélectionné. Cette opération est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteCourse}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCourseId(null);
        }}
      />
    </AdminLayout>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-3 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">
      {children}
    </th>
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
    <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function getCourseThumbnailUrl(path: string): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = String(path)
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
}

function formatDuration(
  duration: string | number | null
): string {
  const totalMinutes = Number(duration || 0);

  if (totalMinutes <= 0) return "-";

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}