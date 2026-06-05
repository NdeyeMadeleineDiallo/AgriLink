<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use Illuminate\Http\Request;

class ExpertProfileController extends Controller
{
    public function index()
    {
        return response()->json(
            ExpertProfile::with('user')
                ->latest()
                ->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'speciality' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'integer'],
            'education_level' => ['nullable', 'string', 'max:255'],
            'certification_file' => ['nullable', 'string'],
            'region' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'intervention_zone' => ['nullable', 'string'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'email_contact' => ['nullable', 'email'],
        ]);

        if ($request->user()->expertProfile) {
            return response()->json([
                'message' => 'Vous avez déjà un profil expert.',
            ], 422);
        }

        $profile = ExpertProfile::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'is_verified' => false,
            'is_premium' => false,
        ]);

        $request->user()->assignRole('expert');

        return response()->json([
            'message' => 'Profil expert créé avec succès. Il est en attente de validation.',
            'expert_profile' => $profile,
        ], 201);
    }

    public function show(ExpertProfile $expertProfile)
    {
        return response()->json([
            'expert_profile' => $expertProfile->load('user'),
        ]);
    }

    public function update(Request $request, ExpertProfile $expertProfile)
    {
        $validated = $request->validate([
            'speciality' => ['sometimes', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'integer'],
            'education_level' => ['nullable', 'string', 'max:255'],
            'certification_file' => ['nullable', 'string'],
            'region' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'intervention_zone' => ['nullable', 'string'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'email_contact' => ['nullable', 'email'],
        ]);

        $expertProfile->update($validated);

        return response()->json([
            'message' => 'Profil expert mis à jour avec succès.',
            'expert_profile' => $expertProfile,
        ]);
    }

    public function updateStatus(Request $request, ExpertProfile $expertProfile)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected,suspended'],
            'is_verified' => ['nullable', 'boolean'],
            'is_premium' => ['nullable', 'boolean'],
        ]);

        $expertProfile->update([
            'status' => $validated['status'],
            'is_verified' => $validated['is_verified'] ?? $expertProfile->is_verified,
            'is_premium' => $validated['is_premium'] ?? $expertProfile->is_premium,
        ]);

        return response()->json([
            'message' => 'Statut du profil expert mis à jour.',
            'expert_profile' => $expertProfile,
        ]);
    }

    public function destroy(ExpertProfile $expertProfile)
    {
        $expertProfile->delete();

        return response()->json([
            'message' => 'Profil expert supprimé avec succès.',
        ]);
    }

    public function myProfile(Request $request)
{
    return response()->json([
        'expert_profile' => $request->user()->expertProfile,
    ]);
}

public function uploadPhoto(Request $request, ExpertProfile $expertProfile)
{
    $validated = $request->validate([
        'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ]);

    $path = $request->file('photo')->store('experts', 'public');

    $expertProfile->update([
        'photo' => $path,
    ]);

    return response()->json([
        'message' => 'Photo de profil mise à jour avec succès.',
        'photo' => $path,
        'url' => asset('storage/' . $path),
    ]);
}
}