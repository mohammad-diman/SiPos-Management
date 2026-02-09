<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('antrians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduks')->onDelete('cascade');
            $table->string('nomor_antrian'); // Contoh: B-001, H-001, L-001
            $table->integer('angka_antrian'); // Untuk pengurutan teknis (1, 2, 3...)
            $table->enum('kategori', ['balita', 'ibu_hamil', 'lansia']);
            $table->enum('status', ['menunggu', 'dipanggil', 'selesai', 'lewat'])->default('menunggu');
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antrians');
    }
};