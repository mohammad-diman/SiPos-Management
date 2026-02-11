<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Desa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('Jadwal/Index', [
            'jadwals' => Jadwal::orderBy('tanggal', 'asc')->get(),
            'desas' => Desa::orderBy('nama_desa', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required',
            'lokasi' => 'required|string|max:255',
            'desa' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        Jadwal::create($validated);

        return redirect()->back()->with('message', 'Jadwal pelayanan berhasil ditambahkan');
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required',
            'lokasi' => 'required|string|max:255',
            'desa' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $jadwal->update($validated);

        return redirect()->back()->with('message', 'Jadwal pelayanan berhasil diperbarui');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();

        return redirect()->back()->with('message', 'Jadwal pelayanan berhasil dihapus secara permanen');
    }
}
