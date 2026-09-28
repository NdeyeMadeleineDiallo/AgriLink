"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  ImageOff,
  Layers3,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function StudentLevelPage() {
  const searchParams = useSearchParams();
  const requestedLevel = searchParams.get("level") || "";

  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [paidAccess, setPaidAccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    setPaidAccess({
  intermediaire:
    localStorage.getItem("agrilink_access_intermediaire") === "true",
  avance:
    localStorage.getItem("agrilink_access_avance") === "true",
});
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await apiRequest("/courses");

      const allCourses =
        data.data?.data ||
        data.data ||
        data.courses ||
        [];

      setCourses(Array.isArray(allCourses) ? allCourses : []);
    } catch (error: any) {
      console.error("Erreur chargement des cours :", error);

      setErrorMessage(
        error?.message ||
          "Impossible de charger les cours pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredCourses = useMemo(() => {
    const normalizedRequestedLevel = normalizeLevel(requestedLevel);

    return courses.filter((course) => {
      return normalizeLevel(course.level) === normalizedRequestedLevel;
    });
  }, [courses, requestedLevel]);

  if (!user) return null;

  const levelLabel = getLevelLabel(requestedLevel);
  const levelDescription = getLevelDescription(requestedLevel);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Parcours AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              {levelLabel}
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {levelDescription}
            </p>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour à mon espace
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Layers3 size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Cours du niveau
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sélectionnez un cours pour accéder aux leçons, vidéos, PDF et quiz.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] border border-slate-100 bg-white p-8 text-slate-500 shadow-lg shadow-slate-200/60">
            Chargement des cours...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-lg shadow-slate-200/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <BookOpen size={36} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-950">
              Aucun cours disponible
            </h3>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Aucun cours n’est encore affecté à ce niveau.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
  <CourseRow
    key={course.id}
    course={course}
    requestedLevel={requestedLevel}
    hasAccess={
      normalizeLevel(requestedLevel) === "debutant" ||
      Boolean(paidAccess[normalizeLevel(requestedLevel)])
    }
  />
))}
          </div>
        )}
      </section>
    </main>
  );
}

function CourseRow({
  course,
  requestedLevel,
  hasAccess,
}: {
  course: any;
  requestedLevel: string;
  hasAccess: boolean;
}) {
  const thumbnailUrl = getCourseThumbnailUrl(course);

  const totalLessons =
    course.lessons_count ||
    course.total_lessons ||
    course.lessons?.length ||
    0;

  const duration =
    course.duration ||
    course.total_duration ||
    0;

  const normalizedLevel = normalizeLevel(requestedLevel);

  const amount =
    normalizedLevel === "intermediaire"
      ? 5000
      : normalizedLevel === "avance"
      ? 15000
      : 0;

  const actionHref = hasAccess
    ? `/student/course?course_id=${course.id}`
    : `/student/payment?level=${normalizedLevel}&amount=${amount}`;

  return (
    <article className="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white p-4 shadow-md shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-lg md:flex-row md:items-center">
      <div className="shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={course.title}
            className="h-24 w-full rounded-2xl object-cover md:h-20 md:w-32"
          />
        ) : (
          <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 md:w-32">
            <ImageOff size={26} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-green-700">
          {course.level || "Formation"}
        </p>

        <h3 className="mt-1 text-xl font-bold text-slate-950">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {course.description ||
            "Découvrez le contenu complet de cette formation AgriAcademy."}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-2">
            <BookOpen size={15} className="text-green-700" />
            {totalLessons} leçon{Number(totalLessons) > 1 ? "s" : ""}
          </span>

          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} className="text-orange-500" />
            {duration > 0 ? `${duration} min` : "Durée à définir"}
          </span>
        </div>
      </div>

      <Link
        href={actionHref}
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
          hasAccess
            ? "bg-green-700 hover:bg-green-800"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {hasAccess ? "Accéder au cours" : "Payer l’accès"}

        {hasAccess ? (
          <ChevronRight size={17} />
        ) : (
          <Lock size={17} />
        )}
      </Link>
    </article>
  );
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

function getLevelLabel(level: string): string {
  const normalized = normalizeLevel(level);

  if (normalized === "debutant") {
    return "Niveau débutant";
  }

  if (normalized === "intermediaire") {
    return "Niveau intermédiaire";
  }

  if (normalized === "avance") {
    return "Niveau avancé";
  }

  return "Niveau de formation";
}

function getLevelDescription(level: string): string {
  const normalized = normalizeLevel(level);

  if (normalized === "debutant") {
    return "Découvrez les fondamentaux indispensables pour bien démarrer vos productions agricoles.";
  }

  if (normalized === "intermediaire") {
    return "Renforcez vos compétences en protection des cultures, prévention et gestion des risques.";
  }

  if (normalized === "avance") {
    return "Développez vos compétences en commercialisation, négociation et valorisation agricole.";
  }

  return "Consultez les cours disponibles dans ce niveau.";
}

function getCourseThumbnailUrl(course: any): string | null {
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