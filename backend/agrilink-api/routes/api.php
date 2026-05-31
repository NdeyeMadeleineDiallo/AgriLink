<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->get('/admin/dashboard', function () {
    return response()->json([
        'message' => 'Bienvenue dans le tableau de bord administrateur AgriLink.',
    ]);
});

Route::middleware(['auth:sanctum', 'role:apprenant'])->get('/apprenant/dashboard', function () {
    return response()->json([
        'message' => 'Bienvenue dans votre espace apprenant AgriLink.',
    ]);
});

Route::middleware(['auth:sanctum', 'role:vendeur'])->get('/vendeur/dashboard', function () {
    return response()->json([
        'message' => 'Bienvenue dans votre espace vendeur AgriMarket.',
    ]);
});

Route::middleware(['auth:sanctum', 'role:expert'])->get('/expert/dashboard', function () {
    return response()->json([
        'message' => 'Bienvenue dans votre espace expert AgriExpert.',
    ]);
});