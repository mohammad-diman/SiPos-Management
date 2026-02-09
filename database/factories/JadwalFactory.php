<?php

namespace Database\Factories;

use App\Models\Jadwal;
use Illuminate\Database\Eloquent\Factories\Factory;

class JadwalFactory extends Factory
{
    protected $model = Jadwal::class;

    public function definition(): array
    {
        return [
            'nama_kegiatan' => $this->faker->randomElement([
                'Posyandu Balita Melati',
                'Posyandu Balita Mawar',
                'Posbindu Lansia RW 01',
                'Pemeriksaan Ibu Hamil Desa',
                'Skrining PTM Kelurahan',
            ]),
            'tanggal' => $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'waktu_mulai' => '08:00:00',
            'waktu_selesai' => '12:00:00',
            'lokasi' => $this->faker->randomElement(['Balai Desa', 'Rumah Pak RT', 'Pos Kamling RW 02', 'Puskesmas Pembantu']),
            'keterangan' => $this->faker->sentence(),
        ];
    }
}