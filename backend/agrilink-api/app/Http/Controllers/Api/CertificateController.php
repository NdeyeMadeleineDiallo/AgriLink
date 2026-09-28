<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\LessonProgress;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * Retourne l'état du parcours certifiant.
     */
    public function status(Request $request)
    {
        $user = $request->user();

        $levelProgress = $this->calculateLevelProgress($user->id);

        $eligible = collect($levelProgress)
            ->every(function ($level) {
                return $level['is_completed'] === true;
            });

        $globalProgress = round(
            collect($levelProgress)
                ->avg('percentage')
        );

        $certificate = Certificate::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'eligible' => $eligible,
            'global_progress' => $globalProgress,
            'levels' => $levelProgress,
            'certificate' => $certificate,
        ]);
    }

    /**
     * Génère le certificat final uniquement
     * lorsque les 3 niveaux sont terminés.
     */
    public function generate(Request $request)
    {
        $user = $request->user();

        $courses = $this->getPathwayCourses();

        if ($courses->isEmpty()) {
            return response()->json([
                'message' => 'Aucun cours du parcours AgriAcademy n’est disponible.',
            ], 422);
        }

        $levelProgress = $this->calculateLevelProgress($user->id);

        $allLevelsCompleted = collect($levelProgress)
            ->every(function ($level) {
                return $level['is_completed'] === true;
            });

        if (! $allLevelsCompleted) {
            return response()->json([
                'message' => 'Vous devez terminer les trois niveaux du parcours AgriAcademy avant de générer votre certificat final.',
                'levels' => $levelProgress,
            ], 403);
        }

        /*
         * Ta table certificates possède encore course_id.
         * On utilise donc temporairement le premier cours
         * comme cours de référence.
         */
        $referenceCourse = $courses
            ->sortBy('id')
            ->first();

        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $referenceCourse->id,
            ],
            [
                'certificate_number' =>
                    'AGRILINK-PARCOURS-' .
                    now()->format('Ymd') .
                    '-' .
                    strtoupper(Str::random(8)),

                'issued_at' => now(),
            ]
        );

        if (! $certificate->issued_at) {
            $certificate->update([
                'issued_at' => now(),
            ]);
        }

        /*
         * Si un ancien PDF existe,
         * on le remplace proprement.
         */
        if (
            $certificate->file_path &&
            Storage::disk('public')
                ->exists($certificate->file_path)
        ) {
            Storage::disk('public')
                ->delete($certificate->file_path);
        }

        $pdf = Pdf::loadView(
            'certificates.template',
            [
                'user' => $user,
                'course' => $referenceCourse,
                'certificate' => $certificate,
                'isFinalCertificate' => true,
                'levelProgress' => $levelProgress,
            ]
        );

        $fileName =
            'certificates/' .
            $certificate->certificate_number .
            '.pdf';

        Storage::disk('public')->put(
            $fileName,
            $pdf->output()
        );

        $certificate->update([
            'file_path' => $fileName,
        ]);

        return response()->json([
            'message' => 'Certificat final AgriAcademy généré avec succès.',
            'certificate' => $certificate
                ->fresh()
                ->load('course'),
            'levels' => $levelProgress,
        ]);
    }

    /**
     * Liste des certificats de l'utilisateur.
     */
    public function myCertificates(Request $request)
    {
        $certificates = Certificate::with('course')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * Calcule la progression de chaque niveau.
     */
    private function calculateLevelProgress(int $userId): array
    {
        $requiredLevels = [
            'debutant',
            'intermediaire',
            'avance',
        ];

        $courses = $this->getPathwayCourses();

        $levelProgress = [];

        foreach ($requiredLevels as $requiredLevel) {
            $levelCourses = $courses->filter(
                function ($course) use ($requiredLevel) {
                    return $this->normalizeLevel(
                        $course->level
                    ) === $requiredLevel;
                }
            );

            $lessonIds = $levelCourses
                ->flatMap(function ($course) {
                    return $course->lessons
                        ->pluck('id');
                })
                ->unique()
                ->values();

            $totalLessons = $lessonIds->count();

            $completedLessons = 0;

            if ($totalLessons > 0) {
                $completedLessons =
                    LessonProgress::where(
                        'user_id',
                        $userId
                    )
                    ->whereIn(
                        'lesson_id',
                        $lessonIds
                    )
                    ->where(
                        'is_completed',
                        true
                    )
                    ->distinct('lesson_id')
                    ->count('lesson_id');
            }

            $percentage = $totalLessons > 0
                ? round(
                    ($completedLessons /
                        $totalLessons) * 100
                )
                : 0;

            $levelProgress[$requiredLevel] = [
                'total_courses' =>
                    $levelCourses->count(),

                'total_lessons' =>
                    $totalLessons,

                'completed_lessons' =>
                    $completedLessons,

                'percentage' =>
                    $percentage,

                'is_completed' =>
                    $totalLessons > 0 &&
                    $completedLessons >=
                        $totalLessons,
            ];
        }

        return $levelProgress;
    }

    /**
     * Récupère tous les cours des 3 niveaux.
     */
    private function getPathwayCourses()
    {
        return Course::with('lessons')
            ->whereIn('level', [
                'Debutant',
                'Débutant',
                'Intermédiaire',
                'Intermediaire',
                'Avancé',
                'Avance',
            ])
            ->get();
    }

    /**
     * Uniformise les noms des niveaux.
     */
    private function normalizeLevel(?string $level): string
    {
        $normalized = Str::of($level ?? '')
            ->lower()
            ->ascii()
            ->trim()
            ->toString();

        return match (true) {
            str_contains(
                $normalized,
                'debutant'
            ) => 'debutant',

            str_contains(
                $normalized,
                'intermediaire'
            ) => 'intermediaire',

            str_contains(
                $normalized,
                'avance'
            ) => 'avance',

            default => $normalized,
        };
    }
}