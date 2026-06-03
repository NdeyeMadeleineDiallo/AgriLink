"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    async function loadProducts() {
      try {
        const data = await apiRequest("/products");
        setProducts(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadProducts();
  }, []);

  if (!user) return null;

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout user={user}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Gestion des produits
          </h1>
          <p className="mt-2 text-slate-500">
            Validation et gestion des annonces AgriMarket.
          </p>
        </div>

        <input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        />
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Produit</th>
              <th className="p-4 text-left">Prix</th>
              <th className="p-4 text-left">Ville</th>
              <th className="p-4 text-left">Téléphone</th>
              <th className="p-4 text-left">Statut</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 font-semibold">{product.title}</td>
                <td className="p-4">{product.price} FCFA</td>
                <td className="p-4">{product.city}</td>
                <td className="p-4">{product.phone}</td>
                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}