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
    private $villages = [
        'Desa Bulontio Barat',
        'Desa Bulontio Timur',
        'Desa Mebongo',
        'Desa Hutokalo'
    ];

    public function run(): void
    {
        // Bersihkan data lama agar bersih
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('pemeriksaan_posyandus')->truncate();
        DB::table('pemeriksaan_ibu_hamils')->truncate();
        DB::table('pemeriksaan_posbindus')->truncate();
        DB::table('balitas')->truncate();
        DB::table('ibu_hamils')->truncate();
        DB::table('lansias')->truncate();
        DB::table('penduduks')->truncate();
        DB::table('jadwals')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Generate Balita (20 data)
        for ($i = 1; $i <= 20; $i++) {
            $gender = $i % 2 == 0 ? 'L' : 'P';
            $nama = $this->indonesianName($gender == 'L' ? 'male' : 'female');
            $desa = $this->villages[array_rand($this->villages)];
            
            $balita = Balita::create([
                'no_rm' => "RM-B-" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nama' => $nama,
                'nik' => '750' . rand(10000000000, 99999999999),
                'tanggal_lahir' => now()->subDays(rand(100, 1500))->format('Y-m-d'),
                'jenis_kelamin' => $gender,
                'alamat' => $desa . ", RT 0" . rand(1, 5) . "/RW 0" . rand(1, 2),
                'no_hp_ortu' => '08' . rand(1111111111, 9999999999),
                'berat_badan_lahir' => rand(250, 450) / 100,
                'tinggi_badan_lahir' => rand(45, 54),
                'nama_ayah' => $this->indonesianName('male'),
                'nama_ibu' => $this->indonesianName('female'),
                'golongan_darah' => ['A', 'B', 'AB', 'O'][array_rand(['A', 'B', 'AB', 'O'])],
                'riwayat_penyakit' => rand(0, 1) ? 'Tidak ada' : 'Demam',
            ]);

            // Tambahkan 3-5 pemeriksaan untuk setiap balita
            for ($j = 0; $j < rand(3, 5); $j++) {
                PemeriksaanPosyandu::create([
                    'balita_id' => $balita->id,
                    'tanggal_periksa' => now()->subMonths($j)->subDays(rand(0, 10))->format('Y-m-d'),
                    'berat_badan' => rand(5, 15) + (rand(0, 9) / 10),
                    'tinggi_badan' => rand(60, 100) + (rand(0, 9) / 10),
                    'lingkar_kepala' => rand(40, 50) + (rand(0, 9) / 10),
                    'status_gizi' => ['Baik', 'Cukup', 'Kurang'][array_rand(['Baik', 'Cukup', 'Kurang'])],
                    'perkembangan' => 'Normal sesuai usia',
                    'catatan' => 'Lanjutkan nutrisi seimbang',
                ]);
            }
        }

        // 2. Generate Ibu Hamil (15 data)
        for ($i = 1; $i <= 15; $i++) {
            $nama = $this->indonesianName('female');
            $desa = $this->villages[array_rand($this->villages)];
            
            $ibu = IbuHamil::create([
                'no_rm' => "RM-IH-" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nama' => $nama,
                'nik' => '750' . rand(10000000000, 99999999999),
                'tanggal_lahir' => now()->subYears(rand(20, 35))->format('Y-m-d'),
                'nama_suami' => $this->indonesianName('male'),
                'alamat' => $desa . ", RT 0" . rand(1, 5) . "/RW 0" . rand(1, 2),
                'no_hp' => '08' . rand(1111111111, 9999999999),
                'usia_kehamilan' => rand(4, 38),
                'hpht' => now()->subMonths(rand(1, 8))->format('Y-m-d'),
                'golongan_darah' => ['A', 'B', 'AB', 'O'][array_rand(['A', 'B', 'AB', 'O'])],
                'riwayat_penyakit' => 'Tidak ada',
            ]);

            // Tambahkan 2-4 pemeriksaan untuk setiap ibu hamil
            for ($j = 0; $j < rand(2, 4); $j++) {
                PemeriksaanIbuHamil::create([
                    'ibu_hamil_id' => $ibu->id,
                    'tanggal_periksa' => now()->subMonths($j)->subDays(rand(0, 15))->format('Y-m-d'),
                    'berat_badan' => rand(50, 80) + (rand(0, 9) / 10),
                    'tinggi_badan' => rand(150, 165),
                    'tekanan_darah' => rand(110, 130) . "/" . rand(70, 90),
                    'lila' => rand(23, 30) + (rand(0, 9) / 10),
                    'tfu' => rand(15, 35),
                    'djj' => rand(120, 160),
                    'jumlah_fe' => rand(30, 90),
                    'imunisasi_tt' => 'TT' . rand(1, 2),
                    'keluhan' => rand(0, 1) ? 'Mual ringan' : 'Tidak ada',
                    'catatan' => 'Istirahat cukup',
                ]);
            }
        }

        // 3. Generate Lansia (30 data)
        for ($i = 1; $i <= 30; $i++) {
            $gender = $i % 2 == 0 ? 'L' : 'P';
            $nama = $this->indonesianName($gender == 'L' ? 'male' : 'female');
            $desa = $this->villages[array_rand($this->villages)];
            
            $lansia = Lansia::create([
                'no_rm' => "RM-L-" . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nama' => $nama,
                'nik' => '750' . rand(10000000000, 99999999999),
                'tanggal_lahir' => now()->subYears(rand(60, 85))->format('Y-m-d'),
                'jenis_kelamin' => $gender,
                'alamat' => $desa . ", RT 0" . rand(1, 5) . "/RW 0" . rand(1, 2),
                'no_hp' => '08' . rand(1111111111, 9999999999),
                'golongan_darah' => ['A', 'B', 'AB', 'O'][array_rand(['A', 'B', 'AB', 'O'])],
                'riwayat_penyakit' => rand(0, 1) ? 'Hipertensi' : 'Tidak ada',
            ]);

            // Tambahkan 1-3 pemeriksaan untuk setiap lansia
            for ($j = 0; $j < rand(1, 3); $j++) {
                $bb = rand(45, 80);
                $tb = rand(150, 175) / 100; // in meters
                $imt = $bb / ($tb * $tb);
                
                PemeriksaanPosbindu::create([
                    'lansia_id' => $lansia->id,
                    'tanggal_periksa' => now()->subMonths($j)->subDays(rand(0, 20))->format('Y-m-d'),
                    'nama_kader' => $this->indonesianName('male'),
                    'berat_badan' => $bb,
                    'tinggi_badan' => $tb * 100,
                    'lingkar_perut' => rand(70, 100),
                    'imt' => $imt,
                    'tekanan_darah' => rand(120, 150) . "/" . rand(80, 100),
                    'nadi' => rand(70, 90),
                    'suhu_tubuh' => 36 + (rand(0, 9) / 10),
                    'gula_darah' => rand(90, 150),
                    'kolesterol' => rand(150, 220),
                    'asam_urat' => rand(4, 9),
                    'status_gizi' => $imt < 18.5 ? 'Kurus' : ($imt < 25 ? 'Normal' : 'Gemuk'),
                    'keluhan_utama' => rand(0, 1) ? 'Pegal-pegal' : 'Tidak ada',
                    'catatan' => 'Kurangi konsumsi garam dan gula berlebih',
                ]);
            }
        }

        // 4. Sinkronisasi ke tabel Penduduk
        $this->syncToPenduduk();
        
        Jadwal::factory(5)->create();
    }

    private function indonesianName($gender = 'male')
    {
        $male_first = ['Agus', 'Budi', 'Catur', 'Dedi', 'Eko', 'Fajar', 'Gunawan', 'Hendra', 'Iwan', 'Joko', 'Kurniawan', 'Lutfi', 'Mulyono', 'Nugroho', 'Oki', 'Prabowo', 'Rahmat', 'Slamet', 'Taufik', 'Umar', 'Vicky', 'Wahyu', 'Xaverius', 'Yanto', 'Zul'];
        $female_first = ['Ani', 'Beti', 'Citra', 'Dewi', 'Endang', 'Fitri', 'Gita', 'Hesti', 'Indah', 'Juli', 'Kartini', 'Lestari', 'Maya', 'Nina', 'Olivia', 'Putri', 'Ratna', 'Siti', 'Tuti', 'Utami', 'Vina', 'Wati', 'Xena', 'Yanti', 'Zahra'];
        $last = ['Saputra', 'Wijaya', 'Kusuma', 'Hidayat', 'Santoso', 'Pratama', 'Setiawan', 'Nugraha', 'Wibowo', 'Budiman', 'Mahendra', 'Permana', 'Susanto', 'Gunawan', 'Ramadhan'];

        $first = $gender == 'male' ? $male_first[array_rand($male_first)] : $female_first[array_rand($female_first)];
        $surname = $last[array_rand($last)];

        return "$first $surname";
    }

    private function syncToPenduduk()
    {
        $balitas = Balita::all();
        foreach ($balitas as $b) {
            Penduduk::updateOrCreate(['nik' => $b->nik], [
                'nama' => $b->nama,
                'jenis_kelamin' => $b->jenis_kelamin,
                'tanggal_lahir' => $b->tanggal_lahir,
                'alamat' => $b->alamat,
                'telepon' => $b->no_hp_ortu
            ]);
        }

        $ibus = IbuHamil::all();
        foreach ($ibus as $i) {
            Penduduk::updateOrCreate(['nik' => $i->nik], [
                'nama' => $i->nama,
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => $i->tanggal_lahir,
                'alamat' => $i->alamat,
                'telepon' => $i->no_hp
            ]);
        }

        $lansias = Lansia::all();
        foreach ($lansias as $l) {
            Penduduk::updateOrCreate(['nik' => $l->nik], [
                'nama' => $l->nama,
                'jenis_kelamin' => $l->jenis_kelamin,
                'tanggal_lahir' => $l->tanggal_lahir,
                'alamat' => $l->alamat,
                'telepon' => $l->no_hp
            ]);
        }
    }
}
