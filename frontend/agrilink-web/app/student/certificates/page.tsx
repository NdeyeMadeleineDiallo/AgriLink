"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Circle,
  Download,
  Eye,
  FileBadge,
  GraduationCap,
  LoaderCircle,
  Lock,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";

import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

type LevelData = {
  total_courses: number;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
  is_completed: boolean;
};

type CertificateStatus = {
  eligible: boolean;
  global_progress: number;

  levels: {
    debutant: LevelData;
    intermediaire: LevelData;
    avance: LevelData;
  };

  certificate: any | null;
};

export default function StudentCertificatesPage() {
  const [user, setUser] = useState<any>(null);

  const [status, setStatus] =
    useState<CertificateStatus | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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
    loadCertificateStatus();
  }, []);

  async function loadCertificateStatus() {
    try {
      setLoading(true);

      const data = await apiRequest(
        "/certificate/status"
      );

      setStatus(data);
    } catch (error: any) {
      console.error(
        "Erreur chargement certificat :",
        error
      );

      setMessageType("error");

      setMessage(
        error?.message ||
          "Impossible de charger votre progression."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateCertificate() {
    if (!status?.eligible || generating) return;

    try {
      setGenerating(true);
      setMessage("");
      setMessageType("");

      const data = await apiRequest(
        "/certificate/generate",
        {
          method: "POST",
        }
      );

      setMessageType("success");

      setMessage(
        data.message ||
          "Votre certificat final a été généré avec succès."
      );

      await loadCertificateStatus();
    } catch (error: any) {
      console.error(
        "Erreur génération certificat :",
        error
      );

      setMessageType("error");

      setMessage(
        error?.message ||
          "Impossible de générer votre certificat."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyCertificateLink(
    url: string
  ) {
    try {
      await navigator.clipboard.writeText(url);

      setMessageType("success");
      setMessage(
        "Lien du certificat copié."
      );
    } catch {
      setMessageType("error");
      setMessage(
        "Impossible de copier le lien."
      );
    }
  }

  if (!user) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container-page py-10">
          <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white p-10 text-slate-500 shadow-md">
            <LoaderCircle
              size={22}
              className="animate-spin text-green-700"
            />

            Chargement de votre progression...
          </div>
        </div>
      </main>
    );
  }

  if (!status) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container-page py-10">
          <div className="rounded-[24px] border border-red-100 bg-white p-10 text-center shadow-md">
            <Award
              size={40}
              className="mx-auto text-red-300"
            />

            <h1 className="mt-4 text-2xl font-black text-slate-950">
              Progression indisponible
            </h1>

            <p className="mt-3 text-slate-500">
              {message ||
                "Impossible de récupérer votre progression."}
            </p>

            <Link
              href="/student"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
            >
              <ArrowLeft size={17} />
              Retour
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const certificateUrl =
    status.certificate?.file_path
      ? getCertificateUrl(
          status.certificate.file_path
        )
      : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER */}
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Mon certificat
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Suivez votre progression vers la certification finale.
            </p>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        {/* BANNIÈRE IMAGE */}
        <div
          className="relative overflow-hidden rounded-[28px] bg-cover bg-center shadow-xl"
          style={{
            backgroundImage:
              "url('/images/certificates-banner.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-green-950/80 to-orange-900/55" />

          <div className="relative z-10 p-7 text-white md:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  <Sparkles
                    size={15}
                    className="text-orange-300"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-100">
                    Parcours certifiant AgriAcademy
                  </span>
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
                  Continuez{" "}
                  <span className="text-orange-400">
                    {user.name}
                  </span>
                  , votre certificat est au bout du parcours.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 md:text-[15px]">
                  Validez les trois phases —
                  Débutant, Intermédiaire et Avancé —
                  pour obtenir votre certificat final
                  AgriAcademy.
                </p>
              </div>

              <div className="w-full max-w-[230px] rounded-[22px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-medium text-white/75">
                  Progression globale
                </p>

                <div className="mt-1 flex items-end gap-1">
                  <p className="text-4xl font-black">
                    {status.global_progress}
                  </p>

                  <span className="mb-1 text-lg font-bold text-white/70">
                    %
                  </span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        status.global_progress,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mt-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" && (
              <CheckCircle2 size={18} />
            )}

            {message}
          </div>
        )}

        {/* TITRE PARCOURS */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
            Votre parcours
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Les 3 phases de certification
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Chaque phase doit être terminée à 100 %.
          </p>
        </div>

        {/* 3 NIVEAUX */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <LevelCard
            number="01"
            title="Débutant"
            subtitle="Fondamentaux agricoles"
            price="Gratuit"
            data={status.levels.debutant}
            href="/student/level?level=debutant"
          />

          <LevelCard
            number="02"
            title="Intermédiaire"
            subtitle="Maîtrise technique"
            price="5 000 FCFA"
            data={status.levels.intermediaire}
            href="/student/level?level=intermediaire"
          />

          <LevelCard
            number="03"
            title="Avancé"
            subtitle="Perfectionnement"
            price="15 000 FCFA"
            data={status.levels.avance}
            href="/student/level?level=avance"
          />
        </div>

        {/* CERTIFICAT FINAL */}
        <div
          className={`mt-7 overflow-hidden rounded-[28px] border shadow-md ${
            status.eligible
              ? "border-green-200 bg-green-50"
              : "border-slate-100 bg-white"
          }`}
        >
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] ${
                    status.eligible
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {status.eligible ? (
                    <Trophy size={30} />
                  ) : (
                    <Lock size={27} />
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.16em] ${
                      status.eligible
                        ? "text-green-700"
                        : "text-slate-400"
                    }`}
                  >
                    Certification finale
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {status.eligible
                      ? "Votre certificat est débloqué"
                      : "Votre certificat est encore verrouillé"}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {status.eligible
                      ? "Félicitations ! Vous avez terminé les trois phases du parcours certifiant AgriAcademy."
                      : `Vous êtes actuellement à ${status.global_progress} %. Terminez les trois phases à 100 % pour débloquer votre certificat final.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {certificateUrl ? (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      <Eye size={17} />
                      Aperçu
                    </a>

                    <a
                      href={certificateUrl}
                      download
                      className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      <Download size={17} />
                      Télécharger
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        copyCertificateLink(
                          certificateUrl
                        )
                      }
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700 transition hover:bg-orange-200"
                      title="Copier le lien"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                ) : status.eligible ? (
                  <button
                    type="button"
                    onClick={generateCertificate}
                    disabled={generating}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {generating ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Award size={18} />
                        Générer mon certificat
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
                  >
                    <Lock size={17} />
                    Certificat verrouillé
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM PROGRESS */}
          {!status.eligible && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 md:px-7">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">
                  Progression vers la certification
                </span>

                <span className="text-green-700">
                  {status.global_progress}%
                </span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-green-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      status.global_progress,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* CERTIFICAT DÉJÀ GÉNÉRÉ */}
        {status.certificate &&
          certificateUrl && (
            <div className="mt-7 rounded-[26px] border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/50">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <FileBadge size={27} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">
                    Certificat de réussite
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    Parcours complet AgriAcademy
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Décerné à{" "}
                    <span className="font-semibold text-slate-800">
                      {user.name}
                    </span>
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Numéro du certificat"
                      value={
                        status.certificate
                          .certificate_number ||
                        "-"
                      }
                    />

                    <Info
                      label="Date d’émission"
                      value={
                        status.certificate
                          .issued_at
                          ? new Date(
                              status.certificate
                                .issued_at
                            ).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* RAPPEL */}
        <div className="mt-7 flex items-start gap-4 rounded-[22px] border border-orange-100 bg-orange-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <GraduationCap size={21} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Une seule certification pour le parcours complet
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Le certificat final n’est pas délivré après
              un seul cours ou une seule phase. Il atteste
              de la validation des niveaux Débutant,
              Intermédiaire et Avancé.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LevelCard({
  number,
  title,
  subtitle,
  price,
  data,
  href,
}: {
  number: string;
  title: string;
  subtitle: string;
  price: string;
  data: LevelData;
  href: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        data.is_completed
          ? "border-green-200 bg-green-50"
          : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              data.is_completed
                ? "bg-green-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {data.is_completed ? (
              <CheckCircle2 size={21} />
            ) : (
              <Circle size={20} />
            )}
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Phase {number}
            </p>

            <h3 className="text-lg font-bold text-slate-950">
              {title}
            </h3>
          </div>
        </div>

        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          {price}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {subtitle}
      </p>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-slate-950">
            {data.percentage}%
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {data.completed_lessons}/
            {data.total_lessons} leçons
          </p>
        </div>

        {data.is_completed && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Terminé
          </span>
        )}
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            data.is_completed
              ? "bg-green-600"
              : "bg-orange-400"
          }`}
          style={{
            width: `${Math.min(
              data.percentage,
              100
            )}%`,
          }}
        />
      </div>

      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-semibold text-green-700 transition hover:text-green-800"
      >
        Voir les cours →
      </Link>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}

function getCertificateUrl(
  path: string
): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = String(path)
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
}