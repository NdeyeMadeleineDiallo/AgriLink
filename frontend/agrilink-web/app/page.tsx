import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MapPin,
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
    icon: <BookOpen />,
    title: "AgriAcademy",
    subtitle: "Formation agricole numérique",
    description:
      "Accédez aux cours, vidéos, PDF, quiz, certificats et suivi de progression pour renforcer vos compétences agricoles.",
    points: ["Cours structurés", "Progression suivie", "Certificats automatiques"],
  },
  {
    id: "market",
    icon: <ShoppingBasket />,
    title: "AgriMarket",
    subtitle: "Marketplace agricole",
    description:
      "Publiez et consultez des annonces de produits agricoles, outils et intrants avec contact direct via WhatsApp.",
    points: ["Annonces agricoles", "Filtres par région", "Contact rapide"],
  },
  {
    id: "expert",
    icon: <Users />,
    title: "AgriExpert",
    subtitle: "Réseau d’experts agricoles",
    description:
      "Trouvez des experts agricoles vérifiés selon leur spécialité, leur zone d’intervention et leur disponibilité.",
    points: ["Experts vérifiés", "Demandes de service", "Zones d’intervention"],
  },
];

const stats = [
  { value: "3", label: "Modules intégrés" },
  { value: "100%", label: "Suivi pédagogique" },
  { value: "24/7", label: "Accès digital" },
  { value: "FCFA", label: "Paiements locaux" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="container-page relative grid gap-14 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
              <Sparkles size={16} />
              Plateforme EdTech & AgriTech pour l’Afrique de l’Ouest
            </div>

            <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
              Former, vendre et trouver des experts agricoles au même endroit.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              AgriLink centralise la formation, le marché agricole et l’expertise
              technique pour accompagner les agripreneurs, producteurs et porteurs
              de projet.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                Commencer maintenant <ArrowRight size={18} />
              </a>
              <a href="#modules" className="btn-secondary inline-flex items-center justify-center">
                Voir les modules
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" /> Plateforme sécurisée
              </span>
              <span className="inline-flex items-center gap-2">
                <Award size={18} className="text-orange-500" /> Certificats
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={18} className="text-green-600" /> Adaptée au Sénégal
              </span>
            </div>
          </div>

          <div className="card p-4">
            <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-7 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Dashboard AgriLink</p>
                  <h2 className="mt-2 text-3xl font-black">Écosystème agricole digital</h2>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  <GraduationCap />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/15 p-5 backdrop-blur">
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 text-slate-900">
                <p className="text-sm font-semibold text-green-700">Progression apprenant</p>
                <div className="mt-4 h-3 rounded-full bg-slate-100">
                  <div className="h-3 w-[72%] rounded-full bg-green-600" />
                </div>
                <p className="mt-3 text-sm text-slate-500">72% du parcours terminé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Modules clés
          </span>
          <h2 className="mt-3 text-4xl font-black text-slate-950">
            Une plateforme, trois solutions complémentaires
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            AgriLink ne se limite pas à la formation. Elle relie les compétences,
            les opportunités de marché et l’expertise technique.
          </p>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {modules.map((module) => (
            <article id={module.id} key={module.title} className="card p-8 transition hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                {module.icon}
              </div>
              <p className="mt-6 text-sm font-bold text-orange-500">{module.subtitle}</p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">{module.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{module.description}</p>

              <ul className="mt-6 space-y-3">
                {module.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 size={18} className="text-green-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-green-600">
              Pourquoi AgriLink ?
            </span>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              Une solution pensée pour les réalités agricoles locales.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Beaucoup d’acteurs agricoles utilisent plusieurs outils séparés :
              WhatsApp pour communiquer, Moodle pour apprendre, Facebook pour vendre
              et des contacts personnels pour trouver des experts. AgriLink regroupe
              ces besoins dans une seule plateforme claire, sécurisée et évolutive.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Paiements adaptés aux usages locaux",
              "Cours organisés avec progression et certificats",
              "Annonces agricoles avec contact direct",
              "Experts vérifiés par spécialité et zone",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="text-green-600" />
                <p className="font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container-page py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black text-slate-950">
            Prêt à digitaliser votre parcours agricole ?
          </h2>
          <p className="mt-4 text-slate-600">
            Rejoignez AgriLink pour apprendre, vendre, échanger et progresser.
          </p>
          <div className="mt-8">
            <a href="/register" className="btn-primary inline-flex items-center gap-2">
              Créer un compte <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}