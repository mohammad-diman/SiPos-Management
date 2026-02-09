<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemeriksaan_posbindus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lansia_id')->constrained('lansias')->onDelete('cascade');

            // 1. Data dasar pemeriksaan
            $table->date('tanggal_periksa');
            $table->string('nama_kader')->nullable(); // Nama kader/petugas

            // 2. Antropometri
            $table->float('berat_badan', 5, 2); // kg
            $table->float('tinggi_badan', 5, 2); // cm
            $table->float('lingkar_perut', 5, 2)->nullable(); // cm
            $table->float('imt', 6, 2)->nullable(); // Indeks Massa Tubuh (akan dihitung otomatis)

            // 3. Vital Sign
            $table->string('tekanan_darah'); // format: 120/80
            $table->integer('nadi')->nullable(); // bpm
            $table->float('suhu_tubuh', 4, 1)->nullable(); // Celcius

            // 4. Pemeriksaan Laboratorium sederhana
            $table->float('gula_darah', 5, 2)->nullable(); // mg/dL
            $table->float('kolesterol', 5, 2)->nullable(); // mg/dL
            $table->float('asam_urat', 5, 2)->nullable(); // mg/dL

            // 5. Riwayat kesehatan
            $table->boolean('riwayat_merokok')->default(false);
            $table->boolean('riwayat_alkohol')->default(false);
            $table->integer('frekuensi_olahraga_per_minggu')->nullable(); // frekuensi per minggu
            $table->text('riwayat_penyakit')->nullable(); // Hipertensi, diabetes, jantung, stroke, dll.

            // 6. Kesehatan umum
            $table->text('keluhan_utama')->nullable(); // Pusing, nyeri sendi, lemah, dll.
            $table->boolean('gangguan_penglihatan')->default(false);
            $table->boolean('gangguan_pendengaran')->default(false);
            $table->string('status_gizi')->nullable(); // Kurus, normal, gemuk, obesitas

            // 7. Intervensi
            $table->text('obat')->nullable(); // Obat yang diberikan
            $table->text('konseling')->nullable(); // Konseling kesehatan
            $table->boolean('rujukan')->default(false); // Perlu rujukan?
            $table->text('catatan')->nullable(); // Catatan tambahan dari petugas

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemeriksaan_posbindus');
    }
};