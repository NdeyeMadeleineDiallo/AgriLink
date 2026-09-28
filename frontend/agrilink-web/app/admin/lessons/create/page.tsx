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
  Link2,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest, apiUpload } from "@/src/services/api";

type LessonForm = {
  course_id: string;
  title: string;
  content: string;
  video_url: string;
  position: string;
  duration: string;
  is_free: boolean;
};

const initialForm: LessonForm = {
  course_id: "",
  title: "",
  content: "",
  video_url: "",
  position: "",
  duration: "",
  is_free: false,
};

export default function CreateLessonGlobalPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  const [form, setForm] =
    useState<LessonForm>(initialForm);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [loading, setLoading] = useState(false);

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
        Array.isArray(loadedCourses)
          ? loadedCourses
          : []
      );
    } catch (error) {
      console.error(
        "Erreur chargement des cours :",
        error
      );
    }
  }

  function updateField(
    name: keyof LessonForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function showMessage(
    type: "success" | "error" | "",
    text: string
  ) {
    setMessageType(type);
    setMessage(text);
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

    if (!allowedTypes.includes(selectedFile.type)) {
      showMessage(
        "error",
        "La vidéo doit être au format MP4, MOV, AVI ou WEBM."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      50 * 1024 * 1024
    ) {
      showMessage(
        "error",
        "La vidéo ne doit pas dépasser 50 Mo."
      );

      event.target.value = "";
      return;
    }

    setVideoFile(selectedFile);
    showMessage("", "");
  }

  function handlePdfChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf"
    ) {
      showMessage(
        "error",
        "Le support de cours doit être un fichier PDF."
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      showMessage(
        "error",
        "Le PDF ne doit pas dépasser 10 Mo."
      );

      event.target.value = "";
      return;
    }

    setPdfFile(selectedFile);
    showMessage("", "");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    showMessage("", "");

    if (!form.course_id) {
      showMessage(
        "error",
        "Veuillez choisir le cours associé."
      );
      return;
    }

    if (!form.title.trim()) {
      showMessage(
        "error",
        "Le titre de la leçon est obligatoire."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * ÉTAPE 1 :
       * création de la leçon
       */
      const lessonData = await apiRequest(
        `/courses/${form.course_id}/lessons`,
        {
          method: "POST",
          body: JSON.stringify({
            title: form.title.trim(),
            content: form.content.trim(),
            video_url:
              form.video_url.trim() || null,
            position: Number(
              form.position || 1
            ),
            duration: Number(
              form.duration || 0
            ),
            is_free: form.is_free,
          }),
        }
      );

      const lesson =
        lessonData.lesson ||
        lessonData.data;

      if (!lesson?.id) {
        throw {
          message:
            "La leçon a été créée mais son identifiant n’a pas été retourné.",
        };
      }

      /*
       * ÉTAPE 2 :
       * upload vidéo + PDF
       */
      if (videoFile || pdfFile) {
        const mediaData = new FormData();

        if (videoFile) {
          mediaData.append(
            "video",
            videoFile
          );
        }

        if (pdfFile) {
          mediaData.append(
            "pdf",
            pdfFile
          );
        }

        await apiUpload(
          `/lessons/${lesson.id}/media`,
          mediaData
        );
      }

      showMessage(
        "success",
        "La leçon et ses ressources ont été ajoutées avec succès."
      );

      setForm(initialForm);
      setVideoFile(null);
      setPdfFile(null);
    } catch (error: any) {
      console.error(
        "Erreur création de la leçon :",
        error
      );

      showMessage(
        "error",
        error?.message ||
          "Impossible de créer la leçon."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Créer une leçon
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Ajoutez le contenu, la vidéo et le support PDF de la leçon.
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

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-lg shadow-slate-200/50"
        >
          <div className="p-5 md:p-6">

            {/* MESSAGE */}
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
                    className="mt-0.5 shrink-0"
                  />
                )}

                <p>{message}</p>
              </div>
            )}

            {/* INFORMATIONS PRINCIPALES */}
            <section>
              <SectionTitle
                title="Informations générales"
                description="Associez la leçon à un cours et renseignez ses informations principales."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Cours associé"
                  required
                >
                  <select
                    value={form.course_id}
                    onChange={(event) =>
                      updateField(
                        "course_id",
                        event.target.value
                      )
                    }
                    className="lesson-input"
                    required
                  >
                    <option value="">
                      Choisir un cours
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.title}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="Titre de la leçon"
                  required
                >
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Ex. Préparation du sol"
                    className="lesson-input"
                    required
                  />
                </Field>

                <Field label="Position">
                  <input
                    type="number"
                    min="1"
                    value={form.position}
                    onChange={(event) =>
                      updateField(
                        "position",
                        event.target.value
                      )
                    }
                    placeholder="1"
                    className="lesson-input"
                  />
                </Field>

                <Field label="Durée">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.duration}
                      onChange={(event) =>
                        updateField(
                          "duration",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      className="lesson-input pr-20"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      minutes
                    </span>
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Contenu / résumé">
                  <textarea
                    value={form.content}
                    onChange={(event) =>
                      updateField(
                        "content",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Expliquez brièvement ce que l’apprenant découvrira dans cette leçon..."
                    className="lesson-input resize-none"
                  />
                </Field>
              </div>
            </section>

            {/* RESSOURCES */}
            <section className="mt-7 border-t border-slate-100 pt-6">
              <SectionTitle
                title="Ressources pédagogiques"
                description="Ajoutez les supports qui seront disponibles dans l’espace apprenant."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                {/* VIDEO */}
                <MediaUploadCard
                  type="video"
                  title="Vidéo de la leçon"
                  description="MP4, MOV, AVI ou WEBM · 50 Mo max."
                  file={videoFile}
                  onChange={handleVideoChange}
                  onRemove={() =>
                    setVideoFile(null)
                  }
                />

                {/* PDF */}
                <MediaUploadCard
                  type="pdf"
                  title="Support PDF"
                  description="PDF · 10 Mo maximum."
                  file={pdfFile}
                  onChange={handlePdfChange}
                  onRemove={() =>
                    setPdfFile(null)
                  }
                />
              </div>

              {/* URL VIDÉO */}
              <div className="mt-4">
                <Field label="Lien vidéo externe facultatif">
                  <div className="relative">
                    <Link2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={form.video_url}
                      onChange={(event) =>
                        updateField(
                          "video_url",
                          event.target.value
                        )
                      }
                      placeholder="https://youtube.com/..."
                      className="lesson-input pl-11"
                    />
                  </div>
                </Field>

                <p className="mt-2 text-xs text-slate-400">
                  Tu peux utiliser une vidéo téléversée ou un lien externe.
                </p>
              </div>
            </section>

            {/* OPTIONS */}
            <section className="mt-6 border-t border-slate-100 pt-5">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Leçon gratuite
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Autoriser l’accès à cette leçon sans paiement.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.is_free}
                  onChange={(event) =>
                    updateField(
                      "is_free",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-green-600"
                />
              </label>
            </section>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/admin/lessons"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {loading
                  ? "Création..."
                  : "Créer la leçon"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .lesson-input {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0.72rem 0.875rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .lesson-input::placeholder {
          color: #94a3b8;
        }

        .lesson-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px
            rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </AdminLayout>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-base font-bold text-slate-950">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function MediaUploadCard({
  type,
  title,
  description,
  file,
  onChange,
  onRemove,
}: {
  type: "video" | "pdf";
  title: string;
  description: string;
  file: File | null;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
}) {
  const isVideo = type === "video";

  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isVideo
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {isVideo ? (
            <Film size={21} />
          ) : (
            <FileText size={21} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {file ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {formatFileSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-green-400 hover:text-green-700">
          <UploadCloud size={18} />

          Choisir un fichier

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

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} Mo`;
}