"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { apiRequest } from "@/src/services/api";
import {
  redirectByRole,
  saveAuthSession,
} from "@/src/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!data.token || !data.user) {
        throw {
          message:
            "La réponse de connexion est incomplète.",
        };
      }

      saveAuthSession(
        data.user,
        data.token
      );

      redirectByRole(data.user);
    } catch (error: any) {
      console.error(
        "Erreur de connexion :",
        error
      );

      setError(
        error?.message ||
          "Adresse email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-br from-[#F5FBF6] via-white to-[#FFF7EF] px-3 py-3 md:px-4">
      {/* GLOWS */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-200/35 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-orange-200/35 blur-[110px]" />

      <div className="relative mx-auto grid h-full max-w-[1180px] overflow-hidden rounded-[34px] border border-white/80 bg-white/60 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 p-5 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-lime-300/20 blur-[90px]" />
          <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-300/20 blur-[90px]" />

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center"
            >
              <img
                src="/images/agrilink-logo.png"
                alt="AgriLink"
                className="h-[60px] w-auto object-contain brightness-0 invert"
              />
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
              <Sparkles
                size={14}
                className="text-lime-200"
              />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-green-50">
                Votre espace AgriLink
              </span>
            </div>

            <h2 className="mt-5 max-w-[430px] text-[24px] font-black leading-[1.08] tracking-[-0.035em]">
              Retrouvez tout votre parcours agricole en un seul endroit.
            </h2>

            <p className="mt-4 max-w-[420px] text-[14px] leading-7 text-white/75">
              Accédez à vos formations, vos annonces
              AgriMarket, vos services AgriExpert et
              votre progression depuis un seul compte.
            </p>
          </div>

          <div className="relative z-10 grid gap-3">
            <Feature
              icon={<Leaf size={17} />}
              title="AgriAcademy"
              text="Progressez dans vos formations."
            />

            <Feature
              icon={
                <ShieldCheck size={17} />
              }
              title="Un seul compte"
              text="Accédez simplement à tout l’écosystème."
            />
          </div>
        </section>

        {/* RIGHT / FORM */}
        <section className="flex items-center justify-center p-4 sm:p-6 md:p-7">
          <div className="w-full max-w-[440px]">
            {/* LOGO MOBILE */}
            <div className="mb-7 flex justify-center lg:hidden">
              <Link href="/">
                <img
                  src="/images/agrilink-logo.png"
                  alt="AgriLink"
                  className="h-[68px] w-auto object-contain"
                />
              </Link>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.17em] text-emerald-700">
                Heureux de vous revoir
              </p>

              <h1 className="mt-2 text-[30px] font-black tracking-[-0.03em] text-slate-950 md:text-[32px]">
                Connectez-vous
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Entrez vos identifiants pour accéder
                à votre espace AgriLink.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-[16px] border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700 shadow-sm backdrop-blur">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="mt-5 space-y-4"
            >
              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Adresse email
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    type="email"
                    placeholder="votre@email.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-[15px] border border-slate-200/90 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none backdrop-blur transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100/70"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Mot de passe
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <div className="relative mt-2">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-[15px] border border-slate-200/90 bg-white/80 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none backdrop-blur transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100/70"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(21,128,61,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(21,128,61,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* REGISTER */}
            <div className="mt-4 rounded-[18px] border border-white/80 bg-white/60 px-4 py-4 text-center shadow-sm backdrop-blur-xl">
              <p className="text-sm text-slate-500">
                Vous n’avez pas encore de compte ?{" "}
                <Link
                  href="/register"
                  className="font-black text-emerald-700 transition hover:text-emerald-800"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* HOME */}
            <div className="mt-3 text-center">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-400 transition hover:text-emerald-700"
              >
                ← Retour à AgriLink
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-white/15 bg-white/10 p-2.5 backdrop-blur-xl">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lime-100">
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-white/65">
          {text}
        </p>
      </div>
    </div>
  );
}