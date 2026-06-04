"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function ExpertProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [expertProfile, setExpertProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    speciality: "",
    bio: "",
    experience_years: "",
    education_level: "",
    region: "",
    city: "",
    intervention_zone: "",
    whatsapp_number: "",
    email_contact: "",
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await apiRequest("/my-expert-profile");
      const profile = data.expert_profile;

      setExpertProfile(profile);

      if (profile) {
        setForm({
          speciality: profile.speciality || "",
          bio: profile.bio || "",
          experience_years: String(profile.experience_years || ""),
          education_level: profile.education_level || "",
          region: profile.region || "",
          city: profile.city || "",
          intervention_zone: profile.intervention_zone || "",
          whatsapp_number: profile.whatsapp_number || "",
          email_contact: profile.email_contact || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      if (!expertProfile?.id) {
        setMessage("Aucun profil expert trouvé.");
        return;
      }

      await apiRequest(`/experts/${expertProfile.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          experience_years: Number(form.experience_years || 0),
        }),
      });

      setMessage("Profil expert mis à jour avec succès.");
      loadProfile();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de la mise à jour.");
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Modifier mon profil expert
            </h1>
            <p className="text-sm text-slate-500">
              Mettez à jour vos informations professionnelles.
            </p>
          </div>

          <Link href="/expert" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {loading ? (
          <div className="card p-8 text-slate-500">Chargement du profil...</div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8">
            {message && (
              <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
                {message}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Spécialité" value={form.speciality} onChange={(v) => updateField("speciality", v)} />
              <Input label="Années d’expérience" value={form.experience_years} onChange={(v) => updateField("experience_years", v)} />
              <Input label="Niveau d’étude" value={form.education_level} onChange={(v) => updateField("education_level", v)} />
              <Input label="Région" value={form.region} onChange={(v) => updateField("region", v)} />
              <Input label="Ville" value={form.city} onChange={(v) => updateField("city", v)} />
              <Input label="Zone d’intervention" value={form.intervention_zone} onChange={(v) => updateField("intervention_zone", v)} />
              <Input label="Numéro WhatsApp" value={form.whatsapp_number} onChange={(v) => updateField("whatsapp_number", v)} />
              <Input label="Email de contact" value={form.email_contact} onChange={(v) => updateField("email_contact", v)} />
            </div>

            <div className="mt-5">
              <label className="text-sm font-bold text-slate-700">
                Biographie
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <button className="btn-primary mt-6 inline-flex items-center gap-2">
              <Save size={18} />
              Enregistrer les modifications
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
      />
    </div>
  );
}