<?php

namespace App\Http\Controllers;

use App\Models\Lansia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LansiaController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Lansia/Index', [
            'lansias' => Lansia::query()
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
            'no_rm' => 'required|string|unique:lansias',
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:lansias',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
            'alergi' => 'nullable|string',
        ]);

        Lansia::create($validated);

        return redirect()->back()->with('message', 'Data master lansia berhasil ditambahkan');
    }

    public function update(Request $request, Lansia $lansium)
    {
        $validated = $request->validate([
            'no_rm' => 'required|string|unique:lansias,no_rm,' . $lansium->id,
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:lansias,nik,' . $lansium->id,
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string',
            'golongan_darah' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
            'alergi' => 'nullable|string',
        ]);

        $lansium->update($validated);

        return redirect()->back()->with('message', 'Data master lansia berhasil diperbarui');
    }

    public function destroy(Lansia $lansium)
    {
        $lansium->delete();
        return redirect()->back()->with('message', 'Data master lansia berhasil dihapus');
    }
}