"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

type LessonForm = {
  title: string;
  content: string;
  video_url: string;
  position: string;
  duration: string;
  is_free: boolean;
};

export default function EditLessonPage() {
  const params = useParams();
  const lessonId = String(params.lessonId || "");

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);

  const [form, setForm] = useState<LessonForm>({
    title: "",
    content: "",
    video_url: "",
    position: "",
    duration: "",
    is_free: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  async function loadLesson() {
    try {
      setLoading(true);
      setMessage("");

      const data = await apiRequest(
        `/lessons/${lessonId}`
      );

      const currentLesson =
        data.lesson ||
        data.data ||
        data;

      setLesson(currentLesson);

      setForm({
        title: currentLesson.title || "",
        content: currentLesson.content || "",
        video_url: currentLesson.video_url || "",
        position: String(
          currentLesson.position ?? ""
        ),
        duration: String(
          currentLesson.duration ?? ""
        ),
        is_free: Boolean(currentLesson.is_free),
      });
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

  function updateField(
    name: keyof LessonForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!form.title.trim()) {
      setMessageType("error");
      setMessage(
        "Le titre de la leçon est obligatoire."
      );
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest(
        `/lessons/${lessonId}`,
        {
          method: "PUT",
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

      setLesson(
        data.lesson ||
          data.data ||
          lesson
      );

      setMessageType("success");
      setMessage(
        "La leçon a été mise à jour avec succès."
      );
    } catch (error: any) {
      console.error(
        "Erreur modification de la leçon :",
        error
      );

      setMessageType("error");
      setMessage(
        error?.message ||
          "Impossible de modifier la leçon."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy · Leçon
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Modifier la leçon
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Modifiez les informations générales de la leçon.
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
            Chargement de la leçon...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-md shadow-slate-200/50"
          >
            <div className="p-5 md:p-6">
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
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  {message}
                </div>
              )}

              {lesson?.course && (
                <div className="mb-6 rounded-xl bg-green-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Cours associé
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {lesson.course.title}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Titre de la leçon">
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    className="lesson-edit-input"
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
                    className="lesson-edit-input"
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
                      className="lesson-edit-input pr-20"
                    />

                    <span className="pointer-events-none absolute right-4 top-[42px] -translate-y-1/2 text-xs font-medium text-slate-400">
                      minutes
                    </span>
                  </div>
                </Field>

                <Field label="Lien vidéo externe">
                  <input
                    value={form.video_url}
                    onChange={(event) =>
                      updateField(
                        "video_url",
                        event.target.value
                      )
                    }
                    placeholder="https://youtube.com/..."
                    className="lesson-edit-input"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Contenu de la leçon">
                  <textarea
                    value={form.content}
                    onChange={(event) =>
                      updateField(
                        "content",
                        event.target.value
                      )
                    }
                    rows={5}
                    className="lesson-edit-input resize-none"
                  />
                </Field>
              </div>

              <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Leçon gratuite
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Autoriser l’accès sans paiement.
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

              <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 transition hover:bg-green-800 disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        .lesson-edit-input {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 0.72rem 0.875rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: 0.2s ease;
        }

        .lesson-edit-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px
            rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </AdminLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}