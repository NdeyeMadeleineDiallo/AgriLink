"use client";

import {
  BookOpen,
  CreditCard,
  FileVideo,
  Home,
  Layers,
  ShoppingBasket,
  Users,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Cours", href: "/admin/courses", icon: BookOpen },
    { label: "Inscriptions", href: "/admin/enrollments", icon: UserPlus },
    { label: "Leçons", href: "/admin/lessons", icon: FileVideo },
    { label: "Cohortes", href: "/admin/cohorts", icon: Layers },
    { label: "Produits", href: "/admin/products", icon: ShoppingBasket },
    { label: "Experts", href: "/admin/experts", icon: Users },
    { label: "Paiements", href: "/admin/payments", icon: CreditCard },
    { label: "Utilisateurs", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 overflow-hidden border-r border-slate-100 bg-white px-5 py-3 lg:flex lg:flex-col xl:w-64">
      <Link href="/admin" className="block shrink-0 text-center">
        <div className="relative mx-auto h-16 w-32">
          <Image
            src="/images/agrilink-logo.png"
            alt="AgriLink"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="-mt-1 text-[11px] font-black uppercase tracking-[0.3em] text-green-700">
          Admin Panel
        </p>
      </Link>

      <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-2 pb-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-0 items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-bold transition-all ${
                active
                  ? "bg-green-100 text-green-700 shadow-sm"
                  : "text-slate-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}