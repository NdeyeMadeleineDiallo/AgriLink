<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Cohort;
use App\Models\Course;
use App\Models\ExpertProfile;
use App\Models\Lesson;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@agrilink.sn'],
            [
                'name' => 'Super Admin AgriLink',
                'phone' => '770000000',
                'password' => Hash::make('password123'),
                'city' => 'Dakar',
                'region' => 'Dakar',
                'status' => 'active',
            ]
        );

        $apprenant = User::firstOrCreate(
            ['email' => 'apprenant@agrilink.sn'],
            [
                'name' => 'Apprenant Test',
                'phone' => '771111111',
                'password' => Hash::make('password123'),
                'city' => 'Dakar',
                'region' => 'Dakar',
                'status' => 'active',
            ]
        );

        $expertUser = User::firstOrCreate(
            ['email' => 'expert@agrilink.sn'],
            [
                'name' => 'Expert Agricole Test',
                'phone' => '772222222',
                'password' => Hash::make('password123'),
                'city' => 'Rufisque',
                'region' => 'Dakar',
                'status' => 'active',
            ]
        );

        $apprenant->assignRole('apprenant');
        $expertUser->assignRole('expert');

        $phase1 = Subscription::firstOrCreate(
            ['name' => 'Phase 1'],
            [
                'slug' => 'phase-1',
                'description' => 'Formation de base AgriAcademy',
                'price' => 5000,
                'duration_days' => 90,
                'status' => 'active',
            ]
        );

        Subscription::firstOrCreate(
            ['name' => 'Phase 1 + 2'],
            [
                'slug' => 'phase-1-2',
                'description' => 'Formation intermédiaire AgriAcademy',
                'price' => 15000,
                'duration_days' => 120,
                'status' => 'active',
            ]
        );

        Subscription::firstOrCreate(
            ['name' => 'Formation complète'],
            [
                'slug' => 'formation-complete',
                'description' => 'Formation complète en trois phases',
                'price' => 25000,
                'duration_days' => 150,
                'status' => 'active',
            ]
        );

        $course = Course::firstOrCreate(
            ['title' => 'Culture de la tomate'],
            [
                'slug' => 'culture-de-la-tomate',
                'description' => 'Formation pratique sur la production de tomate en Afrique de l Ouest.',
                'level' => 'Debutant',
                'duration' => 30,
                'price' => 5000,
                'status' => 'published',
                'created_by' => $admin->id,
            ]
        );

        Lesson::firstOrCreate(
            ['course_id' => $course->id, 'title' => 'Introduction a la culture de la tomate'],
            [
                'content' => 'Cette lecon presente les bases de la culture de la tomate.',
                'video_url' => 'https://example.com/video-tomate-introduction',
                'pdf_file' => 'tomate-introduction.pdf',
                'position' => 1,
                'duration' => 20,
                'is_free' => true,
            ]
        );

        Lesson::firstOrCreate(
            ['course_id' => $course->id, 'title' => 'Preparation du sol'],
            [
                'content' => 'Cette lecon explique la preparation du sol pour la tomate.',
                'position' => 2,
                'duration' => 25,
                'is_free' => false,
            ]
        );

        Lesson::firstOrCreate(
            ['course_id' => $course->id, 'title' => 'Fertilisation et entretien'],
            [
                'content' => 'Cette lecon aborde la fertilisation et le suivi de la culture.',
                'position' => 3,
                'duration' => 30,
                'is_free' => false,
            ]
        );

        $cohort = Cohort::firstOrCreate(
            ['name' => 'Cohorte Janvier 2027'],
            [
                'description' => 'Formation entrepreneuriat agricole',
                'start_date' => '2027-01-05',
                'end_date' => '2027-03-31',
                'status' => 'active',
                'created_by' => $admin->id,
            ]
        );

        $cohort->users()->syncWithoutDetaching([
            $apprenant->id => ['role_in_cohort' => 'participant'],
        ]);

        $category = Category::firstOrCreate(
            ['name' => 'Legumes'],
            [
                'slug' => 'legumes',
                'description' => 'Produits maraichers comme tomate, oignon, piment et gombo.',
                'type' => 'product',
                'status' => 'active',
            ]
        );

        Product::firstOrCreate(
            ['title' => 'Tomates fraiches de Niayes'],
            [
                'user_id' => $apprenant->id,
                'category_id' => $category->id,
                'slug' => 'tomates-fraiches-de-niayes-' . Str::random(5),
                'description' => 'Tomates fraiches disponibles en gros et detail.',
                'price' => 12000,
                'quantity' => '10',
                'unit' => 'caisse',
                'region' => 'Dakar',
                'city' => 'Pikine',
                'phone' => '771111111',
                'whatsapp_number' => '771111111',
                'status' => 'approved',
                'is_featured' => true,
            ]
        );

        ExpertProfile::firstOrCreate(
            ['user_id' => $expertUser->id],
            [
                'speciality' => 'Production maraichere',
                'bio' => 'Technicien agricole specialise en maraichage, fertilisation et suivi des cultures.',
                'experience_years' => 5,
                'education_level' => 'Technicien superieur agricole',
                'region' => 'Dakar',
                'city' => 'Rufisque',
                'intervention_zone' => 'Dakar, Thies, Mbour',
                'whatsapp_number' => '772222222',
                'email_contact' => 'expert@agrilink.sn',
                'is_verified' => true,
                'is_premium' => false,
                'status' => 'approved',
            ]
        );
    }
}