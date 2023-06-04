<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\CheckAuth;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\TrackController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
*/


Route::post('login', [LoginController::class, 'authenticate']);
Route::post('logout', [LoginController::class, 'logout']);

Route::post('register', [RegisterController::class, 'register']);

Route::middleware('auth')->group(function () {
    Route::get('/playlists/list', [PlaylistController::class, 'listOwn'])
        ->name('playlists.listOwn');

    Route::post('/playlists/addTrack', [PlaylistController::class, 'addTrack'])
        ->name('playlists.addTrack');

    Route::post('/playlists/removeTrack', [PlaylistController::class, 'removeTrack'])
        ->name('playlists.removeTrack');

    Route::post('/playlists/changePub', [PlaylistController::class, 'changePublicity'])
        ->name('playlists.changePub');

    Route::post('/playlists/new', [PlaylistController::class, 'new'])
        ->name('playlists.new');

    Route::post('/playlists/edit', [PlaylistController::class, 'edit'])
        ->name('playlists.edit');

    Route::post('/tracks/new', [TrackController::class, 'new'])
        ->name("tracks.new");

    Route::get('/check', [CheckAuth::class, 'check']);
});

Route::get('/playlists/listPublic', [PlaylistController::class, 'listPublic'])
    ->name('playlists.listPublic');

// You don't *need* to be authenticated to list tracks, but then it'll only work on public playlists
Route::get('/playlists/getTracks', [PlaylistController::class, 'getTracks'])
    ->name('playlists.getTracks');