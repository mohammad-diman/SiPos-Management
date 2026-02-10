<?php

namespace App\Services;

use Carbon\Carbon;

class NutritionService
{
    /**
     * Hitung Status Gizi (BB/U) secara otomatis
     * Berdasarkan standar WHO/Kemenkes 2020
     */
    public function calculateStatus($berat_badan, $tanggal_lahir, $jenis_kelamin = 'L')
    {
        $lahir = Carbon::parse($tanggal_lahir);
        $sekarang = Carbon::now();
        $usia_bulan = $lahir->diffInMonths($sekarang);

        // Contoh Data Referensi Sederhana (Median & SD) - Biasanya diambil dari Database Tabel Referensi
        // Ini adalah data dummy untuk demonstrasi logika Smart Gizi
        $reference = $this->getReferenceData($usia_bulan, $jenis_kelamin);
        
        if (!$reference) return 'Data Referensi Tidak Tersedia';

        $median = $reference['median'];
        $sd_plus = $reference['sd_plus'];
        $sd_minus = $reference['sd_minus'];

        // Rumus Z-Score
        if ($berat_badan > $median) {
            $z_score = ($berat_badan - $median) / ($sd_plus - $median);
        } else {
            $z_score = ($berat_badan - $median) / ($median - $sd_minus);
        }

        // Klasifikasi BB/U
        if ($z_score < -3) return 'Sangat Kurang (Severely Underweight)';
        if ($z_score < -2) return 'Kurang (Underweight)';
        if ($z_score <= 1) return 'Normal';
        return 'Risiko Berat Badan Lebih';
    }

    private function getReferenceData($bulan, $jk)
    {
        // Dalam implementasi nyata, ini akan mengambil dari tabel 'ref_antropometri'
        // Contoh untuk bayi laki-laki:
        $data = [
            0 => ['median' => 3.3, 'sd_plus' => 3.9, 'sd_minus' => 2.9],
            6 => ['median' => 7.9, 'sd_plus' => 8.8, 'sd_minus' => 7.1],
            12 => ['median' => 9.6, 'sd_plus' => 10.8, 'sd_minus' => 8.6],
            24 => ['median' => 12.2, 'sd_plus' => 13.6, 'sd_minus' => 10.8],
        ];

        // Ambil data terdekat jika tidak pas bulannya
        $closest = 0;
        foreach (array_keys($data) as $key) {
            if (abs($bulan - $key) < abs($bulan - $closest)) {
                $closest = $key;
            }
        }

        return $data[$closest] ?? null;
    }
}
