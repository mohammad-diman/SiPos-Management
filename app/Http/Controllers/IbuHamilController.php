<?php

namespace App\Http\Controllers;

use App\Models\IbuHamil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IbuHamilController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('IbuHamil/Index', [
            'ibu_hamils' => IbuHamil::query()
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
            'no_rm' => 'required|string|unique:ibu_hamils',
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:ibu_hamils',
            'tanggal_lahir' => 'required|date',
            'nama_suami' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string',
            'usia_kehamilan' => 'required|integer',
            'hpht' => 'required|date',
            'tgl_lahir_anak_terakhir' => 'nullable|date',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
        ]);

        IbuHamil::create($validated);

        return redirect()->back()->with('message', 'Data master ibu hamil berhasil ditambahkan');
    }

    public function update(Request $request, IbuHamil $ibuHamil)
    {
        $validated = $request->validate([
            'no_rm' => 'required|string|unique:ibu_hamils,no_rm,' . $ibuHamil->id,
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:ibu_hamils,nik,' . $ibuHamil->id,
            'tanggal_lahir' => 'required|date',
            'nama_suami' => 'required|string|max:255',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string',
            'usia_kehamilan' => 'required|integer',
            'hpht' => 'required|date',
            'tgl_lahir_anak_terakhir' => 'nullable|date',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
        ]);

        $ibuHamil->update($validated);

        return redirect()->back()->with('message', 'Data master ibu hamil berhasil diperbarui');
    }

    public function destroy(IbuHamil $ibuHamil)
    {
        $ibuHamil->delete();
        return redirect()->back()->with('message', 'Data master ibu hamil berhasil dihapus');
    }
}