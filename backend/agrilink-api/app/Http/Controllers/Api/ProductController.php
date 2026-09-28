<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
{
    $products = Product::with([
        'images',
        'category',
        'user',
    ])
        ->latest()
        ->get();

    return response()->json([
        'data' => $products,
    ]);
}

    public function store(Request $request)
{
    $validated = $request->validate([
        'category_id' => ['nullable', 'exists:categories,id'],
        'title' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'price' => ['nullable', 'numeric', 'min:0'],
        'quantity' => ['nullable', 'numeric', 'min:0'],
        'unit' => ['nullable', 'string', 'max:50'],
        'region' => ['nullable', 'string', 'max:100'],
        'city' => ['nullable', 'string', 'max:100'],
        'phone' => ['nullable', 'string', 'max:30'],
        'whatsapp_number' => ['nullable', 'string', 'max:30'],

        'images' => ['required', 'array', 'min:1', 'max:4'],
        'images.*' => [
            'required',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:5120',
        ],
    ]);

    $product = Product::create([
        'user_id' => $request->user()->id,
        'category_id' => $validated['category_id'] ?? null,
        'title' => $validated['title'],
        'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
        'description' => $validated['description'] ?? null,
        'price' => $validated['price'] ?? null,
        'quantity' => $validated['quantity'] ?? null,
        'unit' => $validated['unit'] ?? null,
        'region' => $validated['region'] ?? null,
        'city' => $validated['city'] ?? null,
        'phone' => $validated['phone'] ?? null,
        'whatsapp_number' => $validated['whatsapp_number'] ?? null,
        'status' => 'approved',
        'is_featured' => false,
    ]);

    foreach ($request->file('images', []) as $index => $image) {
        $imagePath = $image->store('products', 'public');

        $product->images()->create([
            'image_path' => $imagePath,
            'is_primary' => $index === 0,
        ]);
    }

    $product->load([
        'images',
        'category',
        'user',
    ]);

    return response()->json([
        'message' => 'Annonce publiée avec succès et visible sur AgriMarket.',
        'product' => $product,
    ], 201);
}

    public function show(Product $product)
    {
        return response()->json([
            'product' => $product->load(['user', 'category', 'images']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'integer'],
            'quantity' => ['nullable', 'string', 'max:100'],
            'unit' => ['nullable', 'string', 'max:50'],
            'region' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Annonce mise à jour avec succès.',
            'product' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Annonce supprimée avec succès.',
        ]);
    }

    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected,sold'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $product->update([
            'status' => $validated['status'],
            'is_featured' => $validated['is_featured'] ?? $product->is_featured,
        ]);

        return response()->json([
            'message' => 'Statut de l’annonce mis à jour avec succès.',
            'product' => $product,
        ]);
    }
}