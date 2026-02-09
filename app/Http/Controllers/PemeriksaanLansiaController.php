<?php

namespace App\Http\Controllers;

use App\Models\Lansia;
use App\Models\PemeriksaanPosbindu;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PemeriksaanLansiaController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Pemeriksaan/Lansia/Index', [
            'pemeriksaans' => PemeriksaanPosbindu::query()
                ->with('lansia')
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('lansia', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                          ->orWhere('no_rm', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'lansias' => Lansia::select('id', 'nama', 'no_rm', 'nik')->orderBy('no_rm', 'asc')->get(),
            'filters' => $request->only(['search']),
            'antrian_aktif' => Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'lansia')
                ->whereIn('status', ['menunggu', 'dipanggil'])
                ->with('penduduk')
                ->orderBy('angka_antrian', 'asc')
                ->first()
        ]);
    }

    public function panggilAntrian(Antrian $antrian)
    {
        // Reset status 'dipanggil' lain di kategori yang sama
        Antrian::where('kategori', 'lansia')
            ->where('tanggal', date('Y-m-d'))
            ->where('status', 'dipanggil')
            ->update(['status' => 'menunggu']);

        $antrian->update(['status' => 'dipanggil']);
        return redirect()->back()->with('message', 'Memanggil antrian ' . $antrian->nomor_antrian);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lansia_id' => 'required|exists:lansias,id',
            'tanggal_periksa' => 'required|date',
            'nama_kader' => 'nullable|string',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_perut' => 'nullable|numeric',
            'tekanan_darah' => 'required|string',
            'nadi' => 'nullable|integer',
            'suhu_tubuh' => 'nullable|numeric',
            'gula_darah' => 'nullable|numeric',
            'kolesterol' => 'nullable|numeric',
            'asam_urat' => 'nullable|numeric',
            'riwayat_merokok' => 'boolean',
            'riwayat_alkohol' => 'boolean',
            'frekuensi_olahraga_per_minggu' => 'nullable|integer',
            'riwayat_penyakit' => 'nullable|string',
            'keluhan_utama' => 'nullable|string',
            'gangguan_penglihatan' => 'boolean',
            'gangguan_pendengaran' => 'boolean',
            'status_gizi' => 'nullable|string',
            'obat' => 'nullable|string',
            'konseling' => 'nullable|string',
            'rujukan' => 'boolean',
            'catatan' => 'nullable|string',
        ]);

        // Hitung IMT otomatis
        $heightInMeters = $validated['tinggi_badan'] / 100;
        $validated['imt'] = round($validated['berat_badan'] / ($heightInMeters * $heightInMeters), 2);

        $pemeriksaan = PemeriksaanPosbindu::create($validated);

        if ($pemeriksaan) {
            try {
                $lansia = Lansia::find($validated['lansia_id']);
                if ($lansia) {
                    Antrian::whereHas('penduduk', function($q) use ($lansia) {
                        $q->where('nik', $lansia->nik);
                    })->where('tanggal', date('Y-m-d'))
                      ->where('status', 'dipanggil')
                      ->update(['status' => 'selesai']);
                }
            } catch (\Exception $e) {
                Log::error('Queue update failed (Lansia): ' . $e->getMessage());
            }
            return redirect()->back()->with('message', 'Pemeriksaan lansia berhasil dicatat');
        }

        return redirect()->back()->with('error', 'Gagal menyimpan data pemeriksaan');
    }

    public function update(Request $request, PemeriksaanPosbindu $pemeriksaanLansium)
    {
        $validated = $request->validate([
            'lansia_id' => 'required|exists:lansias,id',
            'tanggal_periksa' => 'required|date',
            'nama_kader' => 'nullable|string',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_perut' => 'nullable|numeric',
            'tekanan_darah' => 'required|string',
            'nadi' => 'nullable|integer',
            'suhu_tubuh' => 'nullable|numeric',
            'gula_darah' => 'nullable|numeric',
            'kolesterol' => 'nullable|numeric',
            'asam_urat' => 'nullable|numeric',
            'riwayat_merokok' => 'boolean',
            'riwayat_alkohol' => 'boolean',
            'frekuensi_olahraga_per_minggu' => 'nullable|integer',
            'riwayat_penyakit' => 'nullable|string',
            'keluhan_utama' => 'nullable|string',
            'gangguan_penglihatan' => 'boolean',
            'gangguan_pendengaran' => 'boolean',
            'status_gizi' => 'nullable|string',
            'obat' => 'nullable|string',
            'konseling' => 'nullable|string',
            'rujukan' => 'boolean',
            'catatan' => 'nullable|string',
        ]);

        $heightInMeters = $validated['tinggi_badan'] / 100;
        $validated['imt'] = round($validated['berat_badan'] / ($heightInMeters * $heightInMeters), 2);

        $pemeriksaanLansium->update($validated);

        return redirect()->back()->with('message', 'Data pemeriksaan lansia berhasil diperbarui');
    }

    public function destroy(PemeriksaanPosbindu $pemeriksaanLansium)
    {
        $pemeriksaanLansium->delete();
        return redirect()->back()->with('message', 'Data pemeriksaan berhasil dihapus');
    }
}
