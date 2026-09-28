"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";

const formations: any = {
  intermediaire: {
    title: "Niveau intermédiaire",
    subtitle: "Protéger sa récolte : maladies, traitements bio et prévention",
    amount: 5000,
  },
  avance: {
    title: "Niveau avancé",
    subtitle: "Vendre mieux, négocier fort et transformer pour multiplier",
    amount: 15000,
  },
};

function StudentPaymentContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "intermediaire";
  const amount = Number(searchParams.get("amount") || formations[level]?.amount || 0);

  const [user, setUser] = useState<any>(null);
  const [method, setMethod] = useState("wave");
  const [loading, setLoading] = useState(false);

  const formation = formations[level] || formations.intermediaire;

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  function simulatePayment() {
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(`agrilink_access_${level}`, "true");
      window.location.href = `/student/payment-success?level=${level}`;
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex h-24 items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Paiement de la formation
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Choisissez votre moyen de paiement pour débloquer l’accès.
            </p>
          </div>

          <Link
            href="/student/courses"
            className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-3 font-black text-green-700 transition hover:bg-green-50"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-md lg:col-span-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-green-700">
              <CreditCard size={34} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-950">
              {formation.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              {formation.subtitle}
            </p>

            <div className="mt-6 rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-black text-green-700">
                Montant à payer
              </p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {amount.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-md lg:col-span-2">
            <h3 className="text-2xl font-black text-slate-950">
              Moyen de paiement
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Sélectionnez le service que vous souhaitez utiliser.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <PaymentMethod
                active={method === "wave"}
                title="Wave"
                description="Paiement mobile rapide"
                icon={<Smartphone size={28} />}
                onClick={() => setMethod("wave")}
              />

              <PaymentMethod
                active={method === "orange"}
                title="Orange Money"
                description="Paiement mobile Sénégal"
                icon={<Wallet size={28} />}
                onClick={() => setMethod("orange")}
              />

              <PaymentMethod
                active={method === "paypal"}
                title="PayPal"
                description="Paiement international"
                icon={<CreditCard size={28} />}
                onClick={() => setMethod("paypal")}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <h4 className="font-black text-slate-950">
                Résumé du paiement
              </h4>

              <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                <div className="flex justify-between">
                  <span>Formation</span>
                  <span>{formation.title}</span>
                </div>

                <div className="flex justify-between">
                  <span>Moyen choisi</span>
                  <span className="capitalize">{method}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 text-base text-slate-950">
                  <span>Total</span>
                  <span>{amount.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            </div>

            <button
              onClick={simulatePayment}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 font-black text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              <CheckCircle2 size={20} />
              {loading ? "Traitement du paiement..." : "Payer maintenant"}
            </button>

            <p className="mt-4 text-center text-xs font-medium text-slate-400">
              Version test : le paiement est simulé pour valider le parcours utilisateur.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function PaymentMethod({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active
          ? "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-100"
          : "border-slate-100 bg-slate-50 text-slate-700 hover:bg-white"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          active ? "bg-green-100 text-green-700" : "bg-white text-slate-500"
        }`}
      >
        {icon}
      </div>

      <h4 className="mt-4 font-black">{title}</h4>
      <p className="mt-1 text-sm">{description}</p>
    </button>
  );
}

export default function StudentPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC]">
          <div className="container-page flex min-h-screen items-center justify-center">
            <div className="rounded-[24px] border border-slate-100 bg-white px-8 py-6 text-sm font-semibold text-slate-500 shadow-lg shadow-slate-200/50">
              Chargement du paiement...
            </div>
          </div>
        </main>
      }
    >
      <StudentPaymentContent />
    </Suspense>
  );
}