"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  ImageOff,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

export default function SellerProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadProducts(storedUser.id);
  }, []);

  async function loadProducts(userId: number | string) {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await apiRequest("/products");

      const allProducts =
        data.data?.data ||
        data.data ||
        data.products ||
        [];

      const currentUserProducts = allProducts.filter(
        (product: any) =>
          Number(product.user_id) === Number(userId)
      );

      setProducts(currentUserProducts);
    } catch (error) {
      console.error("Erreur de chargement :", error);
      setErrorMessage(
        "Impossible de charger vos produits pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId: number) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((previous) =>
        previous.filter(
          (product) => Number(product.id) !== Number(productId)
        )
      );
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Impossible de supprimer ce produit.");
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              AgriMarket
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Mes produits
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Consultez et gérez toutes vos annonces AgriMarket.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/seller"
              className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-5 py-3 font-black text-green-700 transition hover:bg-green-50"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>

            <Link
              href="/seller/products/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-black text-white shadow-md transition hover:bg-green-700"
            >
              <PlusCircle size={18} />
              Ajouter
            </Link>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Mes annonces publiées
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {products.length} produit
              {products.length > 1 ? "s" : ""} trouvé
              {products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] border border-slate-100 bg-white p-8 text-slate-500 shadow-lg">
            Chargement de vos produits...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/50">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
              <ImageOff size={36} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-950">
              Aucun produit publié
            </h3>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Publiez votre première annonce pour la rendre visible sur
              AgriMarket.
            </p>

            <Link
              href="/seller/products/create"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-black text-white"
            >
              <PlusCircle size={18} />
              Publier un produit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[28px] border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
            <table className="min-w-[950px] w-full">
              <thead className="bg-slate-50">
                <tr>
                  <TableHead>Image</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const imageUrl = getProductImageUrl(product);

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="p-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="h-16 w-20 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <ImageOff size={22} />
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <p className="font-black text-slate-950">
                          {product.title}
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {product.category?.name ||
                            product.category_name ||
                            "Produit agricole"}
                        </p>
                      </td>

                      <td className="p-4 font-black text-green-700">
                        {formatPrice(product.price)} FCFA
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {product.quantity || 0}{" "}
                        {product.unit || "unité"}
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {product.city || "-"}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/seller/products/${product.id}/edit`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(product.id)
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-4 text-left text-sm font-black text-slate-700">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    suspended: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    approved: "Publié",
    active: "Publié",
    pending: "En attente",
    suspended: "Suspendu",
    rejected: "Rejeté",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
        statusStyles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {statusLabels[status] || status || "Inconnu"}
    </span>
  );
}

function getProductImageUrl(product: any): string | null {
  const path =
    product.images?.[0]?.image_path ||
    product.images?.[0]?.path ||
    product.image_path ||
    product.image ||
    product.photo ||
    null;

  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_BASE_URL}/storage/${path}`;
}

function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("fr-FR").format(
    Number(price || 0)
  );
}