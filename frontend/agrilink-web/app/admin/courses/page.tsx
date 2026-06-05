"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    async function loadCourses() {
      try {
        const data = await apiRequest("/courses");
        setCourses(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadCourses();
  }, []);

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Gestion des cours
          </h1>

          <p className="mt-2 text-slate-500">
            Liste des formations AgriAcademy.
          </p>
        </div>

        <Link href="/admin/courses/create" className="btn-primary">
          Créer un cours
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Titre</th>
              <th className="p-4 text-left">Niveau</th>
              <th className="p-4 text-left">Durée</th>
              <th className="p-4 text-left">Prix</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Aucun cours disponible.
                </td>
              </tr>
            )}

            {courses.map((course) => (
              <tr key={course.id} className="border-t">
                <td className="p-4 font-semibold">{course.title}</td>
                <td className="p-4">{course.level}</td>
                <td className="p-4">{course.duration ? `${course.duration} h` : "-"}</td>
                <td className="p-4">{course.price} FCFA</td>
                <td className="p-4">{course.status}</td>
                <td className="p-4">
                  <Link
  href={`/admin/courses/${course.id}/edit`}
  className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
>
  Modifier
</Link>
                  <Link
                    href={`/admin/courses/${course.id}/lessons/create`}
                    className="rounded-2xl bg-green-100 px-4 py-2 text-sm font-bold text-green-700"
                  >
                    Ajouter une leçon
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}