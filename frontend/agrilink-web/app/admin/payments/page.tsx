"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    async function loadPayments() {
      try {
        const data = await apiRequest("/payments");
        setPayments(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadPayments();
  }, []);

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div>
        <h1 className="text-3xl font-black text-slate-950">
          Gestion des paiements
        </h1>
        <p className="mt-2 text-slate-500">
          Suivi des paiements et abonnements AgriAcademy.
        </p>
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Utilisateur</th>
              <th className="p-4 text-left">Abonnement</th>
              <th className="p-4 text-left">Montant</th>
              <th className="p-4 text-left">Méthode</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Référence</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="p-4 font-semibold">
                  {payment.user?.name || "Utilisateur"}
                </td>
                <td className="p-4">
                  {payment.subscription?.name || "Abonnement"}
                </td>
                <td className="p-4 font-bold text-green-700">
                  {payment.amount} FCFA
                </td>
                <td className="p-4">{payment.payment_method}</td>
                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {payment.transaction_reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}