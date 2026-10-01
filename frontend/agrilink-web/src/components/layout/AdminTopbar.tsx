"use client";

import { logout } from "@/src/lib/auth";
import { Bell, LogOut, Search } from "lucide-react";

export default function AdminTopbar({ user }: { user: any }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-6">
      <div className="min-w-0">
        <h2 className="text-lg font-black text-slate-950">
          Tableau de bord
        </h2>
        <p className="text-xs text-slate-500">
          Vue globale de la plateforme AgriLink
        </p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Search size={17} className="shrink-0 text-slate-400" />
          <input
            placeholder="Rechercher..."
            className="min-w-0 w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500">
          <Bell size={17} />
        </button>

        <div className="rounded-xl bg-green-50 px-3 py-1.5">
          <p className="max-w-44 truncate text-xs font-bold text-slate-800">
            {user?.name}
          </p>
          <p className="text-[11px] text-green-700">Super Admin</p>
        </div>

        <button
          onClick={logout}
          className="rounded-xl bg-slate-900 p-2.5 text-white"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}