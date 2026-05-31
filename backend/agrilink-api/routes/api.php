<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\CohortController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ExpertProfileController;

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

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{course}', [CourseController::class, 'update']);
    Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
});

Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
Route::get('/lessons/{lesson}', [LessonController::class, 'show']);

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
    Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);
});

Route::get('/cohorts', [CohortController::class, 'index']);
Route::get('/cohorts/{cohort}', [CohortController::class, 'show']);

Route::middleware(['auth:sanctum','role:super_admin|admin'])
->group(function () {

    Route::post('/cohorts', [CohortController::class, 'store']);

    Route::put('/cohorts/{cohort}', [CohortController::class, 'update']);

    Route::delete('/cohorts/{cohort}', [CohortController::class, 'destroy']);
    Route::post('/cohorts/{cohort}/enroll', [CohortController::class, 'enroll']);
});

Route::get('/cohorts/{cohort}/users', [CohortController::class, 'users']);
Route::delete('/cohorts/{cohort}/users/{user}', [CohortController::class, 'removeUser']);
Route::get('/cohorts/{cohort}/stats', [CohortController::class, 'stats']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('/products/{product}/images', [ProductImageController::class, 'store']);
    Route::delete('/product-images/{image}', [ProductImageController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
    Route::patch('/products/{product}/status', [ProductController::class, 'updateStatus']);
});

Route::get('/experts', [ExpertProfileController::class, 'index']);
Route::get('/experts/{expertProfile}', [ExpertProfileController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/experts', [ExpertProfileController::class, 'store']);
    Route::put('/experts/{expertProfile}', [ExpertProfileController::class, 'update']);
    Route::delete('/experts/{expertProfile}', [ExpertProfileController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
    Route::patch('/experts/{expertProfile}/status', [ExpertProfileController::class, 'updateStatus']);
});

