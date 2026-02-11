<?php

namespace App\Http\Controllers;

use App\Models\Desa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesaController extends Controller
{
    public function index()
    {
        return Inertia::render('Desa/Index', [
            'desas' => Desa::orderBy('nama_desa', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_desa' => 'required|string|max:255|unique:desas,nama_desa',
        ]);

        Desa::create($validated);

        return redirect()->back()->with('message', 'Data desa berhasil ditambahkan');
    }

    public function update(Request $request, Desa $desa)
    {
        $validated = $request->validate([
            'nama_desa' => 'required|string|max:255|unique:desas,nama_desa,' . $desa->id,
        ]);

        $desa->update($validated);

        return redirect()->back()->with('message', 'Data desa berhasil diperbarui');
    }

    public function destroy(Desa $desa)
    {
        $desa->delete();

        return redirect()->back()->with('message', 'Data desa berhasil dihapus');
    }
}
