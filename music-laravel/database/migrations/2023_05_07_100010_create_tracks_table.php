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
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->text("source_url")->nullable();
            $table->text("file_uri")->nullable();
            $table->timestamps();
        });

        Schema::create('track_userdata', function (Blueprint $table) {
            $table->bigInteger("user_id");
            $table->bigInteger("track_id");
            $table->text("track_name");
            $table->text("track_author");
            $table->timestamp("created_at")->useCurrent();
            $table->timestamp("updated_at")->useCurrent()->useCurrentOnUpdate();

            $table->primary(["user_id", "track_id"]);

            $table->foreign("user_id")
                ->references("id")->on("users");
            
            $table->foreign("track_id")
                ->references("id")->on("tracks");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_userdata');
        Schema::dropIfExists('tracks');
    }
};
