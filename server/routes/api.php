<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\UserController;

Route::apiResource('genders', GenderController::class);
Route::apiResource('users', UserController::class);
