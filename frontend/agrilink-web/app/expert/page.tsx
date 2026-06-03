"use client";

import { useEffect, useState } from "react";
import { getStoredUser, logout } from "@/src/lib/auth";

export default function ExpertPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="card mx-auto max-w-5xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Espace Expert
            </h1>
            <p className="mt-2 text-slate-500">
              Bienvenue {user.name}, gérez votre profil expert et vos demandes.
            </p>
          </div>

          <button onClick={logout} className="btn-secondary">
            Déconnexion
          </button>
        </div>
      </div>
    </main>
  );
}