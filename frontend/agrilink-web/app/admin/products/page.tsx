"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleOff,
  MapPin,
  PackageCheck,
  Phone,
  Search,
  ShoppingBasket,
  Tag,
} from "lucide-react";

import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      setError("");

      const data = await apiRequest("/products");

      const loadedProducts =
        data.data?.data ||
        data.data ||
        data.products ||
        [];

      setProducts(
        Array.isArray(loadedProducts)
          ? loadedProducts
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Impossible de charger les produits."
      );
    }
  }

  async function updateProductStatus(
    productId: number,
    status: "approved" | "rejected"
  ) {
    try {
      setUpdatingId(productId);
      setMessage("");
      setError("");

      const data = await apiRequest(
        `/products/${productId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                status:
                  data.product?.status ||
                  status,
              }
            : product
        )
      );

      setMessage(
        status === "approved"
          ? "Produit approuvé avec succès."
          : "Produit désactivé avec succès."
      );

      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.message ||
          "Impossible de modifier le statut du produit."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (!user) return null;

  const filteredProducts = products.filter(
    (product) =>
      `${product.title || ""} ${
        product.city || ""
      } ${product.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const approvedCount = products.filter(
    (product) =>
      product.status === "approved"
  ).length;

  /*
   * Tous les produits qui ne sont pas approuvés
   * sont considérés comme désactivés.
   *
   * Cela inclut les anciens :
   * pending
   * rejected
   */
  const disabledCount =
    products.length - approvedCount;

  return (
    <AdminLayout user={user}>
      <div className="w-full min-w-0">
        {/* HEADER */}
        <div className="mb-7">
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            AgriMarket
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Gestion des produits
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Contrôlez les annonces publiées sur
            AgriMarket et désactivez celles qui ne
            respectent pas les règles de la plateforme.
          </p>
        </div>

        {/* STATISTIQUES */}
        <div className="mb-7 grid gap-4 md:grid-cols-3">
          <StatBox
            icon={
              <ShoppingBasket size={21} />
            }
            label="Total produits"
            value={products.length}
            color="green"
          />

          <StatBox
            icon={
              <PackageCheck size={21} />
            }
            label="Produits approuvés"
            value={approvedCount}
            color="green"
          />

          <StatBox
            icon={
              <CircleOff size={21} />
            }
            label="Produits désactivés"
            value={disabledCount}
            color="red"
          />
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <CircleOff size={17} />
            {error}
          </div>
        )}

        {/* LISTE */}
        <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Liste des produits
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {filteredProducts.length} produit
                {filteredProducts.length > 1
                  ? "s"
                  : ""}{" "}
                affiché
                {filteredProducts.length > 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 lg:w-72">
              <Search
                size={18}
                className="shrink-0 text-slate-400"
              />

              <input
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* PAS DE SCROLL HORIZONTAL */}
          <div className="w-full overflow-hidden rounded-[20px] border border-slate-100">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[16%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[18%]" />
              </colgroup>

              <thead className="bg-slate-50">
                <tr>
                  <TableHead>
                    Produit
                  </TableHead>

                  <TableHead>
                    Prix
                  </TableHead>

                  <TableHead>
                    Ville
                  </TableHead>

                  <TableHead>
                    Téléphone
                  </TableHead>

                  <TableHead>
                    Gestion
                  </TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProducts.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-slate-500"
                    >
                      Aucun produit disponible.
                    </td>
                  </tr>
                )}

                {filteredProducts.map(
                  (product) => {
                    const isApproved =
                      product.status ===
                      "approved";

                    const isUpdating =
                      updatingId ===
                      product.id;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* PRODUIT */}
                        <td className="px-3 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-3">
                            <ProductImage
                              product={
                                product
                              }
                            />

                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-bold text-slate-900">
                                {
                                  product.title
                                }
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                Annonce
                                AgriMarket
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PRIX */}
                        <td className="px-3 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                            <Tag
                              size={15}
                              className="shrink-0 text-orange-600"
                            />

                            <span className="truncate">
                              {Number(
                                product.price ||
                                  0
                              ).toLocaleString(
                                "fr-FR"
                              )}{" "}
                              FCFA
                            </span>
                          </div>
                        </td>

                        {/* VILLE */}
                        <td className="px-3 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                            <MapPin
                              size={15}
                              className="shrink-0 text-green-700"
                            />

                            <span className="truncate">
                              {product.city ||
                                "-"}
                            </span>
                          </div>
                        </td>

                        {/* TELEPHONE */}
                        <td className="px-3 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                            <Phone
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="truncate">
                              {product.phone ||
                                "-"}
                            </span>
                          </div>
                        </td>

                        {/* GESTION */}
                        <td className="px-3 py-4 align-middle">
                          {isApproved ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1.5 text-xs font-bold text-green-700">
                                <CheckCircle2
                                  size={13}
                                />
                                Approuvé
                              </span>

                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateProductStatus(
                                    product.id,
                                    "rejected"
                                  )
                                }
                                title="Désactiver ce produit"
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <CircleOff
                                  size={16}
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500">
                                <CircleOff
                                  size={13}
                                />
                                Désactivé
                              </span>

                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateProductStatus(
                                    product.id,
                                    "approved"
                                  )
                                }
                                title="Approuver ce produit"
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200 disabled:opacity-50"
                              >
                                <CheckCircle2
                                  size={16}
                                />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* =========================
   ENTÊTE TABLEAU
========================= */

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

/* =========================
   IMAGE PRODUIT
========================= */

function ProductImage({
  product,
}: {
  product: any;
}) {
  const imagePath =
    product.images?.[0]?.image_path ||
    product.images?.[0]?.path ||
    product.image ||
    product.photo ||
    null;

  if (!imagePath) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
        <ShoppingBasket size={21} />
      </div>
    );
  }

  const imageUrl =
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
      ? imagePath
      : `${API_BASE_URL}/storage/${imagePath}`;

  return (
    <img
      src={imageUrl}
      alt={product.title}
      className="h-12 w-12 shrink-0 rounded-xl object-cover"
    />
  );
}

/* =========================
   STATISTIQUES
========================= */

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "green" | "red";
}) {
  const styles = {
    green:
      "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-[90px] items-center gap-4 rounded-[20px] border border-slate-100 bg-white px-5 py-4 shadow-sm shadow-slate-200/50">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-2xl font-black leading-none text-slate-950">
          {value}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}