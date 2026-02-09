<?php

namespace App\Exports;

use App\Models\Penduduk;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PendudukExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Penduduk::all();
    }

    public function headings(): array
    {
        return [
            'NIK',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tanggal Lahir',
            'Alamat',
            'Telepon',
        ];
    }

    public function map($penduduk): array
    {
        return [
            $penduduk->nik,
            $penduduk->nama,
            $penduduk->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            $penduduk->tanggal_lahir,
            $penduduk->alamat,
            $penduduk->telepon,
        ];
    }
}
