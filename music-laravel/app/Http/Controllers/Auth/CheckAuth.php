<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class CheckAuth extends Controller
{
    public function check(Request $request)
    {
        return response()->json(['response' => 'yay'], 200);
    }
}