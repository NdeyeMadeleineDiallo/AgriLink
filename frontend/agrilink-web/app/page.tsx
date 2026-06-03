import { BookOpen, ShoppingBasket, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="container-page flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white font-bold">
            AL
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">AgriLink</h1>
            <p className="text-xs text-[#64748B]">Former. Connecter. Accompagner.</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[#475569]">
          <a href="#academy">AgriAcademy</a>
          <a href="#market">AgriMarket</a>
          <a href="#expert">AgriExpert</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="btn-primary" href="/login">
          Se connecter
        </a>
      </header>

      <section className="container-page grid lg:grid-cols-2 gap-12 items-center py-20">
        <div>
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Plateforme agricole numérique intégrée
          </span>

          <h2 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-[#0F172A]">
            Apprendre, vendre et trouver des experts agricoles au même endroit.
          </h2>

          <p className="mt-6 text-lg text-[#64748B] leading-8">
            AgriLink connecte les agripreneurs à la formation, au marché et à
            l’expertise agricole pour réussir leurs projets en Afrique de l’Ouest.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="/register" className="btn-primary inline-flex items-center justify-center gap-2">
              Commencer maintenant <ArrowRight size={18} />
            </a>
            <a href="#modules" className="btn-secondary inline-flex items-center justify-center">
              Découvrir la plateforme
            </a>
          </div>
        </div>

        <div className="card p-6">
          <div className="rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-orange-500 p-8 text-white">
            <p className="text-sm opacity-90">Tableau de bord AgriLink</p>
            <h3 className="mt-3 text-3xl font-bold">Votre écosystème agricole digital</h3>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm">Modules clés</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm">Suivi progression</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm">Accès digital</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-3xl font-bold">FCFA</p>
                <p className="text-sm">Paiements locaux</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="container-page py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0F172A]">Une seule plateforme, trois solutions</h2>
          <p className="mt-4 text-[#64748B]">
            AgriLink regroupe les services essentiels pour accompagner les acteurs agricoles.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <ModuleCard
            icon={<BookOpen />}
            title="AgriAcademy"
            description="Accédez aux cours, vidéos, PDF, quiz, certificats et suivi de progression."
          />
          <ModuleCard
            icon={<ShoppingBasket />}
            title="AgriMarket"
            description="Publiez et consultez des annonces de produits agricoles, intrants et outils."
          />
          <ModuleCard
            icon={<Users />}
            title="AgriExpert"
            description="Trouvez des experts agricoles vérifiés selon leur spécialité et leur zone."
          />
        </div>
      </section>
    </main>
  );
}

function ModuleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-7 hover:-translate-y-1 transition">
      <div className="h-13 w-13 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-[#64748B] leading-7">{description}</p>
    </div>
  );
}