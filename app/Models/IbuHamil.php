<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IbuHamil extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_rm', 'nama', 'nik', 'tanggal_lahir', 'nama_suami', 'alamat', 
        'no_hp', 'usia_kehamilan', 'hpht', 'tgl_lahir_anak_terakhir', 
        'golongan_darah', 'riwayat_penyakit'
    ];

    public function pemeriksaans()
    {
        return $this->hasMany(PemeriksaanIbuHamil::class);
    }
}