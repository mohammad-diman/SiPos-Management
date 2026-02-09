<?php

namespace Database\Seeders;

use App\Models\Penduduk;
use App\Models\Balita;
use App\Models\IbuHamil;
use App\Models\Lansia;
use App\Models\PemeriksaanPosyandu;
use App\Models\PemeriksaanIbuHamil;
use App\Models\PemeriksaanPosbindu;
use App\Models\Jadwal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama agar bersih
        DB::statement('DELETE FROM pemeriksaan_posyandus');
        DB::statement('DELETE FROM pemeriksaan_ibu_hamils');
        DB::statement('DELETE FROM pemeriksaan_posbindus');
        DB::statement('DELETE FROM balitas');
        DB::statement('DELETE FROM ibu_hamils');
        DB::statement('DELETE FROM lansias');
        DB::statement('DELETE FROM penduduks');
        DB::statement('DELETE FROM jadwals');

        // 1. Generate 18 Balita
        for ($i = 1; $i <= 18; $i++) {
            $num = str_pad($i, 3, '0', STR_PAD_LEFT);
            $gender = $i % 2 == 0 ? 'L' : 'P';
            $balita = Balita::factory()->create([
                'no_rm' => "RM-B-$num",
                'nama' => $this->indonesianName($gender == 'L' ? 'male' : 'female'),
                'jenis_kelamin' => $gender
            ]);
            
            // Tambahkan 2-3 pemeriksaan untuk setiap balita
            PemeriksaanPosyandu::factory(rand(2, 3))->create([
                'balita_id' => $balita->id,
                'tanggal_periksa' => now()->subMonths(rand(0, 5))->format('Y-m-d')
            ]);
        }

        // 2. Generate 11 Ibu Hamil
        for ($i = 1; $i <= 11; $i++) {
            $num = str_pad($i, 3, '0', STR_PAD_LEFT);
            $ibu = IbuHamil::factory()->create([
                'no_rm' => "RM-IH-$num",
                'nama' => $this->indonesianName('female')
            ]);

            // Tambahkan 2 pemeriksaan untuk setiap ibu hamil
            PemeriksaanIbuHamil::factory(2)->create([
                'ibu_hamil_id' => $ibu->id,
                'tanggal_periksa' => now()->subMonths(rand(0, 3))->format('Y-m-d')
            ]);
        }

        // 3. Generate 48 Lansia
        for ($i = 1; $i <= 48; $i++) {
            $num = str_pad($i, 3, '0', STR_PAD_LEFT);
            $gender = $i % 2 == 0 ? 'L' : 'P';
            $lansia = Lansia::factory()->create([
                'no_rm' => "RM-L-$num",
                'nama' => $this->indonesianName($gender == 'L' ? 'male' : 'female'),
                'jenis_kelamin' => $gender
            ]);

            // Tambahkan 1-2 pemeriksaan untuk setiap lansia
            PemeriksaanPosbindu::factory(rand(1, 2))->create([
                'lansia_id' => $lansia->id,
                'tanggal_periksa' => now()->subMonths(rand(0, 2))->format('Y-m-d')
            ]);
        }

        // 4. Tambahan data pendukung
        Penduduk::factory(50)->create();
        Jadwal::factory(5)->create();
    }

    private function indonesianName($gender = 'male')
    {
        $male = ['Budi', 'Agus', 'Slamet', 'Iwan', 'Hendra', 'Dedi', 'Rahmat', 'Ahmad', 'Suryo', 'Eko', 'Andi', 'Fajar', 'Taufik', 'Rizky', 'Aditya', 'Bambang', 'Gunawan', 'Heri', 'Joko', 'Sapto'];
        $female = ['Siti', 'Ani', 'Sari', 'Dewi', 'Indah', 'Lestari', 'Putri', 'Ratna', 'Wati', 'Maya', 'Rina', 'Dian', 'Fitri', 'Ayu', 'Ningsih', 'Sri', 'Endang', 'Kartini', 'Mega', 'Utami'];
        $last = ['Santoso', 'Pratama', 'Hidayat', 'Kusuma', 'Saputra', 'Wijaya', 'Setiawan', 'Ramadhan', 'Gunawan', 'Permana', 'Susanto', 'Wibowo', 'Nugroho', 'Budiman', 'Mahendra'];

        $first = $gender == 'male' ? $male[array_rand($male)] : $female[array_rand($female)];
        $surname = $last[array_rand($last)];

        return "$first $surname";
    }
}
