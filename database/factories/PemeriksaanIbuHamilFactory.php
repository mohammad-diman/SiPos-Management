<?php

namespace Database\Factories;

use App\Models\PemeriksaanIbuHamil;
use App\Models\IbuHamil;
use Illuminate\Database\Eloquent\Factories\Factory;

class PemeriksaanIbuHamilFactory extends Factory
{
    protected $model = PemeriksaanIbuHamil::class;

    public function definition(): array
    {
        return [
            'ibu_hamil_id' => IbuHamil::factory(),
            'tanggal_periksa' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'berat_badan' => $this->faker->randomFloat(1, 45, 90),
            'tinggi_badan' => $this->faker->randomFloat(1, 145, 170),
            'tekanan_darah' => $this->faker->numberBetween(100, 130) . '/' . $this->faker->numberBetween(60, 90),
            'lila' => $this->faker->randomFloat(1, 23, 35),
            'tfu' => $this->faker->randomFloat(1, 10, 35),
            'djj' => $this->faker->numberBetween(120, 160),
            'jumlah_fe' => $this->faker->numberBetween(30, 90),
            'keluhan' => $this->faker->sentence(),
        ];
    }
}