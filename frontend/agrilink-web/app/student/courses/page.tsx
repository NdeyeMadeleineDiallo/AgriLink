"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function StudentCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certificateMessage, setCertificateMessage] = useState("");

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
    const coursesData = await apiRequest("/courses");
    const progressData = await apiRequest("/my-progress");

    const allCourses = coursesData.data || [];
    const myProgress = progressData.progress || [];

    const myCourseIds = myProgress.map((item: any) => item.course_id);

    const myCourses = allCourses.filter((course: any) =>
      myCourseIds.includes(course.id)
    );

    setCourses(myCourses);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  async function openCourse(course: any) {
    setSelectedCourse(course);
    setCertificateMessage("");

    try {
      const lessonsData = await apiRequest(`/courses/${course.id}/lessons`);
      const progressData = await apiRequest(`/courses/${course.id}/progress`);

      setLessons(lessonsData.lessons || []);
      setCourseProgress(progressData);
    } catch (error) {
      console.error(error);
    }
  }

  async function completeLesson(lessonId: number) {
    try {
      await apiRequest(`/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      if (selectedCourse) {
        await openCourse(selectedCourse);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function generateCertificate() {
    if (!selectedCourse) return;

    try {
      await apiRequest(`/courses/${selectedCourse.id}/certificate`, {
        method: "POST",
      });

      setCertificateMessage("Certificat généré avec succès.");
    } catch (error: any) {
      setCertificateMessage(
        error?.message || "Impossible de générer le certificat."
      );
    }
  }

  if (!user) return null;

  const progressPercentage =
    courseProgress?.summary?.progress_percentage || 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Catalogue des cours
            </h1>
            <p className="text-sm text-slate-500">
              Suivez vos formations AgriAcademy.
            </p>
          </div>

          <Link
            href="/student"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {loading ? (
          <div className="card p-8 text-slate-500">Chargement des cours...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => openCourse(course)}
                  className={`card w-full p-5 text-left transition hover:-translate-y-1 ${
                    selectedCourse?.id === course.id
                      ? "ring-2 ring-green-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                      <BookOpen />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-950">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {course.level} · {course.price} FCFA
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {!selectedCourse ? (
                <div className="card p-8 text-slate-500">
                {courses.length === 0
  ? "Vous n’êtes inscrit à aucun cours pour le moment."
  : "Sélectionnez un cours pour voir les leçons."}
                </div>
              ) : (
                <div className="card p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">
                        {selectedCourse.title}
                      </h2>
                      <p className="mt-1 text-slate-500">
                        {selectedCourse.description}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="mt-6 h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-green-600"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {progressPercentage === 100 && (
                    <div className="mt-6 rounded-2xl bg-orange-50 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-black text-orange-800">
                            Félicitations !
                          </h3>
                          <p className="mt-1 text-sm text-orange-700">
                            Vous avez terminé ce cours. Vous pouvez maintenant
                            générer votre certificat.
                          </p>
                        </div>

                        <button
                          onClick={generateCertificate}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                        >
                          <Award size={18} />
                          Générer mon certificat
                        </button>
                      </div>

                      {certificateMessage && (
                        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700">
                          {certificateMessage}{" "}
                          {certificateMessage.includes("succès") && (
                            <Link
                              href="/student/certificates"
                              className="ml-2 font-bold text-green-700"
                            >
                              Voir mes certificats
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 space-y-4">
                    {lessons.map((lesson) => {
                      const progressLesson = courseProgress?.lessons?.find(
                        (item: any) => item.id === lesson.id
                      );

                      const isCompleted = progressLesson?.is_completed;

                      return (
                        <div
                          key={lesson.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                                <PlayCircle />
                              </div>

                              <div>
                                <h3 className="font-bold text-slate-900">
                                  {lesson.position}. {lesson.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {lesson.duration || 0} min
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
  {lesson.content}
</p>

{lesson.video_file && (
  <video
    controls
    className="mt-4 w-full rounded-2xl border border-slate-200"
    src={`http://127.0.0.1:8000/storage/${lesson.video_file}`}
  />
)}

{lesson.pdf_file && (
  <a
    href={`http://127.0.0.1:8000/storage/${lesson.pdf_file}`}
    target="_blank"
    className="mt-4 inline-flex rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
  >
    Télécharger le support PDF
  </a>
)}
                              </div>
                            </div>

                            {isCompleted ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                                <CheckCircle2 size={18} />
                                Terminée
                              </span>
                            ) : (
                              <button
                                onClick={() => completeLesson(lesson.id)}
                                className="btn-primary"
                              >
                                Marquer comme terminé
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}