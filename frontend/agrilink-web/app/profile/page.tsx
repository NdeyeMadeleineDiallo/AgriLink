"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  LogOut,
  ShoppingBasket,
  User,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser, logout } from "@/src/lib/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Mon espace AgriLink
            </h1>
            <p className="text-sm text-slate-500">
              Une seule connexion pour accéder à vos services agricoles.
            </p>
          </div>

          <button
            onClick={logout}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20">
              <User size={34} />
            </div>

            <div>
              <p className="text-sm text-white/80">Bienvenue</p>
              <h2 className="text-4xl font-black">{user.name}</h2>
              <p className="mt-1 text-white/80">{user.email}</p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-white/85">
            Depuis cet espace unique, vous pouvez accéder à vos formations,
            gérer vos annonces agricoles et développer votre profil expert.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ModuleCard
            icon={<GraduationCap size={34} />}
            title="AgriAcademy"
            description="Accédez à vos cours, leçons, supports PDF, vidéos, progression et certificats."
            href="/student"
            button="Accéder à mes cours"
            color="green"
          />

          <ModuleCard
            icon={<ShoppingBasket size={34} />}
            title="AgriMarket"
            description="Publiez vos produits agricoles, gérez vos annonces et facilitez le contact avec les acheteurs."
            href="/seller"
            button="Gérer mes annonces"
            color="orange"
          />

          <ModuleCard
            icon={<Briefcase size={34} />}
            title="AgriExpert"
            description="Présentez votre expertise, recevez des demandes et accompagnez les producteurs."
            href="/expert"
            button="Mon profil expert"
            color="slate"
          />
        </div>

        <div className="mt-8 card p-6">
          <h3 className="text-xl font-black text-slate-950">
            Votre compte AgriLink
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Info label="Nom" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Rôle principal" value={user.role || "Utilisateur"} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  href,
  button,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  button: string;
  color: "green" | "orange" | "slate";
}) {
  const styles = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="card p-6">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-3xl ${styles[color]}`}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-black text-slate-950">{title}</h3>

      <p className="mt-3 min-h-[96px] leading-7 text-slate-600">
        {description}
      </p>

      <Link href={href} className="btn-primary mt-6 inline-flex">
        {button}
      </Link>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value || "-"}</p>
    </div>
  );
}