"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Upload, Video } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest, apiUpload } from "@/src/services/api";

export default function LessonMediaPage() {
  const params = useParams();
  const lessonId = params.id;

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

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
      setLesson(data.lesson);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpload() {
    setMessage("");

    if (!videoFile && !pdfFile) {
      setMessage("Veuillez choisir une vidéo ou un PDF.");
      return;
    }

    const formData = new FormData();

    if (videoFile) {
      formData.append("video", videoFile);
    }

    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    try {
      await apiUpload(`/lessons/${lessonId}/media`, formData);
      setMessage("Médias mis à jour avec succès.");
      setVideoFile(null);
      setPdfFile(null);
      loadLesson();
    } catch (error: any) {
      setMessage(error?.message || "Erreur lors de l’envoi des médias.");
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Médias de la leçon
          </h1>
          <p className="mt-2 text-slate-500">
            Ajoutez une vidéo et un document PDF à une leçon AgriAcademy.
          </p>
        </div>

        <Link href="/admin/courses" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Retour aux cours
        </Link>
      </div>

      <div className="card p-8">
        {lesson && (
          <div className="mb-8 rounded-3xl bg-green-50 p-6">
            <p className="text-sm font-bold text-green-700">Leçon sélectionnée</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {lesson.title}
            </h2>
            <p className="mt-2 text-slate-600">
              Cours : {lesson.course?.title}
            </p>
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Video />
              </div>
              <div>
                <h3 className="font-black text-slate-950">Vidéo de la leçon</h3>
                <p className="text-sm text-slate-500">Formats : MP4, MOV, AVI, WEBM</p>
              </div>
            </div>

            {lesson?.video_file && (
              <video
                controls
                className="mt-5 w-full rounded-2xl"
                src={`http://127.0.0.1:8000/storage/${lesson.video_file}`}
              />
            )}

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-3 text-green-600">
                <FileText />
              </div>
              <div>
                <h3 className="font-black text-slate-950">Document PDF</h3>
                <p className="text-sm text-slate-500">Support de cours téléchargeable</p>
              </div>
            </div>

            {lesson?.pdf_file && (
              <a
                href={`http://127.0.0.1:8000/storage/${lesson.pdf_file}`}
                target="_blank"
                className="mt-5 inline-flex rounded-2xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                Voir le PDF actuel
              </a>
            )}

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          className="btn-primary mt-8 inline-flex items-center gap-2"
        >
          <Upload size={18} />
          Enregistrer les médias
        </button>
      </div>
    </AdminLayout>
  );
}