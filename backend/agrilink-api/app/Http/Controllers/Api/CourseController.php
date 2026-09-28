<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('creator')
            ->latest()
            ->paginate(10);

        return response()->json($courses);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => [
            'required',
            'string',
            'max:255',
        ],

        'description' => [
            'nullable',
            'string',
        ],

        'level' => [
            'required',
            'string',
            'in:Débutant,Intermédiaire,Avancé',
        ],

        'duration' => [
            'nullable',
            'integer',
            'min:0',
        ],

        'price' => [
            'nullable',
            'integer',
            'min:0',
        ],

        'thumbnail' => [
            'required',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:5120',
        ],

        'status' => [
            'nullable',
            'in:draft,published,archived',
        ],
    ]);

    $thumbnailPath = $request
        ->file('thumbnail')
        ->store('courses', 'public');

    $course = Course::create([
        'title' => $validated['title'],

        'slug' =>
            Str::slug($validated['title']) .
            '-' .
            Str::random(6),

        'description' =>
            $validated['description'] ?? null,

        'level' => $validated['level'],

        'duration' =>
            $validated['duration'] ?? null,

        'price' => $validated['price'] ?? 0,

        'thumbnail' => $thumbnailPath,

        'status' =>
            $validated['status'] ?? 'draft',

        'created_by' => $request->user()->id,
    ]);

    return response()->json([
        'message' => 'Cours créé avec succès.',
        'course' => $course,
    ], 201);
}
    public function show(Course $course)
    {
        return response()->json([
            'course' => $course->load(['creator', 'lessons']),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'level' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'integer'],
            'price' => ['nullable', 'integer'],
            'thumbnail' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published,archived'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        $course->update($validated);

        return response()->json([
            'message' => 'Cours mis à jour avec succès.',
            'course' => $course,
        ]);
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'message' => 'Cours supprimé avec succès.',
        ]);
    }
}