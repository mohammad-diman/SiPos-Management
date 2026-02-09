<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lansia extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_rm', 'nama', 'nik', 'tanggal_lahir', 'jenis_kelamin', 
        'alamat', 'no_hp', 'golongan_darah', 'riwayat_penyakit', 'alergi'
    ];

    public function pemeriksaans()
    {
        return $this->hasMany(PemeriksaanPosbindu::class);
    }
}