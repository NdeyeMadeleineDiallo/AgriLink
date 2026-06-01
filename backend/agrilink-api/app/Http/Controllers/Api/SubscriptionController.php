<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function index()
    {
        return response()->json(
            Subscription::where('status', 'active')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'integer'],
            'duration_days' => ['required', 'integer'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $subscription = Subscription::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Formule créée avec succès.',
            'subscription' => $subscription,
        ], 201);
    }
}