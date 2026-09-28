"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  HelpCircle,
  LoaderCircle,
  RotateCcw,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

type AnswerLetter = "A" | "B" | "C" | "D";

type QuizQuestion = {
  id: number;
  quiz_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  position: number;
};

type QuizData = {
  id: number;
  lesson_id: number;
  title: string;
  passing_score: number;
  questions: QuizQuestion[];
};

type QuizResult = {
  message: string;
  score: number;
  passing_score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  attempt?: any;
};

export default function StudentQuizPage() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson_id");

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [bestAttempt, setBestAttempt] = useState<any>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  /*
   * Exemple :
   *
   * {
   *   12: "B",
   *   13: "A",
   *   14: "D"
   * }
   */
  const [answers, setAnswers] = useState<
    Record<number, AnswerLetter>
  >({});

  const [result, setResult] = useState<QuizResult | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [completionMessage, setCompletionMessage] =
    useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    if (!lessonId) {
      setLoading(false);
      setErrorMessage(
        "Aucune leçon n’a été sélectionnée."
      );
      return;
    }

    loadQuiz();
  }, [lessonId]);

  async function loadQuiz() {
    if (!lessonId) return;

    try {
      setLoading(true);
      setErrorMessage("");

      /*
       * On récupère la leçon pour connaître
       * son titre et son cours.
       */
      const lessonData = await apiRequest(
        `/lessons/${lessonId}`
      );

      const currentLesson =
        lessonData.lesson ||
        lessonData.data ||
        lessonData;

      setLesson(currentLesson);

      /*
       * Puis le vrai quiz associé à cette leçon.
       */
      const quizData = await apiRequest(
        `/lessons/${lessonId}/quiz`
      );

      setQuiz(quizData.quiz || null);
      setBestAttempt(quizData.best_attempt || null);
    } catch (error: any) {
      console.error(
        "Erreur chargement du quiz :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Aucun quiz n’est disponible pour cette leçon."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(
    questionId: number,
    answer: AnswerLetter
  ) {
    if (result) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  function nextQuestion() {
    if (!quiz) return;

    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  }

  async function finishQuiz() {
    if (!quiz || !lessonId || submitting) {
      return;
    }

    const unanswered = quiz.questions.filter(
      (question) => !answers[question.id]
    );

    if (unanswered.length > 0) {
      setErrorMessage(
        `Répondez encore à ${unanswered.length} question${
          unanswered.length > 1 ? "s" : ""
        } avant de valider le quiz.`
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setCompletionMessage("");

      const data: QuizResult = await apiRequest(
        `/lessons/${lessonId}/quiz/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            answers,
          }),
        }
      );

      setResult(data);

      /*
       * Si le quiz est réussi, on valide aussi
       * automatiquement la leçon.
       */
      if (data.passed) {
        try {
          await apiRequest(
            `/lessons/${lessonId}/complete`,
            {
              method: "POST",
            }
          );

          setCompletionMessage(
            "La leçon a également été marquée comme terminée."
          );
        } catch (completionError) {
          console.error(
            "Erreur validation de la leçon :",
            completionError
          );

          setCompletionMessage(
            "Quiz réussi. La progression de la leçon n’a toutefois pas pu être actualisée automatiquement."
          );
        }
      }

      /*
       * Actualisation locale du meilleur score.
       */
      if (
        !bestAttempt ||
        Number(data.score) >
          Number(bestAttempt.score || 0)
      ) {
        setBestAttempt({
          ...(data.attempt || {}),
          score: data.score,
          passed: data.passed,
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur validation du quiz :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible de valider le quiz."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restartQuiz() {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setErrorMessage("");
    setCompletionMessage("");
  }

  if (!user) return null;

  const questions = quiz?.questions || [];

  const question =
    questions[currentQuestion] || null;

  const selectedAnswer = question
    ? answers[question.id]
    : undefined;

  const answeredCount = questions.filter(
  (item) => Boolean(answers[item.id])
).length;

  const progressPercentage =
    questions.length > 0
      ? Math.round(
          (answeredCount / questions.length) *
            100
        )
      : 0;

  const courseId =
    lesson?.course?.id ||
    lesson?.course_id ||
    null;

  const returnHref = courseId
    ? `/student/course?course_id=${courseId}`
    : "/student";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="container-page py-10">
          <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white p-10 text-slate-500 shadow-md">
            <LoaderCircle
              size={23}
              className="animate-spin text-green-700"
            />

            Chargement du quiz...
          </div>
        </div>
      </main>
    );
  }

  /*
   * Aucun quiz associé à la leçon.
   */
  if (!quiz || questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <header className="border-b border-slate-100 bg-white">
          <div className="container-page flex min-h-24 items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Quiz
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {lesson?.title ||
                  "Leçon AgriAcademy"}
              </p>
            </div>

            <Link
              href={returnHref}
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              <ArrowLeft size={18} />
              Retour au cours
            </Link>
          </div>
        </header>

        <section className="container-page py-10">
          <div className="mx-auto max-w-xl rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <HelpCircle size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Quiz indisponible
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              {errorMessage ||
                "Aucun quiz n’a encore été ajouté à cette leçon."}
            </p>

            <Link
              href={returnHref}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
            >
              <ArrowLeft size={17} />
              Retour à la formation
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* HEADER */}
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              AgriAcademy · Évaluation
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              {quiz.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {lesson?.title}
              {lesson?.course?.title
                ? ` · ${lesson.course.title}`
                : ""}
            </p>
          </div>

          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour au cours
          </Link>
        </div>
      </header>

      <section className="container-page py-8">

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0"
            />

            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* SIDEBAR */}
          <aside className="h-fit rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <HelpCircle size={24} />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              Quiz de validation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Répondez à toutes les questions puis
              validez votre quiz.
            </p>

            {/* SEUIL */}
            <div className="mt-5 rounded-xl bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Score minimum
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {quiz.passing_score}%
              </p>
            </div>

            {/* PROGRESSION */}
            {!result && (
              <div className="mt-4 rounded-xl bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-green-700">
                    Progression
                  </p>

                  <p className="text-sm font-black text-green-800">
                    {progressPercentage}%
                  </p>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-green-100">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-green-700">
                  {answeredCount}/{questions.length} réponses
                </p>
              </div>
            )}

            {/* MEILLEUR SCORE */}
            {bestAttempt && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <Star size={17} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Meilleur score
                  </p>

                  <p className="font-bold text-slate-800">
                    {bestAttempt.score}%
                  </p>
                </div>
              </div>
            )}
          </aside>

          {/* CONTENU */}
          <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50 md:p-7">

            {!result && question ? (
              <>
                {/* QUESTION NUMBER */}
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                    Question {currentQuestion + 1}/
                    {questions.length}
                  </span>

                  <span className="text-sm text-slate-400">
                    {answeredCount} réponse
                    {answeredCount > 1 ? "s" : ""}
                  </span>
                </div>

                {/* QUESTION */}
                <h3 className="mt-6 text-2xl font-black leading-tight text-slate-950">
                  {question.question}
                </h3>

                {/* OPTIONS */}
                <div className="mt-6 grid gap-3">
                  {getOptions(question).map(
                    (option) => {
                      const selected =
                        selectedAnswer ===
                        option.key;

                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() =>
                            selectAnswer(
                              question.id,
                              option.key
                            )
                          }
                          className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 bg-slate-50 hover:border-green-200 hover:bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                              selected
                                ? "bg-green-600 text-white"
                                : "bg-white text-slate-500 ring-1 ring-slate-200"
                            }`}
                          >
                            {selected ? (
                              <CheckCircle2
                                size={19}
                              />
                            ) : (
                              option.key
                            )}
                          </span>

                          <span
                            className={`text-[15px] font-medium ${
                              selected
                                ? "text-green-900"
                                : "text-slate-700"
                            }`}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* NAVIGATION */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    disabled={currentQuestion === 0}
                    onClick={previousQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    Précédente
                  </button>

                  {currentQuestion <
                  questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={!selectedAnswer}
                      onClick={nextQuestion}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Suivante
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        !selectedAnswer ||
                        submitting
                      }
                      onClick={finishQuiz}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                          Validation...
                        </>
                      ) : (
                        <>
                          Valider le quiz
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : result ? (
              <QuizResultView
                result={result}
                completionMessage={
                  completionMessage
                }
                returnHref={returnHref}
                onRestart={restartQuiz}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function QuizResultView({
  result,
  completionMessage,
  returnHref,
  onRestart,
}: {
  result: QuizResult;
  completionMessage: string;
  returnHref: string;
  onRestart: () => void;
}) {
  return (
    <div className="py-5 text-center">
      <div
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] ${
          result.passed
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {result.passed ? (
          <Trophy size={38} />
        ) : (
          <RotateCcw size={36} />
        )}
      </div>

      <p
        className={`mt-5 text-xs font-bold uppercase tracking-[0.18em] ${
          result.passed
            ? "text-green-700"
            : "text-orange-600"
        }`}
      >
        {result.passed
          ? "Évaluation réussie"
          : "Continuez vos efforts"}
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        {result.passed
          ? "Quiz réussi !"
          : "Quiz à reprendre"}
      </h2>

      {/* SCORE */}
      <div className="mx-auto mt-6 max-w-md rounded-[20px] bg-slate-50 p-5">
        <p className="text-sm text-slate-500">
          Votre score
        </p>

        <p
          className={`mt-1 text-5xl font-black ${
            result.passed
              ? "text-green-700"
              : "text-orange-500"
          }`}
        >
          {result.score}%
        </p>

        <p className="mt-3 text-sm text-slate-500">
          {result.correct_answers}/
          {result.total_questions} bonnes réponses
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Score minimum requis :{" "}
          {result.passing_score}%
        </p>
      </div>

      {/* MESSAGE */}
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600">
        {result.message}
      </p>

      {completionMessage && (
        <div
          className={`mx-auto mt-4 max-w-xl rounded-xl px-4 py-3 text-sm font-medium ${
            result.passed
              ? "bg-green-50 text-green-700"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          {completionMessage}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          <RotateCcw size={17} />
          Refaire le quiz
        </button>

        <Link
          href={returnHref}
          className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Retour au cours
          <ChevronRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function getOptions(
  question: QuizQuestion
): {
  key: AnswerLetter;
  label: string;
}[] {
  return [
    {
      key: "A",
      label: question.option_a,
    },
    {
      key: "B",
      label: question.option_b,
    },
    {
      key: "C",
      label: question.option_c,
    },
    {
      key: "D",
      label: question.option_d,
    },
  ];
}