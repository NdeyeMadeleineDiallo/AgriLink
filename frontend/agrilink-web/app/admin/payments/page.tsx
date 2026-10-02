"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  CreditCard,
  ReceiptText,
  Search,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const data = await apiRequest("/payments");
      setPayments(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) return null;

  const filteredPayments = payments.filter((payment) =>
    `${payment.user?.name || ""} ${payment.subscription?.name || ""} ${
      payment.payment_method || ""
    } ${payment.status || ""} ${payment.transaction_reference || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paidCount = payments.filter((payment) => payment.status === "paid").length;

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return (
    <AdminLayout user={user}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-green-700">
            Paiements
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Gestion des paiements
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Suivez les paiements, abonnements et références de transaction AgriAcademy.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatBox
          icon={<ReceiptText size={22} />}
          label="Total paiements"
          value={payments.length}
          color="green"
        />
        <StatBox
          icon={<ShieldCheck size={22} />}
          label="Paiements validés"
          value={paidCount}
          color="orange"
        />
        <StatBox
          icon={<Banknote size={22} />}
          label="Montant total"
          value={`${totalAmount.toLocaleString("fr-FR")} FCFA`}
          color="slate"
        />
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Liste des paiements
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {filteredPayments.length} paiement(s) affiché(s)
            </p>
          </div>

          <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:w-80">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Rechercher un paiement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Utilisateur
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Abonnement
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Montant
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Méthode
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Statut
                </th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  Référence
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Aucun paiement disponible.
                  </td>
                </tr>
              )}

              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="transition hover:bg-slate-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                        <User size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {payment.user?.name || "Utilisateur"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className="text-orange-600" />
                      {payment.subscription?.name || "Abonnement"}
                    </div>
                  </td>

                  <td className="p-4 text-sm font-black text-green-700">
                    {Number(payment.amount || 0).toLocaleString("fr-FR")} FCFA
                  </td>

                  <td className="p-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Wallet size={15} className="text-slate-500" />
                      {payment.payment_method || "-"}
                    </div>
                  </td>

                  <td className="p-4">
                    <StatusBadge status={payment.status} />
                  </td>

                  <td className="p-4 text-xs font-bold text-slate-500">
                    {payment.transaction_reference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  const labels: any = {
    paid: "Payé",
    pending: "En attente",
    failed: "Échoué",
    cancelled: "Annulé",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status || "-"}
    </span>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "green" | "orange" | "slate";
}) {
  const styles = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
  <div className="flex min-h-[105px] items-center gap-4 rounded-[20px] border border-slate-100 bg-white p-4 shadow-md shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${styles[color]}`}
    >
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-2xl font-bold leading-none text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  </div>
);
}
