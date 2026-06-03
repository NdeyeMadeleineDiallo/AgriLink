"use client";

import { useEffect, useState } from "react";
import { BookOpen, CreditCard, Layers, ShoppingBasket, Users } from "lucide-react";
import AdminSidebar from "@/src/components/layout/AdminSidebar";
import AdminTopbar from "@/src/components/layout/AdminTopbar";
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

  const cards = [
    {
      label: "Utilisateurs",
      value: stats.users,
      icon: <Users />,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Cours",
      value: stats.courses,
      icon: <BookOpen />,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Produits",
      value: stats.products,
      icon: <ShoppingBasket />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Experts",
      value: stats.experts,
      icon: <Layers />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Paiements",
      value: stats.payments,
      icon: <CreditCard />,
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] lg:flex">
      <AdminSidebar />

      <section className="min-h-screen flex-1">
        <AdminTopbar user={user} />

        <div className="p-6">
          <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
            <p className="text-sm font-medium text-white/80">Bienvenue sur AgriLink</p>
            <h1 className="mt-3 text-4xl font-black">
              Pilotez votre écosystème agricole digital.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/85">
              Suivez les utilisateurs, les cours, les cohortes, les annonces, les
              experts et les paiements depuis un espace centralisé.
            </p>
          </div>

          {loading ? (
            <div className="mt-8 card p-8 text-slate-500">Chargement des statistiques...</div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {cards.map((card) => (
                <div key={card.label} className="card p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                    {card.icon}
                  </div>
                  <p className="mt-5 text-3xl font-black text-slate-950">{card.value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{card.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-xl font-black text-slate-950">Activité récente</h3>
              <div className="mt-5 space-y-4">
                {["Nouveau cours publié", "Nouvelle annonce validée", "Profil expert approuvé"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-700">{item}</p>
                    <p className="text-sm text-slate-500">Il y a quelques minutes</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-black text-slate-950">Actions rapides</h3>
              <div className="mt-5 space-y-3">
                <a href="/admin/courses" className="block rounded-2xl bg-green-50 p-4 font-bold text-green-700">
                  Gérer les cours
                </a>
                <a href="/admin/products" className="block rounded-2xl bg-orange-50 p-4 font-bold text-orange-700">
                  Valider les annonces
                </a>
                <a href="/admin/experts" className="block rounded-2xl bg-slate-100 p-4 font-bold text-slate-700">
                  Valider les experts
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}