<?php

namespace Database\Factories;

use App\Models\PemeriksaanPosyandu;
use App\Models\Balita;
use Illuminate\Database\Eloquent\Factories\Factory;

class PemeriksaanPosyanduFactory extends Factory
{
    protected $model = PemeriksaanPosyandu::class;

    public function definition(): array
    {
        return [
            'balita_id' => Balita::factory(),
            'tanggal_periksa' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'berat_badan' => $this->faker->randomFloat(2, 3, 20),
            'tinggi_badan' => $this->faker->randomFloat(2, 50, 110),
            'lingkar_kepala' => $this->faker->randomFloat(2, 35, 50),
            'status_gizi' => $this->faker->randomElement(['Baik', 'Kurang', 'Buruk', 'Lebih']),
            'perkembangan' => $this->faker->sentence(),
            'catatan' => $this->faker->sentence(),
            'imunisasi_bcg' => $this->faker->boolean(),
            'imunisasi_polio' => $this->faker->boolean(),
            'vitamin_a_1' => $this->faker->boolean(),
        ];
    }
}