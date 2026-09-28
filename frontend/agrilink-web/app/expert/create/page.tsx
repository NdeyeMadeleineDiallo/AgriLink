"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  ImagePlus,
  Info,
  MapPin,
  Save,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStoredUser } from "@/src/lib/auth";
import { apiUpload } from "@/src/services/api";

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

export default function CreateExpertProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState<ExpertForm>(initialForm);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(
    []
  );

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [cv, setCv] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    setForm((previous) => ({
      ...previous,
      phone: storedUser.phone || "",
      whatsapp_number: storedUser.phone || "",
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const biographyLength = useMemo(() => form.bio.length, [form.bio]);

  function updateField(name: keyof ExpertForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleSpeciality(speciality: string) {
    setSelectedSpecialities((previous) => {
      if (previous.includes(speciality)) {
        return previous.filter((item) => item !== speciality);
      }

      return [...previous, speciality];
    });
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showError("Le fichier sélectionné doit être une image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showError("La photo ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(selectedFile);
    setPhotoPreview(URL.createObjectURL(selectedFile));
    setMessage("");
    setMessageType("");
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview("");
  }

  function handleCvChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      showError("Le CV doit obligatoirement être au format PDF.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      showError("Le CV ne doit pas dépasser 10 Mo.");
      event.target.value = "";
      return;
    }

    setCv(selectedFile);
    setMessage("");
    setMessageType("");
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
    if (!photo) {
      showError("Veuillez ajouter une photo de profil.");
      return false;
    }

    if (selectedSpecialities.length === 0) {
      showError("Veuillez sélectionner au moins une spécialité.");
      return false;
    }

    if (!form.intervention_zone.trim()) {
      showError("Veuillez renseigner votre zone d’intervention.");
      return false;
    }

    if (
      !form.experience_years ||
      Number(form.experience_years) < 0
    ) {
      showError("Veuillez saisir un nombre d’années d’expérience valide.");
      return false;
    }

    if (!form.bio.trim() || form.bio.trim().length < 80) {
      showError(
        "Votre biographie doit comporter au moins 80 caractères."
      );
      return false;
    }

    if (!form.whatsapp_number.trim()) {
      showError("Veuillez renseigner votre numéro WhatsApp.");
      return false;
    }

    if (!cv) {
      showError("Veuillez joindre votre curriculum vitae au format PDF.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      selectedSpecialities.forEach((speciality) => {
        formData.append("specialities[]", speciality);
      });

      /*
       * Champ de compatibilité :
       * certains backends utilisent encore une seule colonne "speciality".
       */
      formData.append(
        "speciality",
        selectedSpecialities.join(", ")
      );

      formData.append(
        "intervention_zone",
        form.intervention_zone.trim()
      );

      /*
       * Compatibilité avec ton ancien modèle qui semble utiliser "region".
       */
      formData.append("region", form.intervention_zone.trim());

      formData.append(
        "experience_years",
        form.experience_years
      );

      formData.append("hourly_rate", form.hourly_rate || "0");
      formData.append("bio", form.bio.trim());
      formData.append("phone", form.phone.trim());
      formData.append(
        "whatsapp_number",
        form.whatsapp_number.trim()
      );

      formData.append("photo", photo as File);
      formData.append("cv", cv as File);

      /*
       * Le profil doit être vérifié par l’administration.
       */
      formData.append("status", "pending");
      formData.append("is_verified", "0");

      await apiUpload("/experts", formData);

      setMessageType("success");
      setMessage(
        "Votre candidature a été soumise avec succès. Elle sera examinée par l’équipe AgriLink avant sa publication."
      );

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      setSelectedSpecialities([]);
      setPhoto(null);
      setPhotoPreview("");
      setCv(null);

      setForm({
        ...initialForm,
        phone: user?.phone || "",
        whatsapp_number: user?.phone || "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.error("Erreur de création du profil expert :", error);

      showError(
        error?.message ||
          "Une erreur est survenue pendant l’envoi de votre candidature."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
              AgriExpert
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Création d’un profil expert
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Présentez votre expérience et soumettez votre candidature à
              AgriLink.
            </p>
          </div>

          <Link
            href="/expert"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-green-200 bg-white px-5 py-3 font-black text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour à AgriExpert
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {message && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            ) : (
              <Info size={20} className="mt-0.5 shrink-0" />
            )}

            <p>{message}</p>
          </div>
        )}

        <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-xl shadow-slate-200/60"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-green-50 to-orange-50 p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white">
                  <BriefcaseBusiness size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Votre candidature
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Les informations fournies permettront à l’administration
                    de vérifier votre profil.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-9 p-6 md:p-8">
              <FormSection
  icon={<UserRound size={22} />}
  title="Informations personnelles"
  description="Ces informations proviennent automatiquement de votre compte AgriLink."
>
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Nom complet">
      <input
        type="text"
        value={user.name || ""}
        readOnly
        className="input-expert cursor-not-allowed bg-slate-50 text-slate-600"
      />
    </Field>

    <Field label="Adresse email">
      <input
        type="email"
        value={user.email || ""}
        readOnly
        className="input-expert cursor-not-allowed bg-slate-50 text-slate-600"
      />
    </Field>
  </div>
</FormSection>
              <FormSection
                icon={<UserRound size={22} />}
                title="Photo professionnelle"
                description="Ajoutez une photo nette et récente qui sera affichée sur votre profil."
              >
                <div className="flex flex-col gap-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                  {photoPreview ? (
                    <div className="relative shrink-0">
                      <img
                        src={photoPreview}
                        alt="Aperçu de la photo"
                        className="h-32 w-32 rounded-[24px] object-cover"
                      />

                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md hover:bg-red-50"
                        aria-label="Supprimer la photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[24px] bg-white text-slate-300 shadow-sm">
                      <UserRound size={48} />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-green-200 bg-white px-5 py-3 font-black text-green-700 transition hover:bg-green-50">
                      <ImagePlus size={19} />
                      Télécharger une photo

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>

                    <p className="mt-3 text-xs font-medium leading-5 text-slate-500">
                      Formats acceptés : JPG, PNG et WEBP. Taille maximale :
                      5 Mo.
                    </p>
                  </div>
                </div>
              </FormSection>

              <FormSection
                icon={<BriefcaseBusiness size={22} />}
                title="Spécialités"
                description="Sélectionnez une ou plusieurs compétences que vous maîtrisez."
              >
                <div className="flex flex-wrap gap-3">
                  {specialityOptions.map((speciality) => {
                    const isSelected =
                      selectedSpecialities.includes(speciality);

                    return (
                      <button
                        key={speciality}
                        type="button"
                        onClick={() => toggleSpeciality(speciality)}
                        className={`rounded-full border px-5 py-2.5 text-sm font-black transition ${
                          isSelected
                            ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-200"
                            : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {speciality}
                      </button>
                    );
                  })}
                </div>
              </FormSection>

              <FormSection
                icon={<MapPin size={22} />}
                title="Expérience et intervention"
                description="Précisez votre expérience, votre zone d’intervention et votre tarif."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Zone d’intervention"
                    required
                    className="md:col-span-2"
                  >
                    <input
                      type="text"
                      value={form.intervention_zone}
                      onChange={(event) =>
                        updateField(
                          "intervention_zone",
                          event.target.value
                        )
                      }
                      placeholder="Ex. Dakar, Thiès, Kaolack"
                      className="input-expert"
                    />
                  </Field>

                  <Field label="Expérience en années" required>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.experience_years}
                      onChange={(event) =>
                        updateField(
                          "experience_years",
                          event.target.value
                        )
                      }
                      placeholder="Ex. 5"
                      className="input-expert"
                    />
                  </Field>

                  <Field label="Tarif horaire en FCFA">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={form.hourly_rate}
                      onChange={(event) =>
                        updateField("hourly_rate", event.target.value)
                      }
                      placeholder="Ex. 10000"
                      className="input-expert"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                icon={<FileText size={22} />}
                title="Présentation et documents"
                description="Décrivez votre parcours et joignez votre CV."
              >
                <div className="space-y-5">
                  <Field label="Biographie professionnelle" required>
                    <textarea
                      value={form.bio}
                      onChange={(event) =>
                        updateField("bio", event.target.value.slice(0, 1500))
                      }
                      rows={7}
                      placeholder="Présentez votre expertise, vos expériences, les projets réalisés et les types de producteurs que vous accompagnez..."
                      className="input-expert resize-none"
                    />

                    <div className="mt-2 flex justify-between text-xs font-bold text-slate-400">
                      <span>80 caractères minimum</span>
                      <span>{biographyLength}/1500</span>
                    </div>
                  </Field>

                  <Field label="Curriculum vitae au format PDF" required>
                    <label className="mt-2 flex cursor-pointer items-center gap-4 rounded-[22px] border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-green-400 hover:bg-green-50">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                        <UploadCloud size={24} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-slate-800">
                          {cv
                            ? cv.name
                            : "Sélectionner votre curriculum vitae"}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          PDF uniquement — 10 Mo maximum
                        </p>
                      </div>

                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleCvChange}
                        className="hidden"
                      />
                    </label>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                icon={<MapPin size={22} />}
                title="Coordonnées"
                description="Ces coordonnées seront utilisées pour vos échanges avec les utilisateurs."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Téléphone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Ex. 77 123 45 67"
                      className="input-expert"
                    />
                  </Field>

                  <Field label="Numéro WhatsApp" required>
                    <input
                      type="tel"
                      value={form.whatsapp_number}
                      onChange={(event) =>
                        updateField(
                          "whatsapp_number",
                          event.target.value
                        )
                      }
                      placeholder="Ex. 77 123 45 67"
                      className="input-expert"
                    />
                  </Field>
                </div>
              </FormSection>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <div className="flex items-start gap-3">
                  <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-green-700"
                  />

                  <p className="text-sm font-bold leading-6 text-green-800">
                    Votre profil sera soumis à vérification. Il ne sera visible
                    dans l’annuaire AgriExpert qu’après son approbation par
                    l’administration.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/expert"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Annuler
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-7 py-3.5 font-black text-white shadow-lg shadow-green-200 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={19} />

                  {submitting
                    ? "Envoi de la candidature..."
                    : "Soumettre ma candidature"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 xl:sticky xl:top-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <CheckCircle2 size={28} />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                Pour réussir votre candidature
              </h3>

              <div className="mt-5 space-y-3">
                <Advice text="Utilisez une photo professionnelle et récente." />
                <Advice text="Sélectionnez uniquement les spécialités réellement maîtrisées." />
                <Advice text="Décrivez vos résultats et vos expériences de terrain." />
                <Advice text="Joignez un CV clair, actualisé et vérifiable." />
                <Advice text="Utilisez un numéro WhatsApp actif." />
              </div>

              <div className="mt-6 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-bold leading-6 text-orange-800">
                  L’équipe AgriLink pourra vous contacter pour vérifier vos
                  diplômes, références et expériences professionnelles.
                </p>
              </div>
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
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .input-expert::placeholder {
          color: #94a3b8;
        }

        .input-expert:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </main>
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
          <h3 className="text-lg font-black text-slate-950">
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
      <label className="text-sm font-black text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function Advice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-3.5">
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-green-700"
      />

      <p className="text-sm font-bold leading-5 text-green-800">
        {text}
      </p>
    </div>
  );
}