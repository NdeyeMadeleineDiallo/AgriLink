<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function generate(Request $request, Course $course)
    {
        $lessons = $course->lessons()->pluck('id');

        $totalLessons = $lessons->count();

        if ($totalLessons === 0) {
            return response()->json([
                'message' => 'Ce cours ne contient aucune leçon.',
            ], 422);
        }

        $completedLessons = LessonProgress::where('user_id', $request->user()->id)
            ->whereIn('lesson_id', $lessons)
            ->where('is_completed', true)
            ->count();

        if ($completedLessons < $totalLessons) {
            return response()->json([
                'message' => 'Vous devez terminer toutes les leçons avant de générer le certificat.',
                'progress' => [
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'percentage' => round(($completedLessons / $totalLessons) * 100),
                ],
            ], 403);
        }

        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'course_id' => $course->id,
            ],
            [
                'certificate_number' => 'AGRILINK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(8)),
                'issued_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Certificat généré avec succès.',
            'certificate' => $certificate->load('course'),
        ]);
    }

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
}