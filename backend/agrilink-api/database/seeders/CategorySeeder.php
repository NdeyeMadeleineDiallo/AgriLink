<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Culture',
            'Semences',
            'Engrais',
            'Équipements',
            'Bétail',
        ];

        foreach ($categories as $categoryName) {
            Category::updateOrCreate(
                [
                    'slug' => Str::slug($categoryName),
                ],
                [
                    'name' => $categoryName,
                    'slug' => Str::slug($categoryName),
                ]
            );
        }
    }
}