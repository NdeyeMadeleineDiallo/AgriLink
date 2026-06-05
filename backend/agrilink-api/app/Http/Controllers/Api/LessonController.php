<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Course $course)
    {
        $lessons = $course->lessons()
            ->orderBy('position')
            ->get();

        return response()->json([
            'course' => $course->title,
            'lessons' => $lessons,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'pdf_file' => ['nullable', 'string'],
            'position' => ['nullable', 'integer'],
            'duration' => ['nullable', 'integer'],
            'is_free' => ['nullable', 'boolean'],
        ]);

        $lesson = $course->lessons()->create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'video_url' => $validated['video_url'] ?? null,
            'pdf_file' => $validated['pdf_file'] ?? null,
            'position' => $validated['position'] ?? 1,
            'duration' => $validated['duration'] ?? null,
            'is_free' => $validated['is_free'] ?? false,
        ]);

        return response()->json([
            'message' => 'Leçon créée avec succès.',
            'lesson' => $lesson,
        ], 201);
    }

    public function show(Lesson $lesson)
    {
        return response()->json([
            'lesson' => $lesson->load('course'),
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'pdf_file' => ['nullable', 'string'],
            'position' => ['nullable', 'integer'],
            'duration' => ['nullable', 'integer'],
            'is_free' => ['nullable', 'boolean'],
        ]);

        $lesson->update($validated);

        return response()->json([
            'message' => 'Leçon mise à jour avec succès.',
            'lesson' => $lesson,
        ]);
    }

    public function destroy(Lesson $lesson)
    {
        $lesson->delete();

        return response()->json([
            'message' => 'Leçon supprimée avec succès.',
        ]);
    }


    public function uploadMedia(Request $request, Lesson $lesson)
{
    $validated = $request->validate([
        'video' => ['nullable', 'file', 'mimes:mp4,mov,avi,webm', 'max:51200'],
        'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
    ]);

    $data = [];

    if ($request->hasFile('video')) {
        $data['video_file'] = $request->file('video')->store('lessons/videos', 'public');
    }

    if ($request->hasFile('pdf')) {
        $data['pdf_file'] = $request->file('pdf')->store('lessons/pdfs', 'public');
    }

    $lesson->update($data);

    return response()->json([
        'message' => 'Médias de la leçon mis à jour avec succès.',
        'lesson' => $lesson,
    ]);
}
}