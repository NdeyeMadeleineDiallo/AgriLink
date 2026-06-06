"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function EditCohortPage() {
  const params = useParams();
  const cohortId = params.id;

  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCohort();
  }, []);

  async function loadCohort() {
    try {
      const data = await apiRequest(`/cohorts/${cohortId}`);
      const cohort = data.cohort;

      setForm({
        name: cohort.name || "",
        description: cohort.description || "",
        start_date: cohort.start_date ? cohort.start_date.substring(0, 10) : "",
        end_date: cohort.end_date ? cohort.end_date.substring(0, 10) : "",
        status: cohort.status || "active",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      await apiRequest(`/cohorts/${cohortId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setMessage("Cohorte modifiée avec succès.");
      loadCohort();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de la modification.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Modifier la cohorte
          </h1>

          <p className="mt-2 text-slate-500">
            Mettez à jour les informations de la promotion.
          </p>
        </div>

        <Link href="/admin/cohorts" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour aux cohortes
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        {message && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Nom de la cohorte" value={form.name} onChange={(v) => updateField("name", v)} />
          <Input label="Date de début" type="date" value={form.start_date} onChange={(v) => updateField("start_date", v)} />
          <Input label="Date de fin" type="date" value={form.end_date} onChange={(v) => updateField("end_date", v)} />

          <div>
            <label className="text-sm font-bold text-slate-700">Statut</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <button className="btn-primary mt-6 inline-flex items-center gap-2">
          <Save size={18} />
          Enregistrer les modifications
        </button>
      </form>
    </AdminLayout>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
      />
    </div>
  );
}