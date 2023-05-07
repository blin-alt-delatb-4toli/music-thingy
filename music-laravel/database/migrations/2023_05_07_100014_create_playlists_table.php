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
        Schema::create('playlists', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("created_by"); // foreign key to `users.id`
            $table->text("name");
            $table->bigInteger("publicity");
            $table->timestamps();

            $table->foreign("created_by")
                  ->references("id")->on("users");
        });

        Schema::create('playlist_tracks', function (Blueprint $table) {
            $table->bigInteger("playlist_id"); // foreign key to `playlists.id`
            $table->bigInteger("track_id");    // foreign key to `tracks.id`
            $table->bigInteger("order");
            $table->timestamps();

            $table->primary(["playlist_id", "track_id"]); // apparently can't just do ->primary() on both

            // TODO: Cascade on both of these?
            $table->foreign("track_id")
                  ->references("id")->on("tracks");

            $table->foreign("playlist_id")
                  ->references("id")->on("playlists");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('playlist_tracks', function(Blueprint $table) {
            $table->dropForeign(["track_id"]);
            $table->dropForeign(["playlist_id"]);
            $table->drop();
        });

        Schema::table('playlists', function(Blueprint $table) {
            $table->dropForeign(["created_by"]);
            $table->drop();
        });
    }
};
