"use client";

import { logout } from "@/src/lib/auth";
import { Bell, LogOut, Search } from "lucide-react";

export default function AdminTopbar({ user }: { user: any }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-xl font-black text-slate-950">Tableau de bord</h2>
        <p className="text-sm text-slate-500">Vue globale de la plateforme AgriLink</p>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Rechercher..."
            className="bg-transparent text-sm outline-none"
          />
        </div>

        <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500">
          <Bell size={18} />
        </button>

        <div className="rounded-2xl bg-green-50 px-4 py-2">
          <p className="text-sm font-bold text-slate-800">{user?.name}</p>
          <p className="text-xs text-green-700">Super Admin</p>
        </div>

        <button onClick={logout} className="rounded-2xl bg-slate-900 p-3 text-white">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}