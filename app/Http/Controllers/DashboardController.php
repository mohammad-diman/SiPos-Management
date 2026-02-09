<?php

namespace App\Http\Controllers;

use App\Models\Penduduk;
use App\Models\Balita;
use App\Models\IbuHamil;
use App\Models\Lansia;
use App\Models\PemeriksaanPosyandu;
use App\Models\PemeriksaanIbuHamil;
use App\Models\PemeriksaanPosbindu;
use App\Models\Jadwal;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = date('Y');

        // Optimasi: Menggunakan MONTH() untuk MySQL
        $posyanduMonthly = PemeriksaanPosyandu::selectRaw('MONTH(tanggal_periksa) as month, count(*) as count')
            ->whereYear('tanggal_periksa', $currentYear)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $ibuHamilMonthly = PemeriksaanIbuHamil::selectRaw('MONTH(tanggal_periksa) as month, count(*) as count')
            ->whereYear('tanggal_periksa', $currentYear)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $posbinduMonthly = PemeriksaanPosbindu::selectRaw('MONTH(tanggal_periksa) as month, count(*) as count')
            ->whereYear('tanggal_periksa', $currentYear)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $monthly_stats = [];
        for ($i = 1; $i <= 12; $i++) {
            // $i adalah integer 1-12, sesuai dengan output MONTH()
            $monthly_stats[] = ($posyanduMonthly[$i] ?? 0) + 
                             ($ibuHamilMonthly[$i] ?? 0) + 
                             ($posbinduMonthly[$i] ?? 0);
        }

        $antrian = [
            'balita' => \App\Models\Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'balita')
                ->whereIn('status', ['dipanggil', 'selesai'])
                ->orderBy('angka_antrian', 'desc')
                ->first(),
            'ibu_hamil' => \App\Models\Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'ibu_hamil')
                ->whereIn('status', ['dipanggil', 'selesai'])
                ->orderBy('angka_antrian', 'desc')
                ->first(),
            'lansia' => \App\Models\Antrian::where('tanggal', date('Y-m-d'))
                ->where('kategori', 'lansia')
                ->whereIn('status', ['dipanggil', 'selesai'])
                ->orderBy('angka_antrian', 'desc')
                ->first(),
        ];

        \Illuminate\Support\Facades\Log::info('Antrian Dashboard:', $antrian);

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_penduduk' => Penduduk::count(),
                'total_posyandu' => Balita::count(),
                'total_ibu_hamil' => IbuHamil::count(),
                'total_posbindu' => Lansia::count(),
            ],
            'antrian_hari_ini' => $antrian,
            'upcoming_jadwals' => Jadwal::where('tanggal', '>=', now()->toDateString())
                ->orderBy('tanggal', 'asc')
                ->take(3)
                ->get(),
            'chart_data' => [
                'monthly' => $monthly_stats,
                'distribution' => [
                    PemeriksaanPosyandu::distinct('balita_id')->count(),
                    PemeriksaanIbuHamil::distinct('ibu_hamil_id')->count(),
                    PemeriksaanPosbindu::distinct('lansia_id')->count(),
                ]
            ]
        ]);
    }
}
