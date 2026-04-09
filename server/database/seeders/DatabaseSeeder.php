<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\Gender::create(['name' => 'Male']);
        \App\Models\Gender::create(['name' => 'Female']);

        for ($i = 0; $i < 5; $i++) {
            User::factory()->create([
                'firstName' => 'User' . $i,
                'lastName' => 'Test' . $i,
                'gender_id' => 1,
                'username' => 'user_test_' . $i,
            ]);
        }
    }
}
