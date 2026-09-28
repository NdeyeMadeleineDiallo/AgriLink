<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ExpertRating;
class ExpertProfileController extends Controller
{
    public function index()
{
    $experts = ExpertProfile::with('user')
        ->withAvg('ratings', 'rating')
        ->withCount('ratings')
        ->latest()
        ->get();

    $experts->transform(function ($expert) {
        $expert->average_rating = round(
            (float) ($expert->ratings_avg_rating ?? 0),
            1
        );

        $expert->reviews_count =
            $expert->ratings_count ?? 0;

        return $expert;
    });

    return response()->json([
        'data' => $experts,
    ]);
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
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->user()->expertProfile) {
            return response()->json([
                'message' => 'Vous avez déjà un profil expert.',
            ], 422);
        }

        $photoPath = null;

$photoPath = null;

if ($request->hasFile('photo')) {
    $photoPath = $request
        ->file('photo')
        ->store('experts', 'public');
}

        $expertProfile = ExpertProfile::create([
    'user_id' => $request->user()->id,
    'speciality' => $validated['speciality'],
    'region' => $validated['region'] ?? null,
    'experience_years' => $validated['experience_years'] ?? 0,
    'bio' => $validated['bio'] ?? null,
    'phone' => $validated['phone'] ?? null,
    'whatsapp_number' => $validated['whatsapp_number'] ?? null,
    'photo' => $photoPath,
    'status' => 'pending',
    'is_verified' => false,
]);
        $request->user()->assignRole('expert');

        return response()->json([
            'message' => 'Profil expert créé avec succès. Il est en attente de validation.',
            'expert_profile' => $expertProfile,
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
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
    if (
        $expertProfile->photo &&
        Storage::disk('public')->exists($expertProfile->photo)
    ) {
        Storage::disk('public')->delete($expertProfile->photo);
    }

    $validated['photo'] = $request
        ->file('photo')
        ->store('experts', 'public');
}

        $expertProfile->update($validated);

        return response()->json([
            'message' => 'Profil expert mis à jour avec succès.',
            'expert_profile' => $expertProfile,
        ]);
    }

    public function updateStatus(
    Request $request,
    ExpertProfile $expertProfile
) {
    $validated = $request->validate([
        'status' => [
            'required',
            'string',
            'in:pending,approved,rejected,suspended',
        ],
    ]);

    $status = $validated['status'];

    $expertProfile->update([
        'status' => $status,
        'is_verified' => $status === 'approved',
    ]);

    return response()->json([
        'message' => 'Statut du profil expert mis à jour avec succès.',
        'expert' => $expertProfile
            ->fresh()
            ->load('user'),
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
        'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5150'],
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

public function storeRating(
    Request $request,
    ExpertProfile $expertProfile
) {
    $validated = $request->validate([
        'rating' => [
            'required',
            'integer',
            'between:1,5',
        ],
    ]);

    if ($expertProfile->user_id === $request->user()->id) {
        return response()->json([
            'message' => 'Vous ne pouvez pas noter votre propre profil expert.',
        ], 422);
    }

    if (
        $expertProfile->status !== 'approved' &&
        ! $expertProfile->is_verified
    ) {
        return response()->json([
            'message' => 'Seuls les experts approuvés peuvent être notés.',
        ], 422);
    }

    $rating = ExpertRating::updateOrCreate(
        [
            'expert_profile_id' => $expertProfile->id,
            'user_id' => $request->user()->id,
        ],
        [
            'rating' => $validated['rating'],
        ]
    );

    $averageRating = round(
        (float) $expertProfile->ratings()->avg('rating'),
        1
    );

    $reviewsCount = $expertProfile->ratings()->count();

    return response()->json([
        'message' => 'Votre note a été enregistrée avec succès.',
        'rating' => $rating,
        'average_rating' => $averageRating,
        'reviews_count' => $reviewsCount,
    ]);
}
}