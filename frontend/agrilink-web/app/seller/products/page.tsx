"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Edit, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function SellerProductsPage() {
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
    loadProducts(storedUser.id);
  }, []);

  async function loadProducts(userId: number) {
    try {
      const data = await apiRequest("/products");
      const allProducts = data.data || [];
      setProducts(allProducts.filter((product: any) => product.user_id === userId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId: number) {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await apiRequest(`/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Mes produits
            </h1>
            <p className="text-sm text-slate-500">
              Gérez vos annonces AgriMarket.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/seller" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft size={18} />
              Retour
            </Link>

            <Link href="/seller/products/create" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={18} />
              Ajouter
            </Link>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        {loading ? (
          <div className="card p-8 text-slate-500">Chargement des produits...</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left">Produit</th>
                  <th className="p-4 text-left">Prix</th>
                  <th className="p-4 text-left">Quantité</th>
                  <th className="p-4 text-left">Ville</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Aucun produit publié.
                    </td>
                  </tr>
                )}

                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4 font-bold text-slate-900">{product.title}</td>
                    <td className="p-4">{product.price} FCFA</td>
                    <td className="p-4">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="p-4">{product.city}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="rounded-xl bg-slate-100 p-2 text-slate-600"
                        >
                      <Edit size={18} />
                      </Link>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-xl bg-red-100 p-2 text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}