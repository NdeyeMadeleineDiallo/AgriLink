<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'super_admin',
            'admin',
            'apprenant',
            'vendeur',
            'expert',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $permissions = [
            'manage_users',
            'manage_courses',
            'manage_cohorts',
            'manage_products',
            'manage_experts',
            'manage_payments',
            'manage_reports',
            'view_dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        Role::where('name', 'super_admin')->first()->givePermissionTo($permissions);

        Role::where('name', 'admin')->first()->givePermissionTo([
            'manage_users',
            'manage_courses',
            'manage_cohorts',
            'manage_products',
            'manage_experts',
            'manage_payments',
            'manage_reports',
            'view_dashboard',
        ]);
    }
}