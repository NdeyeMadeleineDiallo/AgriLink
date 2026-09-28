"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileVideo,
  HelpCircle,
  Layers3,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

export default function AdminLessonsPage() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      setLoading(true);

      const coursesData = await apiRequest("/courses");

      const allCourses =
        coursesData.data?.data ||
        coursesData.data ||
        coursesData.courses ||
        [];

      const courses = Array.isArray(allCourses) ? allCourses : [];

      const lessonResponses = await Promise.allSettled(
        courses.map(async (course: any) => {
          const lessonsData = await apiRequest(
            `/courses/${course.id}/lessons`
          );

          const courseLessons =
            lessonsData.lessons ||
            lessonsData.data ||
            [];

          return (Array.isArray(courseLessons) ? courseLessons : []).map(
            (lesson: any) => ({
              ...lesson,
              course_title: course.title,
              course_id: course.id,
            })
          );
        })
      );

      const allLessons = lessonResponses.flatMap((result) =>
        result.status === "fulfilled" ? result.value : []
      );

      setLessons(allLessons);
    } catch (error) {
      console.error("Erreur chargement des leçons :", error);
    } finally {
      setLoading(false);
    }
  }

  function askDeleteLesson(lessonId: number) {
    setSelectedLessonId(lessonId);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteLesson() {
    if (!selectedLessonId) return;

    try {
      await apiRequest(`/lessons/${selectedLessonId}`, {
        method: "DELETE",
      });

      setLessons((previous) =>
        previous.filter((lesson) => lesson.id !== selectedLessonId)
      );

      setDeleteModalOpen(false);
      setSelectedLessonId(null);
    } catch (error) {
      console.error("Erreur suppression de la leçon :", error);
    }
  }

  if (!user) return null;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredLessons = lessons.filter((lesson) =>
    `${lesson.title || ""} ${lesson.course_title || ""}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const videoCount = lessons.filter(
    (lesson) =>
      lesson.video_file ||
      lesson.video_url ||
      lesson.video_path
  ).length;

  const pdfCount = lessons.filter(
    (lesson) =>
      lesson.pdf_file ||
      lesson.pdf_path
  ).length;

  return (
    <AdminLayout user={user}>
      <div className="w-full min-w-0">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Gestion des leçons
            </h1>

            <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
              Organisez les leçons et gérez leurs ressources vidéo et PDF.
            </p>
          </div>

          <Link
            href="/admin/lessons/create"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-green-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-md shadow-green-200 transition hover:bg-green-700 lg:self-auto"
          >
            <PlusCircle size={20} />
            Créer une leçon
          </Link>
        </div>

        {/* STATISTIQUES */}
        <div className="mb-7 grid gap-5 sm:grid-cols-3">
          <StatBox
            icon={<Layers3 size={22} />}
            label="Total leçons"
            value={lessons.length}
            color="green"
          />

          <StatBox
            icon={<Video size={22} />}
            label="Avec vidéo"
            value={videoCount}
            color="orange"
          />

          <StatBox
            icon={<FileText size={22} />}
            label="Avec PDF"
            value={pdfCount}
            color="slate"
          />
        </div>

        {/* LISTE */}
        <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50 md:p-6">

          {/* EN-TÊTE LISTE */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Liste des leçons
              </h2>

              <p className="mt-1 text-[14px] text-slate-500">
                {filteredLessons.length} leçon
                {filteredLessons.length > 1 ? "s" : ""} affichée
                {filteredLessons.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
              <Search
                size={20}
                className="shrink-0 text-slate-400"
              />

              <input
                placeholder="Rechercher une leçon..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-10 text-center text-[15px] text-slate-500">
              Chargement des leçons...
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-[20px] border border-slate-100">
              <table className="w-full table-fixed">

                <colgroup>
  <col className="w-[25%]" />
  <col className="w-[19%]" />
  <col className="w-[9%]" />
  <col className="w-[11%]" />
  <col className="w-[11%]" />
  <col className="w-[25%]" />
</colgroup>

                <thead className="bg-slate-50">
                  <tr>
                    <TableHead>Leçon</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Vidéo</TableHead>
                    <TableHead>PDF</TableHead>
                    <TableHead>Actions</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">

                  {filteredLessons.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-12 text-center text-[15px] text-slate-500"
                      >
                        Aucune leçon trouvée.
                      </td>
                    </tr>
                  )}

                  {filteredLessons.map((lesson) => {
                    const hasVideo = Boolean(
                      lesson.video_file ||
                        lesson.video_url ||
                        lesson.video_path
                    );

                    const hasPdf = Boolean(
                      lesson.pdf_file ||
                        lesson.pdf_path
                    );

                    return (
                      <tr
                        key={lesson.id}
                        className="transition hover:bg-slate-50/70"
                      >

                        {/* LEÇON */}
                        <td className="px-4 py-5 align-middle">
                          <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                              <FileVideo size={21} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-bold text-slate-900">
                                {lesson.title}
                              </p>

                              <p className="mt-1 truncate text-[13px] text-slate-400">
                                Leçon AgriAcademy
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* COURS */}
                        <td className="px-4 py-5 align-middle">
                          <p className="truncate text-[15px] font-semibold text-slate-700">
                            {lesson.course_title || "-"}
                          </p>
                        </td>

                        {/* ORDRE */}
                        <td className="px-4 py-5 align-middle">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                            {lesson.position || "-"}
                          </div>
                        </td>

                        {/* VIDÉO */}
                        <td className="px-4 py-5 align-middle">
                          <AvailabilityBadge
                            available={hasVideo}
                            icon={<Video size={15} />}
                          />
                        </td>

                        {/* PDF */}
                        <td className="px-4 py-5 align-middle">
                          <AvailabilityBadge
                            available={hasPdf}
                            icon={<FileText size={15} />}
                          />
                        </td>

                        {/* ACTIONS */}
<td className="px-3 py-5 align-middle">
  <div className="flex items-center gap-2">

    {/* MODIFIER */}
    <Link
      href={`/admin/lessons/${lesson.id}/edit`}
      title="Modifier la leçon"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
    >
      <Pencil size={17} />
    </Link>

    {/* MEDIAS */}
    <Link
      href={`/admin/lessons/${lesson.id}/media`}
      title="Gérer les médias"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 transition hover:bg-green-200"
    >
      <Upload size={17} />
    </Link>

    {/* QUIZ */}
    <Link
      href={`/admin/lessons/${lesson.id}/quiz`}
      title="Créer ou modifier le quiz"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition hover:bg-orange-200"
    >
      <HelpCircle size={17} />
    </Link>

    {/* SUPPRIMER */}
    <button
      type="button"
      onClick={() => askDeleteLesson(lesson.id)}
      title="Supprimer la leçon"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-200"
    >
      <Trash2 size={17} />
    </button>

  </div>
</td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Supprimer cette leçon ?"
        message="Cette action supprimera définitivement la leçon sélectionnée."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteLesson}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedLessonId(null);
        }}
      />
    </AdminLayout>
  );
}

/* ================================
   ENTÊTE TABLEAU
================================ */

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
      {children}
    </th>
  );
}

/* ================================
   BADGE DISPONIBILITÉ
================================ */

function AvailabilityBadge({
  available,
  icon,
}: {
  available: boolean;
  icon: React.ReactNode;
}) {
  return available ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
      {icon}
      Oui
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
      Non
    </span>
  );
}

/* ================================
   STATISTIQUES
================================ */

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
    <div className="flex min-h-[92px] items-center gap-5 rounded-[20px] border border-slate-100 bg-white px-5 py-4 shadow-sm shadow-slate-200/50">

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-slate-950">
          {value}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          {label}
        </p>
      </div>

    </div>
  );
}