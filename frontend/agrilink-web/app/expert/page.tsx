"use client";

import { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  Star,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function ExpertDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [expert, setExpert] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    loadData();
  }, []);

  async function loadData() {
    try {
      const expertData = await apiRequest("/my-expert-profile");
      const requestsData = await apiRequest("/expert-service-requests");

      setExpert(expertData.expert_profile || null);
      setRequests(requestsData.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Dashboard Expert
            </h1>

            <p className="text-sm text-slate-500">
              Gérez votre activité d’expert agricole.
            </p>
          </div>

          <Link
            href="/"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
          <p className="text-sm text-white/80">
            Expert AgriLink
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Développez votre activité d’expertise.
          </h2>

          <p className="mt-4 max-w-2xl text-white/85">
            Recevez des demandes, accompagnez les producteurs
            et développez votre visibilité.
          </p>
        </div>

        {loading ? (
          <div className="card mt-8 p-8">
            Chargement...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <StatCard
                icon={<Briefcase />}
                label="Demandes"
                value={requests.length}
              />

              <StatCard
                icon={<Star />}
                label="Note moyenne"
                value="5.0"
              />

              <StatCard
                icon={<MessageSquare />}
                label="Messages"
                value="0"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="card p-6">
                <h3 className="text-xl font-black">
                  Mon profil
                </h3>

                {expert ? (
                  <div className="mt-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <User size={40} />
                    </div>

                    <h4 className="mt-4 text-xl font-bold">
                      {expert.name}
                    </h4>

                    <p className="text-green-700 font-semibold">
                      {expert.speciality}
                    </p>

                    <p className="mt-4 text-slate-600">
                      {expert.biography}
                    </p>

                    <div className="mt-4 rounded-xl bg-green-50 p-4">
                      Tarif :
                      <span className="font-bold ml-2">
                        {expert.hourly_rate} FCFA
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-slate-500">
                    Aucun profil expert trouvé.
                  </p>
                )}
                <Link href="/expert/profile" className="btn-primary mt-5 inline-flex">
                 Modifier mon profil
                </Link>
              </div>

              <div className="card p-6 lg:col-span-2">
                <h3 className="text-xl font-black">
                  Mes demandes
                </h3>

                <div className="mt-5 space-y-4">
                  {requests.length === 0 && (
                    <p className="text-slate-500">
                      Aucune demande reçue.
                    </p>
                  )}

                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold">
                          {request.subject}
                        </h4>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-3 text-slate-600">
                        {request.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-black">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}