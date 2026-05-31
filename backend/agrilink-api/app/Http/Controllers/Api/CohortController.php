<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use Illuminate\Http\Request;

class CohortController extends Controller
{
    public function index()
    {
        return response()->json(
            Cohort::latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
            'status' => ['nullable','string']
        ]);

        $cohort = Cohort::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Cohorte créée avec succès.',
            'cohort' => $cohort,
        ],201);
    }

    public function show(Cohort $cohort)
    {
        return response()->json([
            'cohort' => $cohort,
        ]);
    }

    public function update(Request $request, Cohort $cohort)
    {
        $cohort->update(
            $request->validate([
                'name' => ['sometimes','string'],
                'description' => ['nullable','string'],
                'start_date' => ['nullable','date'],
                'end_date' => ['nullable','date'],
                'status' => ['nullable','string'],
            ])
        );

        return response()->json([
            'message' => 'Cohorte mise à jour.',
            'cohort' => $cohort,
        ]);
    }

    public function destroy(Cohort $cohort)
    {
        $cohort->delete();

        return response()->json([
            'message' => 'Cohorte supprimée.',
        ]);
    }


    public function enroll(Request $request, Cohort $cohort)
{
    $validated = $request->validate([
        'user_id' => ['required', 'exists:users,id'],
        'role_in_cohort' => ['nullable', 'in:participant,trainer,assistant'],
    ]);

    $cohort->users()->syncWithoutDetaching([
        $validated['user_id'] => [
            'role_in_cohort' => $validated['role_in_cohort'] ?? 'participant',
        ],
    ]);

    return response()->json([
        'message' => 'Utilisateur inscrit dans la cohorte avec succès.',
        'cohort' => $cohort->load('users'),
    ]);
}

public function users(Cohort $cohort)
{
    return response()->json([
        'cohort' => $cohort->name,
        'users' => $cohort->users()->get(),
    ]);
}

public function removeUser(Cohort $cohort, $userId)
{
    $cohort->users()->detach($userId);

    return response()->json([
        'message' => 'Utilisateur retiré de la cohorte avec succès.',
    ]);
}
}