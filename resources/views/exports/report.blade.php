<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #10b981; color: white; text-transform: uppercase; font-size: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 10px; color: #777; }
        h2 { margin: 0; color: #064e3b; }
        p { margin: 5px 0; color: #374151; }
    </style>
</head>
<body>
    <div class="header">
        <h2>SiPos (Sistem Informasi Posyandu & Posbindu)</h2>
        <p>{{ $title }}</p>
        <p>Tanggal Cetak: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                @foreach($columns as $col)
                    <th>{{ $col }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
                <tr>
                    @if($model == 'penduduk')
                        <td>{{ $item->nik }}</td>
                        <td>{{ $item->nama }}</td>
                        <td>{{ $item->jenis_kelamin }}</td>
                        <td>{{ $item->tanggal_lahir }}</td>
                        <td>{{ $item->alamat }}</td>
                    @elseif($model == 'balita')
                        <td>{{ $item->no_rm }}</td>
                        <td>{{ $item->nama }}</td>
                        <td>{{ $item->nik }}</td>
                        <td>{{ $item->tanggal_lahir }}</td>
                        <td>{{ $item->nama_ibu }}</td>
                    @elseif($model == 'ibu-hamil')
                        <td>{{ $item->no_rm }}</td>
                        <td>{{ $item->nama }}</td>
                        <td>{{ $item->nama_suami }}</td>
                        <td>{{ $item->usia_kehamilan }} Minggu</td>
                        <td>{{ $item->alamat }}</td>
                    @elseif($model == 'lansia')
                        <td>{{ $item->no_rm }}</td>
                        <td>{{ $item->nama }}</td>
                        <td>{{ $item->nik }}</td>
                        <td>{{ $item->jenis_kelamin }}</td>
                        <td>{{ $item->alamat }}</td>
                    @endif
                </tr>
            @endforeach
        </tbody>
    </table>

    <div className="footer">
        Dicetak secara otomatis melalui Sistem Manajemen SiPos
    </div>
</body>
</html>
