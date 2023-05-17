<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PlaylistController extends Controller
{
    public function listOwn(Request $request) {
        /*
        id, createdBy, name, 
         $table->id();
            $table->bigInteger("created_by"); // foreign key to `users.id`
            $table->text("name");
            $table->bigInteger("publicity");
            $table->timestamps();

            $table->foreign("created_by")
                  ->references("id")->on("users");
        */

        Log::debug("blacks :)");

        $playlists = DB::table('playlists')
            ->where("created_by", Auth::id())
            ->get();

        return response()->json($playlists, 200);
    }

    public function listPublic(Request $request) {
        return response()->json([
            'my (public) nuts' => true,
        ], 200);
    }
}