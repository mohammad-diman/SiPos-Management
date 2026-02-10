<?php

namespace App\Http\Controllers;

use App\Models\Penduduk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendudukController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Penduduk/Index', [
            'penduduks' => Penduduk::query()
                ->when($request->search, function ($query, $search) {
                    $query->where(function($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                          ->orWhere('nik', 'like', "%{$search}%");
                    });
                })
                ->when($request->desa, function ($query, $desa) {
                    $query->where('alamat', 'like', "%{$desa}%");
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['search', 'desa'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:penduduks',
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
        ]);

        Penduduk::create($validated);

        return redirect()->back()->with('message', 'Data penduduk berhasil ditambahkan');
    }

    public function update(Request $request, Penduduk $penduduk)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:penduduks,nik,' . $penduduk->id,
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
        ]);

        $penduduk->update($validated);

        return redirect()->back()->with('message', 'Data penduduk berhasil diperbarui');
    }

    public function destroy(Penduduk $penduduk)
    {
        $penduduk->delete();

        return redirect()->back()->with('message', 'Data penduduk berhasil dihapus');
    }
}
