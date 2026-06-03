"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function ExpertsPage() {
  const [user, setUser] = useState<any>(null);
  const [experts, setExperts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  async function loadExperts() {
    try {
      const data = await apiRequest("/experts");
      setExperts(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateExpertStatus(id: number, status: string) {
    try {
      await apiRequest(`/experts/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          is_verified: status === "approved",
        }),
      });

      loadExperts();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadExperts();
  }, []);

  if (!user) return null;

  const filteredExperts = experts.filter((expert) =>
    expert.speciality?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout user={user}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Gestion des experts
          </h1>
          <p className="mt-2 text-slate-500">
            Validation et suivi des profils AgriExpert.
          </p>
        </div>

        <input
          placeholder="Rechercher une spécialité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        />
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Expert</th>
              <th className="p-4 text-left">Spécialité</th>
              <th className="p-4 text-left">Région</th>
              <th className="p-4 text-left">Expérience</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredExperts.map((expert) => (
              <tr key={expert.id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold text-slate-800">
                    {expert.user?.name || "Expert"}
                  </p>
                  <p className="text-sm text-slate-500">{expert.email_contact}</p>
                </td>

                <td className="p-4">{expert.speciality}</td>
                <td className="p-4">{expert.region}</td>
                <td className="p-4">{expert.experience_years} ans</td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {expert.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateExpertStatus(expert.id, "approved")}
                      className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700"
                    >
                      Approuver
                    </button>

                    <button
                      onClick={() => updateExpertStatus(expert.id, "rejected")}
                      className="rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700"
                    >
                      Rejeter
                    </button>

                    <button
                      onClick={() => updateExpertStatus(expert.id, "suspended")}
                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"
                    >
                      Suspendre
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}