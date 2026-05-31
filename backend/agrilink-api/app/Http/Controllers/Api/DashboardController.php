<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExpertProfile;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        return response()->json([
            'message' => 'Bienvenue dans le tableau de bord administrateur AgriLink.',
            'statistics' => [
                'users' => User::count(),
                'courses' => Course::count(),
                'products' => Product::count(),
                'experts' => ExpertProfile::count(),
                'payments' => Payment::count(),
            ],
        ]);
    }

    public function apprenant(Request $request)
    {
        return response()->json([
            'message' => 'Bienvenue dans votre espace apprenant AgriLink.',
            'user' => $request->user(),
        ]);
    }

    public function vendeur(Request $request)
    {
        return response()->json([
            'message' => 'Bienvenue dans votre espace vendeur AgriMarket.',
            'products_count' => $request->user()->products()->count(),
        ]);
    }

    public function expert(Request $request)
    {
        return response()->json([
            'message' => 'Bienvenue dans votre espace expert AgriExpert.',
            'expert_profile' => $request->user()->expertProfile,
        ]);
    }
}