<?php

namespace Database\Factories;

use App\Models\PemeriksaanPosbindu;
use App\Models\Lansia;
use Illuminate\Database\Eloquent\Factories\Factory;

class PemeriksaanPosbinduFactory extends Factory
{
    protected $model = PemeriksaanPosbindu::class;

    public function definition(): array
    {
        $bb = $this->faker->randomFloat(1, 40, 100);
        $tb = $this->faker->randomFloat(1, 140, 180);
        $imt = $bb / (($tb/100) * ($tb/100));

        return [
            'lansia_id' => Lansia::factory(),
            'tanggal_periksa' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'nama_kader' => $this->faker->name(),
            'berat_badan' => $bb,
            'tinggi_badan' => $tb,
            'imt' => $imt,
            'tekanan_darah' => $this->faker->numberBetween(100, 180) . '/' . $this->faker->numberBetween(60, 110),
            'gula_darah' => $this->faker->numberBetween(70, 300),
            'kolesterol' => $this->faker->numberBetween(120, 250),
            'asam_urat' => $this->faker->randomFloat(1, 3, 10),
            'catatan' => $this->faker->sentence(),
        ];
    }
}