"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "intermediaire";
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
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="container-page flex min-h-screen items-center justify-center py-10">
        <div className="max-w-xl rounded-[30px] border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-green-100 text-green-700">
            <CheckCircle2 size={54} />
          </div>

          <h1 className="mt-8 text-4xl font-black text-slate-950">
            Paiement validé
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            Votre accès à la formation est maintenant activé. Vous pouvez
            retourner au catalogue et ouvrir la formation.
          </p>

          <Link
            href="/student/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-7 py-4 font-black text-white transition hover:bg-green-700"
          >
            Retour au catalogue
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}