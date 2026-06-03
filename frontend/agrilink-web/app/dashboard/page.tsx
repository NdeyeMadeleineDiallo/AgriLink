"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("agrilink_user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="card mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-black text-slate-950">
          Bienvenue, {user.name}
        </h1>
        <p className="mt-2 text-slate-500">
          Votre espace AgriLink est en cours de construction.
        </p>

        <div className="mt-6 rounded-2xl bg-green-50 p-5 text-green-800">
          Connexion réussie avec Laravel Sanctum.
        </div>
      </div>
    </main>
  );
}