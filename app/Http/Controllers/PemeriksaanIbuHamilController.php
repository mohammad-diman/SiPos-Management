<?php

namespace App\Http\Controllers;

use App\Models\IbuHamil;
use App\Models\PemeriksaanIbuHamil;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PemeriksaanIbuHamilController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Pemeriksaan/IbuHamil/Index', [
            'pemeriksaans' => PemeriksaanIbuHamil::query()
                ->with('ibuHamil')
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('ibuHamil', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                          ->orWhere('no_rm', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'ibu_hamils' => IbuHamil::select('id', 'nama', 'no_rm', 'nik')->orderBy('no_rm', 'asc')->get(),
            'filters' => $request->only(['search']),
            'antrian_aktif' => Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'ibu_hamil')
                ->whereIn('status', ['menunggu', 'dipanggil'])
                ->with('penduduk')
                ->orderBy('angka_antrian', 'asc')
                ->first()
        ]);
    }

    public function panggilAntrian(Antrian $antrian)
    {
        // Reset status 'dipanggil' lain di kategori yang sama
        Antrian::where('kategori', 'ibu_hamil')
            ->where('tanggal', date('Y-m-d'))
            ->where('status', 'dipanggil')
            ->update(['status' => 'menunggu']);

        $antrian->update(['status' => 'dipanggil']);
        return redirect()->back()->with('message', 'Memanggil antrian ' . $antrian->nomor_antrian);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ibu_hamil_id' => 'required|exists:ibu_hamils,id',
            'tanggal_periksa' => 'required|date',
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

        $pemeriksaan = PemeriksaanIbuHamil::create($validated);

        if ($pemeriksaan) {
            // Update status antrian
            try {
                $ibuHamil = IbuHamil::find($validated['ibu_hamil_id']);
                if ($ibuHamil) {
                    Antrian::whereHas('penduduk', function($q) use ($ibuHamil) {
                        $q->where('nik', $ibuHamil->nik);
                    })->where('tanggal', date('Y-m-d'))
                      ->where('status', 'dipanggil')
                      ->update(['status' => 'selesai']);
                }
            } catch (\Exception $e) {
                Log::error('Queue update failed: ' . $e->getMessage());
            }

            return redirect()->back()->with('message', 'Pemeriksaan ibu hamil berhasil disimpan');
        }

        return redirect()->back()->with('error', 'Gagal menyimpan data pemeriksaan');
    }

    public function update(Request $request, PemeriksaanIbuHamil $pemeriksaanIbuHamil)
    {
        $validated = $request->validate([
            'ibu_hamil_id' => 'required|exists:ibu_hamils,id',
            'tanggal_periksa' => 'required|date',
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

        $pemeriksaanIbuHamil->update($validated);

        return redirect()->back()->with('message', 'Pemeriksaan ibu hamil berhasil diperbarui');
    }

    public function destroy(PemeriksaanIbuHamil $pemeriksaanIbuHamil)
    {
        $pemeriksaanIbuHamil->delete();
        return redirect()->back()->with('message', 'Pemeriksaan ibu hamil berhasil dihapus');
    }
}
