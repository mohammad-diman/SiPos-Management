<?php

namespace Database\Factories;

use App\Models\IbuHamil;
use Illuminate\Database\Eloquent\Factories\Factory;

class IbuHamilFactory extends Factory
{
    protected $model = IbuHamil::class;

    public function definition(): array
    {
        return [
            'no_rm' => $this->faker->unique()->numerify('RM-IH-####'),
            'nama' => $this->faker->name('female'),
            'nik' => $this->faker->unique()->numerify('################'),
            'tanggal_lahir' => $this->faker->dateTimeBetween('-40 years', '-20 years')->format('Y-m-d'),
            'nama_suami' => $this->faker->name('male'),
            'alamat' => $this->faker->address(),
            'no_hp' => $this->faker->phoneNumber(),
            'usia_kehamilan' => $this->faker->numberBetween(4, 40),
            'hpht' => $this->faker->dateTimeBetween('-9 months', 'now')->format('Y-m-d'),
            'tgl_lahir_anak_terakhir' => $this->faker->optional()->date(),
            'golongan_darah' => $this->faker->randomElement(['A', 'B', 'AB', 'O']),
            'riwayat_penyakit' => $this->faker->sentence(),
        ];
    }
}
