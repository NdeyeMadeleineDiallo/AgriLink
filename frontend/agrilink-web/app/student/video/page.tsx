"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

function StudentVideoContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson_id");

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadLesson();
  }, []);

  async function loadLesson() {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    try {
      const lessonData = await apiRequest(`/lessons/${lessonId}`);
      const currentLesson = lessonData.lesson || lessonData.data || lessonData;

      setLesson(currentLesson);

      const coursesData = await apiRequest("/courses");
      const allCourses = coursesData.data || [];

      let foundCourse = null;
      let foundLessons: any[] = [];

      for (const item of allCourses) {
        const lessonsData = await apiRequest(`/courses/${item.id}/lessons`);
        const courseLessons = lessonsData.lessons || [];

        const exists = courseLessons.find(
          (l: any) => Number(l.id) === Number(lessonId)
        );

        if (exists) {
          foundCourse = item;
          foundLessons = courseLessons;
          break;
        }
      }

      setCourse(foundCourse);
      setLessons(foundLessons);

      if (foundCourse) {
        try {
          const progressData = await apiRequest(
            `/courses/${foundCourse.id}/progress`
          );

          setCourseProgress(progressData);
        } catch {
          setCourseProgress(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function completeLesson() {
    if (!lessonId) return;

    try {
      await apiRequest(`/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      setMessage("Leçon marquée comme terminée.");

      setTimeout(() => {
        if (course?.id) {
          window.location.href = `/student/course?course_id=${course.id}`;
        } else {
          window.location.href = "/student/courses";
        }
      }, 900);
    } catch (error) {
      console.error(error);
      setMessage("Impossible de terminer cette leçon.");
    }
  }

  if (!user) return null;

  const currentIndex = lessons.findIndex(
    (item) => Number(item.id) === Number(lessonId)
  );

  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const progressLesson = courseProgress?.lessons?.find(
    (item: any) => Number(item.id) === Number(lessonId)
  );

  const isCompleted = progressLesson?.is_completed;
    return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex h-24 items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Lecture vidéo
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Regardez la leçon puis marquez-la comme terminée.
            </p>
          </div>

          <Link
            href={course?.id ? `/student/course?course_id=${course.id}` : "/student/courses"}
            className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-black text-green-700 transition hover:bg-green-50"
          >
            <ArrowLeft size={18} />
            Retour à la formation
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {loading ? (
          <div className="rounded-[28px] bg-white p-8 text-slate-500 shadow-md">
            Chargement de la vidéo...
          </div>
        ) : !lesson ? (
          <div className="rounded-[28px] bg-white p-8 text-center text-slate-500 shadow-md">
            Leçon introuvable.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-md lg:col-span-2">
              <div className="mb-5">
                <p className="text-sm font-black uppercase tracking-wide text-green-700">
                  {course?.title || "Formation AgriAcademy"}
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {lesson.position}. {lesson.title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <Clock size={15} />
                    {lesson.duration || 0} min
                  </span>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
                      <CheckCircle2 size={15} />
                      Terminée
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-slate-950 shadow-lg">
                {lesson.video_file ? (
                  <video
                    controls
                    className="aspect-video w-full bg-black"
                    src={`${API_BASE_URL}/storage/${lesson.video_file}`}
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-white/70">
                    <div className="text-center">
                      <PlayCircle className="mx-auto mb-4" size={54} />
                      <p className="font-bold">Aucune vidéo disponible.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-950">
                  Description de la leçon
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {lesson.content || "Aucune description disponible pour cette leçon."}
                </p>
              </div>
                            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  {previousLesson ? (
                    <Link
                      href={`${API_BASE_URL}/storage/${lesson.pdf_file}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-black text-slate-700 hover:bg-slate-200"
                    >
                      <ChevronLeft size={18} />
                      Leçon précédente
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-5 py-3 font-black text-slate-300">
                      <ChevronLeft size={18} />
                      Leçon précédente
                    </span>
                  )}

                  {nextLesson ? (
                    <Link
                      href={`/student/video?lesson_id=${nextLesson.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-black text-slate-700 hover:bg-slate-200"
                    >
                      Leçon suivante
                      <ChevronRight size={18} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-5 py-3 font-black text-slate-300">
                      Leçon suivante
                      <ChevronRight size={18} />
                    </span>
                  )}
                </div>

                <button
                  onClick={completeLesson}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-black text-white transition hover:bg-green-700"
                >
                  <CheckCircle2 size={18} />
                  Marquer comme terminée
                </button>
              </div>

              {message && (
                <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-700">
                  {message}
                </div>
              )}
            </div>

            <aside className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-md">
              <h3 className="text-xl font-black text-slate-950">
                Ressources de la leçon
              </h3>

              <div className="mt-5 space-y-3">
                {lesson.pdf_file ? (
                  <a
                    href={`http://127.0.0.1:8000/storage/${lesson.pdf_file}`}
                    target="_blank"
                    className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 font-black text-orange-700 hover:bg-orange-100"
                  >
                    <FileText size={22} />
                    Télécharger le PDF
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-black text-slate-400">
                    <FileText size={22} />
                    PDF indisponible
                  </div>
                )}

                <Link
                  href={`/student/quiz?lesson_id=${lesson.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-black text-green-700 hover:bg-green-100"
                >
                  <CheckCircle2 size={22} />
                  Faire le quiz
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-500">
                  Progression formation
                </p>

                <p className="mt-2 text-4xl font-black text-slate-950">
                  {courseProgress?.summary?.progress_percentage || 0}%
                </p>

                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{
                      width: `${
                        courseProgress?.summary?.progress_percentage || 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
export default function StudentVideoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC]">
          <div className="container-page flex min-h-screen items-center justify-center">
            <div className="rounded-[24px] border border-slate-100 bg-white px-8 py-6 text-sm font-semibold text-slate-500 shadow-lg shadow-slate-200/50">
              Chargement de la leçon...
            </div>
          </div>
        </main>
      }
    >
      <StudentVideoContent />
    </Suspense>
  );
}