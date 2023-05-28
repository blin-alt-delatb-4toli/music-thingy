<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

enum PlaylistPublicity : int {
    case Private = 0;
    case Unlisted = 1;
    case Public = 2; // note: max int is hardcoded in validation below. oops
}

class PlaylistController extends Controller
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
            'name' => ['required', 'max:255']
        ]);

        $data['name'] = $data['name'] ?? "Untitled Playlist";

        // TODO: Trying to locate the track via its' URL first would be nice
        // (even if it's easily bypassed)
        $trackID = DB::table("playlists")
            ->insertGetId([
                'created_by' => Auth::id(),
                'publicity' => 0, // TODO: this should be an enum
                'name' => $data["name"],
            ]);

        $data["id"] = $trackID;
        $data["publicity"] = 0;

        return response()->json($data, 200);
    }

    public function edit(Request $request) {
        $data = $request->validate([
            'id' => ['required', 'numeric'],
            'name' => ['required', 'max:255']
        ]);

        DB::table("playlists")
            ->where([
                'id' => $data['id'],
                'created_by' => Auth::id(), // make sure non-creator can't edit playlist
            ])->update([
                'name' => $data['name'],
            ]);

        return response()->noContent();
    }

    public function addTrack(Request $request) {
        $data = $request->validate([
            'id' => ['numeric', 'required'],
            'trackId' => ['numeric', 'required'],
        ]);

        DB::statement("INSERT INTO playlist_tracks(playlist_id, track_id)
            SELECT ?, ? WHERE EXISTS(SELECT id FROM playlists WHERE id = ? AND created_by = ?)",
            [
                $data['id'], $data['trackId'], // <- to insert
                $data['id'], Auth::id(), // <- to check in `playlists`
            ]);

        return response()->noContent();
    }

    public function removeTrack(Request $request) {
        $data = $request->validate([
            'id' => ['numeric', 'required'],
            'trackId' => ['numeric', 'required'],
        ]);

        DB::statement("DELETE FROM playlist_tracks WHERE track_id = ? AND playlist_id = ?
            AND EXISTS(SELECT id FROM playlists WHERE id = ? AND created_by = ?)",
            [
                $data['trackId'], $data['id'],
                $data['id'], Auth::id(), // <- to check in `playlists`
            ]);

        return response()->noContent();
    }

    public function changePublicity(Request $request) {
        $data = $request->validate([
            'id' => ['numeric', 'required'],
            'vis' => ['numeric', 'required', 'min:0', 'max:2'],
        ]);

        $tracks = DB::table("playlists")
            ->where([
                "created_by" => Auth::id(),
                "id" => $data["id"],    
            ])
            ->update([
                "publicity" => $data["vis"]
            ]);
        
        return response()->noContent();
    }

    public function getTracks(Request $request) {
        $data = $request->validate([
            'id' => ['numeric', 'required'],
        ]);

        $tracks = DB::select("SELECT trackdata.*, list.* FROM track_userdata trackdata
            INNER JOIN playlist_tracks list
                ON list.track_id = trackdata.track_id
                    AND list.playlist_id = ?
            WHERE EXISTS(SELECT id FROM playlists WHERE id = ? AND (created_by = ? OR publicity = 1))",
        [
            $data['id'], $data['id'],
            Auth::id(),
        ]);


        $resp = [];

        foreach ($tracks as $trackDat) {
            array_push($resp, [
                "name" => $trackDat->track_name,
                "author" => $trackDat->track_author,
                "id" => $trackDat->track_id,
            ]);
        }
        
        return response()->json(["tracks" => $resp], 200);
    }
}