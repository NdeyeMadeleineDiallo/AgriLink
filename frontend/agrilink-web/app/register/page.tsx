"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/src/services/api";
import { redirectByRole } from "@/src/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "apprenant",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("agrilink_token", data.token);
      localStorage.setItem("agrilink_user", JSON.stringify(data.user));

      redirectByRole(data.user);
    } catch (err: any) {
      setError(err.message || "Erreur d’inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12">
      <div className="card w-full max-w-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A] text-white font-bold">
            AL
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-500">
            Rejoignez l’écosystème AgriLink.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Téléphone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
          >
            <option value="apprenant">Apprenant</option>
            <option value="vendeur">Vendeur</option>
            <option value="expert">Expert</option>
          </select>

          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Mot de passe"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />

          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Confirmer le mot de passe"
            type="password"
            value={form.password_confirmation}
            onChange={(e) => updateField("password_confirmation", e.target.value)}
            required
          />

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-bold text-green-700">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}