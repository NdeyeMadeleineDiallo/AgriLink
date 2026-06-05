"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

export default function EditLessonPage() {
  const params = useParams();
  const lessonId = params.id;

  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
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
    loadLesson();
  }, []);

  async function loadLesson() {
    try {
      const data = await apiRequest(`/lessons/${lessonId}`);
      const lesson = data.lesson;

      setForm({
        title: lesson.title || "",
        content: lesson.content || "",
        video_url: lesson.video_url || "",
        position: String(lesson.position || ""),
        duration: String(lesson.duration || ""),
        is_free: Boolean(lesson.is_free),
      });
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

    try {
      await apiRequest(`/lessons/${lessonId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          position: Number(form.position || 1),
          duration: Number(form.duration || 0),
        }),
      });

      setMessage("Leçon modifiée avec succès.");
      loadLesson();
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
            Modifier la leçon
          </h1>
          <p className="mt-2 text-slate-500">
            Mettez à jour le contenu pédagogique de la leçon.
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
          <Input
            label="Titre de la leçon"
            value={form.title}
            onChange={(v) => updateField("title", v)}
          />

          <Input
            label="Position"
            value={form.position}
            onChange={(v) => updateField("position", v)}
          />

          <Input
            label="Durée en minutes"
            value={form.duration}
            onChange={(v) => updateField("duration", v)}
          />

          <Input
            label="Lien vidéo externe facultatif"
            value={form.video_url}
            onChange={(v) => updateField("video_url", v)}
          />
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
          <span className="font-bold text-slate-700">
            Leçon gratuite
          </span>
        </label>

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