<?php

namespace Database\Factories;

use App\Models\Lansia;
use Illuminate\Database\Eloquent\Factories\Factory;

class LansiaFactory extends Factory
{
    protected $model = Lansia::class;

    public function definition(): array
    {
        return [
            'no_rm' => $this->faker->unique()->numerify('RM-L-####'),
            'nama' => $this->faker->name(),
            'nik' => $this->faker->unique()->numerify('################'),
            'tanggal_lahir' => $this->faker->dateTimeBetween('-80 years', '-50 years')->format('Y-m-d'),
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
            'alamat' => $this->faker->address(),
            'no_hp' => $this->faker->phoneNumber(),
            'golongan_darah' => $this->faker->randomElement(['A', 'B', 'AB', 'O']),
            'riwayat_penyakit' => $this->faker->sentence(),
            'alergi' => $this->faker->optional()->word(),
        ];
    }
}
