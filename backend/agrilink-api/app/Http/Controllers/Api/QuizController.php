<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | ÉTUDIANT : récupérer le quiz
    |--------------------------------------------------------------------------
    |
    | Important :
    | on ne retourne jamais correct_answer à l'étudiant.
    |
    */

    public function showByLesson(Request $request, Lesson $lesson)
    {
        $quiz = Quiz::with([
            'questions' => function ($query) {
                $query
                    ->select(
                        'id',
                        'quiz_id',
                        'question',
                        'option_a',
                        'option_b',
                        'option_c',
                        'option_d',
                        'position'
                    )
                    ->orderBy('position');
            },
        ])
            ->where('lesson_id', $lesson->id)
            ->first();

        if (! $quiz) {
            return response()->json([
                'message' => 'Aucun quiz disponible pour cette leçon.',
            ], 404);
        }

        $bestAttempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('user_id', $request->user()->id)
            ->orderByDesc('score')
            ->first();

        return response()->json([
            'quiz' => $quiz,
            'best_attempt' => $bestAttempt,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ÉTUDIANT : soumettre le quiz
    |--------------------------------------------------------------------------
    */

    public function submit(Request $request, Lesson $lesson)
    {
        $quiz = Quiz::with('questions')
            ->where('lesson_id', $lesson->id)
            ->first();

        if (! $quiz) {
            return response()->json([
                'message' => 'Aucun quiz disponible pour cette leçon.',
            ], 404);
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],

            'answers.*' => [
                'required',
                'string',
                'in:A,B,C,D',
            ],
        ]);

        $questions = $quiz->questions;

        $totalQuestions = $questions->count();

        if ($totalQuestions === 0) {
            return response()->json([
                'message' => 'Ce quiz ne contient aucune question.',
            ], 422);
        }

        $correctAnswers = 0;
        $results = [];

        foreach ($questions as $question) {
            $selectedAnswer =
                $validated['answers'][$question->id] ?? null;

            $isCorrect =
                $selectedAnswer === $question->correct_answer;

            if ($isCorrect) {
                $correctAnswers++;
            }

            $results[] = [
                'question_id' => $question->id,
                'selected_answer' => $selectedAnswer,
                'correct_answer' => $question->correct_answer,
                'is_correct' => $isCorrect,
            ];
        }

        $score = (int) round(
            ($correctAnswers / $totalQuestions) * 100
        );

        $passed =
            $score >= $quiz->passing_score;

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $request->user()->id,
            'score' => $score,
            'correct_answers' => $correctAnswers,
            'total_questions' => $totalQuestions,
            'passed' => $passed,
            'answers' => $results,
        ]);

        return response()->json([
            'message' => $passed
                ? 'Félicitations, quiz réussi.'
                : 'Quiz terminé. Vous pouvez réessayer pour améliorer votre score.',

            'score' => $score,
            'passing_score' => $quiz->passing_score,
            'correct_answers' => $correctAnswers,
            'total_questions' => $totalQuestions,
            'passed' => $passed,
            'attempt' => $attempt,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN : récupérer le quiz avec les réponses
    |--------------------------------------------------------------------------
    */

    public function adminShow(Lesson $lesson)
    {
        $quiz = Quiz::with([
            'questions' => function ($query) {
                $query->orderBy('position');
            },
        ])
            ->where('lesson_id', $lesson->id)
            ->first();

        return response()->json([
            'lesson' => $lesson->load('course'),
            'quiz' => $quiz,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN : créer ou modifier le quiz
    |--------------------------------------------------------------------------
    */

    public function save(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'passing_score' => [
                'required',
                'integer',
                'min:0',
                'max:100',
            ],

            'questions' => [
                'required',
                'array',
                'min:1',
            ],

            'questions.*.question' => [
                'required',
                'string',
                'max:1000',
            ],

            'questions.*.option_a' => [
                'required',
                'string',
                'max:500',
            ],

            'questions.*.option_b' => [
                'required',
                'string',
                'max:500',
            ],

            'questions.*.option_c' => [
                'required',
                'string',
                'max:500',
            ],

            'questions.*.option_d' => [
                'required',
                'string',
                'max:500',
            ],

            'questions.*.correct_answer' => [
                'required',
                'in:A,B,C,D',
            ],
        ]);

        $quiz = DB::transaction(function () use ($validated, $lesson) {

            $quiz = Quiz::updateOrCreate(
                [
                    'lesson_id' => $lesson->id,
                ],
                [
                    'title' => $validated['title'],
                    'passing_score' => $validated['passing_score'],
                ]
            );

            /*
             * On remplace les anciennes questions
             * par la nouvelle version enregistrée.
             */
            $quiz->questions()->delete();

            foreach ($validated['questions'] as $index => $question) {
                $quiz->questions()->create([
                    'question' => $question['question'],
                    'option_a' => $question['option_a'],
                    'option_b' => $question['option_b'],
                    'option_c' => $question['option_c'],
                    'option_d' => $question['option_d'],
                    'correct_answer' => $question['correct_answer'],
                    'position' => $index + 1,
                ]);
            }

            return $quiz->fresh('questions');
        });

        return response()->json([
            'message' => 'Quiz enregistré avec succès.',
            'quiz' => $quiz,
        ]);
    }
}