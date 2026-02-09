<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemeriksaanPosyandu extends Model
{
    use HasFactory;

    protected $fillable = [
        'balita_id', 'tanggal_periksa', 'berat_badan', 'tinggi_badan', 
        'lingkar_kepala', 'status_gizi', 'perkembangan', 'catatan',
        'imunisasi_bcg', 'imunisasi_dpt_hb_hib', 'imunisasi_polio', 
        'imunisasi_campak', 'imunisasi_rotavirus', 'imunisasi_pneumokokus',
        'imunisasi_hepatitis_a', 'imunisasi_varisela', 'imunisasi_tifoid', 
        'imunisasi_influenza', 'imunisasi_hpv', 'vitamin_a_1', 'vitamin_a_2', 
        'jumlah_vit_b1', 'jumlah_vit_c', 'vitamin_lain'
    ];

    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }
}
