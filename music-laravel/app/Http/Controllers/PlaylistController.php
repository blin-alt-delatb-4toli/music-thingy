<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlaylistController extends Controller
{
    public function get(Request $request) {
        return response()->json([
            'my nuts' => true,
        ], 200);
    }
}