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
}