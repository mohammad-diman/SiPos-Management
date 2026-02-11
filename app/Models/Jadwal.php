<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_kegiatan',
        'tanggal',
        'waktu_mulai',
        'waktu_selesai',
        'lokasi',
        'desa',
        'keterangan',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($jadwal) {
            $title = 'Jadwal Pelayanan Baru';
            $locationInfo = $jadwal->lokasi . ($jadwal->desa ? " ({$jadwal->desa})" : "");
            $message = "{$jadwal->nama_kegiatan} di {$locationInfo} pada tanggal " . \Carbon\Carbon::parse($jadwal->tanggal)->format('d M Y');

            // 1. Simpan ke database (Public notification)
            \App\Models\Notification::create([
                'title' => $title,
                'message' => $message,
                'type' => 'jadwal',
            ]);

            // 2. PUSH NOTIFICATION KE SEMUA PERANGKAT
            try {
                // Ambil semua token dari Kader (Users) dan Warga (Penduduks)
                $tokens = array_merge(
                    \App\Models\User::whereNotNull('fcm_token')->pluck('fcm_token')->toArray(),
                    \App\Models\Penduduk::whereNotNull('fcm_token')->pluck('fcm_token')->toArray()
                );

                if (!empty($tokens)) {
                    \App\Services\FcmService::sendToMultiple($tokens, $title, $message);
                }
            } catch (\Exception $e) {
                \Log::error("Failed to send Jadwal FCM: " . $e->getMessage());
            }
        });
    }
}
