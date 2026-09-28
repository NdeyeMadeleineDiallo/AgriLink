"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  ImagePlus,
  Info,
  MapPin,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest, apiUpload } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

type ExpertForm = {
  intervention_zone: string;
  experience_years: string;
  hourly_rate: string;
  bio: string;
  phone: string;
  whatsapp_number: string;
};

const specialityOptions = [
  "Agronomie",
  "Vétérinaire",
  "Irrigation",
  "Marketing agricole",
  "Finance agricole",
];

const initialForm: ExpertForm = {
  intervention_zone: "",
  experience_years: "",
  hourly_rate: "",
  bio: "",
  phone: "",
  whatsapp_number: "",
};

export default function ExpertProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [expert, setExpert] = useState<any>(null);

  const [form, setForm] =
    useState<ExpertForm>(initialForm);

  const [
    selectedSpecialities,
    setSelectedSpecialities,
  ] = useState<string[]>([]);

  const [photo, setPhoto] = useState<File | null>(
    null
  );

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [cv, setCv] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

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
    loadExpertProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (
        photoPreview &&
        photoPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  async function loadExpertProfile() {
    try {
      const data = await apiRequest(
        "/my-expert-profile"
      );

      const profile =
        data.expert_profile ||
        data.expert ||
        data.data ||
        null;

      if (!profile) {
        window.location.href = "/expert/create";
        return;
      }

      setExpert(profile);

      const specialities =
        getExpertSpecialities(profile);

      setSelectedSpecialities(specialities);

      setForm({
        intervention_zone:
          profile.intervention_zone ||
          profile.region ||
          "",
        experience_years: String(
          profile.experience_years || ""
        ),
        hourly_rate: String(
          profile.hourly_rate || ""
        ),
        bio:
          profile.bio ||
          profile.biography ||
          "",
        phone:
          profile.phone ||
          profile.user?.phone ||
          "",
        whatsapp_number:
          profile.whatsapp_number ||
          profile.phone ||
          profile.user?.phone ||
          "",
      });

      const existingPhoto =
        getExpertPhotoUrl(profile);

      if (existingPhoto) {
        setPhotoPreview(existingPhoto);
      }
    } catch (error: any) {
      console.error(
        "Erreur chargement profil expert :",
        error
      );

      setMessageType("error");
      setMessage(
        error?.message ||
          "Impossible de charger votre profil expert."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    name: keyof ExpertForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleSpeciality(
    speciality: string
  ) {
    setSelectedSpecialities((previous) => {
      if (previous.includes(speciality)) {
        return previous.filter(
          (item) => item !== speciality
        );
      }

      return [...previous, speciality];
    });
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    if (
      !selectedFile.type.startsWith("image/")
    ) {
      showError(
        "Le fichier sélectionné doit être une image."
      );
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      showError(
        "La photo ne doit pas dépasser 5 Mo."
      );
      return;
    }

    if (
      photoPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(selectedFile);
    setPhotoPreview(
      URL.createObjectURL(selectedFile)
    );
  }

  function removeNewPhoto() {
    if (
      photoPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);

    const existingPhoto =
      getExpertPhotoUrl(expert);

    setPhotoPreview(existingPhoto || "");
  }

  function handleCvChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf"
    ) {
      showError(
        "Le CV doit être au format PDF."
      );
      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      showError(
        "Le CV ne doit pas dépasser 10 Mo."
      );
      return;
    }

    setCv(selectedFile);
  }

  function showError(text: string) {
    setMessageType("error");
    setMessage(text);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validateForm() {
    if (
      selectedSpecialities.length === 0
    ) {
      showError(
        "Sélectionnez au moins une spécialité."
      );
      return false;
    }

    if (
      !form.intervention_zone.trim()
    ) {
      showError(
        "Renseignez votre zone d’intervention."
      );
      return false;
    }

    if (
      !form.experience_years ||
      Number(form.experience_years) < 0
    ) {
      showError(
        "Renseignez une expérience valide."
      );
      return false;
    }

    if (
      form.bio.trim().length < 80
    ) {
      showError(
        "La biographie doit comporter au moins 80 caractères."
      );
      return false;
    }

    if (
      !form.whatsapp_number.trim()
    ) {
      showError(
        "Renseignez votre numéro WhatsApp."
      );
      return false;
    }

    return true;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!validateForm() || !expert) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      /*
       * apiUpload utilise POST.
       * Laravel transformera la requête en PUT.
       */
      formData.append("_method", "PUT");

      selectedSpecialities.forEach(
        (speciality) => {
          formData.append(
            "specialities[]",
            speciality
          );
        }
      );

      formData.append(
        "speciality",
        selectedSpecialities.join(", ")
      );

      formData.append(
        "intervention_zone",
        form.intervention_zone.trim()
      );

      /*
       * Compatibilité avec la colonne région
       * de ton modèle actuel.
       */
      formData.append(
        "region",
        form.intervention_zone.trim()
      );

      formData.append(
        "experience_years",
        form.experience_years
      );

      formData.append(
        "hourly_rate",
        form.hourly_rate || "0"
      );

      formData.append(
        "bio",
        form.bio.trim()
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "whatsapp_number",
        form.whatsapp_number.trim()
      );

      if (photo) {
        formData.append("photo", photo);
      }

      if (cv) {
        formData.append("cv", cv);
      }

      /*
       * Une candidature rejetée est redéposée.
       * Elle repasse en attente de vérification.
       */
      if (
        String(expert.status).toLowerCase() ===
        "rejected"
      ) {
        formData.append("status", "pending");
        formData.append("is_verified", "0");
      }

      await apiUpload(
        `/experts/${expert.id}`,
        formData
      );

      setMessageType("success");

      setMessage(
        String(expert.status).toLowerCase() ===
          "rejected"
          ? "Votre profil a été corrigé et votre candidature a été redéposée avec succès."
          : "Votre profil expert a été mis à jour avec succès."
      );

      setPhoto(null);
      setCv(null);

      await loadExpertProfile();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.error(
        "Erreur modification profil expert :",
        error
      );

      showError(
        error?.message ||
          "Impossible de mettre à jour votre profil expert."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F9F7]">
        <div className="container-page py-10">
          <div className="rounded-[28px] bg-white p-8 text-slate-500 shadow-lg">
            Chargement de votre profil expert...
          </div>
        </div>
      </main>
    );
  }

  if (!expert) {
    return null;
  }

  const normalizedStatus = String(
    expert.status || ""
  ).toLowerCase();

  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
              AgriExpert
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Mon profil expert
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Consultez et mettez à jour votre
              candidature.
            </p>
          </div>

          <Link
            href="/expert"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour à AgriExpert
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {message && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0"
              />
            )}

            <p>{message}</p>
          </div>
        )}

        <ProfileStatusCard
          status={normalizedStatus}
          isVerified={expert.is_verified}
        />

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_330px]">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-xl shadow-slate-200/60"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-green-50 to-orange-50 p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white">
                  <BriefcaseBusiness size={27} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Informations du profil
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Modifiez les informations qui doivent
                    apparaître dans AgriExpert.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-9 p-6 md:p-8">
              <FormSection
                icon={<UserRound size={22} />}
                title="Informations personnelles"
                description="Ces informations proviennent de votre compte AgriLink."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Nom complet">
                    <input
                      value={user.name || ""}
                      readOnly
                      className="input-expert cursor-not-allowed bg-slate-50 text-slate-500"
                    />
                  </Field>

                  <Field label="Adresse email">
                    <input
                      value={user.email || ""}
                      readOnly
                      className="input-expert cursor-not-allowed bg-slate-50 text-slate-500"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                icon={<ImagePlus size={22} />}
                title="Photo professionnelle"
                description="Remplacez votre photo seulement si nécessaire."
              >
                <div className="flex flex-col gap-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                  {photoPreview ? (
                    <div className="relative shrink-0">
                      <img
                        src={photoPreview}
                        alt="Photo du profil"
                        className="h-32 w-32 rounded-[24px] object-cover"
                      />

                      {photo && (
                        <button
                          type="button"
                          onClick={removeNewPhoto}
                          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[24px] bg-white text-slate-300">
                      <UserRound size={48} />
                    </div>
                  )}

                  <div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50">
                      <ImagePlus size={19} />
                      Remplacer la photo

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      JPG, PNG ou WEBP — 5 Mo maximum.
                    </p>
                  </div>
                </div>
              </FormSection>

              <FormSection
                icon={
                  <BriefcaseBusiness size={22} />
                }
                title="Spécialités"
                description="Sélectionnez vos domaines d’expertise."
              >
                <div className="flex flex-wrap gap-3">
                  {specialityOptions.map(
                    (speciality) => {
                      const selected =
                        selectedSpecialities.includes(
                          speciality
                        );

                      return (
                        <button
                          key={speciality}
                          type="button"
                          onClick={() =>
                            toggleSpeciality(
                              speciality
                            )
                          }
                          className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                            selected
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          {speciality}
                        </button>
                      );
                    }
                  )}
                </div>
              </FormSection>

              <FormSection
                icon={<MapPin size={22} />}
                title="Expérience et intervention"
                description="Présentez votre zone, votre expérience et votre tarif."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Zone d’intervention"
                    required
                    className="md:col-span-2"
                  >
                    <input
                      value={
                        form.intervention_zone
                      }
                      onChange={(event) =>
                        updateField(
                          "intervention_zone",
                          event.target.value
                        )
                      }
                      className="input-expert"
                    />
                  </Field>

                  <Field
                    label="Expérience en années"
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      value={
                        form.experience_years
                      }
                      onChange={(event) =>
                        updateField(
                          "experience_years",
                          event.target.value
                        )
                      }
                      className="input-expert"
                    />
                  </Field>

                  <Field label="Tarif horaire en FCFA">
                    <input
                      type="number"
                      min="0"
                      value={form.hourly_rate}
                      onChange={(event) =>
                        updateField(
                          "hourly_rate",
                          event.target.value
                        )
                      }
                      className="input-expert"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                icon={<FileText size={22} />}
                title="Présentation professionnelle"
                description="Expliquez votre parcours et vos compétences."
              >
                <Field
                  label="Biographie"
                  required
                >
                  <textarea
                    rows={7}
                    value={form.bio}
                    onChange={(event) =>
                      updateField(
                        "bio",
                        event.target.value
                      )
                    }
                    className="input-expert resize-none"
                  />
                </Field>
              </FormSection>

              <FormSection
                icon={<UploadCloud size={22} />}
                title="Curriculum vitae"
                description="Vous pouvez conserver le CV existant ou en ajouter un nouveau."
              >
                {expert.cv && (
                  <a
                    href={`${API_BASE_URL}/storage/${expert.cv}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <FileText size={18} />
                    Voir le CV actuel
                  </a>
                )}

                <label className="flex cursor-pointer items-center gap-4 rounded-[22px] border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-green-400">
                  <UploadCloud
                    size={24}
                    className="text-green-700"
                  />

                  <div>
                    <p className="font-semibold text-slate-800">
                      {cv
                        ? cv.name
                        : "Sélectionner un nouveau CV"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF — 10 Mo maximum
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleCvChange}
                    className="hidden"
                  />
                </label>
              </FormSection>

              <FormSection
                icon={<MapPin size={22} />}
                title="Coordonnées"
                description="Ces coordonnées serviront aux utilisateurs pour vous contacter."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Téléphone">
                    <input
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                        )
                      }
                      className="input-expert"
                    />
                  </Field>

                  <Field
                    label="Numéro WhatsApp"
                    required
                  >
                    <input
                      value={
                        form.whatsapp_number
                      }
                      onChange={(event) =>
                        updateField(
                          "whatsapp_number",
                          event.target.value
                        )
                      }
                      className="input-expert"
                    />
                  </Field>
                </div>
              </FormSection>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/expert"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700"
                >
                  Annuler
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-800 disabled:opacity-60"
                >
                  <Save size={19} />

                  {submitting
                    ? "Enregistrement..."
                    : normalizedStatus ===
                        "rejected"
                    ? "Corriger et redéposer"
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          </form>

          <aside>
            <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/60 xl:sticky xl:top-6">
              <Info
                size={28}
                className="text-green-700"
              />

              <h3 className="mt-4 text-xl font-bold text-slate-950">
                À savoir
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Après le redépôt d’une candidature
                rejetée, votre profil repassera en
                attente. L’administration devra
                l’examiner à nouveau avant sa
                publication.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        .input-expert {
          margin-top: 0.5rem;
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0.875rem 1rem;
          color: #0f172a;
          outline: none;
        }

        .input-expert:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 4px
            rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </main>
  );
}

function ProfileStatusCard({
  status,
  isVerified,
}: {
  status: string;
  isVerified: boolean | number;
}) {
  if (
    status === "approved" ||
    Number(isVerified) === 1
  ) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">
        <ShieldCheck
          size={22}
          className="text-green-700"
        />

        <div>
          <p className="font-semibold text-green-800">
            Profil expert approuvé
          </p>

          <p className="mt-1 text-sm text-green-700">
            Votre profil est visible dans
            AgriExpert.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
        <CircleAlert
          size={22}
          className="text-red-600"
        />

        <div>
          <p className="font-semibold text-red-800">
            Candidature rejetée
          </p>

          <p className="mt-1 text-sm text-red-700">
            Corrigez les informations nécessaires
            puis redéposez votre candidature.
          </p>
        </div>
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
        <CircleAlert
          size={22}
          className="text-red-600"
        />

        <div>
          <p className="font-semibold text-red-800">
            Profil suspendu
          </p>

          <p className="mt-1 text-sm text-red-700">
            Votre profil n’est plus visible dans
            l’annuaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <Clock3
        size={22}
        className="text-orange-600"
      />

      <div>
        <p className="font-semibold text-orange-800">
          Candidature en attente
        </p>

        <p className="mt-1 text-sm text-orange-700">
          L’administration examine actuellement
          votre profil.
        </p>
      </div>
    </div>
  );
}

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-950">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
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

function getExpertSpecialities(
  expert: any
): string[] {
  const speciality =
    expert.speciality ||
    expert.specialties ||
    expert.specialities ||
    "";

  if (Array.isArray(speciality)) {
    return speciality
      .map((item: any) =>
        typeof item === "string"
          ? item
          : item.name
      )
      .filter(Boolean);
  }

  return String(speciality)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getExpertPhotoUrl(
  expert: any
): string | null {
  const path =
    expert.photo ||
    expert.photo_path ||
    expert.profile_photo ||
    null;

  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_BASE_URL}/storage/${path}`;
}