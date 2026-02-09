<?php

use App\Http\Controllers\Api\AntrianController;
use App\Http\Controllers\Api\JadwalController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PemeriksaanController;
use App\Http\Controllers\Api\PendudukController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('antrian')->group(function () {
    Route::post('/login', [AntrianController::class, 'login']);
});

Route::get('/jadwal', [JadwalController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('antrian')->group(function () {
        Route::post('/ambil', [AntrianController::class, 'ambilAntrian']);
        Route::get('/aktif', [AntrianController::class, 'antrianAktif']);
        Route::post('/update-fcm', [AntrianController::class, 'updateFcmToken']);
        Route::get('/status', [AntrianController::class, 'statusSekarang']);
        Route::get('/riwayat-pemeriksaan/{penduduk_id}', [AntrianController::class, 'riwayatPemeriksaan']);
    });

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-read/{id}', [NotificationController::class, 'markOneAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'clearAll']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['auth:sanctum', 'role:admin,kader'])->group(function () {
    Route::prefix('antrian')->group(function () {
        Route::post('/panggil/{id}', [AntrianController::class, 'panggil']);
        Route::get('/daftar-hadir', [AntrianController::class, 'getDaftarHadir']);
        Route::get('/statistik', [AntrianController::class, 'getStatistik']);
    });

    Route::get('/penduduk/search', [PendudukController::class, 'search']);

    Route::prefix('pemeriksaan')->group(function () {
        Route::get('/antrian-menunggu', [PemeriksaanController::class, 'getAntrianMenunggu']);
        Route::post('/balita', [PemeriksaanController::class, 'storeBalita']);
        Route::post('/ibu-hamil', [PemeriksaanController::class, 'storeIbuHamil']);
        Route::post('/lansia', [PemeriksaanController::class, 'storeLansia']);
    });

    Route::get('/reports/get-url', [ReportController::class, 'getReportUrl']);
});

Route::get('/reports/export', [ReportController::class, 'exportDailyPdf']);
