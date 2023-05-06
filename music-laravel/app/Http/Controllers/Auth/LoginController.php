<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'login' => ['required'],
            'password' => ['required'],
        ]);

        $fieldType = filter_var($request->login, FILTER_VALIDATE_EMAIL)
            ? 'email' : 'username';

        $credentials[$fieldType] = $credentials['login'];
        unset($credentials['login']);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json([
                'user' => $user,
                'token' => $user->createToken("apiToken")->plainTextToken,
                'ok' => true,
            ]);
        }

        return response()->json([
            'ok' => false,
            'errors' => [
                'login' => 'Ligma nuts, wrong creds',
            ]
        ], 422);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response(null, 200);
    }
}