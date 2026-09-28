<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'users' => User::with('roles')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => [
                'required',
                'in:apprenant,vendeur,expert,admin,super_admin',
            ],
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'Rôle mis à jour avec succès.',
            'user' => $user->load('roles'),
        ]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive,suspended'],
        ]);

        $user->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès.',
            'user' => $user->load('roles'),
        ]);
    }
}