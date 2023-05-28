<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrackController extends Controller
{
    public function listOwn(Request $request) {
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

    public function new(Request $request) {
        $data = $request->validate([
            'url' => ['url'],
            'name' => ['sometimes', 'nullable', 'max:255'],
            'author' => ['sometimes', 'nullable', 'max:255'],
        ]);

        $data['author'] = $data['author'] ?? "Unknown";
        $data['name'] = $data['name'] ?? "ID";

        // TODO: Trying to locate the track via its' URL first would be nice
        // (even if it's easily bypassed)
        $trackID = DB::table("tracks")
            ->insertGetId([
                'source_url' => $data["url"],
            ]);

    
        DB::table("track_userdata")
            ->insert([
                'user_id' => Auth::id(),
                'track_id' => $trackID,
                'track_name' => $data["name"],
                'track_author' => $data["author"],
            ]);
        
        $data["id"] = $trackID;

        return response()->json($data, 200);
    }
}