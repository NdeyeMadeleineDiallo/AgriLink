<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function complete(Request $request, Lesson $lesson)
    {
        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'is_completed' => true,
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Leçon marquée comme terminée.',
            'progress' => $progress,
        ]);
    }

    public function myProgress(Request $request)
    {
        $courses = Course::with('lessons')->get();

        $data = $courses->map(function ($course) use ($request) {
            $lessonIds = $course->lessons->pluck('id');

            $totalLessons = $lessonIds->count();

            $completedLessons = LessonProgress::where('user_id', $request->user()->id)
                ->whereIn('lesson_id', $lessonIds)
                ->where('is_completed', true)
                ->count();

            $percentage = $totalLessons > 0
                ? round(($completedLessons / $totalLessons) * 100)
                : 0;

            return [
                'course_id' => $course->id,
                'course_title' => $course->title,
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'progress_percentage' => $percentage,
            ];
        });

        return response()->json([
            'progress' => $data,
        ]);
    }

    public function courseProgress(Request $request, Course $course)
{
    $lessons = $course->lessons()
        ->orderBy('position')
        ->get();

    $completedLessonIds = LessonProgress::where('user_id', $request->user()->id)
        ->whereIn('lesson_id', $lessons->pluck('id'))
        ->where('is_completed', true)
        ->pluck('lesson_id')
        ->toArray();

    $totalLessons = $lessons->count();
    $completedLessons = count($completedLessonIds);

    $percentage = $totalLessons > 0
        ? round(($completedLessons / $totalLessons) * 100)
        : 0;

    return response()->json([
        'course' => [
            'id' => $course->id,
            'title' => $course->title,
            'status' => $course->status,
        ],
        'summary' => [
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress_percentage' => $percentage,
        ],
        'lessons' => $lessons->map(function ($lesson) use ($completedLessonIds) {
            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'position' => $lesson->position,
                'duration' => $lesson->duration,
                'is_free' => $lesson->is_free,
                'is_completed' => in_array($lesson->id, $completedLessonIds),
            ];
        }),
    ]);
}
}