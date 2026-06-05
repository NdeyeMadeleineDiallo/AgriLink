"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id;

  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    price: "",
    status: "draft",
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCourse();
  }, []);

  async function loadCourse() {
    try {
      const data = await apiRequest(`/courses/${courseId}`);
      const course = data.course;

      setForm({
        title: course.title || "",
        description: course.description || "",
        level: course.level || "",
        duration: String(course.duration || ""),
        price: String(course.price || ""),
        status: course.status || "draft",
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
      await apiRequest(`/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          duration: Number(form.duration || 0),
          price: Number(form.price || 0),
        }),
      });

      setMessage("Cours modifié avec succès.");
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de la modification.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Modifier le cours
          </h1>
          <p className="mt-2 text-slate-500">
            Mettez à jour les informations de la formation.
          </p>
        </div>

        <Link href="/admin/courses" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        {message && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Titre du cours" value={form.title} onChange={(v) => updateField("title", v)} />
          <Input label="Niveau" value={form.level} onChange={(v) => updateField("level", v)} />
          <Input label="Durée" value={form.duration} onChange={(v) => updateField("duration", v)} />
          <Input label="Prix" value={form.price} onChange={(v) => updateField("price", v)} />

          <div>
            <label className="text-sm font-bold text-slate-700">Statut</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
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
          Enregistrer
        </button>
      </form>
    </AdminLayout>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
      />
    </div>
  );
}