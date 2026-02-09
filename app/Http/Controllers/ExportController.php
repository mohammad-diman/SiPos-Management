<?php

namespace App\Http\Controllers;

use App\Exports\PendudukExport;
use App\Exports\BalitaExport;
use App\Exports\IbuHamilExport;
use App\Exports\LansiaExport;
use App\Models\Penduduk;
use App\Models\Balita;
use App\Models\IbuHamil;
use App\Models\Lansia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function exportExcel($model)
    {
        switch ($model) {
            case 'penduduk':
                return Excel::download(new PendudukExport, 'data-penduduk.xlsx');
            case 'balita':
                return Excel::download(new BalitaExport, 'data-balita.xlsx');
            case 'ibu-hamil':
                return Excel::download(new IbuHamilExport, 'data-ibu-hamil.xlsx');
            case 'lansia':
                return Excel::download(new LansiaExport, 'data-lansia.xlsx');
            default:
                abort(404);
        }
    }

    public function exportPdf($model)
    {
        $data = [];
        $title = '';
        $view = 'exports.report';

        switch ($model) {
            case 'penduduk':
                $data = Penduduk::all();
                $title = 'Laporan Data Penduduk';
                $columns = ['NIK', 'Nama', 'JK', 'Tgl Lahir', 'Alamat'];
                break;
            case 'balita':
                $data = Balita::all();
                $title = 'Laporan Data Balita';
                $columns = ['No. RM', 'Nama', 'NIK', 'Tgl Lahir', 'Ibu'];
                break;
            case 'ibu-hamil':
                $data = IbuHamil::all();
                $title = 'Laporan Data Ibu Hamil';
                $columns = ['No. RM', 'Nama', 'Suami', 'Usia Hamil', 'Alamat'];
                break;
            case 'lansia':
                $data = Lansia::all();
                $title = 'Laporan Data Lansia';
                $columns = ['No. RM', 'Nama', 'NIK', 'JK', 'Alamat'];
                break;
            default:
                abort(404);
        }

        $pdf = Pdf::loadView($view, [
            'data' => $data,
            'title' => $title,
            'columns' => $columns,
            'model' => $model,
            'date' => now()->translatedFormat('d F Y')
        ]);

        return $pdf->download(str_replace(' ', '-', strtolower($title)) . '.pdf');
    }
}
