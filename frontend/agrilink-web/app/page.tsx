import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

const modules = [
  {
    id: "academy",
    number: "01",
    icon: <BookOpen size={22} />,
    title: "AgriAcademy",
    eyebrow: "Apprendre",
    description:
      "Des formations agricoles concrètes pour développer vos compétences et progresser à votre rythme.",
    points: [
      "Vidéos, PDF et quiz",
      "Suivi de progression",
      "Certification finale",
    ],
    style:
      "from-emerald-50/90 to-white border-emerald-100",
    iconStyle:
      "bg-emerald-600 text-white shadow-emerald-200",
    accent: "text-emerald-700",
  },
  {
    id: "market",
    number: "02",
    icon: <ShoppingBasket size={22} />,
    title: "AgriMarket",
    eyebrow: "Acheter & vendre",
    description:
      "Une marketplace pensée pour faciliter la commercialisation des produits et équipements agricoles.",
    points: [
      "Annonces vérifiées",
      "Recherche locale",
      "Contact direct",
    ],
    style:
      "from-orange-50/90 to-white border-orange-100",
    iconStyle:
      "bg-orange-500 text-white shadow-orange-200",
    accent: "text-orange-600",
  },
  {
    id: "expert",
    number: "03",
    icon: <Users size={22} />,
    title: "AgriExpert",
    eyebrow: "Être accompagné",
    description:
      "Trouvez rapidement un professionnel qualifié selon votre besoin, votre activité et votre localisation.",
    points: [
      "Experts vérifiés",
      "Compétences visibles",
      "Contact WhatsApp",
    ],
    style:
      "from-teal-50/90 to-white border-teal-100",
    iconStyle:
      "bg-teal-600 text-white shadow-teal-200",
    accent: "text-teal-700",
  },
];

const benefits = [
  {
    icon: <Users size={18} />,
    title: "Un seul compte",
    text: "Accédez à tous les services AgriLink.",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Apprentissage pratique",
    text: "Des contenus conçus pour le terrain.",
  },
  {
    icon: <ShoppingBasket size={18} />,
    title: "Marché accessible",
    text: "Achetez, vendez et créez des opportunités.",
  },
  {
    icon: <BadgeCheck size={18} />,
    title: "Expertise vérifiée",
    text: "Des professionnels qualifiés et accessibles.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBFCF9] text-slate-950">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden pb-12 pt-7 md:pb-16 md:pt-10">
        {/* LIGHT BLOBS */}
        <div className="pointer-events-none absolute -left-40 top-12 h-[480px] w-[480px] rounded-full bg-emerald-200/30 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-150px] top-0 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-[130px]" />
        <div className="pointer-events-none absolute left-[45%] top-[45%] h-[260px] w-[260px] rounded-full bg-lime-100/40 blur-[100px]" />

        <div className="container-page relative">
          {/* HERO PANEL */}
          <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/65 shadow-[0_25px_80px_rgba(15,55,35,0.09)] backdrop-blur-xl">
            {/* inner decorative glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(22,163,74,0.08),transparent_35%),radial-gradient(circle_at_90%_30%,rgba(249,115,22,0.08),transparent_30%)]" />

            <div className="relative grid gap-8 px-6 py-8 md:px-9 md:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:py-12">
              {/* LEFT */}
              <div className="relative z-10 max-w-[590px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3.5 py-2 shadow-sm backdrop-blur">
                  <Sparkles
                    size={14}
                    className="text-emerald-600"
                  />

                  <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-emerald-700 md:text-[11px]">
                    Agriculture · Formation · Marché · Expertise
                  </span>
                </div>

                <h1 className="mt-6 max-w-[570px] text-[38px] font-black leading-[1.06] tracking-[-0.04em] text-[#08120E] md:text-[46px]">
                  Cultivez vos compétences.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
                    Développez vos opportunités.
                  </span>
                </h1>

                <p className="mt-5 max-w-[535px] text-[15px] leading-7 text-slate-600 md:text-[16px]">
                  AgriLink réunit formation, marché agricole et expertise
                  professionnelle dans une seule plateforme conçue pour
                  accompagner les acteurs agricoles d’Afrique de l’Ouest.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(21,128,61,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(21,128,61,0.28)]"
                  >
                    Commencer avec AgriLink
                    <ArrowRight size={17} />
                  </a>

                  <a
                    href="#modules"
                    className="inline-flex items-center justify-center rounded-[14px] border border-slate-200/90 bg-white/80 px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:bg-emerald-50/50"
                  >
                    Explorer la plateforme
                  </a>
                </div>

                {/* TRUST */}
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <ShieldCheck size={14} />
                    </div>
                    Plateforme sécurisée
                  </div>

                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <MapPin size={14} />
                    </div>
                    Afrique de l’Ouest
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative mx-auto flex min-h-[420px] w-full max-w-[590px] items-center justify-center lg:min-h-[470px]">
                {/* BACK PANEL */}
                <div className="absolute right-[3%] top-[6%] h-[88%] w-[79%] rounded-[40px] bg-gradient-to-br from-[#E4F5E8] via-[#F6F7E9] to-[#FFEADD] shadow-inner" />

                {/* GRID DECOR */}
                <div className="absolute right-[5%] top-[9%] h-[82%] w-[74%] rounded-[34px] border border-white/70" />

                {/* ORANGE DOT */}
                <div className="absolute right-[2%] top-[13%] h-20 w-20 rounded-full border border-orange-200/60 bg-orange-100/35 backdrop-blur" />

                {/* GREEN DOT */}
                <div className="absolute bottom-[8%] left-[13%] h-16 w-16 rounded-full bg-emerald-200/40 blur-sm" />

                {/* WOMAN IMAGE */}
                <div className="relative z-10 h-[385px] w-[285px] overflow-hidden rounded-[34px] border-[5px] border-white shadow-[0_28px_65px_rgba(16,61,38,0.22)] md:h-[430px] md:w-[315px]">
                  <img
                    src="/images/home-young-farmer.png"
                    alt="Jeune agricultrice utilisant AgriLink"
                    className="h-full w-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>

                {/* GLASS CARD TOP */}
                <div className="absolute left-[1%] top-[16%] z-20 hidden w-[190px] rounded-[20px] border border-white/80 bg-white/72 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <BookOpen size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        AgriAcademy
                      </p>

                      <p className="mt-0.5 text-xs font-black text-slate-900">
                        Se former
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[72%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* GLASS CARD BOTTOM */}
                <div className="absolute bottom-[8%] right-[0%] z-20 hidden w-[205px] rounded-[20px] border border-white/85 bg-white/74 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.11)] backdrop-blur-xl md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <MessageCircle size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        AgriExpert
                      </p>

                      <p className="mt-0.5 text-xs font-black text-slate-900">
                        Être accompagné
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-semibold text-slate-500">
                      Experts disponibles
                    </span>
                  </div>
                </div>

                {/* LITTLE BADGE */}
                <div className="absolute bottom-[4%] left-[18%] z-20 rounded-full border border-white bg-emerald-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
                  + opportunités agricoles
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================== */}
      <section className="relative z-10">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-[24px] border border-white/80 bg-white/75 shadow-[0_15px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:grid-cols-3">
            <MiniStat
              value="3"
              label="services intégrés"
              description="Formation, marché et expertise"
            />

            <MiniStat
              value="1"
              label="compte unique"
              description="Une seule connexion AgriLink"
            />

            <MiniStat
              value="24/7"
              label="accès digital"
              description="Depuis mobile ou ordinateur"
              last
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          MODULES
      ========================================================== */}
      <section
        id="modules"
        className="relative py-20"
      >
        <div className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-green-100/40 blur-[120px]" />

        <div className="container-page relative">
          <div className="mx-auto max-w-[720px] text-center">
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
              L’écosystème AgriLink
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 md:text-[38px]">
              Tout ce dont vous avez besoin,
              <span className="text-emerald-700">
                {" "}
                au même endroit.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[610px] text-[15px] leading-7 text-slate-600">
              Trois services complémentaires pour transformer une idée,
              développer une activité et accéder aux bonnes opportunités.
            </p>
          </div>

          <div className="mt-11 grid gap-5 lg:grid-cols-3">
            {modules.map((module) => (
              <article
                id={module.id}
                key={module.id}
                className={`group relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)] ${module.style}`}
              >
                <span className="absolute right-5 top-4 text-[54px] font-black leading-none text-slate-900/[0.035]">
                  {module.number}
                </span>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[15px] shadow-lg ${module.iconStyle}`}
                >
                  {module.icon}
                </div>

                <p
                  className={`mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em] ${module.accent}`}
                >
                  {module.eyebrow}
                </p>

                <h3 className="mt-1.5 text-[23px] font-black tracking-[-0.02em] text-slate-950">
                  {module.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-[14px] leading-6 text-slate-600">
                  {module.description}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-900/5 pt-5">
                  {module.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-600"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                        <Check
                          size={12}
                          className="text-emerald-600"
                        />
                      </div>

                      {point}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY AGRILINK
      ========================================================== */}
      <section className="relative py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-gradient-to-br from-[#EAF7EF] via-[#F7FAF6] to-[#FFF1E5] p-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] md:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/35" />

            <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                  Pourquoi AgriLink ?
                </p>

                <h2 className="mt-3 max-w-lg text-3xl font-black leading-[1.12] tracking-[-0.03em] text-slate-950">
                  Une expérience simple,
                  <span className="text-emerald-700">
                    {" "}
                    pensée pour le terrain.
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-[14px] leading-7 text-slate-600">
                  AgriLink rassemble dans un même espace des services
                  habituellement dispersés entre plusieurs plateformes et
                  réseaux.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="group rounded-[20px] border border-white/80 bg-white/72 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl transition hover:bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        {benefit.icon}
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="pb-20 pt-5">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[32px] bg-[#075B35] px-7 py-10 text-white shadow-[0_25px_70px_rgba(6,78,44,0.22)] md:px-10 md:py-12">
            {/* glows */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-lime-300/15 blur-[80px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-green-100 backdrop-blur">
                  Votre parcours commence ici
                </span>

                <h2 className="mt-4 max-w-[650px] text-[30px] font-black leading-[1.12] tracking-[-0.03em] md:text-[36px]">
                  Transformez vos ambitions agricoles en opportunités concrètes.
                </h2>

                <p className="mt-3 max-w-xl text-[14px] leading-6 text-white/72">
                  Rejoignez AgriLink et accédez à la formation, au marché et
                  aux experts depuis un seul espace.
                </p>
              </div>

              <a
                href="/register"
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[15px] bg-white px-5 py-3.5 text-sm font-black text-emerald-800 shadow-[0_12px_30px_rgba(0,0,0,0.13)] transition hover:-translate-y-0.5 hover:bg-emerald-50 lg:self-auto"
              >
                Créer mon compte
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   MINI STAT
========================================================== */

function MiniStat({
  value,
  label,
  description,
  last = false,
}: {
  value: string;
  label: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-6 py-5 ${
        !last
          ? "border-b border-slate-100 sm:border-b-0 sm:border-r"
          : ""
      }`}
    >
      <p className="min-w-[58px] text-[26px] font-black tracking-[-0.03em] text-emerald-700">
        {value}
      </p>

      <div>
        <p className="text-sm font-bold text-slate-900">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}