<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    public function store(Request $request, ExpertProfile $expertProfile)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
        ]);

        $serviceRequest = ServiceRequest::create([
            'expert_profile_id' => $expertProfile->id,
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return response()->json([
            'message' => 'Demande envoyée à l’expert avec succès.',
            'service_request' => $serviceRequest,
        ], 201);
    }

    public function myRequests(Request $request)
    {
        $requests = ServiceRequest::with('expertProfile.user')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($requests);
    }

    public function expertRequests(Request $request)
    {
        $expertProfile = $request->user()->expertProfile;

        if (! $expertProfile) {
            return response()->json([
                'message' => 'Aucun profil expert associé à cet utilisateur.',
            ], 404);
        }

        $requests = ServiceRequest::with('user')
            ->where('expert_profile_id', $expertProfile->id)
            ->latest()
            ->paginate(10);

        return response()->json($requests);
    }

    public function updateStatus(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,accepted,rejected,completed,cancelled'],
        ]);

        $serviceRequest->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Statut de la demande mis à jour avec succès.',
            'service_request' => $serviceRequest,
        ]);
    }
}