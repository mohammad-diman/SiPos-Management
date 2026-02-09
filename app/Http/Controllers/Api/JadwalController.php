<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalController extends Controller
{
    public function index()
    {
        // Menampilkan semua jadwal untuk memastikan sinkronisasi ke mobile
        $jadwals = Jadwal::orderBy('tanggal', 'desc')
            ->orderBy('waktu_mulai', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $jadwals
        ]);
    }
}
