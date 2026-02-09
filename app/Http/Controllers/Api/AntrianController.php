<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penduduk;
use App\Models\Antrian;
use App\Models\Balita;
use App\Models\IbuHamil;
use App\Models\Lansia;
use App\Models\Kader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AntrianController extends Controller
{
    /**
     * Login menggunakan NIK (Warga) atau Email (Kader)
     */
    public function login(Request $request)
    {
        // 1. Cek apakah ini login Kader (punya email & password)
        if ($request->has('email') && $request->has('password')) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $user = \App\Models\User::where('email', $request->email)->first();

            if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Email atau password salah'], 401);
            }

            // Pastikan user ini terdaftar sebagai Kader
            $kader = Kader::where('user_id', $user->id)->first();
            if (!$kader) {
                return response()->json(['message' => 'Akun anda tidak terdaftar sebagai petugas'], 403);
            }

            // Buat token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login Kader berhasil',
                'token' => $token,
                'data' => [
                    'id' => $kader->id,
                    'nik' => $kader->nik,
                    'nama' => $kader->nama,
                    'kategori_layanan' => 'kader',
                    'email' => $user->email
                ]
            ]);
        }

        // 2. Login Warga (NIK saja)
        $validator = Validator::make($request->all(), [
            'nik' => 'required|string|size:16',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Format NIK tidak valid'], 422);
        }

        $penduduk = Penduduk::where('nik', $request->nik)->first();

        if (!$penduduk) {
            return response()->json(['message' => 'NIK tidak terdaftar dalam sistem'], 404);
        }

        // Tentukan kategori otomatis berdasarkan data master
        $kategori = null;
        if (Kader::where('nik', $request->nik)->exists()) {
            // Jika NIK terdaftar sebagai kader, paksa login lewat email
            return response()->json(['message' => 'Silakan login menggunakan Email & Password sebagai Petugas'], 403);
        } elseif (Balita::where('nik', $penduduk->nik)->exists()) {
            $kategori = 'balita';
        } elseif (IbuHamil::where('nik', $penduduk->nik)->exists()) {
            $kategori = 'ibu_hamil';
        } elseif (Lansia::where('nik', $penduduk->nik)->exists()) {
            $kategori = 'lansia';
        }

        // Buat token untuk penduduk
        $token = $penduduk->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'data' => [
                'id' => $penduduk->id,
                'nik' => $penduduk->nik,
                'nama' => $penduduk->nama,
                'kategori_layanan' => $kategori
            ]
        ]);
    }

    /**
     * Ambil Nomor Antrian
     */
    public function ambilAntrian(Request $request)
    {
        $request->validate([
            'penduduk_id' => 'required|exists:penduduks,id',
            'kategori' => 'required|in:balita,ibu_hamil,lansia'
        ]);

        $authUser = $request->user();
        if ($authUser instanceof \App\Models\Penduduk && (int) $request->penduduk_id !== $authUser->id) {
            return response()->json(['message' => 'Tidak diizinkan mengambil antrian untuk penduduk lain'], 403);
        }

        $hariIni = Carbon::today()->toDateString();

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request, $hariIni) {
            // Cek apakah sudah ambil antrian hari ini (dengan lock)
            $cekAntrian = Antrian::where('penduduk_id', $request->penduduk_id)
                ->where('tanggal', $hariIni)
                ->whereIn('status', ['menunggu', 'dipanggil'])
                ->lockForUpdate()
                ->first();

            if ($cekAntrian) {
                return response()->json([
                    'message' => 'Anda sudah memiliki antrian aktif hari ini',
                    'data' => $cekAntrian,
                    'already_taken' => true
                ], 200);
            }

            // Generate nomor antrian
            $lastAntrian = Antrian::where('kategori', $request->kategori)
                ->where('tanggal', $hariIni)
                ->orderBy('angka_antrian', 'desc')
                ->lockForUpdate()
                ->first();

            $nextAngka = $lastAntrian ? $lastAntrian->angka_antrian + 1 : 1;
            $prefix = strtoupper(substr($request->kategori, 0, 1));
            if ($request->kategori == 'ibu_hamil') $prefix = 'H';
            
            $nomorAntrian = $prefix . '-' . str_pad($nextAngka, 3, '0', STR_PAD_LEFT);

            $antrian = Antrian::create([
                'penduduk_id' => $request->penduduk_id,
                'nomor_antrian' => $nomorAntrian,
                'angka_antrian' => $nextAngka,
                'kategori' => $request->kategori,
                'status' => 'menunggu',
                'tanggal' => $hariIni
            ]);

            // Kirim notifikasi ke Kader
            \App\Models\Notification::create([
                'title' => 'Antrian Baru',
                'message' => "Warga {$antrian->penduduk->nama} mengambil antrian {$antrian->nomor_antrian}",
                'type' => 'antrian',
                'role' => 'kader'
            ]);

            // PUSH NOTIFICATION KE SEMUA KADER
            $kaderTokens = \App\Models\User::where('role', 'kader')->whereNotNull('fcm_token')->pluck('fcm_token')->toArray();
            \App\Services\FcmService::sendToMultiple(
                $kaderTokens, 
                'Antrian Baru', 
                "Warga {$antrian->penduduk->nama} mengambil antrian {$antrian->nomor_antrian}"
            );

            return response()->json([
                'message' => 'Berhasil mengambil nomor antrian',
                'data' => $antrian
            ]);
        });
    }

    /**
     * Cek Status Antrian Saat Ini (untuk Display di Mobile)
     */
    public function statusSekarang()
    {
        $hariIni = Carbon::today()->toDateString();
        $categories = ['balita', 'ibu_hamil', 'lansia'];
        $status = [];

        foreach ($categories as $cat) {
            // 1. Cek yang sedang dipanggil
            $dipanggil = Antrian::where('tanggal', $hariIni)
                ->where('kategori', $cat)
                ->where('status', 'dipanggil')
                ->first();

            if ($dipanggil) {
                $status[$cat] = [
                    'nomor' => $dipanggil->nomor_antrian,
                    'status_label' => 'dipanggil'
                ];
                continue;
            }

            // 2. Cek apakah ada yang sudah selesai hari ini (ambil yang terakhir selesai)
            $selesai = Antrian::where('tanggal', $hariIni)
                ->where('kategori', $cat)
                ->where('status', 'selesai')
                ->orderBy('updated_at', 'desc')
                ->first();

            // Cek juga apakah masih ada yang menunggu
            $adaMenunggu = Antrian::where('tanggal', $hariIni)
                ->where('kategori', $cat)
                ->where('status', 'menunggu')
                ->exists();

            if ($selesai && !$adaMenunggu) {
                $status[$cat] = [
                    'nomor' => $selesai->nomor_antrian,
                    'status_label' => 'selesai'
                ];
            } else {
                $status[$cat] = [
                    'nomor' => '-',
                    'status_label' => 'belum_ada'
                ];
            }
        }

        return response()->json($status);
    }

    /**
     * Panggil Antrian (oleh Kader)
     */
    public function panggil($id)
    {
        $antrian = Antrian::findOrFail($id);

        // Reset antrian lain di kategori yang sama yang mungkin statusnya masih 'dipanggil'
        // agar tidak ada dua nomor yang dipanggil bersamaan dalam satu kategori
        Antrian::where('kategori', $antrian->kategori)
            ->where('tanggal', $antrian->tanggal)
            ->where('status', 'dipanggil')
            ->update(['status' => 'menunggu']);

        $antrian->update(['status' => 'dipanggil']);

        // Kirim notifikasi ke Warga yang bersangkutan
        \App\Models\Notification::create([
            'title' => 'Gilirian Anda!',
            'message' => "Nomor antrian {$antrian->nomor_antrian} silakan menuju ruang pemeriksaan",
            'type' => 'antrian',
            'penduduk_id' => $antrian->penduduk_id
        ]);

        // PUSH NOTIFICATION KE WARGA SPESIFIK
        if ($antrian->penduduk->fcm_token) {
            \App\Services\FcmService::sendNotification(
                $antrian->penduduk->fcm_token,
                'Gilirian Anda!',
                "Nomor antrian {$antrian->nomor_antrian} silakan menuju ruang pemeriksaan"
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Antrian ' . $antrian->nomor_antrian . ' berhasil dipanggil',
            'data' => $antrian
        ]);
    }

    /**
     * Ambil statistik pelayanan hari ini untuk Kader
     */
    public function getStatistik()
    {
        $hariIni = Carbon::today()->toDateString();
        
        $stats = [
            'total_hadir' => Antrian::where('tanggal', $hariIni)->count(),
            'total_selesai' => Antrian::where('tanggal', $hariIni)->where('status', 'selesai')->count(),
            'kategori' => [
                'balita' => [
                    'total' => Antrian::where('tanggal', $hariIni)->where('kategori', 'balita')->count(),
                    'selesai' => Antrian::where('tanggal', $hariIni)->where('kategori', 'balita')->where('status', 'selesai')->count(),
                ],
                'ibu_hamil' => [
                    'total' => Antrian::where('tanggal', $hariIni)->where('kategori', 'ibu_hamil')->count(),
                    'selesai' => Antrian::where('tanggal', $hariIni)->where('kategori', 'ibu_hamil')->where('status', 'selesai')->count(),
                ],
                'lansia' => [
                    'total' => Antrian::where('tanggal', $hariIni)->where('kategori', 'lansia')->count(),
                    'selesai' => Antrian::where('tanggal', $hariIni)->where('kategori', 'lansia')->where('status', 'selesai')->count(),
                ],
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }

    /**
     * Ambil seluruh daftar hadir (antrian) hari ini untuk Kader
     */
    public function getDaftarHadir()
    {
        $hariIni = Carbon::today()->toDateString();
        
        $daftarHadir = Antrian::with('penduduk')
            ->where('tanggal', $hariIni)
            ->orderBy('angka_antrian', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $daftarHadir
        ]);
    }

    /**
     * Ambil Riwayat Pemeriksaan User
     */
    public function riwayatPemeriksaan($penduduk_id)
    {
        $authUser = request()->user();
        if ($authUser instanceof \App\Models\Penduduk && (int) $penduduk_id !== $authUser->id) {
            return response()->json(['message' => 'Tidak diizinkan melihat riwayat penduduk lain'], 403);
        }

        $penduduk = Penduduk::findOrFail($penduduk_id);
        $riwayat = [];

        // Cek kategori dan ambil dari tabel yang sesuai
        if (Balita::where('nik', $penduduk->nik)->exists()) {
            $balita = Balita::where('nik', $penduduk->nik)->first();
            $riwayat = \App\Models\PemeriksaanPosyandu::where('balita_id', $balita->id)
                ->orderBy('tanggal_periksa', 'desc')->get();
        } elseif (IbuHamil::where('nik', $penduduk->nik)->exists()) {
            $ibu = IbuHamil::where('nik', $penduduk->nik)->first();
            $riwayat = \App\Models\PemeriksaanIbuHamil::where('ibu_hamil_id', $ibu->id)
                ->orderBy('tanggal_periksa', 'desc')->get();
        } elseif (Lansia::where('nik', $penduduk->nik)->exists()) {
            $lansia = Lansia::where('nik', $penduduk->nik)->first();
            $riwayat = \App\Models\PemeriksaanPosbindu::where('lansia_id', $lansia->id)
                ->orderBy('tanggal_periksa', 'desc')->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $riwayat
        ]);
    }

    /**
     * Ambil antrian aktif milik user yang sedang login (Warga)
     */
    public function antrianAktif(Request $request)
    {
        $user = $request->user();
        // Cek apakah user adalah Penduduk (Warga)
        if (!$user || !($user instanceof Penduduk)) {
            return response()->json(['message' => 'Hanya tersedia untuk akun warga'], 403);
        }

        $hariIni = Carbon::today()->toDateString();
        $antrian = Antrian::where('penduduk_id', $user->id)
            ->where('tanggal', $hariIni)
            ->whereIn('status', ['menunggu', 'dipanggil'])
            ->first();

        return response()->json([
            'status' => 'success',
            'data' => $antrian
        ]);
    }

    /**
     * Update FCM Token untuk Push Notification
     */
    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string'
        ]);

        $user = $request->user();
        if ($user) {
            $user->update(['fcm_token' => $request->fcm_token]);
            return response()->json(['message' => 'FCM Token berhasil diperbarui']);
        }

        return response()->json(['message' => 'User tidak ditemukan'], 404);
    }
}
