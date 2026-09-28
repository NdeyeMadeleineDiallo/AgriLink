"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ImageOff,
  LogOut,
  MapPin,
  MessageCircle,
  PackageSearch,
  PlusCircle,
  Search,
  ShoppingBasket,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser, logout } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

type MarketFilter =
  | "all"
  | "culture"
  | "semences"
  | "engrais"
  | "equipements"
  | "betail";

const filters: {
  id: MarketFilter;
  label: string;
}[] = [
  { id: "all", label: "Tous" },
  { id: "culture", label: "Culture" },
  { id: "semences", label: "Semences" },
  { id: "engrais", label: "Engrais" },
  { id: "equipements", label: "Équipements" },
  { id: "betail", label: "Bétail" },
];

export default function SellerMarketplacePage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<MarketFilter>("all");
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
      console.error("Erreur lors du chargement des produits :", error);
    } finally {
      setLoading(false);
    }
  }

  const approvedProducts = useMemo(() => {
    return products.filter((product) => product.status === "approved");
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return approvedProducts.filter((product) => {
      const category = getCategorySlug(product);
      const title = normalizeText(product.title || "");
      const city = normalizeText(product.city || "");
      const region = normalizeText(product.region || "");
      const description = normalizeText(product.description || "");

      const matchesSearch =
        normalizedSearch.length === 0 ||
        title.includes(normalizedSearch) ||
        city.includes(normalizedSearch) ||
        region.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch);

      const matchesFilter =
        activeFilter === "all" || category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [approvedProducts, search, activeFilter]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              AgriMarket
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Découvrez, publiez et contactez les vendeurs de produits agricoles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-5 py-3 font-black text-green-700 transition hover:bg-green-50"
            >
              <ArrowLeft size={18} />
              Retour
            </Link>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        <div
          className="relative min-h-[330px] overflow-hidden rounded-[30px] bg-cover bg-center shadow-xl shadow-slate-300/40"
          style={{
            backgroundImage: "url('/images/agrimarket-banner.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-green-950/75 to-black/15" />

          <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-7 md:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-200">
                La marketplace agricole AgriLink
              </p>

              <h2 className="mt-4 max-w-2xl text-xl font-black leading-tight text-white md:text-4xl">
                Achetez et vendez des produits agricoles en toute simplicité.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                Retrouvez les récoltes, semences, engrais, équipements et
                produits d’élevage proposés par les utilisateurs de la plateforme.
              </p>
            </div>

            <div className="mt-1 flex flex-wrap justify-end gap-3">
  <Link
    href="/seller/products"
    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-green-700 shadow-md transition hover:-translate-y-0.5 hover:bg-green-50"
  >
    <ShoppingBasket size={17} />
    Mes produits
  </Link>

  <Link
    href="/seller/products/create"
    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-600"
  >
    <PlusCircle size={17} />
    Publier une annonce
  </Link>
</div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Search size={21} className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un produit, une ville ou une catégorie..."
                className="h-14 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-green-700 px-7 font-black text-white transition hover:bg-green-800"
            >
              <Search size={18} />
              Rechercher
            </button>

            <button
              type="button"
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-green-700"
              aria-label="Afficher les filtres"
            >
              <SlidersHorizontal size={21} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-black transition ${
                    isActive
                      ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              Produits disponibles
            </p>

            <h3 className="mt-2 text-3xl font-black text-slate-950">
              Découvrez le marché
            </h3>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {filteredProducts.length} annonce
            {filteredProducts.length > 1 ? "s" : ""} trouvée
            {filteredProducts.length > 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="mt-7 rounded-[28px] border border-slate-100 bg-white p-10 text-center font-medium text-slate-500 shadow-lg">
            Chargement des produits disponibles...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-7 rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-lg shadow-slate-200/50">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
              <PackageSearch size={38} />
            </div>

            <h4 className="mt-5 text-2xl font-black text-slate-950">
              Aucun produit trouvé
            </h4>

            <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">
              Modifiez votre recherche ou sélectionnez une autre catégorie.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: any }) {
  const imageUrl = getProductImageUrl(product);
  const categoryLabel = getCategoryLabel(product);

  const whatsappNumber =
    product.whatsapp_number ||
    product.phone ||
    product.user?.phone ||
    "";

  const whatsappLink = buildWhatsappLink(
    whatsappNumber,
    product.title,
    product.price
  );

  return (
    <article className="group overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <div className="text-center">
              <ImageOff size={30} className="mx-auto" />
              <p className="mt-2 text-xs font-bold">Image indisponible</p>
            </div>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black text-green-700 shadow-sm backdrop-blur">
          {categoryLabel}
        </span>
      </div>

      <div className="p-4">
        <h4 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-slate-950">
          {product.title}
        </h4>

        <p className="mt-2 text-xl font-black text-green-700">
          {formatPrice(product.price)} FCFA
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <ShoppingBasket size={15} className="shrink-0 text-orange-500" />

            <span>
              {product.quantity || 0} {product.unit || "unité"} disponible
              {Number(product.quantity) > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <MapPin size={15} className="shrink-0 text-green-700" />

            <span className="line-clamp-1">
              {[product.city, product.region].filter(Boolean).join(", ") ||
                "Localisation non renseignée"}
            </span>
          </div>
        </div>

        {product.user?.name && (
          <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
            Publié par{" "}
            <span className="text-slate-700">{product.user.name}</span>
          </p>
        )}

        {whatsappNumber ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-black text-white shadow-md shadow-green-100 transition hover:bg-[#1fbd59]"
          >
            <MessageCircle size={17} />
            Contacter
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-400"
          >
            <MessageCircle size={17} />
            Contact indisponible
          </button>
        )}
      </div>
    </article>
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

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}/storage/${path}`;
}

function getCategoryName(product: any): string {
  return (
    product.category?.name ||
    product.category_name ||
    product.category ||
    product.type ||
    ""
  );
}

function getCategorySlug(product: any): string {
  const category = normalizeText(getCategoryName(product));

  if (
    category.includes("culture") ||
    category.includes("recolte") ||
    category.includes("legume") ||
    category.includes("fruit") ||
    category.includes("produit agricole")
  ) {
    return "culture";
  }

  if (category.includes("semence")) {
    return "semences";
  }

  if (
    category.includes("engrais") ||
    category.includes("fertilisant") ||
    category.includes("intrant")
  ) {
    return "engrais";
  }

  if (
    category.includes("equipement") ||
    category.includes("materiel") ||
    category.includes("machine") ||
    category.includes("outil")
  ) {
    return "equipements";
  }

  if (
    category.includes("betail") ||
    category.includes("elevage") ||
    category.includes("animal") ||
    category.includes("volaille")
  ) {
    return "betail";
  }

  return category;
}

function getCategoryLabel(product: any) {
  const name = (
    product.category?.name ||
    product.category_name ||
    ""
  ).toLowerCase();

  if (name.includes("culture")) return "Culture";
  if (name.includes("récolte")) return "Culture";
  if (name.includes("semence")) return "Semences";
  if (name.includes("engrais")) return "Engrais";
  if (name.includes("équipement")) return "Équipements";
  if (name.includes("equipement")) return "Équipements";
  if (name.includes("bétail")) return "Bétail";
  if (name.includes("betail")) return "Bétail";

  return "Culture";
}

function normalizeText(value: string): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatPrice(price: number | string): string {
  const numericPrice = Number(price || 0);

  return new Intl.NumberFormat("fr-FR").format(numericPrice);
}

function normalizeWhatsappNumber(phone: string): string {
  let normalized = String(phone || "").replace(/\D/g, "");

  if (normalized.startsWith("00")) {
    normalized = normalized.substring(2);
  }

  if (normalized.length === 9) {
    normalized = `221${normalized}`;
  }

  return normalized;
}

function buildWhatsappLink(
  phone: string,
  productTitle: string,
  price: number | string
): string {
  const normalizedPhone = normalizeWhatsappNumber(phone);

  const message = encodeURIComponent(
    `Bonjour, je vous contacte depuis AgriMarket au sujet du produit « ${productTitle} », proposé à ${formatPrice(
      price
    )} FCFA. Est-il toujours disponible ?`
  );

  return `https://wa.me/${normalizedPhone}?text=${message}`;
}