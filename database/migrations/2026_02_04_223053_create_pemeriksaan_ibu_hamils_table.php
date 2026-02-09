<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemeriksaan_ibu_hamils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ibu_hamil_id')->constrained('ibu_hamils')->onDelete('cascade');
            $table->date('tanggal_periksa');
            $table->float('berat_badan', 5, 2); // kg
            $table->float('tinggi_badan', 5, 2); // cm
            $table->string('tekanan_darah'); // format: 120/80
            $table->float('lila', 5, 2); // Lingkar Lengan Atas (cm)
            $table->float('tfu', 5, 2); // Tinggi Fundus Uteri (cm)
            $table->integer('djj'); // Detak Jantung Janin (bpm)
            $table->integer('jumlah_fe'); // Jumlah tablet Fe yang diminum
            $table->string('imunisasi_tt')->nullable(); // Imunisasi TT (TT1, TT2, dst)
            $table->text('keluhan')->nullable(); // Keluhan ibu (mual, pusing, bengkak, dll)
            $table->text('catatan')->nullable(); // Catatan tambahan dari petugas
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemeriksaan_ibu_hamils');
    }
};