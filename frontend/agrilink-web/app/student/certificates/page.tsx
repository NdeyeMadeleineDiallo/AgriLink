"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Award, Download } from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function StudentCertificatesPage() {
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCertificates();
  }, []);

  async function loadCertificates() {
    try {
      const data = await apiRequest("/my-certificates");
      setCertificates(data.certificates || []);
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
              Mes certificats
            </h1>
            <p className="text-sm text-slate-500">
              Retrouvez vos certificats générés après validation des cours.
            </p>
          </div>

          <Link href="/student" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <div className="rounded-[28px] bg-gradient-to-br from-green-700 via-green-500 to-orange-500 p-8 text-white">
          <p className="text-sm text-white/80">Certificats AgriAcademy</p>
          <h2 className="mt-3 text-4xl font-black">
            Vos preuves de réussite.
          </h2>
          <p className="mt-4 max-w-2xl text-white/85">
            Chaque certificat confirme la réussite complète d’un parcours de formation.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 card p-8 text-slate-500">
            Chargement des certificats...
          </div>
        ) : certificates.length === 0 ? (
          <div className="mt-8 card p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600">
              <Award size={32} />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-950">
              Aucun certificat disponible
            </h3>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Terminez toutes les leçons d’un cours pour générer automatiquement votre certificat.
            </p>

            <Link href="/student/courses" className="btn-primary mt-6 inline-flex">
              Voir mes cours
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Award size={28} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-orange-500">
                      Certificat de réussite
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-950">
                      {certificate.course?.title || "Formation AgriAcademy"}
                    </h3>

                    <p className="mt-3 text-sm text-slate-500">
                      Numéro :{" "}
                      <span className="font-bold text-slate-700">
                        {certificate.certificate_number}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Émis le :{" "}
                      {certificate.issued_at
                        ? new Date(certificate.issued_at).toLocaleDateString("fr-FR")
                        : "Date non disponible"}
                    </p>

                    {certificate.file_path ? (
                      <a
                        href={`${API_BASE_URL}/storage/${certificate.file_path}`}
                        target="_blank"
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
                      >
                        <Download size={18} />
                        Télécharger le PDF
                      </a>
                    ) : (
                      <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-600">
                        Le PDF du certificat n’est pas encore généré côté serveur.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}