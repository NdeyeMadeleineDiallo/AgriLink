"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { apiRequest } from "@/src/services/api";
import {
  redirectByRole,
  saveAuthSession,
} from "@/src/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "apprenant",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function updateField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (form.password !== form.password_confirmation) {
      setError(
        "Les deux mots de passe ne correspondent pas."
      );
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!data?.token || !data?.user) {
        throw new Error(
          "La réponse d’inscription est incomplète."
        );
      }

      saveAuthSession(data.user, data.token);
      redirectByRole(data.user);
    } catch (err: any) {
      console.error(
        "Erreur d'inscription :",
        err
      );

      setError(
        err?.message ||
          "Une erreur est survenue lors de l’inscription."
      );
    } finally {
      setLoading(false);
    }
  }

  const roleDescriptions: Record<string, string> = {
    apprenant:
      "Accédez aux formations et suivez votre progression.",
    vendeur:
      "Publiez vos produits et développez vos opportunités commerciales.",
    expert:
      "Proposez votre expertise et accompagnez les acteurs agricoles.",
  };

  return (
    <main className="relative flex h-[100svh] overflow-hidden bg-[#F8FBF9] p-3">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute -left-32 top-8 h-[360px] w-[360px] rounded-full bg-emerald-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-orange-200/30 blur-[100px]" />

      {/* MAIN CARD */}
      <div className="relative mx-auto grid h-full w-full max-w-[1360px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.11)] lg:grid-cols-[0.42fr_0.58fr]">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}
        <section className="relative hidden h-full overflow-hidden bg-gradient-to-br from-[#006B4F] via-[#00895B] to-[#3AAD4F] px-9 py-7 text-white lg:flex lg:flex-col">

          {/* DECORATIONS */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[34px] border-lime-300/10" />

          <div className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-orange-400/25 blur-[70px]" />

          <div className="pointer-events-none absolute right-9 top-48 grid grid-cols-5 gap-2.5 opacity-20">
            {Array.from({ length: 20 }).map(
              (_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-lime-300"
                />
              )
            )}
          </div>

          {/* LOGO */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center"
            >
              <img
                src="/images/agrilink-logo.png"
                alt="AgriLink"
                className="h-[88px] w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          {/* CONTENT */}
          <div className="relative z-10 mt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur-xl">
              <Sparkles
                size={14}
                className="text-lime-300"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                Rejoignez AgriLink
              </span>
            </div>

            <h1 className="mt-4 max-w-[430px] text-[36px] font-black leading-[1.04] tracking-[-0.035em]">
              Un compte.

              <span className="mt-1 block text-lime-300">
                Plusieurs opportunités.
              </span>
            </h1>

            <p className="mt-3 max-w-[400px] text-[13px] leading-6 text-white/75">
              Formation, marché agricole et expertise
              réunis dans une seule plateforme pensée
              pour simplifier votre parcours.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="relative z-10 mt-auto space-y-3">
            <FeatureCard
              icon={<Users size={19} />}
              title="Un profil unique"
              description="Apprenant, vendeur ou expert."
            />

            <FeatureCard
              icon={
                <ShieldCheck size={19} />
              }
              title="Accès sécurisé"
              description="Votre espace reste protégé."
            />

            <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-white/65">
              <ShieldCheck size={14} />
              Inscription sécurisée AgriLink
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT FORM
        ====================================================== */}
        <section className="flex h-full items-center bg-white/95 px-6 py-4 sm:px-9 lg:px-12 xl:px-14">
          <div className="mx-auto w-full max-w-[630px]">

            {/* MOBILE LOGO */}
            <Link
              href="/"
              className="mb-4 inline-flex lg:hidden"
            >
              <img
                src="/images/agrilink-logo.png"
                alt="AgriLink"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* HEADER */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                Nouveau sur AgriLink
              </p>

              <h2 className="mt-1.5 text-[30px] font-black tracking-[-0.035em] text-slate-950 md:text-[32px]">
                Créez votre compte
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Commencez en quelques secondes.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-3 rounded-[13px] border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleRegister}
              className="mt-4"
            >
              <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">

                {/* NAME */}
                <FieldWrapper label="Nom complet">
                  <div className="relative">
                    <FieldIcon color="green">
                      <User size={16} />
                    </FieldIcon>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateField(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Votre nom"
                      autoComplete="name"
                      required
                      className="field-input"
                    />
                  </div>
                </FieldWrapper>

                {/* EMAIL */}
                <FieldWrapper label="Adresse email">
                  <div className="relative">
                    <FieldIcon color="orange">
                      <Mail size={16} />
                    </FieldIcon>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="email@exemple.com"
                      autoComplete="email"
                      required
                      className="field-input"
                    />
                  </div>
                </FieldWrapper>

                {/* PHONE */}
                <FieldWrapper label="Téléphone">
                  <div className="relative">
                    <FieldIcon color="green">
                      <Phone size={16} />
                    </FieldIcon>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="+221 ..."
                      autoComplete="tel"
                      className="field-input"
                    />
                  </div>
                </FieldWrapper>

                {/* ROLE */}
                <FieldWrapper label="Profil principal">
                  <select
                    value={form.role}
                    onChange={(e) =>
                      updateField(
                        "role",
                        e.target.value
                      )
                    }
                    className="h-[48px] w-full cursor-pointer rounded-[14px] border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/70"
                  >
                    <option value="apprenant">
                      Apprenant
                    </option>

                    <option value="vendeur">
                      Vendeur
                    </option>

                    <option value="expert">
                      Expert
                    </option>
                  </select>
                </FieldWrapper>

                {/* PASSWORD */}
                <FieldWrapper label="Mot de passe">
                  <div className="relative">
                    <FieldIcon color="orange">
                      <LockKeyhole size={16} />
                    </FieldIcon>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={(e) =>
                        updateField(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Mot de passe"
                      autoComplete="new-password"
                      required
                      className="field-input !pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-700"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </FieldWrapper>

                {/* CONFIRM PASSWORD */}
                <FieldWrapper label="Confirmation">
                  <div className="relative">
                    <FieldIcon color="green">
                      <LockKeyhole size={16} />
                    </FieldIcon>

                    <input
                      type={
                        showConfirmation
                          ? "text"
                          : "password"
                      }
                      value={
                        form.password_confirmation
                      }
                      onChange={(e) =>
                        updateField(
                          "password_confirmation",
                          e.target.value
                        )
                      }
                      placeholder="Confirmer"
                      autoComplete="new-password"
                      required
                      className="field-input !pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmation(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-700"
                      aria-label={
                        showConfirmation
                          ? "Masquer la confirmation"
                          : "Afficher la confirmation"
                      }
                    >
                      {showConfirmation ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </FieldWrapper>
              </div>

              {/* ROLE INFORMATION */}
              <div className="mt-3 flex items-center gap-2.5 rounded-[13px] border border-emerald-100 bg-emerald-50/70 px-3 py-2">
                <Info
                  size={15}
                  className="shrink-0 text-emerald-600"
                />

                <p className="text-[10px] leading-4 text-emerald-800">
                  <span className="font-black capitalize">
                    {form.role}
                  </span>
                  {" : "}
                  {roleDescriptions[form.role]}
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#008E64] via-[#00A85A] to-[#00B943] text-[14px] font-black text-white shadow-[0_14px_28px_rgba(0,166,88,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(0,166,88,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Création du compte..."
                  : "Créer mon compte"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* LOGIN */}
              <p className="mt-3 text-center text-[11px] text-slate-500">
                Déjà inscrit ?{" "}
                <Link
                  href="/login"
                  className="font-black text-emerald-700 transition hover:text-emerald-800"
                >
                  Se connecter
                </Link>
              </p>

              {/* BACK */}
              <div className="mt-1.5 text-center">
                <Link
                  href="/"
                  className="text-[10px] font-semibold text-slate-400 transition hover:text-emerald-700"
                >
                  ← Retour à AgriLink
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* COMMON FIELD CSS */}
      <style jsx global>{`
        .field-input {
          height: 48px;
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: white;
          padding-left: 48px;
          padding-right: 14px;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: 0.2s ease;
        }

        .field-input::placeholder {
          color: #94a3b8;
        }

        .field-input:focus {
          border-color: #34d399;
          box-shadow: 0 0 0 4px rgba(209, 250, 229, 0.7);
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   FIELD WRAPPER
========================================================= */

function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-black text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   FIELD ICON
========================================================= */

function FieldIcon({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "orange";
}) {
  const style =
    color === "orange"
      ? "bg-orange-50 text-orange-500"
      : "bg-emerald-50 text-emerald-600";

  return (
    <div
      className={`pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[10px] ${style}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-white/25 bg-white/10 p-3 backdrop-blur-xl transition hover:bg-white/15">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-white/20 to-lime-300/20 text-lime-200">
        {icon}
      </div>

      <div>
        <p className="text-[13px] font-black text-white">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-white/70">
          {description}
        </p>
      </div>
    </div>
  );
}