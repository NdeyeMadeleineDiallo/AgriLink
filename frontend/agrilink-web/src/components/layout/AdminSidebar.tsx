import { BookOpen, CreditCard, FileVideo, Home, Layers, ShoppingBasket, Users } from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  const items = [
    { label: "Dashboard", href: "/admin", icon: <Home size={20} /> },
    { label: "Cours", href: "/admin/courses", icon: <BookOpen size={20} /> },
    { label: "Leçons", href: "/admin/lessons", icon: <FileVideo size={20} /> },
    { label: "Cohortes", href: "/admin/cohorts", icon: <Layers size={20} /> },
    { label: "Produits", href: "/admin/products", icon: <ShoppingBasket size={20} /> },
    { label: "Experts", href: "/admin/experts", icon: <Users size={20} /> },
    { label: "Paiements", href: "/admin/payments", icon: <CreditCard size={20} /> },
  ];

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16A34A] text-lg font-bold text-white">
          AL
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-950">AgriLink</h1>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </Link>

      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}