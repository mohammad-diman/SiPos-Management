<?php

use App\Http\Controllers\KaderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PendudukController;
use App\Http\Controllers\BalitaController;
use App\Http\Controllers\LansiaController;
use App\Http\Controllers\IbuHamilController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\PemeriksaanBalitaController;
use App\Http\Controllers\PemeriksaanIbuHamilController;
use App\Http\Controllers\PemeriksaanLansiaController;
use App\Http\Controllers\ExportController;
use App\Models\Penduduk;
use App\Models\Balita;
use App\Models\IbuHamil;
use App\Models\Lansia;
use App\Models\PemeriksaanPosyandu;
use App\Models\PemeriksaanIbuHamil;
use App\Models\PemeriksaanPosbindu;
use App\Models\Jadwal;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Manajemen Petugas
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    });

    // Data Master & Pemeriksaan (Admin & Kader)
    Route::middleware('role:admin,kader')->group(function () {
        Route::resource('desa', \App\Http\Controllers\DesaController::class);
        Route::resource('kader', KaderController::class);
        Route::resource('penduduk', PendudukController::class);
        Route::resource('balita', BalitaController::class);
        Route::resource('ibu-hamil', IbuHamilController::class);
        Route::resource('lansia', LansiaController::class);
        Route::resource('jadwal', JadwalController::class);

        // Fitur Pemeriksaan
        Route::post('/pemeriksaan-balita/panggil/{antrian}', [PemeriksaanBalitaController::class, 'panggilAntrian'])->name('pemeriksaan-balita.panggil');
        Route::resource('pemeriksaan-balita', PemeriksaanBalitaController::class)->parameters([
            'pemeriksaan-balita' => 'pemeriksaanBalitum'
        ]);

        Route::post('/pemeriksaan-ibu-hamil/panggil/{antrian}', [PemeriksaanIbuHamilController::class, 'panggilAntrian'])->name('pemeriksaan-ibu-hamil.panggil');
        Route::resource('pemeriksaan-ibu-hamil', PemeriksaanIbuHamilController::class)->parameters([
            'pemeriksaan-ibu-hamil' => 'pemeriksaanIbuHamil'
        ]);

        Route::post('/pemeriksaan-lansia/panggil/{antrian}', [PemeriksaanLansiaController::class, 'panggilAntrian'])->name('pemeriksaan-lansia.panggil');
        Route::resource('pemeriksaan-lansia', PemeriksaanLansiaController::class)->parameters([
            'pemeriksaan-lansia' => 'pemeriksaanLansium'
        ]);
        
        // Fitur Export
        Route::get('/export/excel/{model}', [ExportController::class, 'exportExcel'])->name('export.excel');
        Route::get('/export/pdf/{model}', [ExportController::class, 'exportPdf'])->name('export.pdf');
    });
});

require __DIR__.'/auth.php';
