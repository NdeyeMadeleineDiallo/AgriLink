<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = CourseEnrollment::with(['user', 'course'])
            ->latest()
            ->paginate(10);

        return response()->json($enrollments);
    }

    public function enroll(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
            'status' => ['nullable', 'in:active,inactive,completed,cancelled'],
        ]);

        $enrollment = CourseEnrollment::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'course_id' => $validated['course_id'],
            ],
            [
                'status' => $validated['status'] ?? 'active',
                'enrolled_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Apprenant inscrit au cours avec succès.',
            'enrollment' => $enrollment->load(['user', 'course']),
        ], 201);
    }

    public function myCourses(Request $request)
    {
        $courses = $request->user()
            ->enrolledCourses()
            ->wherePivot('status', 'active')
            ->latest()
            ->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function courseUsers(Course $course)
    {
        $users = $course->enrolledUsers()
            ->withPivot(['status', 'enrolled_at'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'course' => $course,
            'users' => $users,
        ]);
    }

    public function unenroll(User $user, Course $course)
    {
        CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->delete();

        return response()->json([
            'message' => 'Apprenant retiré du cours avec succès.',
        ]);
    }
}