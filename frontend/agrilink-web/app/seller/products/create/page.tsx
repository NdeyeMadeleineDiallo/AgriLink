"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  Save,
  ShoppingBasket,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest, apiUpload } from "@/src/services/api";

type ProductForm = {
  category_id: string;
  title: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  region: string;
  city: string;
  phone: string;
  whatsapp_number: string;
};

const units = [
  { value: "kg", label: "Kilogramme (kg)" },
  { value: "sac", label: "Sac" },
  { value: "litre", label: "Litre" },
  { value: "piece", label: "Pièce" },
  { value: "tonne", label: "Tonne" },
  { value: "caisse", label: "Caisse" },
];

const defaultCategories = [
  { id: "culture", name: "Culture" },
  { id: "semences", name: "Semences" },
  { id: "engrais", name: "Engrais" },
  { id: "equipements", name: "Équipements" },
  { id: "betail", name: "Bétail" },
];

const initialForm: ProductForm = {
  category_id: "",
  title: "",
  description: "",
  price: "",
  quantity: "",
  unit: "",
  region: "",
  city: "",
  phone: "",
  whatsapp_number: "",
};

export default function CreateProductPage() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  async function loadCategories() {
  try {
    const data = await apiRequest("/categories");
    setCategories(data.data || data.categories || []);
  } catch (error) {
    console.error("Erreur de chargement des catégories :", error);
  }
}

  function updateField(name: keyof ProductForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;

      return isImage && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      setMessageType("error");
      setMessage(
        "Certaines images ont été refusées. Utilisez des images JPG, PNG ou WEBP de moins de 5 Mo."
      );
    }

    const remainingSlots = 4 - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    setImages((previous) => [...previous, ...filesToAdd]);

    const newPreviews = filesToAdd.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((previous) => [...previous, ...newPreviews]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]);

    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );

    setImagePreviews((previous) =>
      previous.filter((_, previewIndex) => previewIndex !== index)
    );
  }

  function validateForm(): boolean {
    if (!form.title.trim()) {
      showError("Veuillez renseigner le titre du produit.");
      return false;
    }

    if (!form.category_id) {
      showError("Veuillez sélectionner une catégorie.");
      return false;
    }

    if (!form.price || Number(form.price) <= 0) {
      showError("Veuillez saisir un prix valide.");
      return false;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      showError("Veuillez saisir une quantité valide.");
      return false;
    }

    if (!form.unit) {
      showError("Veuillez sélectionner une unité.");
      return false;
    }

    if (!form.city.trim()) {
      showError("Veuillez renseigner la ville.");
      return false;
    }

    if (!form.whatsapp_number.trim()) {
      showError("Veuillez renseigner le numéro WhatsApp.");
      return false;
    }

    if (images.length === 0) {
      showError("Veuillez ajouter au moins une photo du produit.");
      return false;
    }

    return true;
  }

  function showError(text: string) {
    setMessageType("error");
    setMessage(text);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("category_id", form.category_id);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("unit", form.unit);
      formData.append("region", form.region.trim());
      formData.append("city", form.city.trim());
      formData.append("phone", form.phone.trim());
      formData.append(
        "whatsapp_number",
        form.whatsapp_number.trim()
      );

      images.forEach((image) => {
        formData.append("images[]", image);
      });

      await apiUpload("/products", formData);

      setMessageType("success");
      setMessage(
        "Votre annonce a été publiée avec succès et est maintenant visible sur AgriMarket."
      );

      imagePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );

      setImages([]);
      setImagePreviews([]);
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
      console.error("Erreur de publication :", error);

      setMessageType("error");
      setMessage(
        error?.message ||
          "Une erreur est survenue pendant la publication de l’annonce."
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
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              AgriMarket
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Publier une annonce
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Présentez clairement votre produit pour attirer des acheteurs.
            </p>
          </div>

          <Link
            href="/seller"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-green-200 bg-white px-6 py-3 font-black text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour à AgriMarket
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
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
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
                  <ShoppingBasket size={27} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Informations du produit
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Les champs importants doivent être remplis avec précision.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6 md:p-8">
              <FormSection
                icon={<Camera size={22} />}
                title="Photos du produit"
                description="Ajoutez jusqu’à quatre photos claires et réelles."
              >
                <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-green-200 bg-green-50/50 p-6 text-center transition hover:border-green-500 hover:bg-green-50">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    disabled={images.length >= 4}
                  />

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-green-700 shadow-md">
                    <ImagePlus size={30} />
                  </div>

                  <p className="mt-4 font-black text-slate-900">
                    Cliquez pour ajouter des photos
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    JPG, PNG ou WEBP — 5 Mo maximum par image
                  </p>

                  <p className="mt-3 text-xs font-black text-green-700">
                    {images.length}/4 image(s) ajoutée(s)
                  </p>
                </label>

                {imagePreviews.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-100"
                      >
                        <img
                          src={preview}
                          alt={`Aperçu ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-green-700 px-3 py-1 text-[10px] font-black uppercase text-white">
                            Photo principale
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                          aria-label="Supprimer cette photo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormSection>

              <FormSection
                icon={<Package size={22} />}
                title="Détails de l’annonce"
                description="Indiquez les caractéristiques principales du produit."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Titre du produit"
                    required
                    className="md:col-span-2"
                  >
                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      placeholder="Ex. Tomates fraîches de Niayes"
                      className="input-market"
                    />
                  </Field>

                  <Field label="Catégorie" required>
                    <select
                      value={form.category_id}
                      onChange={(event) =>
                        updateField(
                          "category_id",
                          event.target.value
                        )
                      }
                      className="input-market"
                    >
                      <option value="">
                        Choisir une catégorie
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Unité de vente" required>
                    <select
                      value={form.unit}
                      onChange={(event) =>
                        updateField("unit", event.target.value)
                      }
                      className="input-market"
                    >
                      <option value="">Choisir une unité</option>

                      {units.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Prix en FCFA" required>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      placeholder="Ex. 12000"
                      className="input-market"
                    />
                  </Field>

                  <Field label="Quantité disponible" required>
                    <input
                      type="number"
                      min="0"
                      step="01"
                      value={form.quantity}
                      onChange={(event) =>
                        updateField(
                          "quantity",
                          event.target.value
                        )
                      }
                      placeholder="Ex. 10"
                      className="input-market"
                    />
                  </Field>

                  <Field
                    label="Conditions de vente et description"
                    className="md:col-span-2"
                  >
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value
                        )
                      }
                      rows={5}
                      placeholder="Décrivez la qualité, les conditions de livraison, le prix négociable ou non, la disponibilité..."
                      className="input-market resize-none"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                icon={<MapPin size={22} />}
                title="Localisation et contacts"
                description="Ces informations permettront aux acheteurs de vous contacter."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Région">
                    <input
                      type="text"
                      value={form.region}
                      onChange={(event) =>
                        updateField("region", event.target.value)
                      }
                      placeholder="Ex. Dakar"
                      className="input-market"
                    />
                  </Field>

                  <Field label="Ville ou localité" required>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      placeholder="Ex. Pikine"
                      className="input-market"
                    />
                  </Field>

                  <Field label="Téléphone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Ex. 77 123 45 67"
                      className="input-market"
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
                      className="input-market"
                    />
                  </Field>
                </div>
              </FormSection>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/seller"
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
                    ? "Publication en cours..."
                    : "Publier l’annonce"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60 xl:sticky xl:top-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <CheckCircle2 size={27} />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                Conseils pour vendre rapidement
              </h3>

              <div className="mt-5 space-y-3">
                <Advice text="Utilisez des photos nettes prises sous une bonne lumière." />
                <Advice text="Indiquez un prix réel et une quantité disponible." />
                <Advice text="Précisez les conditions de livraison ou de retrait." />
                <Advice text="Utilisez un numéro WhatsApp actif et joignable." />
                <Advice text="Répondez rapidement aux acheteurs intéressés." />
              </div>

              <div className="mt-6 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-bold leading-6 text-orange-800">
                  L’annonce sera soumise à l’administrateur avant son
                  affichage public dans AgriMarket.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        .input-market {
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

        .input-market::placeholder {
          color: #94a3b8;
        }

        .input-market:focus {
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