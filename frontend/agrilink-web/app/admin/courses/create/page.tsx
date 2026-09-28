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
  ImagePlus,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiUpload } from "@/src/services/api";

type MessageType = "success" | "error" | "";

type CourseForm = {
  title: string;
  description: string;
  level: string;
  duration: string;
  price: string;
  status: string;
};

const initialForm: CourseForm = {
  title: "",
  description: "",
  level: "",
  duration: "",
  price: "",
  status: "draft",
};

export default function CreateCoursePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<CourseForm>(initialForm);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
  }, []);

  useEffect(() => {
    return () => {
      if (
        thumbnailPreview &&
        thumbnailPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  function updateField(
    name: keyof CourseForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function showMessage(
    type: MessageType,
    text: string
  ) {
    setMessageType(type);
    setMessage(text);
  }

  function handleThumbnailChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showMessage(
        "error",
        "Le fichier sélectionné doit être une image."
      );
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showMessage(
        "error",
        "L’image ne doit pas dépasser 5 Mo."
      );
      event.target.value = "";
      return;
    }

    if (
      thumbnailPreview &&
      thumbnailPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(selectedFile);
    setThumbnailPreview(
      URL.createObjectURL(selectedFile)
    );

    showMessage("", "");
  }

  function removeThumbnail() {
    if (
      thumbnailPreview &&
      thumbnailPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(null);
    setThumbnailPreview("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    showMessage("", "");

    if (!form.title.trim()) {
      showMessage(
        "error",
        "Le titre du cours est obligatoire."
      );
      return;
    }

    if (!form.level) {
      showMessage(
        "error",
        "Sélectionnez le niveau du cours."
      );
      return;
    }

    if (!thumbnail) {
      showMessage(
        "error",
        "Ajoutez une image de couverture."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("level", form.level);
      formData.append(
        "duration",
        form.duration || "0"
      );
      formData.append("price", form.price || "0");
      formData.append("status", form.status);
      formData.append("thumbnail", thumbnail);

      await apiUpload("/courses", formData);

      showMessage(
        "success",
        "Le cours a été créé avec succès."
      );

      setForm(initialForm);
      removeThumbnail();
    } catch (error: any) {
      console.error(
        "Erreur lors de la création du cours :",
        error
      );

      showMessage(
        "error",
        error?.message ||
          "Impossible de créer le cours."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy
            </p>

            <h1 className="mt-1 text-2xl font-black text-slate-950">
              Créer un nouveau cours
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Image, contenu, niveau et publication.
            </p>
          </div>

          <Link
            href="/admin/courses"
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
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-green-50 to-orange-50 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white">
              <ImagePlus size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-950">
                Informations principales
              </h2>

              <p className="text-xs text-slate-500">
                Tous les éléments nécessaires à la création du cours.
              </p>
            </div>
          </div>

          <div className="p-5">
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

                <p>{message}</p>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Image de couverture
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="mt-2">
                  {thumbnailPreview ? (
                    <div className="relative overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50">
                      <img
                        src={thumbnailPreview}
                        alt="Aperçu du cours"
                        className="h-44 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                        aria-label="Supprimer l’image"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="border-t border-slate-100 bg-white px-3 py-2">
                        <p className="truncate text-xs font-medium text-slate-600">
                          {thumbnail?.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center transition hover:border-green-400 hover:bg-green-50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                        <UploadCloud size={24} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        Ajouter une image
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        JPG, PNG ou WEBP
                        <br />
                        5 Mo maximum
                      </p>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid content-start gap-4 md:grid-cols-2">
                <Field
                  label="Titre du cours"
                  required
                  className="md:col-span-2"
                >
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Ex. Culture rentable de la fraise"
                    className="course-input"
                    required
                  />
                </Field>

                <Field label="Niveau" required>
                  <select
                    value={form.level}
                    onChange={(event) =>
                      updateField(
                        "level",
                        event.target.value
                      )
                    }
                    className="course-input"
                    required
                  >
                    <option value="">
                      Choisir
                    </option>
                    <option value="Débutant">
                      Débutant
                    </option>
                    <option value="Intermédiaire">
                      Intermédiaire
                    </option>
                    <option value="Avancé">
                      Avancé
                    </option>
                  </select>
                </Field>

                <Field label="Statut">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value
                      )
                    }
                    className="course-input"
                  >
                    <option value="draft">
                      Brouillon
                    </option>
                    <option value="published">
                      Publié
                    </option>
                  </select>
                </Field>

                <Field label="Durée totale">
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
                      className="course-input pr-20"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      minutes
                    </span>
                  </div>
                </Field>

                <Field label="Prix">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateField(
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      className="course-input pr-20"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      FCFA
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            <div className="mt-5">
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Présentez brièvement les objectifs et le contenu du cours..."
                  className="course-input resize-none"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Link
                href="/admin/courses"
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
                  : "Créer le cours"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .course-input {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0.7rem 0.875rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .course-input::placeholder {
          color: #94a3b8;
        }

        .course-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </AdminLayout>
  );
}

function Field({
  label,
  required = false,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
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