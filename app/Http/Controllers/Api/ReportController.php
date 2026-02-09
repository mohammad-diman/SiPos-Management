<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\PemeriksaanPosyandu;
use App\Models\PemeriksaanPosbindu;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Laravel\Sanctum\PersonalAccessToken;

class ReportController extends Controller
{
    private function authorizeStaff(Request $request): ?\App\Models\User
    {
        $user = $request->user();
        if ($user instanceof \App\Models\User && in_array($user->role, ['admin', 'kader'])) {
            return $user;
        }

        $token = $request->bearerToken() ?? $request->query('token');
        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken && $accessToken->tokenable instanceof \App\Models\User) {
                $tokenUser = $accessToken->tokenable;
                if (in_array($tokenUser->role, ['admin', 'kader'])) {
                    return $tokenUser;
                }
            }
        }

        return null;
    }

    /**
     * Export Laporan Pemeriksaan Harian ke PDF
     */
    public function exportDailyPdf(Request $request)
    {
        if (!$this->authorizeStaff($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $date = $request->query('date', Carbon::today()->toDateString());
        $kategori = $request->query('kategori', 'balita');

        if ($kategori == 'balita') {
            $data = PemeriksaanPosyandu::with('balita')
                ->where('tanggal_periksa', $date)
                ->get();
            $title = "Laporan Posyandu Balita - $date";
        } else {
            $data = PemeriksaanPosbindu::with('lansia')
                ->where('tanggal_periksa', $date)
                ->get();
            $title = "Laporan Posbindu Lansia - $date";
        }

        $pdf = Pdf::loadView('reports.daily_pemeriksaan', compact('data', 'title', 'date', 'kategori'));
        
        return $pdf->download("Laporan-$kategori-$date.pdf");
    }

    /**
     * Endpoint untuk mendapatkan link download (Simulasi untuk Mobile)
     */
    public function getReportUrl(Request $request)
    {
        if (!$this->authorizeStaff($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $date = $request->query('date', Carbon::today()->toDateString());
        $kategori = $request->query('kategori', 'balita');
        $type = $request->query('type', 'pdf');

        // Di dunia nyata, ini akan mengembalikan URL file yang disimpan di storage S3/Public
        // Untuk keperluan skripsi, kita arahkan ke URL download Laravel langsung
        $token = $request->bearerToken() ?? $request->query('token');
        $tokenParam = $token ? '&token=' . urlencode($token) : '';
        $url = url("/api/reports/export?date=$date&kategori=$kategori&type=$type{$tokenParam}");

        return response()->json([
            'status' => 'success',
            'download_url' => $url
        ]);
    }
}
