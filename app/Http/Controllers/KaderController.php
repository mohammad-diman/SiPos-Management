<?php

namespace App\Http\Controllers;

use App\Models\Kader;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KaderController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Kaders/Index', [
            'kaders' => Kader::query()
                ->with('user:id,name,email')
                ->when($request->search, function ($query, $search) {
                    $query->where('nama', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'available_users' => User::where('role', 'kader')
                ->whereDoesntHave('kader')
                ->select('id', 'name', 'email')
                ->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|unique:kaders,nik',
            'nama' => 'required|string|max:255',
            'jabatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id|unique:kaders,user_id',
        ]);

        Kader::create($validated);

        return redirect()->back()->with('message', 'Data master kader berhasil ditambahkan');
    }

    public function update(Request $request, Kader $kader)
    {
        $validated = $request->validate([
            'nik' => 'required|string|unique:kaders,nik,' . $kader->id,
            'nama' => 'required|string|max:255',
            'jabatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id|unique:kaders,user_id,' . $kader->id,
        ]);

        $kader->update($validated);

        return redirect()->back()->with('message', 'Data master kader berhasil diperbarui');
    }

    public function destroy(Kader $kader)
    {
        $kader->delete();
        return redirect()->back()->with('message', 'Data master kader berhasil dihapus');
    }
}