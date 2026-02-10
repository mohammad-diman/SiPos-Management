<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penduduk;
use Illuminate\Http\Request;

class PendudukController extends Controller
{
    /**
     * Cari penduduk berdasarkan NIK atau Nama
     */
    public function search(Request $request)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json([
                'status' => 'success',
                'data' => []
            ]);
        }

        $penduduks = Penduduk::where('nik', 'like', "%{$query}%")
            ->orWhere('nama', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'nama', 'nik', 'alamat']);

        return response()->json([
            'status' => 'success',
            'data' => $penduduks
        ]);
    }
}
