"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CirclePlus,
  HelpCircle,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AdminLayout from "@/src/components/layout/AdminLayout";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

type Answer = "A" | "B" | "C" | "D";

type Question = {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: Answer;
};

const emptyQuestion = (): Question => ({
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
});

export default function AdminLessonQuizPage() {
  const params = useParams();

  const lessonId = String(
    params.lessonId || ""
  );

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] =
    useState("70");

  const [questions, setQuestions] =
    useState<Question[]>([
      emptyQuestion(),
    ]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "success" | "error" | ""
    >("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href =
        "/login";
      return;
    }

    setUser(storedUser);

    if (lessonId) {
      loadQuiz();
    }
  }, [lessonId]);

  async function loadQuiz() {
    try {
      setLoading(true);

      const data = await apiRequest(
        `/admin/lessons/${lessonId}/quiz`
      );

      setLesson(data.lesson);

      if (data.quiz) {
        setTitle(
          data.quiz.title || ""
        );

        setPassingScore(
          String(
            data.quiz
              .passing_score ?? 70
          )
        );

        if (
          Array.isArray(
            data.quiz.questions
          ) &&
          data.quiz.questions
            .length > 0
        ) {
          setQuestions(
            data.quiz.questions.map(
              (question: any) => ({
                question:
                  question.question ||
                  "",

                option_a:
                  question.option_a ||
                  "",

                option_b:
                  question.option_b ||
                  "",

                option_c:
                  question.option_c ||
                  "",

                option_d:
                  question.option_d ||
                  "",

                correct_answer:
                  question.correct_answer ||
                  "A",
              })
            )
          );
        }
      } else {
        /*
         * Nouveau quiz :
         * titre automatiquement proposé.
         */
        const lessonTitle =
          data.lesson?.title ||
          "Leçon";

        setTitle(
          `Quiz — ${lessonTitle}`
        );
      }
    } catch (error: any) {
      console.error(
        "Erreur chargement quiz :",
        error
      );

      setMessageType("error");

      setMessage(
        error?.message ||
          "Impossible de charger le quiz."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateQuestion(
    index: number,
    field: keyof Question,
    value: string
  ) {
    setQuestions(
      (previous) =>
        previous.map(
          (question, questionIndex) =>
            questionIndex === index
              ? {
                  ...question,
                  [field]: value,
                }
              : question
        )
    );
  }

  function addQuestion() {
    setQuestions(
      (previous) => [
        ...previous,
        emptyQuestion(),
      ]
    );
  }

  function removeQuestion(
    index: number
  ) {
    if (questions.length === 1) {
      setMessageType("error");

      setMessage(
        "Le quiz doit contenir au moins une question."
      );

      return;
    }

    setQuestions(
      (previous) =>
        previous.filter(
          (_, questionIndex) =>
            questionIndex !== index
        )
    );
  }

  function validateForm() {
    if (!title.trim()) {
      return "Le titre du quiz est obligatoire.";
    }

    const score =
      Number(passingScore);

    if (
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      return "Le score minimum doit être compris entre 0 et 100.";
    }

    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question =
        questions[index];

      if (
        !question.question.trim()
      ) {
        return `La question ${
          index + 1
        } est vide.`;
      }

      if (
        !question.option_a.trim() ||
        !question.option_b.trim() ||
        !question.option_c.trim() ||
        !question.option_d.trim()
      ) {
        return `Complétez les quatre réponses de la question ${
          index + 1
        }.`;
      }
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const error =
      validateForm();

    if (error) {
      setMessageType("error");
      setMessage(error);
      return;
    }

    try {
      setSaving(true);

      await apiRequest(
        `/admin/lessons/${lessonId}/quiz`,
        {
          method: "POST",

          body: JSON.stringify({
            title:
              title.trim(),

            passing_score:
              Number(
                passingScore
              ),

            questions:
              questions.map(
                (question) => ({
                  question:
                    question.question.trim(),

                  option_a:
                    question.option_a.trim(),

                  option_b:
                    question.option_b.trim(),

                  option_c:
                    question.option_c.trim(),

                  option_d:
                    question.option_d.trim(),

                  correct_answer:
                    question.correct_answer,
                })
              ),
          }),
        }
      );

      setMessageType(
        "success"
      );

      setMessage(
        "Quiz enregistré avec succès."
      );
    } catch (error: any) {
      console.error(
        "Erreur enregistrement quiz :",
        error
      );

      setMessageType(
        "error"
      );

      setMessage(
        error?.message ||
          "Impossible d’enregistrer le quiz."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy · Quiz
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              {lesson
                ? `Quiz — ${lesson.title}`
                : "Quiz de la leçon"}
            </h1>

            {lesson?.course && (
              <p className="mt-1 text-sm text-slate-500">
                Cours :{" "}
                <span className="font-semibold text-slate-700">
                  {
                    lesson.course
                      .title
                  }
                </span>
              </p>
            )}
          </div>

          <Link
            href="/admin/lessons"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft
              size={17}
            />
            Retour
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-md">
            Chargement du quiz...
          </div>
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            {/* CONFIGURATION */}
            <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <HelpCircle
                    size={22}
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Configuration
                  </h2>

                  <p className="text-sm text-slate-500">
                    Définissez le titre
                    et le seuil de
                    réussite.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">

                <Field
                  label="Titre du quiz"
                >
                  <input
                    value={title}
                    onChange={(
                      event
                    ) =>
                      setTitle(
                        event.target
                          .value
                      )
                    }
                    className="quiz-input"
                  />
                </Field>

                <Field
                  label="Score minimum"
                >
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        passingScore
                      }
                      onChange={(
                        event
                      ) =>
                        setPassingScore(
                          event
                            .target
                            .value
                        )
                      }
                      className="quiz-input pr-12"
                    />

                    <span className="absolute right-4 top-[41px] -translate-y-1/2 text-sm font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                </Field>

              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                  messageType ===
                  "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {messageType ===
                  "success" && (
                  <CheckCircle2
                    size={18}
                  />
                )}

                {message}
              </div>
            )}

            {/* QUESTIONS */}
            <div className="space-y-4">
              {questions.map(
                (
                  question,
                  index
                ) => (
                  <QuestionCard
                    key={index}
                    index={index}
                    question={
                      question
                    }
                    canDelete={
                      questions.length >
                      1
                    }
                    onChange={
                      updateQuestion
                    }
                    onDelete={() =>
                      removeQuestion(
                        index
                      )
                    }
                  />
                )
              )}
            </div>

            {/* AJOUT QUESTION */}
            <button
              type="button"
              onClick={
                addQuestion
              }
              className="flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-green-200 bg-green-50/40 px-5 py-4 text-sm font-semibold text-green-700 transition hover:border-green-400 hover:bg-green-50"
            >
              <CirclePlus
                size={19}
              />
              Ajouter une question
            </button>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">

              <Link
                href="/admin/lessons"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 transition hover:bg-green-800 disabled:opacity-60"
              >
                <Save
                  size={17}
                />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer le quiz"}
              </button>

            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        .quiz-input {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 0.72rem 0.875rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: 0.2s ease;
        }

        .quiz-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px
            rgba(34, 197, 94, 0.1);
        }

        .quiz-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </AdminLayout>
  );
}

function QuestionCard({
  index,
  question,
  canDelete,
  onChange,
  onDelete,
}: {
  index: number;

  question: Question;

  canDelete: boolean;

  onChange: (
    index: number,
    field: keyof Question,
    value: string
  ) => void;

  onDelete: () => void;
}) {
  const answers: {
    key: Answer;
    field:
      | "option_a"
      | "option_b"
      | "option_c"
      | "option_d";
  }[] = [
    {
      key: "A",
      field: "option_a",
    },
    {
      key: "B",
      field: "option_b",
    },
    {
      key: "C",
      field: "option_c",
    },
    {
      key: "D",
      field: "option_d",
    },
  ];

  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/40">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-sm font-bold text-white">
            {index + 1}
          </div>

          <div>
            <p className="font-bold text-slate-950">
              Question{" "}
              {index + 1}
            </p>

            <p className="text-xs text-slate-400">
              Une seule bonne
              réponse
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
            title="Supprimer la question"
          >
            <Trash2
              size={16}
            />
          </button>
        )}

      </div>

      <div className="mt-4">
        <Field label="Question">
          <textarea
            value={
              question.question
            }
            onChange={(event) =>
              onChange(
                index,
                "question",
                event.target
                  .value
              )
            }
            rows={2}
            placeholder="Saisissez votre question..."
            className="quiz-input resize-none"
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">

        {answers.map(
          (answer) => {
            const selected =
              question.correct_answer ===
              answer.key;

            return (
              <div
                key={
                  answer.key
                }
                className={`rounded-xl border p-3 transition ${
                  selected
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        index,
                        "correct_answer",
                        answer.key
                      )
                    }
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      selected
                        ? "bg-green-600 text-white"
                        : "bg-white text-slate-500 ring-1 ring-slate-200"
                    }`}
                    title="Définir comme bonne réponse"
                  >
                    {selected ? (
                      <CheckCircle2
                        size={17}
                      />
                    ) : (
                      answer.key
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-500">
                      Réponse{" "}
                      {answer.key}
                    </p>

                    <input
                      value={
                        question[
                          answer.field
                        ]
                      }
                      onChange={(
                        event
                      ) =>
                        onChange(
                          index,
                          answer.field,
                          event
                            .target
                            .value
                        )
                      }
                      placeholder={`Option ${answer.key}`}
                      className="mt-1 w-full bg-transparent text-sm text-slate-800 outline-none"
                    />
                  </div>

                </div>
              </div>
            );
          }
        )}

      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-medium text-green-700">
        <CheckCircle2
          size={15}
        />
        Bonne réponse :{" "}
        <strong>
          {
            question.correct_answer
          }
        </strong>
      </div>

    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}