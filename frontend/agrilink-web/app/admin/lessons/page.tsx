"use client";

import { useEffect, useState } from "react";
import { FileVideo, Search, Upload } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";
import { Trash2 } from "lucide-react";

export default function AdminLessonsPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [search, setSearch] = useState("");

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
      const coursesData = await apiRequest("/courses");
      const allCourses = coursesData.data || [];

      setCourses(allCourses);

      const allLessons: any[] = [];

      for (const course of allCourses) {
        const lessonsData = await apiRequest(`/courses/${course.id}/lessons`);

        const courseLessons = (lessonsData.lessons || []).map((lesson: any) => ({
          ...lesson,
          course_title: course.title,
        }));

        allLessons.push(...courseLessons);
      }

      setLessons(allLessons);
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title?.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteLesson(lessonId: number) {
  if (!confirm("Voulez-vous vraiment supprimer cette leçon ?")) return;

  try {
    await apiRequest(`/lessons/${lessonId}`, {
      method: "DELETE",
    });

    setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression de la leçon.");
  }
}

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Gestion des leçons
          </h1>
          <p className="mt-2 text-slate-500">
            Gérez les supports vidéos et PDF des formations AgriAcademy.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Rechercher une leçon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Leçon</th>
              <th className="p-4 text-left">Cours</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Vidéo</th>
              <th className="p-4 text-left">PDF</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLessons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Aucune leçon trouvée.
                </td>
              </tr>
            )}

            {filteredLessons.map((lesson) => (
              <tr key={lesson.id} className="border-t">
                <td className="p-4 font-bold text-slate-900">
                  {lesson.title}
                </td>

                <td className="p-4 text-slate-600">
                  {lesson.course_title}
                </td>

                <td className="p-4">
                  {lesson.position}
                </td>

                <td className="p-4">
                  {lesson.video_file ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      Aucun
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {lesson.pdf_file ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      Aucun
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
  <Link
    href={`/admin/lessons/${lesson.id}/edit`}
    className="inline-flex items-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
  >
    Modifier
  </Link>

  <Link
    href={`/admin/lessons/${lesson.id}/media`}
    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
  >
    <Upload size={16} />
    Médias
  </Link>

  <button
  onClick={() => deleteLesson(lesson.id)}
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
    </AdminLayout>
  );
}