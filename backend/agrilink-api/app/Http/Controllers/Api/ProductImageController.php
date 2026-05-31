<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_main' => ['nullable', 'boolean'],
        ]);

        $path = $request->file('image')->store('products', 'public');

        if (($validated['is_main'] ?? false) === true) {
            $product->images()->update(['is_main' => false]);
        }

        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => $path,
            'is_main' => $validated['is_main'] ?? false,
        ]);

        return response()->json([
            'message' => 'Image ajoutée avec succès.',
            'image' => $image,
            'url' => asset('storage/' . $path),
        ], 201);
    }

    public function destroy(ProductImage $image)
    {
        $image->delete();

        return response()->json([
            'message' => 'Image supprimée avec succès.',
        ]);
    }
}