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
    { label: "Dashboard", href: "/admin", icon: <Home size={20} /> },
    { label: "Cours", href: "/admin/courses", icon: <BookOpen size={20} /> },
    { label: "Inscriptions", href: "/admin/enrollments", icon: <UserPlus size={20} /> },
    { label: "Leçons", href: "/admin/lessons", icon: <FileVideo size={20} /> },
    { label: "Cohortes", href: "/admin/cohorts", icon: <Layers size={20} /> },
    { label: "Produits", href: "/admin/products", icon: <ShoppingBasket size={20} /> },
    { label: "Experts", href: "/admin/experts", icon: <Users size={20} /> },
    { label: "Paiements", href: "/admin/payments", icon: <CreditCard size={20} /> },
    { label: "Utilisateurs", href: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 overflow-y-auto border-r border-slate-100 bg-white px-7 py-5 lg:block">
      <Link href="/admin" className="block text-center">
        <div className="relative mx-auto h-24 w-40">
          <Image
            src="/images/agrilink-logo.png"
            alt="AgriLink"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="-mt-2 text-xs font-black uppercase tracking-[0.35em] text-green-700">
          Admin Panel
        </p>
      </Link>

      <nav className="mt-10 space-y-1.5">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                active
                  ? "bg-green-100 text-green-700 shadow-sm"
                  : "text-slate-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}