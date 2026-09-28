"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";

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
    icon: <Leaf size={34} />,
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
    icon: <ShieldCheck size={34} />,
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
    icon: <TrendingUp size={34} />,
    learners: "563 apprenants",
    rating: "4.9/5",
    features: [
      "Techniques de vente et négociation",
      "Transformation et valorisation",
      "Stratégies pour multiplier vos profits",
    ],
  },
];

export default function StudentCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [paidAccess, setPaidAccess] = useState<any>({});

  useEffect(() => {
  const storedUser = getStoredUser();

  if (!storedUser) {
    window.location.href = "/login";
    return;
  }

  setUser(storedUser);

  setPaidAccess({
    intermediaire: localStorage.getItem("agrilink_access_intermediaire") === "true",
    avance: localStorage.getItem("agrilink_access_avance") === "true",
  });
}, []);

  if (!user) return null;

  function handleOpenFormation(item: any) {
  const hasAccess = item.amount === 0 || paidAccess[item.id];

  if (hasAccess) {
    window.location.href = `/student/course?level=${item.id}`;
    return;
  }

  window.location.href = `/student/payment?level=${item.id}&amount=${item.amount}`;
}

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex h-24 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Catalogue des formations
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Choisissez votre niveau et développez vos compétences agricoles.
            </p>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-black text-green-700 transition hover:bg-green-50"
          >
            <ArrowLeft size={18} />
            Retour à mon espace
          </Link>
        </div>
      </header>

<br></br>
      <section className="container-page py-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <BookOpen size={25} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Nos parcours de formation
            </h2>
            <p className="mt-1 text-slate-500">
              Des formations adaptées à chaque étape de votre évolution.
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

        <div className="mt-8 grid gap-5 rounded-[28px] border border-green-100 bg-white p-6 shadow-md shadow-slate-200/60 md:grid-cols-4">
          <Benefit
            icon={<BookOpen size={26} />}
            title="Apprentissage pratique"
            description="Des contenus concrets et applicables sur le terrain."
          />
          <Benefit
            icon={<CheckCircle2 size={26} />}
            title="Certificats inclus"
            description="Obtenez un certificat à la fin de chaque formation."
          />
          <Benefit
            icon={<PlayCircle size={26} />}
            title="Accessible partout"
            description="Apprenez à votre rythme depuis votre mobile."
          />
          <Benefit
            icon={<Users size={26} />}
            title="Accompagnement"
            description="Support et conseils d’experts pendant votre parcours."
          />
        </div>
      </section>
    </main>
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
  const styles: any = {
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

  const s = styles[item.color];

  return (
    <div
      className={`group overflow-hidden rounded-[26px] border ${s.border} ${s.background} p-3 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-xl px-3 py-2 text-sm font-black ${s.badge}`}
              >
                {item.number}
              </span>

              <p className={`text-[11px] font-extrabold uppercase tracking-wider ${s.level}`}>
                {item.level}
              </p>
            </div>

            <h3 className="mt-3 text-[18px] font-black leading-[1.15] text-slate-950">
              {item.title}
            </h3>

            <p className="mt-2 min-h-[46px] text-[13px] leading-6 text-slate-600">
              {item.description}
            </p>
          </div>

          <div
            className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full ${s.iconBg} md:flex`}
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
          className={`absolute bottom-4 left-4 rounded-xl px-4 py-2 text-sm font-black ${s.price}`}
        >
          {item.price}
        </span>
      </div>

      <div className={`mt-3 rounded-2xl ${s.soft} p-3`}>
        <div className="space-y-2">
          {item.features.map((feature: string) => (
            <div key={feature} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${s.feature}`}
              >
                <CheckCircle2 size={15} />
              </span>
              <p className="text-[13px] font-semibold text-slate-700">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onOpen}
        className={`mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold text-white transition ${s.button}`}
      >
        {hasAccess ? "Voir la formation" : "Payer et voir la formation"}
{hasAccess ? <ChevronRight size={18} /> : <Lock size={18} />}
      </button>

      <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <Users size={16} className="text-green-700" />
          <span>{item.learners}</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Star size={16} className="text-orange-500" />
          <span>{item.rating}</span>
        </div>
      </div>
    </div>
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
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        {icon}
      </div>

      <div>
        <h4 className="font-black text-slate-950">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}