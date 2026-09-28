"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Film,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import {
  apiRequest,
  apiUpload,
} from "@/src/services/api";

const API_BASE_URL =
  "http://127.0.0.1:8000";

export default function LessonMediaPage() {
  const params = useParams();
  const lessonId = String(
    params.lessonId || ""
  );

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "success" | "error" | ""
    >("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href =
        "/login";
      return;
    }

    setUser(storedUser);

    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  async function loadLesson() {
    try {
      setLoading(true);

      const data = await apiRequest(
        `/lessons/${lessonId}`
      );

      setLesson(
        data.lesson ||
          data.data ||
          data
      );
    } catch (error: any) {
      console.error(
        "Erreur chargement de la leçon :",
        error
      );

      setMessageType("error");

      setMessage(
        error?.message ||
          "Impossible de charger la leçon."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleVideoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setMessageType("error");

      setMessage(
        "La vidéo doit être au format MP4, MOV, AVI ou WEBM."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      50 * 1024 * 1024
    ) {
      setMessageType("error");

      setMessage(
        "La vidéo ne doit pas dépasser 50 Mo."
      );

      event.target.value = "";
      return;
    }

    setVideoFile(selectedFile);
    setMessage("");
  }

  function handlePdfChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      setMessageType("error");

      setMessage(
        "Le fichier doit être au format PDF."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setMessageType("error");

      setMessage(
        "Le PDF ne doit pas dépasser 10 Mo."
      );

      event.target.value = "";
      return;
    }

    setPdfFile(selectedFile);
    setMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !videoFile &&
      !pdfFile
    ) {
      setMessageType("error");

      setMessage(
        "Sélectionnez au moins une vidéo ou un PDF à envoyer."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const formData =
        new FormData();

      if (videoFile) {
        formData.append(
          "video",
          videoFile
        );
      }

      if (pdfFile) {
        formData.append(
          "pdf",
          pdfFile
        );
      }

      const data =
        await apiUpload(
          `/lessons/${lessonId}/media`,
          formData
        );

      setLesson(
        data.lesson ||
          lesson
      );

      setVideoFile(null);
      setPdfFile(null);

      setMessageType(
        "success"
      );

      setMessage(
        "Les médias ont été mis à jour avec succès."
      );
    } catch (error: any) {
      console.error(
        "Erreur upload médias :",
        error
      );

      setMessageType("error");

      setMessage(
        error?.message ||
          "Impossible de mettre à jour les médias."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  const hasCurrentVideo =
    Boolean(
      lesson?.video_file ||
        lesson?.video_url
    );

  const hasCurrentPdf =
    Boolean(lesson?.pdf_file);

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy · Médias
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Médias de la leçon
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gérez la vidéo et le support PDF.
            </p>
          </div>

          <Link
            href="/admin/lessons"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={17} />
            Retour
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-md">
            Chargement des médias...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50 md:p-6"
          >
            {message && (
              <div
                className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {messageType ===
                  "success" && (
                  <CheckCircle2
                    size={18}
                  />
                )}

                {message}
              </div>
            )}

            <div className="mb-6 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Leçon
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {lesson?.title ||
                  "Leçon AgriAcademy"}
              </p>

              {lesson?.course?.title && (
                <p className="mt-1 text-sm text-slate-500">
                  {
                    lesson.course
                      .title
                  }
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <MediaCard
                type="video"
                title="Vidéo de la leçon"
                available={
                  hasCurrentVideo
                }
                currentUrl={
                  lesson?.video_file
                    ? getStorageUrl(
                        lesson.video_file
                      )
                    : lesson?.video_url ||
                      null
                }
                file={videoFile}
                onChange={
                  handleVideoChange
                }
                onRemove={() =>
                  setVideoFile(null)
                }
              />

              <MediaCard
                type="pdf"
                title="Support PDF"
                available={
                  hasCurrentPdf
                }
                currentUrl={
                  lesson?.pdf_file
                    ? getStorageUrl(
                        lesson.pdf_file
                      )
                    : null
                }
                file={pdfFile}
                onChange={
                  handlePdfChange
                }
                onRemove={() =>
                  setPdfFile(null)
                }
              />
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 transition hover:bg-green-800 disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les médias"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

function MediaCard({
  type,
  title,
  available,
  currentUrl,
  file,
  onChange,
  onRemove,
}: {
  type: "video" | "pdf";
  title: string;
  available: boolean;
  currentUrl: string | null;
  file: File | null;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
}) {
  const isVideo =
    type === "video";

  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isVideo
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {isVideo ? (
            <Film size={22} />
          ) : (
            <FileText size={22} />
          )}
        </div>

        <div>
          <p className="font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {isVideo
              ? "MP4, MOV, AVI ou WEBM · 50 Mo max."
              : "PDF · 10 Mo maximum."}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Fichier actuel
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${
                available
                  ? "text-green-700"
                  : "text-slate-400"
              }`}
            >
              {available
                ? "Disponible"
                : "Aucun fichier"}
            </p>
          </div>

          {available &&
            currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Ouvrir
              </a>
            )}
        </div>
      </div>

      {file ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-green-900">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-green-700">
              Nouveau fichier sélectionné
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-green-400 hover:text-green-700">
          <UploadCloud size={18} />

          {available
            ? "Remplacer le fichier"
            : "Choisir un fichier"}

          <input
            type="file"
            accept={
              isVideo
                ? "video/mp4,video/quicktime,video/x-msvideo,video/webm"
                : "application/pdf"
            }
            onChange={onChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

function getStorageUrl(
  path: string
): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
}