<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\PemeriksaanPosyandu;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PemeriksaanBalitaController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Pemeriksaan/Balita/Index', [
            'pemeriksaans' => PemeriksaanPosyandu::query()
                ->with('balita')
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('balita', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                          ->orWhere('no_rm', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'balitas' => Balita::select('id', 'nama', 'no_rm', 'nik')->orderBy('no_rm', 'asc')->get(),
            'filters' => $request->only(['search']),
            'antrian_aktif' => Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'balita')
                ->whereIn('status', ['menunggu', 'dipanggil'])
                ->with('penduduk')
                ->orderBy('angka_antrian', 'asc')
                ->first()
        ]);
    }

    public function panggilAntrian(Antrian $antrian)
    {
        // Reset status 'dipanggil' lain di kategori yang sama
        Antrian::where('kategori', 'balita')
            ->where('tanggal', date('Y-m-d'))
            ->where('status', 'dipanggil')
            ->update(['status' => 'menunggu']);

        $antrian->update(['status' => 'dipanggil']);
        return redirect()->back()->with('message', 'Memanggil antrian ' . $antrian->nomor_antrian);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'tanggal_periksa' => 'required|date',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_kepala' => 'required|numeric',
            'status_gizi' => 'nullable|string',
            'perkembangan' => 'nullable|string',
            'catatan' => 'nullable|string',
            'imunisasi_bcg' => 'boolean',
            'imunisasi_dpt_hb_hib' => 'boolean',
            'imunisasi_polio' => 'boolean',
            'imunisasi_campak' => 'boolean',
            'imunisasi_rotavirus' => 'boolean',
            'imunisasi_pneumokokus' => 'boolean',
            'imunisasi_hepatitis_a' => 'boolean',
            'imunisasi_varisela' => 'boolean',
            'imunisasi_tifoid' => 'boolean',
            'imunisasi_influenza' => 'boolean',
            'imunisasi_hpv' => 'boolean',
            'vitamin_a_1' => 'boolean',
            'vitamin_a_2' => 'boolean',
            'jumlah_vit_b1' => 'integer|min:0',
            'jumlah_vit_c' => 'integer|min:0',
            'vitamin_lain' => 'nullable|string',
        ]);

        $pemeriksaan = PemeriksaanPosyandu::create($validated);

        if ($pemeriksaan) {
            try {
                $balita = Balita::find($validated['balita_id']);
                if ($balita) {
                    Antrian::whereHas('penduduk', function($q) use ($balita) {
                        $q->where('nik', $balita->nik);
                    })->where('tanggal', date('Y-m-d'))
                      ->where('status', 'dipanggil')
                      ->update(['status' => 'selesai']);
                }
            } catch (\Exception $e) {
                Log::error('Queue update failed (Balita): ' . $e->getMessage());
            }
            return redirect()->back()->with('message', 'Data pemeriksaan berhasil disimpan');
        }

        return redirect()->back()->with('error', 'Gagal menyimpan data');
    }

    public function update(Request $request, PemeriksaanPosyandu $pemeriksaanBalitum)
    {
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'tanggal_periksa' => 'required|date',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_kepala' => 'required|numeric',
            'status_gizi' => 'nullable|string',
            'perkembangan' => 'nullable|string',
            'catatan' => 'nullable|string',
            'imunisasi_bcg' => 'boolean',
            'imunisasi_dpt_hb_hib' => 'boolean',
            'imunisasi_polio' => 'boolean',
            'imunisasi_campak' => 'boolean',
            'imunisasi_rotavirus' => 'boolean',
            'imunisasi_pneumokokus' => 'boolean',
            'imunisasi_hepatitis_a' => 'boolean',
            'imunisasi_varisela' => 'boolean',
            'imunisasi_tifoid' => 'boolean',
            'imunisasi_influenza' => 'boolean',
            'imunisasi_hpv' => 'boolean',
            'vitamin_a_1' => 'boolean',
            'vitamin_a_2' => 'boolean',
            'jumlah_vit_b1' => 'integer|min:0',
            'jumlah_vit_c' => 'integer|min:0',
            'vitamin_lain' => 'nullable|string',
        ]);

        $pemeriksaanBalitum->update($validated);
        return redirect()->back()->with('message', 'Data pemeriksaan berhasil diperbarui');
    }

    public function destroy(PemeriksaanPosyandu $pemeriksaanBalitum)
    {
        $pemeriksaanBalitum->delete();
        return redirect()->back()->with('message', 'Data pemeriksaan berhasil dihapus');
    }
}
