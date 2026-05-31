<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:product,tool,input,service'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => $category,
        ], 201);
    }

    public function show(Category $category)
    {
        return response()->json([
            'category' => $category->load('products'),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'in:product,tool,input,service'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès.',
            'category' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès.',
        ]);
    }
}