<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemeriksaan_posyandus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('balita_id')->constrained('balitas')->onDelete('cascade');
            $table->date('tanggal_periksa');
            $table->float('berat_badan', 5, 2); // kg
            $table->float('tinggi_badan', 5, 2); // cm
            $table->float('lingkar_kepala', 5, 2); // cm
            $table->string('status_gizi')->nullable(); // Baik, Kurang, Buruk, dll.
            $table->text('perkembangan')->nullable(); // Perkembangan fisik/mental
            $table->text('catatan')->nullable(); // Catatan tambahan dari petugas

            // Imunisasi Dasar
            $table->boolean('imunisasi_bcg')->default(false);
            $table->boolean('imunisasi_dpt_hb_hib')->default(false);
            $table->boolean('imunisasi_polio')->default(false);
            $table->boolean('imunisasi_campak')->default(false);
            $table->boolean('imunisasi_rotavirus')->default(false);
            $table->boolean('imunisasi_pneumokokus')->default(false);

            // Imunisasi Lanjutan
            $table->boolean('imunisasi_hepatitis_a')->default(false);
            $table->boolean('imunisasi_varisela')->default(false);
            $table->boolean('imunisasi_tifoid')->default(false);
            $table->boolean('imunisasi_influenza')->default(false);
            $table->boolean('imunisasi_hpv')->default(false);

            // Vitamin
            $table->boolean('vitamin_a_1')->default(false); // Vitamin A dosis 1
            $table->boolean('vitamin_a_2')->default(false); // Vitamin A dosis 2
            $table->integer('jumlah_vit_b1')->default(0);   // Jumlah tablet Vit B1
            $table->integer('jumlah_vit_c')->default(0);    // Jumlah tablet Vit C
            $table->text('vitamin_lain')->nullable();       // Vitamin lainnya (catatan bebas)

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemeriksaan_posyandus');
    }
};