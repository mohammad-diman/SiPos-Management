<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kader extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nik',
        'nama',
        'jabatan',
        'no_hp',
        'alamat',
        'is_aktif',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}