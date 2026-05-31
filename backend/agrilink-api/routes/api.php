<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->get('/admin/dashboard', [DashboardController::class, 'admin']);

Route::middleware(['auth:sanctum', 'role:apprenant'])->get('/apprenant/dashboard', [DashboardController::class, 'apprenant']);

Route::middleware(['auth:sanctum', 'role:vendeur'])->get('/vendeur/dashboard', [DashboardController::class, 'vendeur']);

Route::middleware(['auth:sanctum', 'role:expert'])->get('/expert/dashboard', [DashboardController::class, 'expert']);