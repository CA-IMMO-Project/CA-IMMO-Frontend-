<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\SearchRequestController;
use App\Http\Controllers\SellController;
use App\Http\Controllers\VisitRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AUTHENTIFICATION
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [
    AuthController::class,
    'register'
]);

Route::post('/auth/login', [
    AuthController::class,
    'login'
]);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', [
        AuthController::class,
        'me'
    ]);

    Route::post('/auth/logout', [
        AuthController::class,
        'logout'
    ]);
});


/*
|--------------------------------------------------------------------------
| TERRAINS
|--------------------------------------------------------------------------
*/

Route::get('/properties', [
    PropertyController::class,
    'index'
]);

Route::get('/properties/{property}', [
    PropertyController::class,
    'show'
]);

Route::get('/properties/{property}/related', [
    PropertyController::class,
    'related'
]);


/*
|--------------------------------------------------------------------------
| VENDRE UN TERRAIN
|--------------------------------------------------------------------------
*/

Route::post('/sell', [
    SellController::class,
    'store'
]);


/*
|--------------------------------------------------------------------------
| DEMANDES D'ACHAT
|--------------------------------------------------------------------------
*/

Route::get('/purchase-requests', [
    PurchaseRequestController::class,
    'index'
]);

Route::get('/purchase-requests/{purchaseRequest}', [
    PurchaseRequestController::class,
    'show'
]);

Route::post(
    '/properties/{property}/purchase-requests',
    [PurchaseRequestController::class, 'store']
);


/*
|--------------------------------------------------------------------------
| DEMANDES DE VISITE
|--------------------------------------------------------------------------
*/

Route::get('/visit-requests', [
    VisitRequestController::class,
    'index'
]);

Route::post(
    '/properties/{property}/visit-requests',
    [VisitRequestController::class, 'store']
);


/*
|--------------------------------------------------------------------------
| RECHERCHES PERSONNALISÉES
|--------------------------------------------------------------------------
*/

Route::get('/search-requests', [
    SearchRequestController::class,
    'index'
]);

Route::post('/search-requests', [
    SearchRequestController::class,
    'store'
]);


/*
|--------------------------------------------------------------------------
| ADMINISTRATION
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard', [
        AdminController::class,
        'dashboard'
    ]);

    Route::get('/properties', [
        AdminController::class,
        'properties'
    ]);

    Route::patch('/properties/{property}/status', [
        AdminController::class,
        'updatePropertyStatus'
    ]);

    Route::get('/documents', [
        AdminController::class,
        'documents'
    ]);

    Route::patch('/documents/{document}', [
        AdminController::class,
        'updateDocument'
    ]);

    Route::get('/purchases', [
        AdminController::class,
        'purchases'
    ]);

    Route::get('/searches', [
        AdminController::class,
        'searches'
    ]);

    Route::get('/visits', [
        AdminController::class,
        'visits'
    ]);

    Route::get('/users', [
        AdminController::class,
        'users'
    ]);

    Route::get('/transactions', [
        AdminController::class,
        'transactions'
    ]);
});
