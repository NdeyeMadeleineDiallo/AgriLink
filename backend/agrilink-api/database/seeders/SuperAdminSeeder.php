<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
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

        $superAdmin->assignRole('super_admin');
    }
}