<?php

namespace App\Exports;

use App\Models\Balita;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BalitaExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Balita::all();
    }

    public function headings(): array
    {
        return [
            'No. RM',
            'Nama Lengkap',
            'NIK',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'Nama Ayah',
            'Nama Ibu',
            'Alamat',
        ];
    }

    public function map($balita): array
    {
        return [
            $balita->no_rm,
            $balita->nama,
            $balita->nik,
            $balita->tanggal_lahir,
            $balita->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            $balita->nama_ayah,
            $balita->nama_ibu,
            $balita->alamat,
        ];
    }
}
