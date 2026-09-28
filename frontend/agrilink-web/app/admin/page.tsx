"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CreditCard,
  Layers,
  ShoppingBasket,
  Users,
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { apiRequest } from "@/src/services/api";
import { getStoredUser } from "@/src/lib/auth";

type Stats = {
  users: number;
  courses: number;
  products: number;
  experts: number;
  payments: number;
};

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    users: 0,
    courses: 0,
    products: 0,
    experts: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    async function loadDashboard() {
      try {
        const data = await apiRequest("/admin/dashboard");
        setStats(data.statistics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (!user) return null;

  const cards = [
    { label: "Utilisateurs", value: stats.users, icon: <Users />, color: "bg-green-100 text-green-700" },
    { label: "Cours", value: stats.courses, icon: <BookOpen />, color: "bg-orange-100 text-orange-700" },
    { label: "Produits", value: stats.products, icon: <ShoppingBasket />, color: "bg-blue-100 text-blue-700" },
    { label: "Experts", value: stats.experts, icon: <Layers />, color: "bg-purple-100 text-purple-700" },
    { label: "Paiements", value: stats.payments, icon: <CreditCard />, color: "bg-slate-100 text-slate-700" },
  ];

  return (
    <AdminLayout user={user}>
      <div className="relative overflow-hidden rounded-[34px] border border-white/50 bg-white/60 p-8 shadow-xl backdrop-blur-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/admin-banner.png')" }}
        />

        <div className="relative max-w-3xl">
  <p className="text-sm font-black uppercase tracking-wide text-green-400">
    BIENVENUE SUR AGRILINK
  </p>

  <h1 className="mt-4 text-4xl font-black leading-tight text-white drop-shadow-2xl">
    Pilotez votre écosystème agricole digital.
  </h1>

  <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/95 drop-shadow-lg">
    Suivez les utilisateurs, les cours, les cohortes, les annonces,
    les experts et les paiements depuis un espace centralisé.
  </p>
</div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[28px] border border-white/50 bg-white/70 p-8 text-slate-500 shadow-lg backdrop-blur-2xl">
          Chargement des statistiques...
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-2xl transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}>
                {card.icon}
              </div>

              <p className="mt-6 text-4xl font-black text-slate-950">
                {card.value}
              </p>

              <p className="mt-1 text-sm font-bold text-slate-500">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-2xl lg:col-span-2">
          <h3 className="text-xl font-black text-slate-950">
            Activité récente
          </h3>

          <div className="mt-5 space-y-4">
            {[
              "Nouveau cours publié",
              "Nouvelle annonce validée",
              "Profil expert approuvé",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-slate-50/80 p-4"
              >
                <p className="font-bold text-slate-800">{item}</p>
                <p className="text-sm text-slate-500">Il y a quelques minutes</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-2xl">
          <h3 className="text-xl font-black text-slate-950">
            Actions rapides
          </h3>

          <div className="mt-5 space-y-3">
            <Link
              href="/admin/courses"
              className="block rounded-2xl bg-green-100/80 p-4 font-bold text-green-700 hover:bg-green-200"
            >
              Gérer les cours
            </Link>

            <Link
              href="/admin/products"
              className="block rounded-2xl bg-orange-100/80 p-4 font-bold text-orange-700 hover:bg-orange-200"
            >
              Valider les annonces
            </Link>

            <Link
              href="/admin/experts"
              className="block rounded-2xl bg-slate-100/80 p-4 font-bold text-slate-700 hover:bg-slate-200"
            >
              Valider les experts
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}