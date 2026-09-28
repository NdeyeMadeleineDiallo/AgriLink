"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  ImageOff,
  LoaderCircle,
  Lock,
  Play,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

function StudentCourseContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [completingLessonId, setCompletingLessonId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    if (!courseId) {
      setLoading(false);
      return;
    }

    loadCourseData();
  }, [courseId]);

  async function loadCourseData() {
    if (!courseId) return;

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const [courseResult, lessonsResult, progressResult] =
        await Promise.allSettled([
          apiRequest(`/courses/${courseId}`),
          apiRequest(`/courses/${courseId}/lessons`),
          apiRequest(`/courses/${courseId}/progress`),
        ]);

      if (courseResult.status === "fulfilled") {
        const loadedCourse =
          courseResult.value.course ||
          courseResult.value.data ||
          courseResult.value;

        setCourse(loadedCourse);
      }

      if (lessonsResult.status === "fulfilled") {
        const loadedLessons =
          lessonsResult.value.lessons ||
          lessonsResult.value.data ||
          [];

        setLessons(
          Array.isArray(loadedLessons) ? loadedLessons : []
        );
      } else {
        setLessons([]);
      }

      if (progressResult.status === "fulfilled") {
        setCourseProgress(progressResult.value);
      } else {
        setCourseProgress(null);
      }
    } catch (error: any) {
      console.error("Erreur chargement du cours :", error);

      setMessageType("error");
      setMessage(
        error?.message ||
          "Impossible de charger ce cours."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markLessonAsCompleted(lessonId: number) {
    if (completingLessonId) return;

    try {
      setCompletingLessonId(lessonId);
      setMessage("");
      setMessageType("");

      await apiRequest(`/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      setMessageType("success");
      setMessage("La leçon a été marquée comme terminée.");

      await refreshProgress();

      window.setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error: any) {
      console.error(
        "Erreur lors de la validation de la leçon :",
        error
      );

      setMessageType("error");
      setMessage(
        error?.message ||
          "Impossible de valider cette leçon."
      );
    } finally {
      setCompletingLessonId(null);
    }
  }

  async function refreshProgress() {
    if (!courseId) return;

    try {
      const progressData = await apiRequest(
        `/courses/${courseId}/progress`
      );

      setCourseProgress(progressData);
    } catch (error) {
      console.error(
        "Erreur actualisation progression :",
        error
      );
    }
  }

  function isLessonCompleted(lessonId: number) {
    const progressLesson =
      courseProgress?.lessons?.find(
        (item: any) =>
          Number(item.id) === Number(lessonId) ||
          Number(item.lesson_id) === Number(lessonId)
      );

    return Boolean(progressLesson?.is_completed);
  }

  if (!user) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container-page py-10">
          <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white p-10 text-slate-500 shadow-lg">
            <LoaderCircle
              size={22}
              className="animate-spin text-green-700"
            />
            Chargement du cours...
          </div>
        </div>
      </main>
    );
  }

  if (!courseId || !course) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container-page py-10">
          <div className="rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-lg">
            <BookOpen
              size={42}
              className="mx-auto text-slate-300"
            />

            <h1 className="mt-4 text-2xl font-black text-slate-950">
              Cours introuvable
            </h1>

            <p className="mt-2 text-slate-500">
              Aucun cours valide n’a été sélectionné.
            </p>

            <Link
              href="/student"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
            >
              <ArrowLeft size={18} />
              Retour à mon espace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const thumbnailUrl = getCourseThumbnailUrl(course);

  const progressPercentage = Number(
    courseProgress?.summary?.progress_percentage ||
      courseProgress?.progress_percentage ||
      0
  );

  const completedLessons = Number(
    courseProgress?.summary?.completed_lessons ||
      courseProgress?.completed_lessons ||
      0
  );

  const totalLessons =
    Number(
      courseProgress?.summary?.total_lessons ||
        courseProgress?.total_lessons
    ) || lessons.length;

  const duration = formatDuration(
    course.duration,
    lessons
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Formation AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              {course.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Progressez leçon après leçon et validez votre
              apprentissage.
            </p>
          </div>

          <Link
            href={`/student/level?level=${normalizeLevel(
              course.level
            )}`}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour aux cours
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {message && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" && (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <p>{message}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-lg shadow-slate-200/60">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <div className="relative h-[240px] overflow-hidden bg-slate-100 lg:h-[260px]">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={course.title}
                  className="h-[240px] w-full object-cover lg:h-[260px]"
                />
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center text-slate-300">
                  <ImageOff size={42} />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <span className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-green-700 shadow-md">
                {course.level || "Formation"}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                    Présentation du cours
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {course.title}
                  </h2>

                  <p className="mt-3 leading-7 text-slate-600">
                    {course.description ||
                      "Découvrez le contenu complet de cette formation AgriAcademy."}
                  </p>
                </div>

                <div className="min-w-[180px] rounded-2xl bg-green-50 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-700">
                        Progression
                      </p>

                      <p className="mt-1 text-3xl font-black text-slate-950">
                        {progressPercentage}%
                      </p>
                    </div>

                    {progressPercentage === 100 && (
                      <CheckCircle2
                        size={28}
                        className="text-green-600"
                      />
                    )}
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-green-100">
                    <div
                      className="h-full rounded-full bg-green-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          progressPercentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-green-700">
                    {completedLessons}/{totalLessons} leçons
                    terminées
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <CourseInfo
                  icon={<GraduationCap size={18} />}
                  label="Niveau"
                  value={course.level || "-"}
                />

                <CourseInfo
                  icon={<Clock3 size={18} />}
                  label="Durée"
                  value={duration}
                />

                <CourseInfo
                  icon={<BookOpen size={18} />}
                  label="Leçons"
                  value={`${lessons.length} leçon${
                    lessons.length > 1 ? "s" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                Programme
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Les leçons du cours
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consultez les ressources et validez chaque
                leçon après l’avoir terminée.
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {completedLessons}/{lessons.length} validée
              {completedLessons > 1 ? "s" : ""}
            </p>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-[24px] border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-md">
              Aucune leçon n’est disponible pour ce cours.
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(
                  lesson.id
                );

                const isCompleting =
                  completingLessonId === lesson.id;

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
                  <article
                    key={lesson.id}
                    className={`rounded-[20px] border bg-white p-4 shadow-sm transition hover:shadow-md ${
                      isCompleted
                        ? "border-green-200"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isCompleted
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={20} />
                          ) : (
                            <span className="text-sm font-bold">
                              {lesson.position ||
                                index + 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-950">
                              {lesson.title}
                            </h3>

                            {isCompleted && (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                                Terminée
                              </span>
                            )}
                          </div>

                          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                            {lesson.content ||
                              lesson.description ||
                              "Consultez les ressources pédagogiques de cette leçon."}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                            <Clock3 size={14} />

                            <span>
                              {lesson.duration
                                ? `${lesson.duration} min`
                                : "Durée non renseignée"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {hasVideo ? (
                          <Link
                            href={`/student/video?lesson_id=${lesson.id}`}
                            title="Regarder la vidéo"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 transition hover:bg-green-100"
                          >
                            <Play size={17} />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="Vidéo indisponible"
                            className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 text-slate-300"
                          >
                            <Play size={17} />
                          </button>
                        )}

                        {hasPdf ? (
                          <a
                            href={getLessonPdfUrl(lesson)}
                            target="_blank"
                            rel="noreferrer"
                            title="Ouvrir le PDF"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition hover:bg-orange-100"
                          >
                            <FileText size={18} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="PDF indisponible"
                            className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 text-slate-300"
                          >
                            <FileText size={18} />
                          </button>
                        )}

                        <Link
                          href={`/student/quiz?lesson_id=${lesson.id}`}
                          title="Faire le quiz"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <HelpCircle size={18} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            markLessonAsCompleted(lesson.id)
                          }
                          disabled={
                            isCompleted || isCompleting
                          }
                          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                            isCompleted
                              ? "cursor-default bg-green-100 text-green-700"
                              : "bg-green-700 text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                          }`}
                        >
                          {isCompleting ? (
                            <>
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                              Validation...
                            </>
                          ) : isCompleted ? (
                            <>
                              <CheckCircle2 size={17} />
                              Leçon terminée
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={17} />
                              Marquer comme terminée
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {progressPercentage === 100 && (
          <div className="mt-6 flex items-start gap-4 rounded-[24px] border border-green-200 bg-green-50 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white">
              <CheckCircle2 size={25} />
            </div>

            <div>
              <h3 className="font-bold text-green-900">
                Cours terminé avec succès
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Vous avez validé toutes les leçons de ce cours.
                Continuez les autres cours du parcours pour
                progresser vers votre certificat final.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CourseInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-[150px] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-green-700">{icon}</div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function getCourseThumbnailUrl(
  course: any
): string | null {
  const path =
    course.thumbnail ||
    course.image ||
    course.photo ||
    null;

  if (!path) return null;

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

function getLessonPdfUrl(lesson: any): string {
  const path =
    lesson.pdf_file ||
    lesson.pdf_path ||
    "";

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

function normalizeLevel(value: string): string {
  const normalized = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized.includes("debutant")) {
    return "debutant";
  }

  if (normalized.includes("intermediaire")) {
    return "intermediaire";
  }

  if (normalized.includes("avance")) {
    return "avance";
  }

  return normalized;
}

function formatDuration(
  courseDuration: number | string | null,
  lessons: any[]
): string {
  let totalMinutes = Number(courseDuration || 0);

  if (totalMinutes <= 0) {
    totalMinutes = lessons.reduce(
      (total, lesson) =>
        total + Number(lesson.duration || 0),
      0
    );
  }

  if (totalMinutes <= 0) {
    return "À définir";
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;

  
}

export default function StudentCoursePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC]">
          <div className="container-page py-10">
            <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white p-10 text-slate-500 shadow-lg">
              <LoaderCircle
                size={22}
                className="animate-spin text-green-700"
              />
              Chargement du cours...
            </div>
          </div>
        </main>
      }
    >
      <StudentCourseContent />
    </Suspense>
  );
}