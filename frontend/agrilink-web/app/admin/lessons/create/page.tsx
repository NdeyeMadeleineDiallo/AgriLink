"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function CreateLessonGlobalPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    course_id: "",
    title: "",
    content: "",
    video_url: "",
    position: "",
    duration: "",
    is_free: false,
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const data = await apiRequest("/courses");
      setCourses(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.course_id) {
      setMessage("Veuillez choisir un cours.");
      return;
    }

    try {
      await apiRequest(`/courses/${form.course_id}/lessons`, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          video_url: form.video_url,
          position: Number(form.position || 1),
          duration: Number(form.duration || 0),
          is_free: form.is_free,
        }),
      });

      setMessage("Leçon créée avec succès.");

      setForm({
        course_id: "",
        title: "",
        content: "",
        video_url: "",
        position: "",
        duration: "",
        is_free: false,
      });
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de la création de la leçon.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Créer une leçon
          </h1>

          <p className="mt-2 text-slate-500">
            Ajoutez une leçon en choisissant le cours associé.
          </p>
        </div>

        <Link href="/admin/lessons" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour aux leçons
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        {message && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700">Cours</label>
            <select
              value={form.course_id}
              onChange={(e) => updateField("course_id", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="">Choisir un cours</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <Input label="Titre de la leçon" value={form.title} onChange={(v) => updateField("title", v)} />
          <Input label="Position" value={form.position} onChange={(v) => updateField("position", v)} />
          <Input label="Durée en minutes" value={form.duration} onChange={(v) => updateField("duration", v)} />
          <Input label="Lien vidéo externe facultatif" value={form.video_url} onChange={(v) => updateField("video_url", v)} />
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">
            Contenu de la leçon
          </label>
          <textarea
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={7}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={form.is_free}
            onChange={(e) => updateField("is_free", e.target.checked)}
          />
          <span className="font-bold text-slate-700">Leçon gratuite</span>
        </label>

        <button className="btn-primary mt-6 inline-flex items-center gap-2">
          <Save size={18} />
          Créer la leçon
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