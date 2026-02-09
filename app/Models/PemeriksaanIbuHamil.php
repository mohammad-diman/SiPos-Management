<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemeriksaanIbuHamil extends Model
{
    use HasFactory;

    protected $fillable = [
        'ibu_hamil_id', 'tanggal_periksa', 'berat_badan', 'tinggi_badan', 
        'tekanan_darah', 'lila', 'tfu', 'djj', 'jumlah_fe', 'imunisasi_tt', 
        'keluhan', 'catatan'
    ];

    public function ibuHamil()
    {
        return $this->belongsTo(IbuHamil::class);
    }
}
