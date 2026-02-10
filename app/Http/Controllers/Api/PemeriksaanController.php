<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\PemeriksaanPosyandu;
use App\Models\PemeriksaanIbuHamil;
use App\Models\PemeriksaanPosbindu;
use App\Services\NutritionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PemeriksaanController extends Controller
{
    protected $nutritionService;

    public function __construct(NutritionService $nutritionService)
    {
        $this->nutritionService = $nutritionService;
    }

    /**
     * Simpan Pemeriksaan Balita (Posyandu)
     */
    public function storeBalita(Request $request)
    {
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'antrian_id' => 'required|exists:antrians,id',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_kepala' => 'required|numeric',
            'status_gizi' => 'nullable|string',
            'perkembangan' => 'nullable|string',
            'catatan' => 'nullable|string',
            // ... (rest of validation)
        ]);

        // Validasi relasi antrian dan balita
        $antrian = Antrian::with('penduduk')->find($validated['antrian_id']);
        $balita = \App\Models\Balita::find($validated['balita_id']);

        if ($antrian->penduduk->nik !== $balita->nik || $antrian->kategori !== 'balita') {
            return response()->json([
                'status' => 'error',
                'message' => 'Data antrian tidak sesuai dengan data balita'
            ], 400);
        }

        // SMART GIZI: Hitung otomatis jika status_gizi kosong
        if (empty($validated['status_gizi'])) {
            $validated['status_gizi'] = $this->nutritionService->calculateStatus(
                $validated['berat_badan'],
                $balita->tanggal_lahir,
                $balita->jenis_kelamin ?? 'L'
            );
        }

        return DB::transaction(function () use ($validated) {
            $pemeriksaan = PemeriksaanPosyandu::create(array_merge($validated, [
                'tanggal_periksa' => Carbon::today()->toDateString(),
            ]));

            // Update status antrian menjadi selesai
            Antrian::where('id', $validated['antrian_id'])->update(['status' => 'selesai']);

            return response()->json([
                'status' => 'success',
                'message' => 'Data pemeriksaan balita berhasil disimpan',
                'data' => $pemeriksaan
            ]);
        });
    }

    /**
     * Simpan Pemeriksaan Ibu Hamil
     */
    public function storeIbuHamil(Request $request)
    {
        $validated = $request->validate([
            'ibu_hamil_id' => 'required|exists:ibu_hamils,id',
            'antrian_id' => 'required|exists:antrians,id',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'tekanan_darah' => 'required|string',
            'lila' => 'required|numeric',
            'tfu' => 'required|numeric',
            'djj' => 'required|integer',
            'jumlah_fe' => 'required|integer',
            'imunisasi_tt' => 'nullable|string',
            'keluhan' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        // Validasi relasi antrian dan ibu hamil
        $antrian = Antrian::with('penduduk')->find($validated['antrian_id']);
        $ibuHamil = \App\Models\IbuHamil::find($validated['ibu_hamil_id']);

        if ($antrian->penduduk->nik !== $ibuHamil->nik || $antrian->kategori !== 'ibu_hamil') {
            return response()->json([
                'status' => 'error',
                'message' => 'Data antrian tidak sesuai dengan data ibu hamil'
            ], 400);
        }

        return DB::transaction(function () use ($validated) {
            $pemeriksaan = PemeriksaanIbuHamil::create(array_merge($validated, [
                'tanggal_periksa' => Carbon::today()->toDateString(),
            ]));

            Antrian::where('id', $validated['antrian_id'])->update(['status' => 'selesai']);

            return response()->json([
                'status' => 'success',
                'message' => 'Data pemeriksaan ibu hamil berhasil disimpan',
                'data' => $pemeriksaan
            ]);
        });
    }

    /**
     * Simpan Pemeriksaan Lansia (Posbindu)
     */
    public function storeLansia(Request $request)
    {
        $validated = $request->validate([
            'lansia_id' => 'required|exists:lansias,id',
            'antrian_id' => 'required|exists:antrians,id',
            'nama_kader' => 'nullable|string',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'imt' => 'nullable|numeric',
            'tekanan_darah' => 'required|string',
            'gula_darah' => 'nullable|numeric',
            'kolesterol' => 'nullable|numeric',
            'asam_urat' => 'nullable|numeric',
            'nadi' => 'nullable|numeric',
            'suhu_tubuh' => 'nullable|numeric',
            'lingkar_perut' => 'nullable|numeric',
            'riwayat_merokok' => 'boolean',
            'riwayat_alkohol' => 'boolean',
            'frekuensi_olahraga_per_minggu' => 'nullable|numeric',
            'gangguan_penglihatan' => 'boolean',
            'gangguan_pendengaran' => 'boolean',
            'status_gizi' => 'nullable|string',
            'obat' => 'nullable|string',
            'konseling' => 'nullable|string',
            'rujukan' => 'boolean',
            'keluhan_utama' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        // Validasi relasi antrian dan lansia
        $antrian = Antrian::with('penduduk')->find($validated['antrian_id']);
        $lansia = \App\Models\Lansia::find($validated['lansia_id']);

        if ($antrian->penduduk->nik !== $lansia->nik || $antrian->kategori !== 'lansia') {
            return response()->json([
                'status' => 'error',
                'message' => 'Data antrian tidak sesuai dengan data lansia'
            ], 400);
        }

        return DB::transaction(function () use ($validated) {
            $pemeriksaan = PemeriksaanPosbindu::create(array_merge($validated, [
                'tanggal_periksa' => Carbon::today()->toDateString(),
            ]));

            Antrian::where('id', $validated['antrian_id'])->update(['status' => 'selesai']);

            return response()->json([
                'status' => 'success',
                'message' => 'Data pemeriksaan lansia berhasil disimpan',
                'data' => $pemeriksaan
            ]);
        });
    }

    /**
     * Ambil daftar antrian yang menunggu untuk diproses oleh kader
     */
    public function getAntrianMenunggu(Request $request)
    {
        $kategori = $request->query('kategori'); // balita, ibu_hamil, lansia
        
        $query = Antrian::with('penduduk')
            ->where('tanggal', Carbon::today()->toDateString())
            ->whereIn('status', ['menunggu', 'dipanggil'])
            ->orderBy('angka_antrian', 'asc');

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        $antrianItems = $query->get();

        $nikBalita = [];
        $nikIbuHamil = [];
        $nikLansia = [];
        foreach ($antrianItems as $item) {
            $penduduk = $item->penduduk;
            if (!$penduduk) {
                continue;
            }
            if ($item->kategori == 'balita') {
                $nikBalita[] = $penduduk->nik;
            } elseif ($item->kategori == 'ibu_hamil') {
                $nikIbuHamil[] = $penduduk->nik;
            } elseif ($item->kategori == 'lansia') {
                $nikLansia[] = $penduduk->nik;
            }
        }

        $balitaByNik = \App\Models\Balita::whereIn('nik', $nikBalita)
            ->get(['id', 'nik', 'tanggal_lahir'])
            ->keyBy('nik');
        $ibuHamilByNik = \App\Models\IbuHamil::whereIn('nik', $nikIbuHamil)
            ->get(['id', 'nik'])
            ->keyBy('nik');
        $lansiaByNik = \App\Models\Lansia::whereIn('nik', $nikLansia)
            ->get(['id', 'nik'])
            ->keyBy('nik');

        $antrian = $antrianItems->map(function($item) use ($balitaByNik, $ibuHamilByNik, $lansiaByNik) {
            // Lampirkan ID spesifik kategori (balita_id, dll)
            $penduduk = $item->penduduk;
            $kategoriId = null;
            $tanggalLahir = null;
            
            if ($item->kategori == 'balita') {
                $balita = $balitaByNik->get($penduduk->nik);
                $kategoriId = $balita?->id;
                $tanggalLahir = $balita?->tanggal_lahir;
            } elseif ($item->kategori == 'ibu_hamil') {
                $kategoriId = $ibuHamilByNik->get($penduduk->nik)?->id;
            } elseif ($item->kategori == 'lansia') {
                $kategoriId = $lansiaByNik->get($penduduk->nik)?->id;
            }

            return [
                'id' => $item->id,
                'nomor_antrian' => $item->nomor_antrian,
                'kategori' => $item->kategori,
                'penduduk_id' => $penduduk->id,
                'nama' => $penduduk->nama,
                'nik' => $penduduk->nik,
                'kategori_id' => $kategoriId, // ID Balita/IbuHamil/Lansia
                'tanggal_lahir' => $tanggalLahir
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $antrian
        ]);
    }
}
