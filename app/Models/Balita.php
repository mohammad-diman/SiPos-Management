<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balita extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_rm', 'nama', 'nik', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 
        'no_hp_ortu', 'berat_badan_lahir', 'tinggi_badan_lahir', 'nama_ayah', 
        'nama_ibu', 'golongan_darah', 'riwayat_penyakit'
    ];

    public function pemeriksaans()
    {
        return $this->hasMany(PemeriksaanPosyandu::class);
    }
}