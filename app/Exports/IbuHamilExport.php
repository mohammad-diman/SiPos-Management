<?php

namespace App\Exports;

use App\Models\IbuHamil;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class IbuHamilExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return IbuHamil::all();
    }

    public function headings(): array
    {
        return [
            'No. RM',
            'Nama Lengkap',
            'NIK',
            'Nama Suami',
            'Usia Kehamilan (Minggu)',
            'Alamat',
            'No. HP',
        ];
    }

    public function map($ibuHamil): array
    {
        return [
            $ibuHamil->no_rm,
            $ibuHamil->nama,
            $ibuHamil->nik,
            $ibuHamil->nama_suami,
            $ibuHamil->usia_kehamilan,
            $ibuHamil->alamat,
            $ibuHamil->no_hp,
        ];
    }
}
