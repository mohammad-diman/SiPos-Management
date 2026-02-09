<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Antrian extends Model
{
    use HasFactory;

    protected $fillable = [
        'penduduk_id',
        'nomor_antrian',
        'angka_antrian',
        'kategori',
        'status',
        'tanggal',
    ];

    public function penduduk()
    {
        return $this->belongsTo(Penduduk::class);
    }
}