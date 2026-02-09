<?php

namespace App\Exports;

use App\Models\Lansia;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LansiaExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Lansia::all();
    }

    public function headings(): array
    {
        return [
            'No. RM',
            'Nama Lengkap',
            'NIK',
            'Jenis Kelamin',
            'Alamat',
            'No. HP',
        ];
    }

    public function map($lansia): array
    {
        return [
            $lansia->no_rm,
            $lansia->nama,
            $lansia->nik,
            $lansia->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            $lansia->alamat,
            $lansia->no_hp,
        ];
    }
}
