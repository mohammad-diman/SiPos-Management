<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\PemeriksaanPosyandu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalitaController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Balita/Index', [
            'balitas' => Balita::query()
                ->when($request->search, function ($query, $search) {
                    $query->where('nama', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")
                        ->orWhere('no_rm', 'like', "%{$search}%");
                })
                ->with('pemeriksaans')
                ->orderBy('no_rm', 'asc')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_rm' => 'required|string|unique:balitas',
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:balitas',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_hp_ortu' => 'nullable|string',
            'berat_badan_lahir' => 'nullable|numeric',
            'tinggi_badan_lahir' => 'nullable|numeric',
            'nama_ayah' => 'nullable|string',
            'nama_ibu' => 'nullable|string',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
        ]);

        Balita::create($validated);

        return redirect()->back()->with('message', 'Data master balita berhasil ditambahkan');
    }

    public function update(Request $request, Balita $balita)
    {
        $validated = $request->validate([
            'no_rm' => 'required|string|unique:balitas,no_rm,' . $balita->id,
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:balitas,nik,' . $balita->id,
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_hp_ortu' => 'nullable|string',
            'berat_badan_lahir' => 'nullable|numeric',
            'tinggi_badan_lahir' => 'nullable|numeric',
            'nama_ayah' => 'nullable|string',
            'nama_ibu' => 'nullable|string',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
        ]);

        $balita->update($validated);

        return redirect()->back()->with('message', 'Data master balita berhasil diperbarui');
    }

    public function destroy(Balita $balita)
    {
        $balita->delete();
        return redirect()->back()->with('message', 'Data master balita berhasil dihapus');
    }
}