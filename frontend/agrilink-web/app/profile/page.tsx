"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  ChevronRight,
  GraduationCap,
  LogOut,
  Mail,
  ShieldCheck,
  ShoppingBasket,
  Store,
  User,
  Users,
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
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex h-24 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Mon espace AgriLink
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Une seule connexion pour accéder à vos services agricoles.
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-black text-green-700 transition hover:bg-green-50"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <section className="container-page py-8">
        <div
          className="relative overflow-hidden rounded-[28px] bg-cover bg-center p-8 shadow-xl"
          style={{ backgroundImage: "url('/images/profile-banner.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-800/55 to-transparent" />

          <div className="relative flex items-center gap-5 text-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <User size={40} />
            </div>

            <div>
              <p className="font-semibold text-white/90">Bienvenue</p>
              <h2 className="mt-1 text-lg font-bold">{user.name}</h2>
              <p className="mt-1 font-medium text-white/90">{user.email}</p>
            </div>
          </div>

          <p className="relative mt-6 max-w-2xl text-base font-normal leading-7 text-white/95">
            Depuis cet espace unique, vous pouvez accéder à vos formations,
            gérer vos annonces agricoles et développer votre profil expert.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ModuleCard
            icon={<GraduationCap size={32} />}
            title="AgriAcademy"
            description="Accédez à vos cours, leçons, supports PDF, vidéos, progression et certificats."
            href="/student"
            button="Accéder à mes cours"
            color="green"
          />

          <ModuleCard
            icon={<ShoppingBasket size={32} />}
            title="AgriMarket"
            description="Publiez vos produits agricoles, gérez vos annonces et facilitez le contact avec les acheteurs."
            href="/seller"
            button="Gérer mes annonces"
            color="orange"
          />

          <ModuleCard
            icon={<Briefcase size={32} />}
            title="AgriExpert"
            description="Présentez votre expertise, recevez des demandes et accompagnez les producteurs."
            href="/expert"
            button="Mon profil expert"
            color="slate"
          />
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60">
          <h3 className="text-xl font-bold text-slate-950">
            Développez votre compte
          </h3>

          <p className="mt-2 text-slate-500">
            Activez de nouveaux services sur AgriLink.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-orange-200 bg-orange-50/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Store size={24} />
              </div>

              <h4 className="mt-5 text-xl font-black text-orange-700">
                Devenir vendeur
              </h4>

              <p className="mt-2 leading-7 text-orange-700">
                Publiez vos produits agricoles et recevez des demandes d'achat.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white transition hover:bg-orange-600">
                Activer AgriMarket
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="rounded-[24px] border border-green-200 bg-green-50/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Users size={24} />
              </div>

              <h4 className="mt-5 text-xl font-black text-green-700">
                Devenir expert
              </h4>

              <p className="mt-2 leading-7 text-green-700">
                Accompagnez les producteurs et proposez vos services.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-green-700">
                Activer AgriExpert
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60">
          <h3 className="text-xl font-bold text-slate-950">
            Votre compte AgriLink
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Info icon={<User size={22} />} label="Nom" value={user.name} />
            <Info icon={<Mail size={22} />} label="Email" value={user.email} />
            <Info
              icon={<ShieldCheck size={22} />}
              label="Rôle principal"
              value={user.role || "Utilisateur"}
            />
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
  const iconStyles = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };

  const buttonStyles = {
    green: "bg-green-600 hover:bg-green-700",
    orange: "bg-orange-500 hover:bg-orange-600",
    slate: "bg-slate-700 hover:bg-slate-800",
  };

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-3 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconStyles[color]}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-800">{title}</h3>

      <p className="mt-3 min-h-[82px] text-[15px] leading-7 text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 font-semibold text-white transition ${buttonStyles[color]}`}
      >
        {button}
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 font-semibold text-slate-800">{value || "-"}</p>
      </div>
    </div>
  );
}