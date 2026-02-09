<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@posyandu.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Kader
        User::create([
            'name' => 'Kader Posyandu',
            'email' => 'kader@posyandu.com',
            'password' => Hash::make('password'),
            'role' => 'kader',
        ]);

        // Masyarakat
        User::create([
            'name' => 'Masyarakat Umum',
            'email' => 'masyarakat@posyandu.com',
            'password' => Hash::make('password'),
            'role' => 'masyarakat',
        ]);
    }
}