"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  PlusCircle,
  ShoppingBasket,
  Star,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser, logout } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function SellerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await apiRequest("/products");
      setProducts(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const myProducts = products.filter((product) => product.user_id === user.id);

  const approvedProducts = myProducts.filter(
    (product) => product.status === "approved"
  ).length;

  const pendingProducts = myProducts.filter(
    (product) => product.status === "pending"
  ).length;

  const featuredProducts = myProducts.filter(
    (product) => product.is_featured
  ).length;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Espace Vendeur
            </h1>
            <p className="text-sm text-slate-500">
              Bienvenue {user.name}, gérez vos annonces AgriMarket.
            </p>
          </div>

          <button onClick={logout} className="btn-secondary">
            Déconnexion
          </button>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
          <p className="text-sm text-white/80">AgriMarket vendeur</p>

          <h2 className="mt-3 text-4xl font-black">
            Vendez vos produits agricoles plus facilement.
          </h2>

          <p className="mt-4 max-w-2xl text-white/85">
            Publiez vos produits, suivez leur statut et facilitez le contact avec les acheteurs.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/seller/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-green-700 shadow-md hover:bg-green-50"
            >
              <ShoppingBasket size={18} />
              Gérer mes produits
            </Link>

            <Link
              href="/seller/products/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md hover:bg-orange-600"
            >
              <PlusCircle size={18} />
              Ajouter un produit
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 card p-8 text-slate-500">
            Chargement de vos produits...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-4">
              <StatCard icon={<Package />} label="Produits" value={myProducts.length} />
              <StatCard icon={<CheckCircle2 />} label="Approuvés" value={approvedProducts} />
              <StatCard icon={<Clock />} label="En attente" value={pendingProducts} />
              <StatCard icon={<Star />} label="Vedettes" value={featuredProducts} />
            </div>

            <div className="mt-8 card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-950">
                  Mes dernières annonces
                </h3>

                <Link href="/seller/products" className="font-bold text-green-700">
                  Voir tout
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {myProducts.length === 0 && (
                  <p className="text-slate-500">
                    Aucun produit publié pour le moment.
                  </p>
                )}

                {myProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {product.title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {product.city} · {product.price} FCFA · {product.quantity} {product.unit}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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
    <div className="card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}