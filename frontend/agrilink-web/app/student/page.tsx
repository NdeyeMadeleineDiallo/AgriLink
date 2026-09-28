"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Leaf,
  Lock,
  LogOut,
  PlayCircle,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser, logout } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const catalog = [
  {
    id: "debutant",
    number: "01",
    level: "NIVEAU DÉBUTANT",
    title: "Les 3 fondations d'une récolte rentable",
    description:
      "Maîtrisez les bases essentielles pour lancer vos productions avec succès.",
    image: "/images/course-beginner.jpg",
    price: "GRATUIT",
    amount: 0,
    color: "green",
    icon: <Leaf size={25} />,
    learners: "1 245 apprenants",
    rating: "4.8/5",
    features: [
      "Choisir les bonnes cultures",
      "Préparer un sol fertile",
      "Semer et entretenir efficacement",
    ],
  },
  {
    id: "intermediaire",
    number: "02",
    level: "NIVEAU INTERMÉDIAIRE",
    title: "Protéger sa récolte : maladies, traitements bio et prévention",
    description:
      "Apprenez à prévenir et traiter naturellement pour des cultures saines et durables.",
    image: "/images/course-intermediate.jpg",
    price: "5 000 FCFA",
    amount: 5000,
    color: "orange",
    icon: <ShieldCheck size={25} />,
    learners: "892 apprenants",
    rating: "4.7/5",
    features: [
      "Identifier et prévenir les maladies",
      "Traitements bio et solutions naturelles",
      "Préserver le rendement et la qualité",
    ],
  },
  {
    id: "avance",
    number: "03",
    level: "NIVEAU AVANCÉ",
    title: "Vendre mieux, négocier fort et transformer pour multiplier",
    description:
      "Valorisez, transformez et maximisez vos revenus agricoles.",
    image: "/images/course-advanced.jpg",
    price: "15 000 FCFA",
    amount: 15000,
    color: "emerald",
    icon: <TrendingUp size={25} />,
    learners: "563 apprenants",
    rating: "4.9/5",
    features: [
      "Techniques de vente et négociation",
      "Transformation et valorisation",
      "Stratégies pour multiplier vos profits",
    ],
  },
];

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [paidAccess, setPaidAccess] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    setPaidAccess({
      intermediaire:
        localStorage.getItem("agrilink_access_intermediaire") === "true",
      avance:
        localStorage.getItem("agrilink_access_avance") === "true",
    });

    loadStudentData();
  }, []);

  async function loadStudentData() {
    try {
      const [progressResult, certificatesResult, subscriptionResult] =
        await Promise.allSettled([
          apiRequest("/my-progress"),
          apiRequest("/my-certificates"),
          apiRequest("/my-subscription"),
        ]);

      if (progressResult.status === "fulfilled") {
        setProgress(progressResult.value.progress || []);
      }

      if (certificatesResult.status === "fulfilled") {
        setCertificates(certificatesResult.value.certificates || []);
      }

      if (subscriptionResult.status === "fulfilled") {
        setSubscription(subscriptionResult.value.subscription || null);
      }
    } catch (error) {
      console.error("Erreur de chargement de l’espace apprenant :", error);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenFormation(item: any) {
  window.location.href = `/student/level?level=${item.id}`;
}

  if (!user) return null;

  const averageProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce(
            (sum, item) => sum + Number(item.progress_percentage || 0),
            0
          ) / progress.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Espace Apprenant
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Bienvenue {user.name}, suivez vos formations et votre progression.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-bold text-green-700 transition hover:bg-green-50"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-bold text-green-700 transition hover:bg-green-50"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        <div
          className="relative flex min-h-[320px] overflow-hidden rounded-[28px] bg-cover bg-center shadow-xl"
          style={{
            backgroundImage: "url('/images/student-banner.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/100 via-green-1000/70 to-orange-900/20" />

          <div className="relative z-10 flex w-full flex-col justify-between px-7 py-8 text-white md:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-green-300">
                Votre parcours AgriAcademy
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight md:text-4xl">
                Continuez votre progression agricole.
              </h2>

              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/90 md:text-lg">
                Progressez du niveau débutant au niveau avancé et débloquez
                votre certificat final après avoir terminé le parcours complet.
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/student/certificates"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                <Award size={18} />
                Voir mes certificats
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[22px] border border-slate-100 bg-white p-4 shadow-md shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg">
            Chargement de votre espace...
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<BookOpen />}
              label="Cours suivis"
              value={progress.length}
            />

            <StatCard
              icon={<TrendingUp />}
              label="Progression moyenne"
              value={`${averageProgress}%`}
            />

            <StatCard
              icon={<Award />}
              label="Certificats"
              value={certificates.length}
            />

            <StatCard
              icon={<CreditCard />}
              label="Abonnement"
              value={subscription ? "Actif" : "Aucun"}
            />
          </div>
        )}

        <div className="mt-10">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <BookOpen size={25} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Parcours AgriAcademy
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Nos trois niveaux de formation
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Avancez progressivement et terminez les trois niveaux pour
                obtenir votre certificat final AgriAcademy.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {catalog.map((item) => (
              <CourseCard
                key={item.id}
                item={item}
                hasAccess={item.amount === 0 || paidAccess[item.id]}
                onOpen={() => handleOpenFormation(item)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 rounded-[28px] border border-green-100 bg-white p-6 shadow-md shadow-slate-200/60 md:grid-cols-2 xl:grid-cols-4">
          <Benefit
            icon={<BookOpen size={25} />}
            title="Apprentissage pratique"
            description="Des contenus concrets et directement applicables sur le terrain."
          />

          <Benefit
            icon={<Award size={25} />}
            title="Certificat final"
            description="Débloquez votre certificat après avoir terminé les trois niveaux."
          />

          <Benefit
            icon={<PlayCircle size={25} />}
            title="Accessible partout"
            description="Apprenez à votre rythme depuis votre ordinateur ou votre mobile."
          />

          <Benefit
            icon={<Users size={25} />}
            title="Accompagnement"
            description="Profitez du support et des conseils d’experts pendant votre parcours."
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function CourseCard({
  item,
  hasAccess,
  onOpen,
}: {
  item: any;
  hasAccess: boolean;
  onOpen: () => void;
}) {
  const styles: Record<string, any> = {
    green: {
      border: "border-green-200",
      background: "bg-gradient-to-br from-green-50 to-white",
      badge: "bg-green-700 text-white",
      level: "text-green-700",
      iconBg: "bg-green-100 text-green-700",
      price: "bg-green-700 text-white",
      button: "bg-green-600 hover:bg-green-700",
      feature: "text-green-700 bg-green-100",
      soft: "bg-green-50",
    },
    orange: {
      border: "border-orange-200",
      background: "bg-gradient-to-br from-orange-50 to-white",
      badge: "bg-orange-500 text-white",
      level: "text-orange-600",
      iconBg: "bg-orange-100 text-orange-600",
      price: "bg-orange-500 text-white",
      button: "bg-orange-500 hover:bg-orange-600",
      feature: "text-orange-600 bg-orange-100",
      soft: "bg-orange-50",
    },
    emerald: {
      border: "border-emerald-200",
      background: "bg-gradient-to-br from-emerald-50 to-white",
      badge: "bg-emerald-700 text-white",
      level: "text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-700",
      price: "bg-emerald-700 text-white",
      button: "bg-emerald-700 hover:bg-emerald-800",
      feature: "text-emerald-700 bg-emerald-100",
      soft: "bg-emerald-50",
    },
  };

  const style = styles[item.color];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[26px] border ${style.border} ${style.background} p-3 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-xl px-3 py-2 text-sm font-black ${style.badge}`}
              >
                {item.number}
              </span>

              <p
                className={`text-[11px] font-bold uppercase tracking-wider ${style.level}`}
              >
                {item.level}
              </p>
            </div>

            <h3 className="mt-4 text-[18px] font-bold leading-[1.25] text-slate-950">
              {item.title}
            </h3>

            <p className="mt-3 min-h-[50px] text-[13px] leading-6 text-slate-600">
              {item.description}
            </p>
          </div>

          <div
            className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.iconBg} md:flex`}
          >
            {item.icon}
          </div>
        </div>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-2xl">
        <img
          src={item.image}
          alt={item.title}
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

        <span
          className={`absolute bottom-4 left-4 rounded-xl px-4 py-2 text-sm font-black ${style.price}`}
        >
          {item.price}
        </span>
      </div>

      <div className={`mt-3 rounded-2xl ${style.soft} p-3`}>
        <div className="space-y-2.5">
          {item.features.map((feature: string) => (
            <div key={feature} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.feature}`}
              >
                <CheckCircle2 size={15} />
              </span>

              <p className="text-[13px] font-medium text-slate-700">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className={`mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold text-white transition ${style.button}`}
      >
        {hasAccess ? "Voir la formation" : "Payer et voir la formation"}

        {hasAccess ? <ChevronRight size={18} /> : <Lock size={18} />}
      </button>

      <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 pb-1 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 px-2">
          <Users size={16} className="shrink-0 text-green-700" />
          <span>{item.learners}</span>
        </div>

        <div className="flex items-center justify-center gap-2 px-2">
          <Star size={16} className="shrink-0 text-orange-500" />
          <span>{item.rating}</span>
        </div>
      </div>
    </article>
  );
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        {icon}
      </div>

      <div>
        <h4 className="font-bold text-slate-950">{title}</h4>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}