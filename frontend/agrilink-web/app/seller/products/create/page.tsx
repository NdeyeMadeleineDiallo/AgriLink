"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function CreateProductPage() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    quantity: "",
    unit: "",
    region: "",
    city: "",
    phone: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await apiRequest("/categories");
      setCategories(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          category_id: form.category_id ? Number(form.category_id) : null,
          price: form.price ? Number(form.price) : null,
        }),
      });

      setMessage("Produit ajouté avec succès. Il est en attente de validation.");
      setForm({
        category_id: "",
        title: "",
        description: "",
        price: "",
        quantity: "",
        unit: "",
        region: "",
        city: "",
        phone: "",
        whatsapp_number: "",
      });
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de la création du produit.");
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Ajouter un produit
            </h1>
            <p className="text-sm text-slate-500">
              Publiez une annonce sur AgriMarket.
            </p>
          </div>

          <Link href="/seller/products" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <form onSubmit={handleSubmit} className="card p-8">
          {message && (
            <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700">Catégorie</label>
              <select
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Titre du produit" value={form.title} onChange={(v) => updateField("title", v)} />
            <Input label="Prix" value={form.price} onChange={(v) => updateField("price", v)} />
            <Input label="Quantité" value={form.quantity} onChange={(v) => updateField("quantity", v)} />
            <Input label="Unité" value={form.unit} onChange={(v) => updateField("unit", v)} />
            <Input label="Région" value={form.region} onChange={(v) => updateField("region", v)} />
            <Input label="Ville" value={form.city} onChange={(v) => updateField("city", v)} />
            <Input label="Téléphone" value={form.phone} onChange={(v) => updateField("phone", v)} />
            <Input label="Numéro WhatsApp" value={form.whatsapp_number} onChange={(v) => updateField("whatsapp_number", v)} />
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button className="btn-primary mt-6 inline-flex items-center gap-2">
            <Save size={18} />
            Publier le produit
          </button>
        </form>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
      />
    </div>
  );
}