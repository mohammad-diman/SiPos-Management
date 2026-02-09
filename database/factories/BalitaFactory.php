<?php

namespace Database\Factories;

use App\Models\Balita;
use Illuminate\Database\Eloquent\Factories\Factory;

class BalitaFactory extends Factory
{
    protected $model = Balita::class;

    public function definition(): array
    {
        return [
            'no_rm' => $this->faker->unique()->numerify('RM-B-####'),
            'nama' => $this->faker->name('male'),
            'nik' => $this->faker->unique()->numerify('################'),
            'tanggal_lahir' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
            'alamat' => $this->faker->address(),
            'no_hp_ortu' => $this->faker->phoneNumber(),
            'berat_badan_lahir' => $this->faker->randomFloat(2, 2.5, 4.5),
            'tinggi_badan_lahir' => $this->faker->randomFloat(2, 45, 55),
            'nama_ayah' => $this->faker->name('male'),
            'nama_ibu' => $this->faker->name('female'),
            'golongan_darah' => $this->faker->randomElement(['A', 'B', 'AB', 'O']),
            'riwayat_penyakit' => $this->faker->sentence(),
        ];
    }
}
