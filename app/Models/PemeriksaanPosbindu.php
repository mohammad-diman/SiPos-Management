<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemeriksaanPosbindu extends Model
{
    use HasFactory;

    protected $fillable = [
        'lansia_id', 'tanggal_periksa', 'nama_kader', 'berat_badan', 
        'tinggi_badan', 'lingkar_perut', 'imt', 'tekanan_darah', 
        'nadi', 'suhu_tubuh', 'gula_darah', 'kolesterol', 'asam_urat',
        'riwayat_merokok', 'riwayat_alkohol', 'frekuensi_olahraga_per_minggu',
        'riwayat_penyakit', 'keluhan_utama', 'gangguan_penglihatan',
        'gangguan_pendengaran', 'status_gizi', 'obat', 'konseling',
        'rujukan', 'catatan'
    ];

    public function lansia()
    {
        return $this->belongsTo(Lansia::class);
    }
}
