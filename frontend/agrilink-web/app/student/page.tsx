"use client";

import { useEffect, useState } from "react";
import { Award, BookOpen, CreditCard, LogOut, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getStoredUser, logout } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    async function loadData() {
      try {
        const progressData = await apiRequest("/my-progress");
        const certificateData = await apiRequest("/my-certificates");
        const subscriptionData = await apiRequest("/my-subscription");

        setProgress(progressData.progress || []);
        setCertificates(certificateData.certificates || []);
        setSubscription(subscriptionData.subscription || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (!user) return null;

  const averageProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce((sum, item) => sum + item.progress_percentage, 0) /
            progress.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Espace Apprenant
            </h1>
            <p className="text-sm text-slate-500">
              Bienvenue {user.name}, suivez vos cours et votre progression.
            </p>
          </div>

          <button onClick={logout} className="btn-secondary inline-flex items-center gap-2">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
  <p className="text-sm text-white/80">Votre parcours AgriAcademy</p>

  <h2 className="mt-3 text-4xl font-black">
    Continuez votre progression agricole.
  </h2>

  <p className="mt-4 max-w-2xl text-white/85">
    Retrouvez vos cours, certificats et informations d’abonnement dans un seul espace.
  </p>

  <div className="mt-6">
    <Link
      href="/student/courses"
      className="inline-flex items-center rounded-2xl bg-white px-6 py-3 font-bold text-green-700 shadow-md hover:bg-green-50"
    >
      Voir mes cours
    </Link>
  </div>
</div>

        {loading ? (
          <div className="mt-8 card p-8 text-slate-500">
            Chargement de votre espace...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-4">
              <StatCard
                icon={<BookOpen />}
                label="Cours suivis"
                value={progress.length}
              />
              <StatCard
                icon={<TrendingUp />}
                label="Progression moyenne"
                value={`${averageProgress}%`}
              />
              <StatCard
                icon={<Award />}
                label="Certificats"
                value={certificates.length}
              />
              <StatCard
                icon={<CreditCard />}
                label="Abonnement"
                value={subscription ? "Actif" : "Aucun"}
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="card p-6 lg:col-span-2">
                <h3 className="text-xl font-black text-slate-950">
                  Mes cours et progressions
                </h3>

                <div className="mt-6 space-y-4">
                  {progress.length === 0 && (
                    <p className="text-slate-500">
                      Aucun cours suivi pour le moment.
                    </p>
                  )}

                  {progress.map((item) => (
                    <div key={item.course_id} className="rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {item.course_title}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {item.completed_lessons}/{item.total_lessons} leçons terminées
                          </p>
                        </div>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                          {item.progress_percentage}%
                        </span>
                      </div>

                      <div className="mt-4 h-3 rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-green-600"
                          style={{ width: `${item.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-xl font-black text-slate-950">
                    Mon abonnement
                  </h3>

                  {subscription ? (
                    <div className="mt-4 rounded-2xl bg-green-50 p-5">
                      <p className="font-bold text-green-800">
                        {subscription.subscription?.name}
                      </p>
                      <p className="mt-2 text-sm text-green-700">
                        Expire le : {subscription.end_date}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 text-slate-500">
                      Aucun abonnement actif.
                    </p>
                  )}
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-black text-slate-950">
                    Mes certificats
                  </h3>

                  <div className="mt-4 space-y-3">
                    {certificates.length === 0 && (
                      <p className="text-slate-500">
                        Aucun certificat généré.
                      </p>
                    )}

                    {certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="rounded-2xl bg-orange-50 p-4"
                      >
                        <p className="font-bold text-orange-800">
                          {certificate.course?.title}
                        </p>
                        <p className="mt-1 text-xs text-orange-700">
                          N° {certificate.certificate_number}
                        </p>
                      </div>
                    ))}
                  </div>
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
      <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}